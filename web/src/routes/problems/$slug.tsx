import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Play, MessageCircle, TestTube, CheckCircle, XCircle, Lightbulb, Code2, RotateCcw } from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeEditor from '../../components/CodeEditor'
import AIChat from '../../components/AIChat'
import { useProblemBySlug } from '../../hooks/useProblems'
import { useSubmitCode } from '../../hooks/useJudge'
import { useCodeExplanation, useHint } from '../../hooks/useGenAi'

interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
  error?: string
  time?: string
  memory?: number
}

function ProblemPage() {
  const { slug } = Route.useParams()
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'submissions'>('description')
  const [bottomTab, setBottomTab] = useState<'testcase' | 'result'>('testcase')

  // Fetch problem using existing hook
  const { data: problemArray, isLoading, error } = useProblemBySlug(slug)
  const problem = problemArray?.[0] // The hook returns an array, get first item

  // Judge0 submission hook
  const submitCodeMutation = useSubmitCode()

  // GenAI hooks
  const codeExplanationMutation = useCodeExplanation()
  const hintMutation = useHint()

  const handleRunCode = () => {
    if (!code.trim()) {
      alert('Please write some code first!')
      return
    }

    if (!problem?.testCases || problem.testCases.length === 0) {
      alert('No test cases available for this problem!')
      return
    }

    setBottomTab('result')
    submitCodeMutation.mutate(
      {
        code,
        language: selectedLanguage,
        testCases: problem.testCases,
      },
      {
        onSuccess: (results) => {
          setTestResults(results)
        },
        onError: (error) => {
          console.error('Submission error:', error)
          setTestResults([{
            passed: false,
            input: 'Error',
            expected: '',
            actual: '',
            error: error instanceof Error ? error.message : 'Failed to run code'
          }])
        }
      }
    )
  }

  const handleExplainCode = () => {
    if (!code.trim()) {
      alert('Please write some code first!')
      return
    }

    codeExplanationMutation.mutate({
      code,
      language: selectedLanguage,
      problem,
    })
  }

  const handleGetHint = () => {
    if (!problem) return

    hintMutation.mutate({
      problem,
      difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
    })
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-400'
      case 'medium': return 'bg-yellow-500/10 text-yellow-400'
      case 'hard': return 'bg-red-500/10 text-red-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Problem</h1>
          <p className="text-gray-400">Failed to load the problem. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Problem not found</h1>
          <p className="text-gray-400">The problem you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-lg font-semibold">{problem.name}</h1>
          {problem.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyBg(problem.difficulty)}`}>
              {problem.difficulty.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            AI Help
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full flex flex-col bg-gray-950">
              {/* Tabs */}
              <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4">
                <div className="flex gap-1">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'editorial', label: 'Editorial' },
                    { id: 'submissions', label: 'Submissions' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 text-sm rounded transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    {/* Problem Statement */}
                    <div>
                      <div 
                        className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: problem.statement || 'No statement available' }}
                      />
                    </div>

                    {/* Examples */}
                    {problem.examples && problem.examples.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Examples</h3>
                        <div className="space-y-4">
                          {problem.examples.map((example: any, index: number) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-400">Example {index + 1}:</span>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium text-gray-400">Input:</span>
                                  <pre className="text-green-400 font-mono text-sm mt-1 bg-gray-800 p-2 rounded">{example.input}</pre>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-400">Output:</span>
                                  <pre className="text-blue-400 font-mono text-sm mt-1 bg-gray-800 p-2 rounded">{example.output}</pre>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-400">Explanation:</span>
                                    <p className="text-gray-300 text-sm mt-1">{example.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problem.constraints && problem.constraints.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
                        <ul className="space-y-1 text-gray-300">
                          {problem.constraints.map((constraint: string, index: number) => (
                            <li key={index} className="text-sm font-mono bg-gray-900 p-2 rounded">• {constraint}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Assistance */}
                    <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-lg font-semibold mb-4">AI Assistance</h3>
                      <div className="flex gap-2 flex-wrap mb-4">
                        <button
                          onClick={handleGetHint}
                          disabled={hintMutation.isPending}
                          className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded text-sm transition-colors"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {hintMutation.isPending ? 'Getting Hint...' : 'Get Hint'}
                        </button>
                        <button
                          onClick={handleExplainCode}
                          disabled={codeExplanationMutation.isPending || !code.trim()}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm transition-colors"
                        >
                          <Code2 className="w-4 h-4" />
                          {codeExplanationMutation.isPending ? 'Analyzing...' : 'Explain Code'}
                        </button>
                      </div>

                      {/* AI Responses */}
                      {hintMutation.data && (
                        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                          <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Hint:
                          </h4>
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                            >
                              {hintMutation.data}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {codeExplanationMutation.data && (
                        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                          <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                            <Code2 className="w-4 h-4" />
                            Code Analysis:
                          </h4>
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                            >
                              {codeExplanationMutation.data}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'editorial' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Editorial coming soon...</p>
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Submissions history coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-gray-800 hover:bg-gray-700 transition-colors cursor-col-resize" />

          {/* Right Panel - Code Editor */}
          <Panel defaultSize={55} minSize={40}>
            <div className="h-full flex flex-col">
              <PanelGroup direction="vertical">
                {/* Code Editor Panel */}
                <Panel defaultSize={60} minSize={40}>
                  <div className="h-full flex flex-col bg-gray-950">
                    {/* Editor Header */}
                    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
                      <div className="flex items-center gap-4">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value)
                            setCode('')
                          }}
                          className="bg-gray-800 text-white px-3 py-1.5 rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="go">Go</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCode('')}
                          className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded text-sm transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </button>
                        <button
                          onClick={handleRunCode}
                          disabled={submitCodeMutation.isPending}
                          className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm transition-colors font-medium"
                        >
                          {submitCodeMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {submitCodeMutation.isPending ? 'Running...' : 'Run'}
                        </button>
                      </div>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1">
                      <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={selectedLanguage}
                        height="100%"
                      />
                    </div>
                  </div>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="h-2 bg-gray-800 hover:bg-gray-700 transition-colors cursor-row-resize" />

                {/* Bottom Panel - Test Cases / Results */}
                <Panel defaultSize={40} minSize={20}>
                  <div className="h-full flex flex-col bg-gray-950">
                    {/* Bottom Tabs */}
                    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4">
                      <div className="flex gap-1">
                        {[
                          { id: 'testcase', label: 'Testcase' },
                          { id: 'result', label: 'Test Result' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setBottomTab(tab.id as any)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                              bottomTab === tab.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {bottomTab === 'testcase' && (
                        <div className="space-y-4">
                          {problem.testCases?.map((testCase: any, index: number) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                              <div className="mb-2">
                                <span className="text-sm font-medium text-gray-400">Test Case {index + 1}:</span>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs text-gray-500">Input:</span>
                                  <pre className="text-green-400 font-mono text-sm mt-1 bg-gray-800 p-2 rounded">
                                    {testCase.variables?.map((v: any) => `${v.name} = ${v.value}`).join('\n') || 'No input'}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Expected Output:</span>
                                  <pre className="text-blue-400 font-mono text-sm mt-1 bg-gray-800 p-2 rounded">{testCase.output}</pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {bottomTab === 'result' && (
                        <div className="space-y-4">
                          {testResults.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              <TestTube className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>Run your code to see test results</p>
                            </div>
                          ) : (
                            testResults.map((result, index) => (
                              <div key={index} className={`p-4 rounded-lg border ${result.passed ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                  {result.passed ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                  )}
                                  <span className="font-medium">Test Case {index + 1}</span>
                                  {result.time && (
                                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                      {result.time}s
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-400">Input:</span>
                                    <pre className="text-yellow-400 font-mono bg-gray-800 p-2 rounded mt-1">{result.input}</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Expected:</span>
                                    <pre className="text-green-400 font-mono bg-gray-800 p-2 rounded mt-1">{result.expected}</pre>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Output:</span>
                                    <pre className={`font-mono bg-gray-800 p-2 rounded mt-1 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                      {result.actual}
                                    </pre>
                                  </div>
                                  {result.error && (
                                    <div>
                                      <span className="text-gray-400">Error:</span>
                                      <pre className="text-red-400 font-mono bg-gray-800 p-2 rounded mt-1">{result.error}</pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
              </PanelGroup>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-3/4 border border-gray-800 shadow-2xl">
            <AIChat 
              problem={problem} 
              onClose={() => setShowChat(false)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/problems/$slug')({
  component: ProblemPage,
})
