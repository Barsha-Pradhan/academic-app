'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function CoursePage() {
  const router = useRouter()
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [materials, setMaterials] = useState([])
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState('materials')
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('lesson')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    const getData = async () => {
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', id).single()
      setCourse(courseData)
      const { data: materialsData } = await supabase.from('materials').select('*').eq('course_id', id)
      setMaterials(materialsData || [])
      const { data: enrollments } = await supabase.from('enrollments').select('student_id, users(id, name, email)').eq('course_id', id)
      setStudents(enrollments?.map(e => e.users).filter(u => u !== null) || [])
    }
    getData()
  }, [id])

  const handleAddMaterial = async () => {
    const { data } = await supabase.from('materials').insert({
      course_id: id, title, description, type
    }).select()
    setMaterials([...materials, ...(data || [])])
    setTitle(''); setDescription(''); setShowAddMaterial(false)
  }

  const handleMarkAttendance = async () => {
    const records = students.map(student => ({
      course_id: id,
      student_id: student.id,
      date: attendanceDate,
      status: attendance[student.id] || 'present'
    }))
    const { error } = await supabase.from('attendance').upsert(records)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Attendance saved!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Academic App</h1>
        <button onClick={() => router.push('/teacher')} className="text-sm text-gray-500 hover:underline">← Back</button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-1 text-gray-800">{course?.name}</h2>
        <p className="text-gray-500 mb-6">{course?.semester}</p>

        <div className="flex gap-2 mb-6">
          {['materials', 'attendance', 'students'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'materials' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Materials</h3>
              <button onClick={() => setShowAddMaterial(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">+ Add Material</button>
            </div>
            {showAddMaterial && (
              <div className="bg-white p-5 rounded-xl shadow mb-4">
                <input type="text" placeholder="Title" className="w-full border p-3 rounded-lg mb-3 text-sm text-gray-800 placeholder-gray-400" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea placeholder="Description" className="w-full border p-3 rounded-lg mb-3 text-sm text-gray-800 placeholder-gray-400" value={description} onChange={e => setDescription(e.target.value)} />
                <select className="w-full border p-3 rounded-lg mb-3 text-sm text-gray-800" value={type} onChange={e => setType(e.target.value)}>
                  <option value="lesson">Lesson Plan</option>
                  <option value="material">Study Material</option>
                  <option value="assignment">Assignment</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleAddMaterial} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
                  <button onClick={() => setShowAddMaterial(false)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}
            {materials.length === 0 && <p className="text-gray-400 text-sm bg-white p-5 rounded-xl shadow">No materials yet.</p>}
            {materials.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${m.type === 'lesson' ? 'bg-blue-100 text-blue-600' : m.type === 'assignment' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{m.type}</span>
                    <span className="font-medium text-gray-800">{m.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                {m.description && <p className="text-gray-500 text-sm mt-2">{m.description}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4 text-gray-800">Mark Attendance</h3>
            <input type="date" className="border p-2 rounded-lg mb-4 text-sm text-gray-800" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
            {students.length === 0 && <p className="text-gray-400 text-sm">No students enrolled yet.</p>}
            {students.map(student => (
              <div key={student.id} className="flex justify-between items-center py-3 border-b">
                <span className="text-sm font-medium text-gray-800">{student.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAttendance({ ...attendance, [student.id]: 'present' })}
                    className={`px-3 py-1 rounded-lg text-sm ${attendance[student.id] !== 'absent' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                  >Present</button>
                  <button
                    onClick={() => setAttendance({ ...attendance, [student.id]: 'absent' })}
                    className={`px-3 py-1 rounded-lg text-sm ${attendance[student.id] === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                  >Absent</button>
                </div>
              </div>
            ))}
            {students.length > 0 && (
              <button onClick={handleMarkAttendance} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save Attendance</button>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4 text-gray-800">Enrolled Students</h3>
            {students.length === 0 && <p className="text-gray-400 text-sm">No students enrolled yet.</p>}
            {students.map(student => (
              <div key={student.id} className="py-3 border-b">
                <p className="font-medium text-sm text-gray-800">{student.name}</p>
                <p className="text-gray-400 text-xs">{student.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}