import { useState } from 'react'
import { Send, X, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useAIChat, type Message } from '../hooks/useGenAi'

interface AIChatProps {
  problem: any
  onClose: () => void
}

export default function AIChat({ problem, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm here to help you solve **"${problem?.name || 'this problem'}"**. I have access to the problem statement, examples, and constraints. Feel free to ask me about:

• **Approach and algorithm suggestions**
• **Code implementation help**
• **Debugging assistance**
• **Complexity analysis**
• **Test case explanations**

What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')

  const aiChatMutation = useAIChat()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('') // Clear input immediately

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])

    // Send to AI
    aiChatMutation.mutate(
      {
        message: userMessage,
        problem,
        conversationHistory: messages,
      },
      {
        onSuccess: (aiResponse) => {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiMsg])
        },
        onError: (error) => {
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: error instanceof Error ? error.message : "I'm sorry, I'm having trouble right now. Please try again later.",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMsg])
        }
      }
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              <div className="text-sm leading-relaxed">
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <pre className="bg-gray-900 rounded p-3 overflow-x-auto border border-gray-600">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        )
                      },
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-200">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-white">{children}</h3>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
              <div className="text-xs opacity-70 mt-2 border-t border-gray-600 pt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {aiChatMutation.isPending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about this problem..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            disabled={aiChatMutation.isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || aiChatMutation.isPending}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
