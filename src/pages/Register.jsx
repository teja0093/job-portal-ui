import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import api, { errorMessage } from '../api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const input = 'w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200'

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
            <UserPlus />
          </span>
          <h1 className="text-2xl font-extrabold">Create account</h1>
          <p className="text-sm text-gray-500">Join the job portal</p>
        </div>

        {error && <p className="rounded-xl bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>}

        <input name="name" className={input} placeholder="Name" value={form.name}
               onChange={change} required />
        <input name="email" type="email" className={input} placeholder="Email" value={form.email}
               onChange={change} required />
        <input name="password" type="password" className={input} placeholder="Password (min 6)"
               value={form.password} onChange={change} required />
        <select name="role" className={input} value={form.role} onChange={change}>
          <option value="CANDIDATE">Candidate (find jobs)</option>
          <option value="EMPLOYER">Employer (post jobs)</option>
        </select>
        <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow hover:opacity-90">
          Create account
        </button>
        <p className="text-center text-sm text-gray-500">
          Have an account? <Link className="font-semibold text-indigo-600" to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}