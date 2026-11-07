export default function StatCard({ label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    green: 'from-emerald-500 to-green-600',
    amber: 'from-amber-400 to-orange-500',
    red: 'from-rose-500 to-red-600',
  }
  return (
    <div className={`lift rounded-2xl bg-gradient-to-br p-5 text-white shadow-md ${colors[color]}`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="mt-1 text-4xl font-extrabold">{value}</p>
    </div>
  )
}