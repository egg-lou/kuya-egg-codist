import { createFileRoute, Link } from '@tanstack/react-router'
import { Code, Zap, Brain, Play, ArrowRight } from 'lucide-react'

function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Code. Solve. Learn.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Practice coding problems with our modern IDE powered by Judge0. 
              Get AI assistance, run your code instantly, and improve your programming skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/problems"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Coding
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/judge0/ide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors border border-gray-700"
              >
                <Code className="w-5 h-5" />
                View Source
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-400 text-lg">Everything you need to practice and improve your coding skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multiple Languages</h3>
              <p className="text-gray-400">
                Support for JavaScript, Python, Java, Go, C++, and many more programming languages 
                with syntax highlighting and auto-completion.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
              <p className="text-gray-400">
                Get intelligent help with problem-solving approaches, debugging assistance, 
                and code optimization suggestions powered by Gemini AI.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Execution</h3>
              <p className="text-gray-400">
                Run your code instantly with our Judge0 API integration. 
                Get immediate feedback with detailed test results and error messages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of developers improving their skills with our platform
          </p>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Browse Problems
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
