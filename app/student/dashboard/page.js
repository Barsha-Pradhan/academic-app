'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [materials, setMaterials] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [activeTab, setActiveTab] = useState('materials')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Get logged-in user from Supabase
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          router.replace('/')
          return
        }

        const authUser = data.user

        // 2. Fetch user details from students table
        const { data: userData, error: fetchError } = await supabase
          .from('students')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (fetchError || !userData) {
          router.replace('/')
          return
        }

        // 3. Role check
        if (userData.role.toLowerCase() !== 'student') {
          router.replace('/')
          return
        }

        setUser(userData)
        setLoading(false)

        // 4. Load dashboard data
        loadData(authUser.id)

      } catch (err) {
        router.replace('/')
      }
    }

    checkUser()
  }, [])

  const loadData = async (userId) => {
    try {
      // 1. Fetch enrollments
      const { data: enrollments, error: eErr } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', userId)

      if (eErr) throw eErr

      const courseIds = enrollments?.map((e) => e.course_id) || []
      if (courseIds.length === 0) return

      // 2. Fetch materials + attendance
      const [{ data: mData, error: mErr }, { data: attData, error: aErr }] =
        await Promise.all([
          supabase.from('materials').select('*, courses(name)').in('course_id', courseIds),
          supabase.from('attendance').select('status').eq('student_id', userId),
        ])

      if (mErr) throw mErr
      if (aErr) throw aErr

      setMaterials(mData || [])

      if (attData?.length > 0) {
        const present = attData.filter((a) => a.status === 'present').length
        setPercentage(Math.round((present / attData.length) * 100))
      }
    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#003a70]" />
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-[#003a70] text-white p-5 rounded-t-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">Dashboard</span>
          <h2 className="text-xl font-bold tracking-tight">Student Dashboard</h2>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-xl border border-gray-100">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800">
            Welcome back, {user?.full_name || 'Student'}!
          </h3>
          <p className="text-gray-500 text-xs">
            Student ID: {user?.student_id}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard val={`${percentage}%`} label="Attendance" color="red" />
          <StatCard val={materials.length} label="Materials" color="green" />
          <StatCard val="0" label="Assignments" color="purple" />
        </div>

        <div className="flex gap-2 mb-6 border-b pb-4">
          {['materials', 'attendance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-[#003a70] text-white shadow-md'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[200px]">
          {activeTab === 'materials' ? (
            materials.length > 0 ? (
              materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-lg border mb-3 flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-gray-700">{m.title}</p>
                    <p className="text-[10px] text-gray-400">
                      {m.courses?.name}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase">
                    View PDF
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10 italic">
                No materials available for your courses.
              </p>
            )
          ) : (
            <p className="text-center text-gray-400 py-10 italic">
              Detailed attendance logs coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ val, label, color }) {
  const colors = {
    red: 'bg-red-50 border-red-100 text-red-600',
    green: 'bg-green-50 border-green-100 text-green-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
  }

  return (
    <div
      className={`${colors[color]} border p-6 rounded-3xl flex flex-col items-center justify-center shadow-sm`}
    >
      <div className="text-4xl font-black mb-1">{val}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
        {label}
      </span>
    </div>
  )
}