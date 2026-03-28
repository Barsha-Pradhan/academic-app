'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function TeacherDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [courseName, setCourseName] = useState('')
  const [semester, setSemester] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUser(data)
      const { data: coursesData } = await supabase.from('courses').select('*').eq('teacher_id', user.id)
      setCourses(coursesData || [])
    }
    getData()
  }, [])

  const handleAddCourse = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('courses').insert({
      name: courseName,
      semester,
      teacher_id: user.id
    }).select()
    setCourses([...courses, ...(data || [])])
    setCourseName('')
    setSemester('')
    setShowAddCourse(false)
  }

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
          <button onClick={() => router.push('/report')} className="text-sm text-gray-600 hover:underline">Report</button>
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h2>
          <button
            onClick={() => setShowAddCourse(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            + Add Course
          </button>
        </div>

        {showAddCourse && (
          <div className="bg-white p-5 rounded-xl shadow mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">New Course</h3>
            <input
              type="text"
              placeholder="Course Name"
              className="w-full border p-3 rounded-lg mb-3 text-sm text-gray-800 placeholder-gray-400"