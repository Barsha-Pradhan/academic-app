'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ClipboardList, BookOpen, Shield, CalendarOff, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const navItems = [
  { label: 'Dashboard',         href: '/teacher',              icon: LayoutDashboard },
  { label: 'Attendance',        href: '/teacher/attendance',   icon: ClipboardList },
  { label: 'Lesson Plan',       href: '/teacher/lesson-plan',  icon: BookOpen },
  { label: 'Exam Duty',         href: '/teacher/exam-duty',    icon: Shield },
  { label: 'Leave Application', href: '/teacher/leave',        icon: CalendarOff },
]

export default function TeacherLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm fixed h-full">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Faculty Portal</p>
          <h2 className="text-lg font-bold text-slate-800">Dashboard</h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              href === '/teacher'
                ? pathname === '/teacher'
                : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 overflow-auto">
        {children}
      </main>
    </div>
  )
}