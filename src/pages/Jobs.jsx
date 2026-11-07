import { useEffect, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'

const typeColor = {
  FULL_TIME: 'bg-indigo-100 text-indigo-700',
  PART_TIME: 'bg-amber-100 text-amber-700',
  INTERNSHIP: 'bg-emerald-100 text-emerald-700',
  CONTRACT: 'bg-rose-100 text-rose-700',
}

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [filters, setFilters] = useState({ keyword: '', location: '', jobType: '' })
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [message, setMessage] = useState('')
  const [appliedIds, setAppliedIds] = useState([])

  const load = async (p = page) => {
    const params = { page: p, size: 6, sort: 'postedDate,desc' }
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.location) params.location = filters.location
    if (filters.jobType) params.jobType = filters.jobType
    try {
      const res = await api.get('/jobs', { params })
      setJobs(res.data.content)
      setTotalPages(res.data.totalPages ?? res.data.page?.totalPages ?? 1)
    } catch (err) {
      setMessage(errorMessage(err))
    }
  }

  const loadApplied = async () => {
    if (user?.role !== 'CANDIDATE') return
    try {
      const res = await api.get('/applications/my')
      setAppliedIds(res.data.map((a) => a.jobId))
    } catch {
      /* ignore */
    }
  }

  useEffect(() => { load(page) }, [page])
  useEffect(() => { loadApplied() }, [user])

  const search = (e) => {
    e.preventDefault()
    if (page === 0) load(0)
    else setPage(0)
  }

  const apply = async (id) => {
    try {
      await api.post(`/jobs/${id}/apply`)
      setAppliedIds((prev) => [...prev, id])
      setMessage('Applied successfully!')
    } catch (err) {
      if (err.response?.status === 409) {
        setAppliedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
        setMessage('You have already applied for this job')
      } else if (err.response?.status === 403) {
        setMessage('Only candidates can apply')
      } else {
        setMessage(errorMessage(err))
      }
    }
  }

  const field = 'rounded-xl border-0 bg-white p-3 text-gray-800 outline-none focus:ring-2 focus:ring-fuchsia-300'

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-extrabold md:text-4xl">Find your dream job</h1>
        <p className="mt-1 text-white/80">Search jobs by keyword, location and type</p>
        <form onSubmit={search} className="mt-5 grid gap-2 md:grid-cols-4">
          <input className={field} placeholder="Keyword (e.g. java)" value={filters.keyword}
                 onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
          <input className={field} placeholder="Location" value={filters.location}
                 onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          <select className={field} value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
            <option value="">All types</option>
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
          </select>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 p-3 font-semibold text-white hover:bg-gray-800">
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-indigo-100 p-3 text-sm font-medium text-indigo-800">{message}</p>
      )}

      {jobs.length === 0 && <p className="text-center text-gray-500">No jobs found.</p>}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j) => {
          const applied = appliedIds.includes(j.id)
          return (
            <div key={j.id} className="lift flex flex-col justify-between rounded-2xl bg-white p-5 shadow-md">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg font-bold text-white">
                    {j.companyName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight">{j.title}</h3>
                    <p className="text-sm text-gray-500">{j.companyName}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${typeColor[j.jobType]}`}>
                    {j.jobType?.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin size={13} /> {j.location}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{j.description}</p>
                <p className="mt-3 text-lg font-extrabold text-indigo-700">
                  ₹{j.salary?.toLocaleString('en-IN')}
                </p>
              </div>

              {user?.role === 'CANDIDATE' && (
                applied ? (
                  <button disabled
                          className="mt-4 cursor-not-allowed rounded-xl bg-gray-200 py-2 font-semibold text-gray-500">
                    Applied
                  </button>
                ) : (
                  <button onClick={() => apply(j.id)}
                          className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2 font-semibold text-white hover:opacity-90">
                    Apply now
                  </button>
                )
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}
                className="rounded-full bg-white px-4 py-1.5 font-medium shadow disabled:opacity-40">Previous</button>
        <span className="text-sm text-gray-600">Page {page + 1} of {Math.max(totalPages, 1)}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}
                className="rounded-full bg-white px-4 py-1.5 font-medium shadow disabled:opacity-40">Next</button>
      </div>
    </div>
  )
}