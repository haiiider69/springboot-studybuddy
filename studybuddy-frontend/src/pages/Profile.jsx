import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ bio: '', major: '', studyYear: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/users/${user.userId}`)
      setProfile(res.data)
      setForm({ bio: res.data.bio || '', major: res.data.major || '', studyYear: res.data.studyYear || '' })
    } catch (err) {
      console.error('Profile fetch error:', err.response?.data || err.message)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result
      try {
        await api.put(`/api/users/${user.userId}`, { profilePicture: base64 })
        fetchProfile()
      } catch (err) {
        console.error('Image upload error:', err.response?.data || err.message)
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put(`/api/users/${user.userId}`, form)
      await fetchProfile()
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-sm">Loading profile...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center text-center">
        <div className="relative mb-4">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-500">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full cursor-pointer transition-all">
            {uploading ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <h1 className="text-xl font-bold text-gray-800">{profile.username}</h1>
        <p className="text-sm text-gray-400 mb-1">{profile.email}</p>
        {profile.major && <p className="text-sm text-indigo-500 font-medium">{profile.major} — Year {profile.studyYear}</p>}
        {profile.bio && !editing && <p className="text-sm text-gray-600 mt-3 max-w-md">{profile.bio}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Profile info</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Edit
            </button>
          )}
        </div>

        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg mb-4">Profile updated successfully!</p>
        )}

        {editing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bio</label>
              <textarea rows={3} placeholder="Tell your classmates about yourself..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Major</label>
              <input placeholder="e.g. Computer Science" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Year</label>
              <input placeholder="e.g. 3" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" value={form.studyYear} onChange={e => setForm({ ...form, studyYear: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save changes'}
              </button>
              <button onClick={() => setEditing(false)} className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Username</span>
              <span className="text-gray-700 font-medium">{profile.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Email</span>
              <span className="text-gray-700">{profile.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Major</span>
              <span className="text-gray-700">{profile.major || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Year</span>
              <span className="text-gray-700">{profile.studyYear || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bio</span>
              <span className="text-gray-700 text-right max-w-xs">{profile.bio || '—'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}