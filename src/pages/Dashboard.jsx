import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../AuthContext'
import StatCard from '../components/StatCard'

const badge = {
  APPLIED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

const th = 'p-3 font-semibold'

export default function Dashboard() {
  const { user } = useAuth()
  const [totalJobs, setTotalJobs] = useState(0)
  const [rows, setRows] = useState([])

  useEffect(() => {
    const load = async () => {
      const jobsRes = await api.get('/jobs', { params: { page: 0, size: 100 } })
      const jobs = jobsRes.data.content
      setTotalJobs(jobsRes.data.totalElements ?? jobsRes.data.page?.totalElements ?? jobs.length)

      if (user.role === 'CANDIDATE') {
        const res = await api.get('/applications/my')
        setRows(res.data)
      } else {
        const withCounts = await Promise.all(
          jobs.map(async (j) => {
            const res = await api.get(`/jobs/${j.id}/applications`)
            return {
              ...j,
              applicants: res.data.length,
              shortlisted: res.data.filter((a) => a.status === 'SHORTLISTED').length,
              rejected: res.data.filter((a) => a.status === 'REJECTED').length,
            }
          }))
        setRows(withCounts)
      }
    }
    load().catch(() => {})
  }, [user.role])

  if (user.role === 'CANDIDATE') {
    const count = (s) => rows.filter((a) => a.status === s).length
    return (
      <div>
        <h1 className="mb-1 text-3xl font-extrabold">Candidate Dashboard</h1>
        <p className="mb-6 text-gray-500">Welcome, {user.email}</p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Jobs available" value={totalJobs} />
          <StatCard label="Applied" value={rows.length} color="amber" />
          <StatCard label="Shortlisted" value={count('SHORTLISTED')} color="green" />
          <StatCard label="Rejected" value={count('REJECTED')} color="red" />
        </div>

        <h2 className="mb-3 text-lg font-bold">My applications</h2>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
              <tr><th className={th}>Job</th><th className={th}>Applied on</th><th className={th}>Status</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="3" className="p-4 text-gray-500">You have not applied to any jobs yet.</td></tr>
              )}
              {rows.map((a) => (
                <tr key={a.id} className="border-t hover:bg-indigo-50">
                  <td className="p-3 font-medium">{a.jobTitle}</td>
                  <td className="p-3 text-gray-600">{a.appliedDate}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const sum = (key) => rows.reduce((s, j) => s + j[key], 0)
  return (
    <div>
      <h1 className="mb-1 text-3xl font-extrabold">Employer Dashboard</h1>
      <p className="mb-6 text-gray-500">Welcome, {user.email}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total jobs" value={totalJobs} />
        <StatCard label="Total applicants" value={sum('applicants')} color="amber" />
        <StatCard label="Shortlisted" value={sum('shortlisted')} color="green" />
        <StatCard label="Rejected" value={sum('rejected')} color="red" />
      </div>

      <h2 className="mb-3 text-lg font-bold">Jobs and applicants</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
            <tr>
              <th className={th}>Job</th><th className={th}>Company</th>
              <th className={th}>Applicants</th><th className={th}>Shortlisted</th>
              <th className={th}>Rejected</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.id} className="border-t hover:bg-indigo-50">
                <td className="p-3 font-medium">{j.title}</td>
                <td className="p-3 text-gray-600">{j.companyName}</td>
                <td className="p-3">{j.applicants}</td>
                <td className="p-3 text-emerald-700">{j.shortlisted}</td>
                <td className="p-3 text-rose-700">{j.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}