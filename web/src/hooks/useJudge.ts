import { useMutation, useQuery } from '@tanstack/react-query'

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'http://localhost:2358'
const JUDGE0_AUTH_TOKEN = import.meta.env.VITE_JUDGE0_AUTH_TOKEN

export interface Language {
  id: number
  name: string
  is_archived: boolean
  source_file: string
  compile_cmd?: string
  run_cmd: string
}

export interface Submission {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

export interface SubmissionResult {
  message(arg0: string, message: any): unknown
  token: string
  status: {
    id: number
    description: string
  }
  stdout?: string
  stderr?: string
  compile_output?: string
  time?: string
  memory?: number
  exit_code?: number
}

// Language ID mappings for Judge0
export const LANGUAGE_IDS = {
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  python: 71,      // Python (3.8.1)
  java: 62,        // Java (OpenJDK 13.0.1)
  go: 60,          // Go (1.13.5)
} as const

class Judge0Service {
  private baseUrl: string
  private authToken: string | undefined

  constructor(baseUrl: string = JUDGE0_API_URL) {
    this.baseUrl = baseUrl
    this.authToken = JUDGE0_AUTH_TOKEN
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add authentication header if token is available
    if (this.authToken) {
      headers['td-auth-token'] = this.authToken
    }

    return headers
  }

  async getLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        headers: this.getHeaders(),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      throw error
    }
  }

  async submitCode(submission: Submission): Promise<{ token: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to submit code:', error)
      throw error
    }
  }

  async getSubmissionResult(token: string): Promise<SubmissionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/submissions/${token}?base64_encoded=false`, {
        headers: this.getHeaders(),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to get submission result:', error)
      throw error
    }
  }

  async submitAndWait(submission: Submission, maxWaitTime: number = 10000): Promise<SubmissionResult> {
    console.log('Submitting code:', { 
      language_id: submission.language_id, 
      source_code_length: submission.source_code.length,
      stdin: submission.stdin 
    })
    
    const { token } = await this.submitCode(submission)
    console.log('Received token:', token)
    
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getSubmissionResult(token)
      console.log('Submission status:', result.status)
      
      // Status ID 1 = In Queue, 2 = Processing
      if (result.status.id !== 1 && result.status.id !== 2) {
        console.log('Final result:', result)
        
        // Check for internal errors
        if (result.status.id === 13) {
          console.error('Judge0 Internal Error:', result.message)
          throw new Error(`Judge0 Internal Error: ${result.message || 'Unknown internal error'}`)
        }
        
        // Check for compilation errors
        if (result.status.id === 6 && result.compile_output) {
          console.error('Compilation Error:', result.compile_output)
          throw new Error(`Compilation Error: ${result.compile_output}`)
        }
        
        // Check for runtime errors
        if (result.status.id === 5 && result.stderr) {
          console.error('Runtime Error:', result.stderr)
          // Don't throw here, return the result so we can show the error
        }
        
        return result
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    throw new Error('Submission timed out')
  }

  getLanguageId(language: string): number {
    return LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS] || LANGUAGE_IDS.javascript
  }
}

const judge0Service = new Judge0Service()

// Hook to get available languages
export const useLanguages = () => {
  return useQuery({
    queryKey: ['judge0-languages'],
    queryFn: () => judge0Service.getLanguages(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Hook to submit code and get results
export const useSubmitCode = () => {
  return useMutation({
    mutationFn: async ({ 
      code, 
      language, 
      testCases 
    }: { 
      code: string
      language: string
      testCases: any[]
    }) => {
      const results = []
      
      // Run code against each test case
      for (const testCase of testCases) {
        try {
          // Prepare input for the test case
          const input = testCase.variables
            ?.map((variable: any) => variable.value)
            .join('\n') || ''

          const submission: Submission = {
            source_code: code,
            language_id: judge0Service.getLanguageId(language),
            stdin: input,
            expected_output: testCase.output,
          }

          const result = await judge0Service.submitAndWait(submission)
          
          const passed = result.stdout?.trim() === testCase.output?.trim()
          
          results.push({
            passed,
            input: testCase.variables?.map((v: any) => `${v.name} = ${v.value}`).join(', ') || 'No input',
            expected: testCase.output || '',
            actual: result.stdout?.trim() || '',
            error: result.stderr || result.compile_output || undefined,
            time: result.time,
            memory: result.memory,
          })
        } catch (error) {
          results.push({
            passed: false,
            input: testCase.variables?.map((v: any) => `${v.name} = ${v.value}`).join(', ') || 'Error',
            expected: testCase.output || '',
            actual: '',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
      
      return results
    },
  })
}

export { judge0Service }
