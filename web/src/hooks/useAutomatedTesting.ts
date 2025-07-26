import { useMutation } from '@tanstack/react-query'
import { generateWrappedCode, parseTestResults, extractFunctionName, type TestCase } from '../utils/codeWrappers'

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'http://localhost:2358'
const JUDGE0_AUTH_TOKEN = import.meta.env.VITE_JUDGE0_AUTH_TOKEN

export interface AutomatedTestConfig {
  userCode: string
  language: string
  testCases: TestCase[]
  functionName?: string // Optional, will be auto-detected if not provided
  timeLimit?: number
  memoryLimit?: number
}

export interface TestResult {
  testCaseId: number
  passed: boolean
  input: string
  expected: string
  actual: string
  executionTime?: number
  error?: string
  status: 'passed' | 'failed' | 'runtime_error' | 'timeout' | 'memory_exceeded'
}

export interface AutomatedTestResult {
  overallStatus: 'accepted' | 'wrong_answer' | 'runtime_error' | 'compilation_error' | 'time_limit_exceeded'
  passedTests: number
  totalTests: number
  testResults: TestResult[]
  executionTime: number
  memoryUsage?: number
  error?: string
}

async function submitToJudge0(code: string, languageId: number, timeLimit?: number, memoryLimit?: number) {
  // Submit code
  const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(JUDGE0_AUTH_TOKEN && { 'X-Auth-Token': JUDGE0_AUTH_TOKEN })
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      cpu_time_limit: timeLimit || 2,
      memory_limit: memoryLimit || 128000, // 128MB in KB
    })
  })

  if (!submitResponse.ok) {
    throw new Error(`Failed to submit code: ${submitResponse.statusText}`)
  }

  const { token } = await submitResponse.json()

  // Poll for results
  let attempts = 0
  const maxAttempts = 30 // 30 seconds max wait time

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second

    const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
      headers: {
        ...(JUDGE0_AUTH_TOKEN && { 'X-Auth-Token': JUDGE0_AUTH_TOKEN })
      }
    })

    if (!resultResponse.ok) {
      throw new Error(`Failed to get result: ${resultResponse.statusText}`)
    }

    const result = await resultResponse.json()

    // Check if processing is complete
    if (result.status.id <= 2) { // Still processing
      attempts++
      continue
    }

    return result
  }

  throw new Error('Timeout waiting for code execution')
}

export function useAutomatedTesting() {
  return useMutation({
    mutationFn: async (config: AutomatedTestConfig): Promise<AutomatedTestResult> => {
      try {
        // Auto-detect function name if not provided
        const functionName = config.functionName || extractFunctionName(config.userCode, config.language)
        
        // Generate wrapped code with test cases
        const { code: wrappedCode, languageId } = generateWrappedCode({
          userCode: config.userCode,
          language: config.language,
          testCases: config.testCases,
          functionName
        })

        console.log('Generated wrapped code:', wrappedCode) // Debug log

        // Submit to Judge0
        const judgeResult = await submitToJudge0(
          wrappedCode, 
          languageId, 
          config.timeLimit, 
          config.memoryLimit
        )

        console.log('Judge0 result:', judgeResult) // Debug log

        // Handle compilation errors
        if (judgeResult.status.id === 6) { // Compilation Error
          return {
            overallStatus: 'compilation_error',
            passedTests: 0,
            totalTests: config.testCases.length,
            testResults: [],
            executionTime: 0,
            error: judgeResult.compile_output || 'Compilation failed'
          }
        }

        // Handle runtime errors or other failures
        if (judgeResult.status.id !== 3) { // Not Accepted
          return {
            overallStatus: 'runtime_error',
            passedTests: 0,
            totalTests: config.testCases.length,
            testResults: [],
            executionTime: parseFloat(judgeResult.time || '0') * 1000,
            error: judgeResult.stderr || judgeResult.message || 'Runtime error occurred'
          }
        }

        // Parse test results from stdout
        const testResults = parseTestResults(judgeResult.stdout || '')
        
        if (testResults.length === 0) {
          throw new Error('No test results found in output. Check your code structure.')
        }

        const passedTests = testResults.filter((result: TestResult) => result.passed).length
        const totalTests = testResults.length

        // Determine overall status
        let overallStatus: AutomatedTestResult['overallStatus'] = 'accepted'
        if (passedTests < totalTests) {
          overallStatus = 'wrong_answer'
        }

        return {
          overallStatus,
          passedTests,
          totalTests,
          testResults,
          executionTime: parseFloat(judgeResult.time || '0') * 1000, // Convert to ms
          memoryUsage: parseInt(judgeResult.memory || '0') // KB
        }

      } catch (error) {
        console.error('Automated testing error:', error)
        throw error
      }
    }
  })
}

// Helper hook for quick testing with sample data
export function useQuickTest() {
  const automatedTest = useAutomatedTesting()

  const runQuickTest = (userCode: string, language: string) => {
    // Sample test cases for demonstration
    const sampleTestCases: TestCase[] = [
      {
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1]
      },
      {
        input: [[3, 2, 4], 6],
        expected: [1, 2]
      }
    ]

    return automatedTest.mutate({
      userCode,
      language,
      testCases: sampleTestCases
    })
  }

  return {
    runQuickTest,
    ...automatedTest
  }
}
