import { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
}

const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'javascript':
      return javascript()
    case 'python':
      return python()
    case 'java':
      return java()
    case 'go':
    case 'cpp':
    case 'c':
      return cpp()
    default:
      return javascript()
  }
}

export default function CodeEditor({ value, onChange, language, height = '400px' }: CodeEditorProps) {
  const [extensions, setExtensions] = useState([
    getLanguageExtension(language),
    oneDark,
    EditorView.theme({
      '&': {
        fontSize: '14px',
        fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
      },
      '.cm-content': {
        padding: '16px',
        minHeight: height,
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        borderRadius: '8px',
        border: '1px solid #374151',
      },
      '.cm-scroller': {
        fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
      },
    }),
    EditorView.lineWrapping,
  ])

  useEffect(() => {
    setExtensions([
      getLanguageExtension(language),
      oneDark,
      EditorView.theme({
        '&': {
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: height,
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          borderRadius: '8px',
          border: '1px solid #374151',
        },
        '.cm-scroller': {
          fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
        },
      }),
      EditorView.lineWrapping,
    ])
  }, [language, height])

  return (
    <div className="w-full">
      <CodeMirror
        value={value}
        onChange={(val) => onChange(val)}
        extensions={extensions}
        theme={oneDark}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
        }}
      />
    </div>
  )
}
