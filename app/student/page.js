'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [materials, setMaterials] = useState([])
  const [attendance, setAttendance] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [activeTab, setActiveTab] = useState('materials')

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUser(data)

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user.id)

      const courseIds = enrollments?.map(e => e.course_id) || []

      if (courseIds.length > 0) {
        const { data: materialsData } = await supabase
          .from('materials')
          .select('*, courses(name)')
          .in('course_id', courseIds)
          .order('created_at', { ascending: false })
        setMaterials(materialsData || [])

        const { data: attData } = await supabase
          .from('attendance')
          .select('*, courses(name)')
          .eq('student_id', user.id)
          .order('date', { ascending: false })
        setAttendance(attData || [])

        if (attData && attData.length > 0) {
          const present = attData.filter(a => a.status === 'present').length
          setPercentage(Math.round((present / attData.length) * 100))
        }
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
          <button onClick={() => router.push('/timetable')} className="text-sm text-gray-600 hover:underline">Timetable</button>
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-5 rounded-xl shadow text-center ${percentage < 75 ? 'bg-red-50' : 'bg-white'}`}>
            <p className={`text-3xl font-bold ${percentage < 75 ? 'text-red-600' : 'text-green-600'}`}>{percentage}%</p>
            <p className="text-gray-500 mt-1">Attendance</p>
            {percentage < 75 && <p className="text-red-500 text-xs mt-1">⚠️ Below 75%!</p>}
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <p className="text-3xl font-bold text-green-600">{materials.filter(m => m.type !== 'assignment').length}</p>
            <p className="text-gray-500 mt-1">Materials</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{materials.filter(m => m.type === 'assignment').length}</p>
            <p className="text-gray-500 mt-1">Assignments</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['materials', 'attendance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'materials' && (
          <div>
            {materials.length === 0 && <p className="text-gray-400 text-sm bg-white p-5 rounded-xl shadow">No materials yet.</p>}
            {materials.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${m.type === 'lesson' ? 'bg-blue-100 text-blue-600' : m.type === 'assignment' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{m.type}</span>
                    <span className="font-medium">{m.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{m.courses?.name}</span>
                </div>
                {m.description && <p className="text-gray-500 text-sm mt-2">{m.description}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">My Attendance</h3>
            {attendance.length === 0 && <p className="text-gray-400 text-sm">No attendance records yet.</p>}
            {attendance.map(a => (
              <div key={a.id} className="flex justify-between items-center py-3 border-b">
                <div>
                  <p className="text-sm font-medium">{a.courses?.name}</p>
                  <p className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}