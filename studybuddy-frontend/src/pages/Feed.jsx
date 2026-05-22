import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Feed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [joiningPostId, setJoiningPostId] = useState(null)

  const fetchPosts = async () => {
    try {
      const res = await api.get('/api/posts')
      setPosts(res.data)
    } catch {
      setError('Failed to load posts')
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/posts', { ...form, authorId: user.userId })
      setForm({ title: '', description: '' })
      fetchPosts()
    } catch {
      setError('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = async (id) => {
    try {
      await api.patch(`/api/posts/${id}/close`)
      fetchPosts()
    } catch {}
  }

  const handleStudyTogether = async (post) => {
    setJoiningPostId(post.id)
    try {
      const res = await api.post(`/api/groups/from-post/${post.id}/user/${user.userId}`)
      navigate('/groups', { state: { activeGroupId: res.data.id } })
    } catch {
      setError('Failed to create group')
    } finally {
      setJoiningPostId(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Post a study request</h2>
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="What do you need help with?"
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Add more details..."
            rows={3}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 self-end px-6">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {posts.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No posts yet. Be the first!</p>}
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{post.title}</h3>
                {post.description && <p className="text-sm text-gray-500 mt-1">{post.description}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-400">by {post.authorUsername}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {post.status === 'OPEN' && post.authorUsername !== user.username && (
                  <button
                    onClick={() => handleStudyTogether(post)}
                    disabled={joiningPostId === post.id}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    {joiningPostId === post.id ? 'Creating...' : '📚 Study Together'}
                  </button>
                )}
                {post.authorUsername === user.username && post.status === 'OPEN' && (
                  <button onClick={() => handleClose(post.id)} className="text-xs text-gray-400 hover:text-red-500 whitespace-nowrap">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}