import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Code, Home, List, Github, TestTube } from 'lucide-react'
import { queryClient } from '../utils/queryClient'
import '../styles.css'

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                  <Code className="w-6 h-6 text-blue-400" />
                  <span>Kuya Egg's Code Tester</span>
                </Link>
                
                <div className="flex items-center gap-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition-colors [&.active]:bg-gray-800 [&.active]:text-blue-400"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link
                    to="/problems"
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition-colors [&.active]:bg-gray-800 [&.active]:text-blue-400"
                  >
                    <List className="w-4 h-4" />
                    Problems
                  </Link>
                  <Link
                    to="/demo"
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition-colors [&.active]:bg-gray-800 [&.active]:text-blue-400"
                  >
                    <TestTube className="w-4 h-4" />
                    Demo
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/judge0/ide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
