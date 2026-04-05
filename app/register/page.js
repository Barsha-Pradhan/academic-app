'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('student') 

  const [form, setForm] = useState({
    email: '', password: '', fullName: '', username: '', 
    enrollmentNo: '', department: '', designation: ''
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
      })

      if (authError) throw authError
      const userId = authData.user?.id

      await supabase.from('user').insert([{
        user_id: userId, username: form.username, email: form.email, role: role
      }])

      if (role === 'student') {
        await supabase.from('student').insert([{
          user_id: userId, full_name: form.fullName, 
          enrollment_no: form.enrollmentNo, department: form.department
        }])
      } else if (role === 'faculty') {
        await supabase.from('faculty').insert([{
          user_id: userId, full_name: form.fullName, designation: form.designation
        }])
      }

      alert("Success! Please log in.")
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (key, val) => setForm({...form, [key]: val})

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-black">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          {['student', 'faculty', 'admin'].map((r) => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${
                role === r ? 'bg-white shadow-sm text-black' : 'text-slate-400'
              }`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input placeholder="Username" required onChange={e => updateForm('username', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
          <input placeholder="Full Name" required onChange={e => updateForm('fullName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
          <input placeholder="Email" type="email" required onChange={e => updateForm('email', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
          <input placeholder="Password" type="password" required onChange={e => updateForm('password', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />

          {role === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Enroll No" required onChange={e => updateForm('enrollmentNo', e.target.value)} className="px-4 py-3 bg-slate-50 border rounded-xl" />
              <input placeholder="Dept" required onChange={e => updateForm('department', e.target.value)} className="px-4 py-3 bg-slate-50 border rounded-xl" />
            </div>
          )}

          {role === 'faculty' && (
            <input placeholder="Designation (e.g. Professor)" required onChange={e => updateForm('designation', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
          )}

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg">
            {loading ? "CREATING..." : "REGISTER NOW"}
          </button>
        </form>
      </div>
    </div>
  )
}