import StatCard from './StatCard'

const badge = {
  APPLIED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

const th = 'p-3 font-semibold'

export default function ApplicantsPanel({ jobId, jobTitle, list, onStatus }) {
  const count = (s) => list.filter((a) => a.status === s).length

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="text-lg font-bold">Applicants for: {jobTitle} (job #{jobId})</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total applicants" value={list.length} />
        <StatCard label="Applied" value={count('APPLIED')} color="amber" />
        <StatCard label="Shortlisted" value={count('SHORTLISTED')} color="green" />
        <StatCard label="Rejected" value={count('REJECTED')} color="red" />
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
            <tr>
              <th className={th}>Candidate</th><th className={th}>Applied on</th>
              <th className={th}>Status</th><th className={th}>Change status</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-gray-500">No applicants yet.</td></tr>
            )}
            {list.map((a) => (
              <tr key={a.id} className="border-t hover:bg-indigo-50">
                <td className="p-3 font-medium">{a.candidateName}</td>
                <td className="p-3 text-gray-600">{a.appliedDate}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-3">
                  <select value={a.status} onChange={(e) => onStatus(a.id, e.target.value)}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-1.5">
                    <option>APPLIED</option>
                    <option>SHORTLISTED</option>
                    <option>REJECTED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}