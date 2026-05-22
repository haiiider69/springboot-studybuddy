import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'
import api from '../api/axios'
import * as pdfjsLib from 'pdfjs-dist'
import { createWorker } from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function Groups() {
  const { user } = useAuth()
  const location = useLocation()
  const [groups, setGroups] = useState([])
  const [messages, setMessages] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '' })
  const [msgContent, setMsgContent] = useState('')
  const [extracting, setExtracting] = useState(false)

  useEffect(() => {
    if (location.state?.activeGroupId && groups.length > 0) {
      const group = groups.find(g => g.id === location.state.activeGroupId)
      if (group) handleSelectGroup(group)
    }
  }, [groups])

  const fetchGroups = async () => {
    const res = await api.get('/api/groups')
    setGroups(res.data)
  }

  const fetchMessages = async (groupId) => {
    const res = await api.get(`/api/groups/${groupId}/messages`)
    setMessages(res.data)
  }

  useEffect(() => { fetchGroups() }, [])

  const handleSelectGroup = (group) => {
    setActiveGroup(group)
    fetchMessages(group.id)
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    await api.post('/api/groups', form)
    setForm({ name: '', subject: '' })
    fetchGroups()
  }

  const handleJoin = async (groupId) => {
    await api.post(`/api/groups/${groupId}/members/${user.userId}`)
    fetchGroups()
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!msgContent.trim()) return
    await api.post(`/api/groups/${activeGroup.id}/messages`, { content: msgContent, senderId: user.userId })
    setMsgContent('')
    fetchMessages(activeGroup.id)
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setExtracting(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ').trim()

        if (pageText.length > 20) {
          fullText += pageText + '\n'
        } else {
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise

          const worker = await createWorker('eng')
          const { data: { text } } = await worker.recognize(canvas)
          await worker.terminate()
          fullText += text + '\n'
        }
      }

      const trimmed = fullText.trim().slice(0, 2000)
      const message = `📄 **${file.name}**\n\n${trimmed}`
      await api.post(`/api/groups/${activeGroup.id}/messages`, {
        content: message,
        senderId: user.userId
      })
      fetchMessages(activeGroup.id)
    } catch (err) {
      console.error('PDF error:', err)
      alert('Failed to read PDF: ' + err.message)
    } finally {
      setExtracting(false)
      e.target.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
      <div className="w-72 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Create group</h2>
          <form onSubmit={handleCreateGroup} className="flex flex-col gap-2">
            <input placeholder="Group name" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Subject" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Create</button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">All groups</h2>
          <div className="flex flex-col gap-2">
            {groups.map(group => (
              <div
                key={group.id}
                onClick={() => handleSelectGroup(group)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${activeGroup?.id === group.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <p className="text-sm font-medium text-gray-800">{group.name}</p>
                <p className="text-xs text-gray-400">{group.subject} · {group.memberUsernames.length} members</p>
                {!group.memberUsernames.includes(user.username) && (
                  <button onClick={e => { e.stopPropagation(); handleJoin(group.id) }} className="mt-2 text-xs text-indigo-600 hover:underline">Join</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col">
        {activeGroup ? (
          <>
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{activeGroup.name}</h2>
              <p className="text-xs text-gray-400">{activeGroup.subject}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 min-h-64">
              {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello!</p>}
              {messages.map(msg => {
                const isMe = msg.senderUsername === user.username
                const member = activeGroup.members?.find(m => m.username === msg.senderUsername)
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {member?.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={msg.senderUsername}
                        className="w-7 h-7 rounded-full object-cover border-2 border-indigo-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-500 flex-shrink-0">
                        {msg.senderUsername?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-2xl text-sm max-w-sm whitespace-pre-wrap ${isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{msg.senderUsername}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2 items-center">
              <label className={`cursor-pointer p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all ${extracting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {extracting ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  disabled={extracting}
                  onChange={handlePdfUpload}
                />
              </label>
              <input
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={msgContent}
                onChange={e => setMsgContent(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a group to start chatting</div>
        )}
      </div>
    </div>
  )
}