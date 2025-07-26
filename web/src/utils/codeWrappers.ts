// Automated code wrapper generation for LeetCode-style testing

export interface TestCase {
  input: any[]
  expected: any
  explanation?: string
}

export interface WrapperConfig {
  functionName: string
  testCases: TestCase[]
  userCode: string
  language: string
}

export interface WrapperTemplate {
  template: string
  languageId: number
  fileExtension: string
}

// Language-specific wrapper templates
const WRAPPER_TEMPLATES: Record<string, WrapperTemplate> = {
  javascript: {
    languageId: 63, // Node.js
    fileExtension: 'js',
    template: `
{USER_CODE}

// Test execution framework
const testCases = {TEST_CASES};
const results = [];

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

for (let i = 0; i < testCases.length; i++) {
  const testCase = testCases[i];
  const startTime = Date.now();
  
  try {
    const result = {FUNCTION_NAME}(...testCase.input);
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    const passed = deepEqual(result, testCase.expected);
    
    results.push({
      testCaseId: i + 1,
      passed: passed,
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(testCase.expected),
      actual: JSON.stringify(result),
      executionTime: executionTime,
      status: passed ? 'passed' : 'failed'
    });
  } catch (error) {
    results.push({
      testCaseId: i + 1,
      passed: false,
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(testCase.expected),
      actual: 'Error',
      error: error.message,
      status: 'runtime_error'
    });
  }
}

// Output results as JSON for parsing
console.log('JUDGE_RESULTS_START');
console.log(JSON.stringify(results));
console.log('JUDGE_RESULTS_END');
`
  },

  python: {
    languageId: 71, // Python 3
    fileExtension: 'py',
    template: `
import json
import time
import sys

{USER_CODE}

# Test execution framework
test_cases = {TEST_CASES}
results = []

def deep_equal(a, b):
    if type(a) != type(b):
        return False
    if isinstance(a, list):
        if len(a) != len(b):
            return False
        return all(deep_equal(x, y) for x, y in zip(a, b))
    elif isinstance(a, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(deep_equal(a[k], b[k]) for k in a.keys())
    else:
        return a == b

for i, test_case in enumerate(test_cases):
    start_time = time.time()
    
    try:
        result = {FUNCTION_NAME}(*test_case['input'])
        end_time = time.time()
        execution_time = int((end_time - start_time) * 1000)  # Convert to ms
        
        passed = deep_equal(result, test_case['expected'])
        
        results.append({
            'testCaseId': i + 1,
            'passed': passed,
            'input': json.dumps(test_case['input']),
            'expected': json.dumps(test_case['expected']),
            'actual': json.dumps(result),
            'executionTime': execution_time,
            'status': 'passed' if passed else 'failed'
        })
    except Exception as error:
        results.append({
            'testCaseId': i + 1,
            'passed': False,
            'input': json.dumps(test_case['input']),
            'expected': json.dumps(test_case['expected']),
            'actual': 'Error',
            'error': str(error),
            'status': 'runtime_error'
        })

# Output results as JSON for parsing
print('JUDGE_RESULTS_START')
print(json.dumps(results))
print('JUDGE_RESULTS_END')
`
  },

  java: {
    languageId: 62, // Java
    fileExtension: 'java',
    template: `
import java.util.*;
import java.util.concurrent.TimeUnit;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class Solution {
    {USER_CODE}
    
    public static void main(String[] args) {
        String testCasesJson = "{TEST_CASES_JSON}";
        Gson gson = new Gson();
        
        // Parse test cases
        List<Map<String, Object>> testCases = gson.fromJson(testCasesJson, 
            new TypeToken<List<Map<String, Object>>>(){}.getType());
        
        List<Map<String, Object>> results = new ArrayList<>();
        Solution solution = new Solution();
        
        for (int i = 0; i < testCases.size(); i++) {
            Map<String, Object> testCase = testCases.get(i);
            long startTime = System.currentTimeMillis();
            
            try {
                // This would need to be customized based on the specific function signature
                Object result = solution.{FUNCTION_NAME}(/* parse inputs from testCase */);
                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                
                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("testCaseId", i + 1);
                resultMap.put("passed", result.equals(testCase.get("expected")));
                resultMap.put("input", gson.toJson(testCase.get("input")));
                resultMap.put("expected", gson.toJson(testCase.get("expected")));
                resultMap.put("actual", gson.toJson(result));
                resultMap.put("executionTime", executionTime);
                resultMap.put("status", result.equals(testCase.get("expected")) ? "passed" : "failed");
                
                results.add(resultMap);
            } catch (Exception error) {
                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("testCaseId", i + 1);
                resultMap.put("passed", false);
                resultMap.put("input", gson.toJson(testCase.get("input")));
                resultMap.put("expected", gson.toJson(testCase.get("expected")));
                resultMap.put("actual", "Error");
                resultMap.put("error", error.getMessage());
                resultMap.put("status", "runtime_error");
                
                results.add(resultMap);
            }
        }
        
        System.out.println("JUDGE_RESULTS_START");
        System.out.println(gson.toJson(results));
        System.out.println("JUDGE_RESULTS_END");
    }
}
`
  },

  cpp: {
    languageId: 54, // C++
    fileExtension: 'cpp',
    template: `
#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

{USER_CODE}

int main() {
    string testCasesJson = R"({TEST_CASES_JSON})";
    json testCases = json::parse(testCasesJson);
    json results = json::array();
    
    for (int i = 0; i < testCases.size(); i++) {
        auto testCase = testCases[i];
        auto startTime = chrono::high_resolution_clock::now();
        
        try {
            // This would need to be customized based on the specific function signature
            auto result = {FUNCTION_NAME}(/* parse inputs from testCase */);
            auto endTime = chrono::high_resolution_clock::now();
            auto executionTime = chrono::duration_cast<chrono::milliseconds>(endTime - startTime).count();
            
            json resultObj;
            resultObj["testCaseId"] = i + 1;
            resultObj["passed"] = (result == testCase["expected"]);
            resultObj["input"] = testCase["input"].dump();
            resultObj["expected"] = testCase["expected"].dump();
            resultObj["actual"] = json(result).dump();
            resultObj["executionTime"] = executionTime;
            resultObj["status"] = (result == testCase["expected"]) ? "passed" : "failed";
            
            results.push_back(resultObj);
        } catch (const exception& error) {
            json resultObj;
            resultObj["testCaseId"] = i + 1;
            resultObj["passed"] = false;
            resultObj["input"] = testCase["input"].dump();
            resultObj["expected"] = testCase["expected"].dump();
            resultObj["actual"] = "Error";
            resultObj["error"] = error.what();
            resultObj["status"] = "runtime_error";
            
            results.push_back(resultObj);
        }
    }
    
    cout << "JUDGE_RESULTS_START" << endl;
    cout << results.dump() << endl;
    cout << "JUDGE_RESULTS_END" << endl;
    
    return 0;
}
`
  }
};

// Function to generate wrapped code automatically
export function generateWrappedCode(config: WrapperConfig): { code: string; languageId: number } {
  const template = WRAPPER_TEMPLATES[config.language.toLowerCase()];
  
  if (!template) {
    throw new Error(`Unsupported language: ${config.language}`);
  }

  // Convert test cases to JSON string
  const testCasesJson = JSON.stringify(config.testCases.map(tc => ({
    input: tc.input,
    expected: tc.expected
  })));

  // Replace placeholders in template
  let wrappedCode = template.template
    .replace('{USER_CODE}', config.userCode)
    .replace('{FUNCTION_NAME}', config.functionName)
    .replace('{TEST_CASES}', testCasesJson)
    .replace('{TEST_CASES_JSON}', testCasesJson.replace(/"/g, '\\"'));

  return {
    code: wrappedCode,
    languageId: template.languageId
  };
}

// Function to parse Judge0 output and extract test results
export function parseTestResults(output: string): any[] {
  try {
    // Look for our special markers
    const startMarker = 'JUDGE_RESULTS_START';
    const endMarker = 'JUDGE_RESULTS_END';
    
    const startIndex = output.indexOf(startMarker);
    const endIndex = output.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find test results in output');
    }
    
    const jsonStr = output.substring(startIndex + startMarker.length, endIndex).trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse test results:', error);
    return [];
  }
}

// Function to extract function name from user code (basic implementation)
export function extractFunctionName(code: string, language: string): string {
  const patterns: Record<string, RegExp> = {
    javascript: /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\(.*?\)\s*=>))/,
    python: /def\s+(\w+)\s*\(/,
    java: /public\s+(?:static\s+)?(?:\w+\s+)*(\w+)\s*\(/,
    cpp: /(?:int|string|vector|bool|double|float|long|char)\s+(\w+)\s*\(/
  };

  const pattern = patterns[language.toLowerCase()];
  if (!pattern) return 'solution'; // default fallback

  const match = code.match(pattern);
  return match ? (match[1] || match[2] || 'solution') : 'solution';
}
