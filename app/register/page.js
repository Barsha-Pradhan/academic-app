'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') || 'student'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    id_no: '',
    phone: '',
    branch: 'CSE',
    program: 'B.Tech'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    // 1. Sign up
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          role: role
        }
      }
    })

    if (error) throw error

    const user = data.user
    if (!user) throw new Error("Signup failed. Try again.")

    // 2. Insert into students table (NO PASSWORD)
    const { error: insertError } = await supabase
      .from('students')
      .insert([
        {
          id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          student_id: formData.id_no,
          phone: formData.phone,
          role: role,
          branch: role === 'student' ? formData.branch : null,
          program: role === 'student' ? formData.program : null
        }
      ])

    if (insertError) throw insertError

    alert('Registration successful! Check your email to verify, then login.')
    router.push('/')

  } catch (err) {
    setError(err.message || 'Registration failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-[#002244] border-b pb-4 mb-8 uppercase">
          {role} Registration
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-gray-400 block mb-1">FULL NAME</label>
            <input name="full_name" onChange={handleChange} required
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-400 bg-gray-50" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">EMAIL</label>
            <input name="email" type="email" onChange={handleChange} required
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-400 bg-blue-50" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">PASSWORD</label>
            <input name="password" type="password" onChange={handleChange} required
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-400 bg-blue-50" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">
              {role === 'student' ? 'ENROLLMENT NO' : 'FACULTY ID'}
            </label>
            <input name="id_no" onChange={handleChange} required
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-400 bg-gray-50" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">PHONE</label>
            <input name="phone" onChange={handleChange} required
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-400 bg-gray-50" />
          </div>

          {role === 'student' && (
            <>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">BRANCH</label>
                <select name="branch" onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50">
                  <option value="CSE">CSE</option>
                  <option value="EE">EE</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">PROGRAM</label>
                <select name="program" onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50">
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>
            </>
          )}

          <div className="md:col-span-2 pt-4">
            <button type="submit" disabled={loading}
              className="w-full bg-[#0d1b2a] text-white py-4 rounded-lg font-bold">
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function RegisterWrapper() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'student'
  return <RegisterForm key={role} />
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <RegisterWrapper />
    </Suspense>
  )
}