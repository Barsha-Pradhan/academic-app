'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const roles = [
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'admin', label: 'Admin', icon: '🛡️' },
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email, password,
      })

      if (authError) throw authError

      const { data: profile, error: profileError } = await supabase
        .from('user')
        .select('role')
        .eq('user_id', authData.user.id)
        .single()

      if (profileError) throw new Error("Profile not found.")

      if (profile.role.toLowerCase() !== role.toLowerCase()) {
        await supabase.auth.signOut()
        throw new Error(`Unauthorized: Account is registered as ${profile.role}.`)
      }

      if (role === 'student') router.push('/student')
      else if (role === 'faculty') router.push('/teacher')
      else if (role === 'admin') router.push('/admin')

      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-black">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Academic Portal</h1>
        
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          {roles.map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                role === r.id ? 'bg-white shadow-sm text-black' : 'text-slate-400'
              }`}>
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all">
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          New user? <Link href="/register" className="text-blue-600 font-bold">Register Now</Link>
        </p>
      </div>
    </div>
  )
}