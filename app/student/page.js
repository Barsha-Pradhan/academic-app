'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [materials, setMaterials] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [activeTab, setActiveTab] = useState('materials')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      if (typeof window === 'undefined') return

      const session = localStorage.getItem('session')
      if (!session) {
        router.push('/login')
        return
      }

      const userData = JSON.parse(session)
      setUser(userData)

      try {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', userData.id)
        
        const courseIds = enrollments?.map(e => e.course_id) || []

        if (courseIds.length > 0) {
          const { data: mData } = await supabase
            .from('materials')
            .select('*, courses(name)')
            .in('course_id', courseIds)
          setMaterials(mData || [])

          const { data: attData } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_id', userData.id)
            
          if (attData?.length > 0) {
            const present = attData.filter(a => a.status === 'present').length
            setPercentage(Math.round((present / attData.length) * 100))
          }
        }
      } catch (error) {
        console.error("Supabase error:", error.message)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003a70]"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#003a70] text-white p-5 rounded-t-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <h2 className="text-xl font-bold tracking-tight">Student Dashboard</h2>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('session'); router.push('/login') }}
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-xl border border-gray-100">
        {/* Welcome Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800">Welcome back, {user?.name || 'Student'}!</h3>
          <p className="text-gray-500 text-sm">Here is your academic overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-4xl font-black text-red-600 mb-1">{percentage}%</div>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Attendance</span>
            {percentage < 75 && <p className="text-[10px] text-red-400 mt-2 font-bold italic">⚠️ Below 75%!</p>}
          </div>

          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-4xl font-black text-green-700 mb-1">{materials.length}</div>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Materials</span>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-6 rounded-3xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-4xl font-black text-purple-700 mb-1">0</div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Assignments</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-4">
          <button 
            onClick={() => setActiveTab('materials')} 
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'materials' ? 'bg-[#003a70] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
          >
            Materials
          </button>
          <button 
            onClick={() => setActiveTab('attendance')} 
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'attendance' ? 'bg-[#003a70] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
          >
            Attendance
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[200px]">
          {activeTab === 'materials' ? (
            materials.length > 0 ? (
              materials.map((m) => (
                <div key={m.id} className="bg-white p-4 rounded-lg border mb-3 flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-gray-700">{m.title}</p>
                    <p className="text-[10px] text-gray-400">{m.courses?.name}</p>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase">View PDF</span>
                </div>
              ))
            ) : <p className="text-center text-gray-400 py-10 italic">No materials available for your courses.</p>
          ) : (
            <p className="text-center text-gray-400 py-10 italic">Detailed attendance logs coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}