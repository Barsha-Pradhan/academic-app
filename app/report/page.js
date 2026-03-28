'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReportPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUser(userData)

      const { data: coursesData } = await supabase.from('courses').select('*')
      setCourses(coursesData || [])

      const report = []
      for (const course of coursesData || []) {
        const { data: materials } = await supabase.from('materials').select('*').eq('course_id', course.id)
        const { data: attendance } = await supabase.from('attendance').select('*').eq('course_id', course.id)
        const { data: enrollments } = await supabase.from('enrollments').select('*').eq('course_id', course.id)

        const uniqueDates = [...new Set(attendance?.map(a => a.date) || [])]
        const studentStats = {}

        for (const record of attendance || []) {
          if (!studentStats[record.student_id]) {
            studentStats[record.student_id] = { present: 0, absent: 0 }
          }
          if (record.status === 'present') studentStats[record.student_id].present++
          else studentStats[record.student_id].absent++
        }

        report.push({
          course,
          materials: materials || [],
          totalClasses: uniqueDates.length,
          totalStudents: enrollments?.length || 0,
          attendance: attendance || [],
          uniqueDates,
          studentStats,
          lessons: materials?.filter(m => m.type === 'lesson') || [],
          assignments: materials?.filter(m => m.type === 'assignment') || [],
        })
      }

      setReportData(report)
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Generating report...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Academic App</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={() => router.push(`/${user?.role}`)} className="text-sm text-gray-500 hover:underline">← Back</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Semester Report</h2>
            <p className="text-gray-500 text-sm">Auto-generated — {new Date().toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >🖨️ Print Report</button>
        </div>

        {reportData.map(({ course, materials, totalClasses, totalStudents, uniqueDates, lessons, assignments, attendance }) => (
          <div key={course.id} className="bg-white rounded-xl shadow mb-6 overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-lg font-bold">{course.name}</h3>
              <p className="text-blue-100 text-sm">{course.semester}</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{totalClasses}</p>
                  <p className="text-gray-500 text-xs">Total Classes</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{materials.length}</p>
                  <p className="text-gray-500 text-xs">Materials Uploaded</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
                  <p className="text-gray-500 text-xs">Students Enrolled</p>
                </div>
              </div>

              {uniqueDates.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold mb-3 text-sm">Date-wise Attendance</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 text-gray-500 font-medium">Date</th>
                        <th className="text-center p-2 text-gray-500 font-medium">Present</th>
                        <th className="text-center p-2 text-gray-500 font-medium">Absent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueDates.map(date => {
                        const dayRecords = attendance.filter(a => a.date === date)
                        const present = dayRecords.filter(a => a.status === 'present').length
                        const absent = dayRecords.filter(a => a.status === 'absent').length
                        return (
                          <tr key={date} className="border-b">
                            <td className="p-2">{new Date(date).toLocaleDateString()}</td>
                            <td className="p-2 text-center text-green-600 font-medium">{present}</td>
                            <td className="p-2 text-center text-red-600 font-medium">{absent}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {lessons.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold mb-3 text-sm">Covered Lesson Plans</h4>
                  {lessons.map(l => (
                    <div key={l.id} className="flex items-start gap-2 mb-2">
                      <span className="text-blue-500 mt-0.5">📘</span>
                      <div>
                        <p className="text-sm font-medium">{l.title}</p>
                        {l.description && <p className="text-xs text-gray-400">{l.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {assignments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Assignments</h4>
                  {assignments.map(a => (
                    <div key={a.id} className="flex items-start gap-2 mb-2">
                      <span className="text-red-500 mt-0.5">📝</span>
                      <div>
                        <p className="text-sm font-medium">{a.title}</p>
                        {a.description && <p className="text-xs text-gray-400">{a.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}