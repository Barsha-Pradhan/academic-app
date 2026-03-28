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
          <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
          <button
            onClick={() => setShowAddCourse(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            + Add Course
          </button>
        </div>

        {showAddCourse && (
          <div className="bg-white p-5 rounded-xl shadow mb-6">
            <h3 className="font-semibold mb-3">New Course</h3>
            <input
              type="text"
              placeholder="Course Name"
              className="w-full border p-3 rounded-lg mb-3 text-sm"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Semester (e.g. Semester 1 2024)"
              className="w-full border p-3 rounded-lg mb-3 text-sm"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleAddCourse} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
              <button onClick={() => setShowAddCourse(false)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.length === 0 && (
            <div className="bg-white p-5 rounded-xl shadow col-span-2">
              <p className="text-gray-400 text-sm">No courses yet. Click "Add Course" to get started.</p>
            </div>
          )}
          {courses.map(course => (
            <div key={course.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{course.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{course.semester}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/teacher/course/${course.id}`)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  Manage Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}