import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Code, Clock, Users } from 'lucide-react'
import { useProblems } from '../../hooks/useProblems'

function ProblemsPage() {
  const { data: problems, isLoading, error } = useProblems()

  // Debug logging
  console.log('Problems data:', problems)
  console.log('Loading:', isLoading)
  console.log('Error:', error)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-6 mb-4">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Problems</h1>
          <p className="text-gray-400">Failed to load problems. Please try again later.</p>
          <p className="text-red-400 text-sm mt-2">Error: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Problems</h1>
          <p className="text-gray-400">Practice coding problems and improve your skills</p>
          {problems && (
            <p className="text-sm text-gray-500 mt-2">Found {problems.length} problems</p>
          )}
        </div>

        <div className="space-y-4">
          {problems?.map((problem: any, index: number) => {
            console.log(`Problem ${index}:`, problem)
            
            if (!problem.slug) {
              console.warn('Problem missing slug:', problem)
              return (
                <div key={index} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <p className="text-red-400">Problem missing slug: {problem.name || 'Unnamed'}</p>
                </div>
              )
            }
            
            return (
              <Link
                key={problem.slug}
                to="/problems/$slug"
                params={{ slug: problem.slug }}
                className="block bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors border border-gray-800 hover:border-gray-700"
                onClick={() => console.log('Navigating to:', problem.slug)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-semibold">{problem.name || 'Untitled Problem'}</h3>
                      {problem.difficulty && (
                        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div 
                      className="text-gray-400 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: problem.statement?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'No description available'
                      }}
                    />
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>By {problem.author?.authorName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{problem.testCases?.length || 0} test cases</span>
                      </div>
                    </div>
                    
                    {problem.searchKeywords && problem.searchKeywords.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {problem.searchKeywords.slice(0, 3).map((keyword: string) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {problems?.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No problems found</h2>
            <p className="text-gray-400">Check back later for new coding challenges!</p>
          </div>
        )}

        {!problems && !isLoading && !error && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No data received</h2>
            <p className="text-gray-400">There might be an issue with the data source.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/problems/')({
  component: ProblemsPage,
})
