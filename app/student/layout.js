'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function StudentLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(data)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-[#002d5b] text-white transition-all duration-300 overflow-hidden flex flex-col shadow-2xl z-30`}>
        <div className="p-5 border-b border-blue-900 flex items-center gap-3 bg-[#001e42]">
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-red-600 rounded-full flex items-center justify-center font-bold shadow-lg">CP</div>
          <span className="font-bold text-xl tracking-tight whitespace-nowrap">CampusPortal</span>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto px-2">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Student Menu</p>

          <div className="space-y-1">
            <details open className="group">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#003d7a] rounded-lg list-none transition-all">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-gray-400">👤</span> <span>Personal Info.</span>
                </div>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="bg-[#001d3d] rounded-lg mt-1 py-1 text-xs pl-12 flex flex-col gap-2 pb-2">
                <Link href="/student/profile" className="text-gray-300 hover:text-white py-1 transition-colors">Student Personal Info.</Link>
              </div>
            </details>

            <details open className="group">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#003d7a] rounded-lg list-none transition-all">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-gray-400">📚</span> <span>Academic Info.</span>
                </div>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="bg-[#001d3d] rounded-lg mt-1 py-1 text-xs pl-12 flex flex-col gap-2 pb-2">
                <Link href="/student/timetable" className="text-gray-300 hover:text-white py-1">Class Time Table</Link>
                <Link href="/student/attendance" className="text-gray-300 hover:text-white py-1">Class Attendance</Link>
                <Link href="/student/subjects" className="text-gray-300 hover:text-white py-1">Registered Subjects</Link>
              </div>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#003d7a] rounded-lg list-none transition-all">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-gray-400">📝</span> <span>Exam. Info.</span>
                </div>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="bg-[#001d3d] rounded-lg mt-1 py-1 text-xs pl-12 flex flex-col gap-2 pb-2">
                {/* ✅ FIXED PATHS */}
                <Link href="/student/exam-info/admit-card" className="text-gray-300 hover:text-white py-1">Admit Card</Link>
                <Link href="/student/exam-info/result" className="text-gray-300 hover:text-white py-1">Student Result</Link>
              </div>
            </details>
          </div>
        </nav>
      </aside>

      {/* MAIN SECTION */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm z-20">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 text-2xl hover:text-blue-900 transition-colors">☰</button>
          <div className="flex items-center gap-5">
            <span className="text-blue-700 font-bold hidden md:block">Welcome |</span>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">👤</div>
              <span className="text-sm font-black text-gray-800 uppercase tracking-tight">
                {user?.full_name || user?.name || 'STUDENT'}
              </span>
            </div>
            <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all">LOGOUT</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}