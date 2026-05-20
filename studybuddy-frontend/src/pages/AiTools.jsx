import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import api from '../api/axios'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const tools = [
  { key: 'explain', label: 'Explain a topic', endpoint: '/api/ai/explain', placeholder: 'e.g. Dynamic Programming', responseKey: 'explanation' },
  { key: 'quiz', label: 'Generate a quiz', endpoint: '/api/ai/quiz', placeholder: 'Paste your notes here or upload a PDF...', responseKey: 'quiz', isContext: true },
  { key: 'summarize', label: 'Summarize notes', endpoint: '/api/ai/summarize', placeholder: 'Paste your notes here or upload a PDF...', responseKey: 'summary', isContext: true },
]

function ResultModal({ result, tool, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800">{tool.label}</h2>
            <p className="text-xs text-gray-400 mt-0.5">AI generated result</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to clipboard
          </button>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AiTools() {
  const [activeTool, setActiveTool] = useState(tools[0])
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setExtracting(true)
    setError('')
    setFileName(file.name)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }
      setTopic(fullText.trim())
    } catch {
      setError('Failed to extract text from PDF. Make sure it is not scanned.')
    } finally {
      setExtracting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')
    setError('')
    try {
      const body = activeTool.isContext
        ? { topic: 'notes', context: topic }
        : { topic }
      const res = await api.post(activeTool.endpoint, body)
      setResult(res.data[activeTool.responseKey])
      setShowModal(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToolChange = (tool) => {
    setActiveTool(tool)
    setTopic('')
    setResult('')
    setError('')
    setFileName('')
    setShowModal(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Study Tools</h1>
      <p className="text-sm text-gray-500 mb-6">Powered by AI to help you study smarter</p>

      <div className="flex gap-2 mb-6">
        {tools.map(tool => (
          <button
            key={tool.key}
            onClick={() => handleToolChange(tool)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTool.key === tool.key ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTool.isContext ? (
            <>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium px-4 py-2 rounded-xl border border-indigo-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {extracting ? 'Reading PDF...' : 'Upload PDF'}
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </label>
                {fileName && (
                  <span className="text-xs text-gray-500 truncate max-w-xs">{fileName}</span>
                )}
              </div>
              <div className="relative">
                <textarea
                  placeholder={activeTool.placeholder}
                  rows={8}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
                {extracting && (
                  <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-indigo-600 font-medium">Extracting text...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <input
              placeholder={activeTool.placeholder}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          )}

          <button
            type="submit"
            disabled={loading || !topic.trim() || extracting}
            className="bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : activeTool.label}
          </button>
        </form>

        {error && <p className="text-sm text-red-500 mt-4 bg-red-50 p-3 rounded-lg">{error}</p>}
      </div>

      {showModal && (
        <ResultModal
          result={result}
          tool={activeTool}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}