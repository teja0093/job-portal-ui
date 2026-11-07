import { useEffect, useRef, useState } from 'react'
import api, { errorMessage } from '../api'
import ApplicantsPanel from '../components/ApplicantsPanel'

const input = 'w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200'
const btn = 'rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 font-semibold text-white hover:opacity-90'

export default function Employer() {
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [company, setCompany] = useState({ name: '', location: '', description: '' })
  const [job, setJob] = useState({ title: '', description: '', salary: '', location: '',
                                   jobType: 'FULL_TIME', companyId: '' })
  const [applicants, setApplicants] = useState({ jobId: null, jobTitle: '', list: [] })
  const [message, setMessage] = useState('')
  const panelRef = useRef(null)

  const loadAll = async () => {
    const [c, j] = await Promise.all([
      api.get('/companies'),
      api.get('/jobs', { params: { page: 0, size: 100 } }),
    ])
    setCompanies(c.data)
    setJobs(j.data.content)
  }

  useEffect(() => { loadAll().catch((err) => setMessage(errorMessage(err))) }, [])

  const createCompany = async (e) => {
    e.preventDefault()
    try {
      await api.post('/companies', company)
      setMessage('Company created')
      setCompany({ name: '', location: '', description: '' })
      loadAll()
    } catch (err) { setMessage(errorMessage(err)) }
  }

  const createJob = async (e) => {
    e.preventDefault()
    try {
      await api.post('/jobs', { ...job, salary: Number(job.salary), companyId: Number(job.companyId) })
      setMessage('Job posted')
      setJob({ ...job, title: '', description: '', salary: '' })
      loadAll()
    } catch (err) { setMessage(errorMessage(err)) }
  }

  const viewApplicants = async (j) => {
    try {
      const res = await api.get(`/jobs/${j.id}/applications`)
      setApplicants({ jobId: j.id, jobTitle: j.title, list: res.data })
      setMessage('')
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      setMessage('Could not load applicants: ' + errorMessage(err))
    }
  }

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status })
      const res = await api.get(`/jobs/${applicants.jobId}/applications`)
      setApplicants({ ...applicants, list: res.data })
    } catch (err) { setMessage(errorMessage(err)) }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Manage jobs</h1>
      {message && (
        <p className="rounded-xl bg-indigo-100 p-3 text-sm font-medium text-indigo-800">{message}</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={createCompany} className="space-y-3 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="text-lg font-bold">Add company</h2>
          <input className={input} placeholder="Name" value={company.name} required
                 onChange={(e) => setCompany({ ...company, name: e.target.value })} />
          <input className={input} placeholder="Location" value={company.location}
                 onChange={(e) => setCompany({ ...company, location: e.target.value })} />
          <input className={input} placeholder="Description" value={company.description}
                 onChange={(e) => setCompany({ ...company, description: e.target.value })} />
          <button className={btn}>Save company</button>
        </form>

        <form onSubmit={createJob} className="space-y-3 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="text-lg font-bold">Post a job</h2>
          <input className={input} placeholder="Title" value={job.title} required
                 onChange={(e) => setJob({ ...job, title: e.target.value })} />
          <input className={input} placeholder="Description" value={job.description}
                 onChange={(e) => setJob({ ...job, description: e.target.value })} />
          <input className={input} type="number" placeholder="Salary" value={job.salary}
                 onChange={(e) => setJob({ ...job, salary: e.target.value })} />
          <input className={input} placeholder="Location" value={job.location}
                 onChange={(e) => setJob({ ...job, location: e.target.value })} />
          <select className={input} value={job.jobType}
                  onChange={(e) => setJob({ ...job, jobType: e.target.value })}>
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
          </select>
          <select className={input} value={job.companyId} required
                  onChange={(e) => setJob({ ...job, companyId: e.target.value })}>
            <option value="">Select company</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className={btn}>Post job</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
            <tr><th className="p-3">Job</th><th className="p-3">Company</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t hover:bg-indigo-50">
                <td className="p-3 font-medium">{j.title}</td>
                <td className="p-3 text-gray-600">{j.companyName}</td>
                <td className="p-3">
                  <button onClick={() => viewApplicants(j)}
                          className="rounded-full bg-indigo-600 px-4 py-1.5 text-white hover:bg-indigo-700">
                    View applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={panelRef}>
        {applicants.jobId && (
          <ApplicantsPanel jobId={applicants.jobId} jobTitle={applicants.jobTitle}
                           list={applicants.list} onStatus={setStatus} />
        )}
      </div>
    </div>
  )
}