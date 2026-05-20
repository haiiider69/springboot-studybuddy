import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-lg font-bold text-indigo-600">StudyBuddy</Link>
        {user && (
          <>
            <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">Feed</Link>
            <Link to="/groups" className="text-sm text-gray-600 hover:text-indigo-600">Groups</Link>
            <Link to="/ai" className="text-sm text-gray-600 hover:text-indigo-600">AI Tools</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100">Login</Link>
            <Link to="/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}