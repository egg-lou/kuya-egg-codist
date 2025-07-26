import { useQuery } from '@tanstack/react-query'
import { db } from '../utils/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

// Fallback data for testing
const fallbackProblems = [
    {
        slug: 'best-meeting-point',
        name: 'Best Meeting Point',
        difficulty: 'hard',
        statement: '<p>You have an m by n binary grid where each cell with a 1 represents a friend\'s home. Your task is to find a meeting point that minimizes the total travel distance for all friends.</p>',
        examples: [
            {
                input: 'grid = [[1,0,0,0,1],[0,0,0,0,0],[0,0,1,0,0]]',
                output: '6',
                explanation: 'Three friends live at coordinates (0,0), (0,4), and (2,2). The point (0,2) serves as an optimal meeting spot.'
            }
        ],
        constraints: [
            'm == grid.length',
            'n == grid[i].length',
            '1 <= m, n <= 200'
        ],
        testCases: [
            {
                output: '6',
                variables: [
                    {
                        name: 'grid',
                        type: 'array',
                        elementType: 'int',
                        value: '[[1,0,0,0,1],[0,0,0,0,0],[0,0,1,0,0]]'
                    }
                ]
            }
        ],
        starterCode: {
            javascript: 'function solution(grid) {\n    // Write your code here\n    return 0;\n}',
            python: 'def solution(grid):\n    # Write your code here\n    return 0',
            java: 'public class Solution {\n    public int solution(int[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}',
            go: 'func solution(grid [][]int) int {\n    // Write your code here\n    return 0\n}'
        },
        author: {
            authorName: 'Test Author'
        },
        searchKeywords: ['array', 'matrix', 'manhattan distance']
    }
]

const getProblems = async () => {
    try {
        const q = query(collection(db, 'code-problems'), where('slug', '==', 'two-sum'))
        const problems = await getDocs(q)
        const firebaseProblems = problems.docs.map((doc) => doc.data())
        
        // If no problems from Firebase, return fallback data
        if (firebaseProblems.length === 0) {
            console.log('No problems found in Firebase, using fallback data')
            return fallbackProblems
        }
        
        return firebaseProblems
    } catch (error) {
        console.error('Error fetching problems from Firebase:', error)
        console.log('Using fallback data due to error')
        return fallbackProblems
    }
}

const getProblemBySlug = async (slug: string) => {
    try {
        const q = query(collection(db, 'code-problems'), where('slug', '==', slug))
        const problem = await getDocs(q)
        const firebaseProblems = problem.docs.map((doc) => doc.data())
        
        // If no problem found in Firebase, check fallback data
        if (firebaseProblems.length === 0) {
            console.log(`No problem found in Firebase for slug: ${slug}, checking fallback data`)
            const fallbackProblem = fallbackProblems.find(p => p.slug === slug)
            return fallbackProblem ? [fallbackProblem] : []
        }
        
        return firebaseProblems
    } catch (error) {
        console.error('Error fetching problem from Firebase:', error)
        console.log('Using fallback data due to error')
        const fallbackProblem = fallbackProblems.find(p => p.slug === slug)
        return fallbackProblem ? [fallbackProblem] : []
    }
}

export const useProblems = () => {
    return useQuery({ queryKey: ['code-problems'], queryFn: getProblems })
}

export const useProblemBySlug = (slug: string) => {
    return useQuery({ queryKey: ['code-problems', slug], queryFn: () => getProblemBySlug(slug) })
}