// Enhanced test case types for LeetCode-style testing
export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
  explanation?: string
  timeLimit?: number // in milliseconds
  memoryLimit?: number // in MB
}

export interface TestResult {
  testCaseId: string
  passed: boolean
  input: string
  expected: string
  actual: string
  executionTime?: number
  memoryUsed?: number
  error?: string
  status: 'passed' | 'failed' | 'timeout' | 'memory_exceeded' | 'runtime_error'
}

export interface SubmissionResult {
  overallStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error'
  passedTests: number
  totalTests: number
  testResults: TestResult[]
  executionTime: number
  memoryUsage: number
  score?: number
}

export interface ProblemTemplate {
  language: string
  starterCode: string
  functionName: string
  inputFormat: string
  outputFormat: string
  wrapper?: string // Code to wrap around user solution
}
