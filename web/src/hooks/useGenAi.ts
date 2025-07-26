import { useMutation } from '@tanstack/react-query'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatRequest {
  message: string
  problem: any
  conversationHistory?: Message[]
}

class GenAIService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY not found. AI features will not work.')
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '')
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }

  async generateResponse({ message, problem, conversationHistory = [] }: ChatRequest): Promise<string> {
    try {
      // Prepare context for AI
      const problemContext = `
Problem: ${problem.name || 'Unknown Problem'}
Difficulty: ${problem.difficulty || 'Unknown'}
Statement: ${problem.statement || 'No statement available'}
Examples: ${JSON.stringify(problem.examples || [], null, 2)}
Constraints: ${problem.constraints?.join(', ') || 'No constraints listed'}
Test Cases: ${JSON.stringify(problem.testCases || [], null, 2)}
Starter Code Available: ${Object.keys(problem.starterCode || {}).join(', ')}
`

      // Build conversation context
      const conversationContext = conversationHistory
        .slice(-5) // Only include last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      const prompt = `
You are a helpful coding assistant helping with LeetCode-style programming problems. Here's the problem context:

${problemContext}

Previous conversation:
${conversationContext}

Current user question: ${message}

Please provide a helpful response that guides the user without giving away the complete solution. Focus on:
- Explaining concepts and approaches
- Providing hints and guidance
- Helping with debugging
- Explaining time/space complexity
- Clarifying problem requirements
- Suggesting optimal data structures or algorithms
- Code review and optimization tips

Keep your response concise, educational, and encouraging. If the user asks for the complete solution, guide them to think through the problem step by step instead.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('GenAI Error:', error)
      throw new Error("I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.")
    }
  }

  async explainCode(code: string, language: string, problem: any): Promise<string> {
    try {
      const prompt = `
Analyze this ${language} code solution for the problem "${problem.name || 'coding problem'}":

Code:
\`\`\`${language}
${code}
\`\`\`

Problem Context:
${problem.statement || 'No statement available'}

Please provide:
1. Code explanation (what the code does step by step)
2. Time complexity analysis
3. Space complexity analysis
4. Potential improvements or optimizations
5. Edge cases the code handles or misses

Keep the explanation clear and educational.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Code explanation error:', error)
      throw new Error("I'm sorry, I couldn't analyze the code right now. Please try again later.")
    }
  }

  async generateHint(problem: any, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    try {
      const prompt = `
Give a helpful hint for this coding problem without revealing the complete solution:

Problem: ${problem.name || 'Coding Problem'}
Difficulty: ${problem.difficulty || difficulty}
Statement: ${problem.statement || 'No statement available'}
Examples: ${JSON.stringify(problem.examples || [], null, 2)}

Provide a ${difficulty === 'easy' ? 'gentle' : difficulty === 'medium' ? 'moderate' : 'subtle'} hint that helps the user think about:
- The right approach or algorithm
- Key insights needed
- Data structures that might be useful
- Important edge cases to consider

Don't give away the solution, but help them get unstuck.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Hint generation error:', error)
      throw new Error("I'm sorry, I couldn't generate a hint right now. Please try again later.")
    }
  }

  async debugCode(code: string, language: string, error: string, problem: any): Promise<string> {
    try {
      const prompt = `
Help debug this ${language} code that's producing an error:

Problem: ${problem.name || 'Coding Problem'}
Code:
\`\`\`${language}
${code}
\`\`\`

Error: ${error}

Please help identify:
1. What's causing the error
2. How to fix it
3. Common mistakes in this type of problem
4. Best practices to avoid similar issues

Provide specific guidance without giving away the complete solution.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Debug error:', error)
      throw new Error("I'm sorry, I couldn't help debug the code right now. Please try again later.")
    }
  }

  async optimizeCode(code: string, language: string, problem: any): Promise<string> {
    try {
      const prompt = `
Analyze this ${language} code and suggest optimizations:

Problem: ${problem.name || 'Coding Problem'}
Code:
\`\`\`${language}
${code}
\`\`\`

Problem Context:
${problem.statement || 'No statement available'}
Constraints: ${problem.constraints?.join(', ') || 'No constraints listed'}

Please suggest:
1. Time complexity improvements
2. Space complexity optimizations
3. Code readability enhancements
4. Alternative approaches or algorithms
5. Best practices for this problem type

Focus on educational guidance rather than providing the complete optimized solution.
`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Optimization error:', error)
      throw new Error("I'm sorry, I couldn't analyze the code for optimization right now. Please try again later.")
    }
  }
}

const genAIService = new GenAIService()

// Hook for general chat with AI
export const useAIChat = () => {
  return useMutation({
    mutationFn: (request: ChatRequest) => genAIService.generateResponse(request),
  })
}

// Hook for code explanation
export const useCodeExplanation = () => {
  return useMutation({
    mutationFn: ({ code, language, problem }: { code: string; language: string; problem: any }) =>
      genAIService.explainCode(code, language, problem),
  })
}

// Hook for getting hints
export const useHint = () => {
  return useMutation({
    mutationFn: ({ problem, difficulty }: { problem: any; difficulty?: 'easy' | 'medium' | 'hard' }) =>
      genAIService.generateHint(problem, difficulty),
  })
}

// Hook for debugging code
export const useDebugCode = () => {
  return useMutation({
    mutationFn: ({ code, language, error, problem }: { code: string; language: string; error: string; problem: any }) =>
      genAIService.debugCode(code, language, error, problem),
  })
}

// Hook for code optimization suggestions
export const useOptimizeCode = () => {
  return useMutation({
    mutationFn: ({ code, language, problem }: { code: string; language: string; problem: any }) =>
      genAIService.optimizeCode(code, language, problem),
  })
}

export { genAIService }
export type { Message, ChatRequest }
