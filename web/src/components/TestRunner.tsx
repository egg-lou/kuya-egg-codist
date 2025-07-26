import React, { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'http://localhost:2358'
const JUDGE0_AUTH_TOKEN = import.meta.env.VITE_JUDGE0_AUTH_TOKEN

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testBasicSubmission = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      // Simple JavaScript code to test
      const testCode = `
console.log("Hello from automated test!");
console.log("Testing Judge0 integration");

// Simple function test
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
console.log("2 + 3 =", result);
`

      console.log('Submitting code to Judge0...')
      
      // Submit code
      const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(JUDGE0_AUTH_TOKEN && { 'td-auth-token': JUDGE0_AUTH_TOKEN })
        },
        body: JSON.stringify({
          source_code: testCode,
          language_id: 63, // Node.js
          cpu_time_limit: 2,
          memory_limit: 128000
        })
      })

      console.log('headers', {
        'Content-Type': 'application/json',
        ...(JUDGE0_AUTH_TOKEN && { 'td-auth-token': JUDGE0_AUTH_TOKEN })
      })

      if (!submitResponse.ok) {
        throw new Error(`Submit failed: ${submitResponse.status} ${submitResponse.statusText}`)
      }

      const { token } = await submitResponse.json()
      console.log('Got token:', token)

      // Poll for results
      let attempts = 0
      const maxAttempts = 10

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
          headers: {
            ...(JUDGE0_AUTH_TOKEN && { 'X-Auth-Token': JUDGE0_AUTH_TOKEN })
          }
        })

        if (!resultResponse.ok) {
          throw new Error(`Result fetch failed: ${resultResponse.status} ${resultResponse.statusText}`)
        }

        const judgeResult = await resultResponse.json()
        console.log('Judge result:', judgeResult)

        if (judgeResult.status.id > 2) { // Processing complete
          setResult(judgeResult)
          break
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Timeout waiting for execution')
      }

    } catch (err: any) {
      console.error('Test failed:', err)
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }

  const testAutomatedWrapper = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      // Test the wrapper generation
      const userCode = `
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
`

      const testCases = [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] }
      ]

      // Generate wrapped code
      const wrappedCode = `
${userCode}

// Test execution framework
const testCases = ${JSON.stringify(testCases)};
const results = [];

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
}

for (let i = 0; i < testCases.length; i++) {
  const testCase = testCases[i];
  
  try {
    const result = twoSum(...testCase.input);
    const passed = deepEqual(result, testCase.expected);
    
    results.push({
      testCaseId: i + 1,
      passed: passed,
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(testCase.expected),
      actual: JSON.stringify(result),
      status: passed ? 'passed' : 'failed'
    });
  } catch (error) {
    results.push({
      testCaseId: i + 1,
      passed: false,
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(testCase.expected),
      actual: 'Error',
      error: error.message,
      status: 'runtime_error'
    });
  }
}

console.log('JUDGE_RESULTS_START');
console.log(JSON.stringify(results));
console.log('JUDGE_RESULTS_END');
`

      console.log('Generated wrapped code:', wrappedCode)

      // Submit wrapped code
      const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(JUDGE0_AUTH_TOKEN && { 'X-Auth-Token': JUDGE0_AUTH_TOKEN })
        },
        body: JSON.stringify({
          source_code: wrappedCode,
          language_id: 63, // Node.js
          cpu_time_limit: 2,
          memory_limit: 128000
        })
      })

      if (!submitResponse.ok) {
        throw new Error(`Submit failed: ${submitResponse.status} ${submitResponse.statusText}`)
      }

      const { token } = await submitResponse.json()
      console.log('Got token:', token)

      // Poll for results
      let attempts = 0
      const maxAttempts = 10

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
          headers: {
            ...(JUDGE0_AUTH_TOKEN && { 'X-Auth-Token': JUDGE0_AUTH_TOKEN })
          }
        })

        if (!resultResponse.ok) {
          throw new Error(`Result fetch failed: ${resultResponse.status} ${resultResponse.statusText}`)
        }

        const judgeResult = await resultResponse.json()
        console.log('Judge result:', judgeResult)

        if (judgeResult.status.id > 2) { // Processing complete
          // Try to parse test results
          if (judgeResult.stdout) {
            const startMarker = 'JUDGE_RESULTS_START'
            const endMarker = 'JUDGE_RESULTS_END'
            const startIndex = judgeResult.stdout.indexOf(startMarker)
            const endIndex = judgeResult.stdout.indexOf(endMarker)
            
            if (startIndex !== -1 && endIndex !== -1) {
              const jsonStr = judgeResult.stdout.substring(startIndex + startMarker.length, endIndex).trim()
              try {
                const testResults = JSON.parse(jsonStr)
                judgeResult.parsedTestResults = testResults
              } catch (e) {
                console.error('Failed to parse test results:', e)
              }
            }
          }
          
          setResult(judgeResult)
          break
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Timeout waiting for execution')
      }

    } catch (err: any) {
      console.error('Automated test failed:', err)
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white">Judge0 Integration Test</h3>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testBasicSubmission}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Test Basic Submission
        </button>
        
        <button
          onClick={testAutomatedWrapper}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Test Automated Wrapper
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded p-4 mb-4">
          <h4 className="text-red-400 font-medium mb-2">Error:</h4>
          <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded p-4">
          <h4 className="text-white font-medium mb-2">Result:</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-blue-400">Status:</span> {result.status?.description}</div>
            <div><span className="text-blue-400">Time:</span> {result.time}s</div>
            <div><span className="text-blue-400">Memory:</span> {result.memory} KB</div>
            
            {result.stdout && (
              <div>
                <span className="text-green-400">Output:</span>
                <pre className="text-gray-300 text-xs mt-1 bg-gray-900 p-2 rounded overflow-x-auto">{result.stdout}</pre>
              </div>
            )}
            
            {result.stderr && (
              <div>
                <span className="text-red-400">Error:</span>
                <pre className="text-red-300 text-xs mt-1 bg-gray-900 p-2 rounded overflow-x-auto">{result.stderr}</pre>
              </div>
            )}

            {result.parsedTestResults && (
              <div>
                <span className="text-purple-400">Parsed Test Results:</span>
                <pre className="text-gray-300 text-xs mt-1 bg-gray-900 p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.parsedTestResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
