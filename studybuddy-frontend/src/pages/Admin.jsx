import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-2`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
  )
}

function Table({ columns, data, onDelete, onPromote, showAvatar }) {
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No data found.</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {showAvatar && <th className="text-left text-xs text-gray-400 font-medium py-3 px-4">Photo</th>}
            {columns.map(col => (
              <th key={col} className="text-left text-xs text-gray-400 font-medium py-3 px-4">{col}</th>
            ))}
            <th className="text-left text-xs text-gray-400 font-medium py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
              {showAvatar && (
                <td className="py-3 px-4">
                  {row.profilePicture ? (
                    <img
                      src={row.profilePicture}
                      alt={row.username}
                      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-500">
                      {row.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
              )}
              {columns.map(col => (
                <td key={col} className="py-3 px-4 text-gray-700 max-w-xs truncate">
                  {col === 'role' ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row[col.toLowerCase()] === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {row[col.toLowerCase()]}
                    </span>
                  ) : (
                    row[col.toLowerCase()] || row[col] || '—'
                  )}
                </td>
              ))}
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {onPromote && row.role !== 'ADMIN' && (
                    <button
                      onClick={() => onPromote(row.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Promote
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(row.id)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
    }
  }, [user])

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchPosts()
    fetchGroups()
  }, [])

  const fetchStats = async () => {
    const res = await api.get('/api/admin/stats')
    setStats(res.data)
  }

  const fetchUsers = async () => {
    const res = await api.get('/api/admin/users')
    setUsers(res.data)
  }

  const fetchPosts = async () => {
    const res = await api.get('/api/admin/posts')
    setPosts(res.data)
  }

  const fetchGroups = async () => {
    const res = await api.get('/api/admin/groups')
    setGroups(res.data)
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/api/admin/users/${id}`)
    fetchUsers()
    fetchStats()
  }

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    await api.delete(`/api/admin/posts/${id}`)
    fetchPosts()
    fetchStats()
  }

  const deleteGroup = async (id) => {
    if (!confirm('Delete this group?')) return
    await api.delete(`/api/admin/groups/${id}`)
    fetchGroups()
    fetchStats()
  }

  const promoteUser = async (id) => {
    if (!confirm('Promote this user to admin?')) return
    await api.put(`/api/admin/users/${id}/promote`)
    fetchUsers()
  }

  const tabs = ['stats', 'users', 'posts', 'groups']

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Manage your StudyBuddy platform</p>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium">Admin</span>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} color="text-indigo-600" />
          <StatCard label="Total Posts" value={stats.totalPosts} color="text-blue-600" />
          <StatCard label="Total Groups" value={stats.totalGroups} color="text-purple-600" />
          <StatCard label="Open Posts" value={stats.openPosts} color="text-green-600" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">All Users ({users.length})</h2>
          <Table
            columns={['username', 'email', 'major', 'role']}
            data={users.map(u => ({ ...u, username: u.username, email: u.email, major: u.major, role: u.role }))}
            onDelete={deleteUser}
            onPromote={promoteUser}
            showAvatar={true}
          />
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">All Posts ({posts.length})</h2>
          <Table
            columns={['title', 'authorUsername', 'post_status']}
            data={posts.map(p => ({ ...p, title: p.title, authorusername: p.authorUsername, post_status: p.status }))}
            onDelete={deletePost}
          />
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">All Groups ({groups.length})</h2>
          <Table
            columns={['name', 'subject']}
            data={groups.map(g => ({ ...g, name: g.name, subject: g.subject }))}
            onDelete={deleteGroup}
          />
        </div>
      )}
    </div>
  )
}