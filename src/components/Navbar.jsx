import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, LogOut } from 'lucide-react'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const link = 'rounded-full px-3 py-1.5 text-sm font-medium hover:bg-white/20'

  return (
    <nav className="sticky top-0 z-10 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="rounded-lg bg-white/20 p-1.5"><Briefcase size={20} /></span>
          JobPortal
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className={link}>Jobs</Link>
          {user && <Link to="/dashboard" className={link}>Dashboard</Link>}
          {user?.role === 'EMPLOYER' && <Link to="/employer" className={link}>Manage</Link>}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-700">
                {user.email[0].toUpperCase()}
              </div>
              <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-xs md:inline">
                {user.role}
              </span>
              <button onClick={handleLogout}
                      className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={link}>Login</Link>
              <Link to="/register"
                    className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}