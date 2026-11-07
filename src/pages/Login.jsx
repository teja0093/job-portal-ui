import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    }
  }

  const input = 'w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200'

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
            <Briefcase />
          </span>
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <p className="text-sm text-gray-500">Login to continue</p>
        </div>

        {error && <p className="rounded-xl bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>}

        <input className={input} placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow hover:opacity-90">
          Login
        </button>
        <p className="text-center text-sm text-gray-500">
          No account? <Link className="font-semibold text-indigo-600" to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}