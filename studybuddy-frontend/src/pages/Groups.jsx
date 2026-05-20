import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Groups() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [messages, setMessages] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '' })
  const [msgContent, setMsgContent] = useState('')

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
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.senderUsername === user.username ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${msg.senderUsername === user.username ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.senderUsername}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2">
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