import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import AutomatedTester from '../components/AutomatedTester'
import TestRunner from '../components/TestRunner'
import { type TestCase } from '../utils/codeWrappers'

function DemoPage() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`)

  const [language, setLanguage] = useState('javascript')

  // Sample test cases for Two Sum problem
  const testCases: TestCase[] = [
    {
      input: [[2, 7, 11, 15], 9],
      expected: [0, 1],
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: [[3, 2, 4], 6],
      expected: [1, 2],
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      input: [[3, 3], 6],
      expected: [0, 1],
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
    },
    {
      input: [[1, 2, 3, 4, 5], 8],
      expected: [2, 4],
      explanation: "Because nums[2] + nums[4] == 8, we return [2, 4]."
    },
    {
      input: [[5, 75, 25], 100],
      expected: [1, 2],
      explanation: "Because nums[1] + nums[2] == 100, we return [1, 2]."
    }
  ]

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ]

  const getStarterCode = (lang: string) => {
    switch (lang) {
      case 'python':
        return `def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`
      
      case 'java':
        return `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        
        map.put(nums[i], i);
    }
    
    return new int[]{};
}`
      
      case 'cpp':
        return `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        
        map[nums[i]] = i;
    }
    
    return {};
}`
      
      default:
        return code
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(getStarterCode(newLanguage))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Automated Testing Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Experience LeetCode-style automated testing with our Judge0 integration. 
            Write code, run tests, and get instant feedback!
          </p>
        </div>

        {/* Problem Description */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Problem: Two Sum</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">
              Given an array of integers <code className="bg-gray-800 px-2 py-1 rounded">nums</code> and an integer <code className="bg-gray-800 px-2 py-1 rounded">target</code>, 
              return indices of the two numbers such that they add up to target.
            </p>
            <p className="text-gray-300 mb-4">
              You may assume that each input would have exactly one solution, and you may not use the same element twice.
            </p>
            <p className="text-gray-300">
              You can return the answer in any order.
            </p>
            
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <h4 className="text-green-400 font-medium mb-2">Example:</h4>
              <div className="font-mono text-sm">
                <div><span className="text-blue-400">Input:</span> nums = [2,7,11,15], target = 9</div>
                <div><span className="text-green-400">Output:</span> [0,1]</div>
                <div className="text-gray-400 mt-1">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section */}
        <div className="mb-6">
          <TestRunner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Code Editor</h3>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="400px"
              />
            </div>
          </div>

          {/* Automated Tester */}
          <div>
            <AutomatedTester
              userCode={code}
              language={language}
              testCases={testCases}
              functionName="twoSum"
              onTestComplete={(results) => {
                console.log('Test completed:', results)
              }}
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">How Automated Testing Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 rounded p-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3">1</div>
              <h4 className="font-medium mb-2">Code Analysis</h4>
              <p className="text-gray-400">Automatically detects your function name and analyzes the code structure.</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-3">2</div>
              <h4 className="font-medium mb-2">Wrapper Generation</h4>
              <p className="text-gray-400">Generates language-specific test wrapper code around your solution.</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mb-3">3</div>
              <h4 className="font-medium mb-2">Judge0 Execution</h4>
              <p className="text-gray-400">Runs the wrapped code with test cases using Judge0 API in isolated environment.</p>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold mb-3">4</div>
              <h4 className="font-medium mb-2">Result Parsing</h4>
              <p className="text-gray-400">Parses execution output and provides detailed feedback for each test case.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})
