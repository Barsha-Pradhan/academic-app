'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ParentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUser(data)

      const { data: attData } = await supabase
        .from('attendance')
        .select('*, courses(name)')
        .eq('student_id', '1d313703-4b8f-435a-b6d2-b983054f1c7d')
        .order('date', { ascending: false })

      setAttendance(attData || [])

      if (attData && attData.length > 0) {
        const present = attData.filter(a => a.status === 'present').length
        setPercentage(Math.round((present / attData.length) * 100))
      }
    }
    getData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Academic App</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Parent Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-xl shadow text-center ${percentage < 75 ? 'bg-red-50' : 'bg-white'}`}>
            <p className={`text-4xl font-bold ${percentage < 75 ? 'text-red-600' : 'text-green-600'}`}>{percentage}%</p>
            <p className="text-gray-500 mt-1">Child's Attendance</p>
            {percentage < 75 && (
              <p className="text-red-500 text-sm mt-2 font-medium">⚠️ Below required 75% threshold!</p>
            )}
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <p className="text-4xl font-bold text-blue-600">{attendance.length}</p>
            <p className="text-gray-500 mt-1">Total Classes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-800">Attendance History</h3>
          {attendance.length === 0 && <p className="text-gray-400 text-sm">No attendance records yet.</p>}
          {attendance.map(a => (
            <div key={a.id} className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="text-sm font-medium text-gray-800">{a.courses?.name}</p>
                <p className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}