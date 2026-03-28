'use client'
import { useState } from 'react'
import { supabase } from './lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginAs = async (role) => {
    setLoading(true)
    setError('')

    const credentials = {
      teacher: { email: 'teacher@test.com', password: 'password123' },
      student: { email: 'student@gmail.com', password: 'password123' },
      parent: { email: 'parent@test.com', password: 'password123' },
    }

    const { email, password } = credentials[role]
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/${role}`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Academic App</h1>
        <p className="text-center text-gray-500 mb-8">Select your role to continue</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <button
            onClick={() => loginAs('teacher')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition text-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👨‍🏫</span> Login as Teacher
          </button>

          <button
            onClick={() => loginAs('student')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition text-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👨‍🎓</span> Login as Student
          </button>

          <button
            onClick={() => loginAs('parent')}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition text-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👨‍👩‍👧</span> Login as Parent
          </button>
        </div>

        {loading && <p className="text-center text-gray-400 text-sm mt-4">Signing in...</p>}
      </div>
    </div>
  )
}
