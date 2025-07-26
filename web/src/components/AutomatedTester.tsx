import { useState } from 'react'
import { Play, CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { useAutomatedTesting, type AutomatedTestConfig, type TestResult } from '../hooks/useAutomatedTesting'
import { type TestCase } from '../utils/codeWrappers'

interface AutomatedTesterProps {
  userCode: string
  language: string
  testCases: TestCase[]
  functionName?: string
  onTestComplete?: (results: any) => void
}

export default function AutomatedTester({ 
  userCode, 
  language, 
  testCases, 
  functionName,
  onTestComplete 
}: AutomatedTesterProps) {
  const [showResults, setShowResults] = useState(false)
  const automatedTest = useAutomatedTesting()

  const handleRunTests = () => {
    if (!userCode.trim()) {
      alert('Please write some code first!')
      return
    }

    if (testCases.length === 0) {
      alert('No test cases available!')
      return
    }

    const config: AutomatedTestConfig = {
      userCode,
      language,
      testCases,
      functionName,
      timeLimit: 2, // 2 seconds
      memoryLimit: 128000 // 128MB in KB
    }

    automatedTest.mutate(config, {
      onSuccess: (results) => {
        setShowResults(true)
        onTestComplete?.(results)
      },
      onError: (error) => {
        console.error('Test execution failed:', error)
        alert(`Test execution failed: ${error.message}`)
      }
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'runtime_error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'wrong_answer':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'compilation_error':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'runtime_error':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-4">
      {/* Run Tests Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Automated Testing</h3>
        <button
          onClick={handleRunTests}
          disabled={automatedTest.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {automatedTest.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {automatedTest.isPending ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      {/* Test Cases Preview */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Test Cases ({testCases.length})
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {testCases.slice(0, 3).map((testCase, index) => (
            <div key={index} className="text-xs text-gray-400 font-mono">
              <span className="text-blue-400">Input:</span> {JSON.stringify(testCase.input)} 
              <span className="text-green-400 ml-4">Expected:</span> {JSON.stringify(testCase.expected)}
            </div>
          ))}
          {testCases.length > 3 && (
            <div className="text-xs text-gray-500">
              ... and {testCases.length - 3} more test cases
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && automatedTest.data && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          {/* Overall Status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(automatedTest.data.overallStatus)}`}>
            {automatedTest.data.overallStatus === 'accepted' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {automatedTest.data.overallStatus.replace('_', ' ').toUpperCase()}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {automatedTest.data.passedTests}/{automatedTest.data.totalTests}
              </div>
              <div className="text-gray-400">Tests Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {automatedTest.data.executionTime.toFixed(0)}ms
              </div>
              <div className="text-gray-400">Execution Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {automatedTest.data.memoryUsage ? `${(automatedTest.data.memoryUsage / 1024).toFixed(1)}MB` : 'N/A'}
              </div>
              <div className="text-gray-400">Memory Used</div>
            </div>
          </div>

          {/* Individual Test Results */}
          {automatedTest.data.testResults.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-300">Test Results:</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {automatedTest.data.testResults.map((result: TestResult, index: number) => (
                  <div key={index} className="bg-gray-800 rounded p-3 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">Test Case {result.testCaseId}</span>
                      </div>
                      {result.executionTime && (
                        <span className="text-gray-400 text-xs">{result.executionTime}ms</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 font-mono text-xs">
                      <div>
                        <span className="text-blue-400">Input:</span> 
                        <span className="text-gray-300 ml-2">{result.input}</span>
                      </div>
                      <div>
                        <span className="text-green-400">Expected:</span> 
                        <span className="text-gray-300 ml-2">{result.expected}</span>
                      </div>
                      <div>
                        <span className={result.passed ? "text-green-400" : "text-red-400"}>Actual:</span> 
                        <span className="text-gray-300 ml-2">{result.actual}</span>
                      </div>
                      {result.error && (
                        <div>
                          <span className="text-red-400">Error:</span> 
                          <span className="text-red-300 ml-2">{result.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compilation/Runtime Errors */}
          {automatedTest.data.overallStatus === 'compilation_error' && (
            <div className="bg-red-900/20 border border-red-500/20 rounded p-3 mt-4">
              <h5 className="text-red-400 font-medium mb-2">Compilation Error:</h5>
              <pre className="text-red-300 text-xs whitespace-pre-wrap">
                {(automatedTest.data as any).error}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {automatedTest.error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded p-4">
          <h5 className="text-red-400 font-medium mb-2">Execution Error:</h5>
          <p className="text-red-300 text-sm">
            {automatedTest.error.message}
          </p>
        </div>
      )}
    </div>
  )
}
