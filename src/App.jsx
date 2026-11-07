import { useState } from 'react'
import api from './api'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [jobs, setJobs] = useState([])

  const login = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setMessage(`Logged in as ${res.data.email} (${res.data.role})`)
    } catch {
      setMessage('Invalid email or password')
    }
  }

  const loadJobs = async () => {
    const res = await api.get('/jobs?page=0&size=10')
    setJobs(res.data.content)
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Job Portal</h1>

      <form onSubmit={login} className="space-y-3 rounded-lg border p-4">
        <input className="w-full rounded border p-2" placeholder="Email"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="rounded bg-indigo-600 px-4 py-2 text-white">Login</button>
        <p className="text-sm">{message}</p>
      </form>

      <button onClick={loadJobs} className="mt-4 rounded bg-gray-800 px-4 py-2 text-white">
        Load jobs
      </button>
      <ul className="mt-3 space-y-2">
        {jobs.map((j) => (
          <li key={j.id} className="rounded border p-3">
            <b>{j.title}</b>, {j.companyName}, {j.location}
          </li>
        ))}
      </ul>
    </div>
  )
}