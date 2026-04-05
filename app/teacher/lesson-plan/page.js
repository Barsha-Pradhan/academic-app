'use client'
import { useState } from 'react'
import { BookOpen, Upload, Plus, FileText, CheckCircle, Trash2 } from 'lucide-react'

export default function LessonPlanPage() {
  const [plans, setPlans] = useState([
    { id: 1, topic: 'Introduction to React Hooks', date: '2024-05-10', status: 'Completed', file: 'hooks_intro.pdf' },
    { id: 2, topic: 'Database Normalization', date: '2024-05-15', status: 'Pending', file: null },
  ])

  const [newPlan, setNewPlan] = useState({ topic: '', date: '', file: null })
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        setNewPlan({ ...newPlan, file: file.name })
        setUploading(false)
        alert(`File "${file.name}" ready for upload.`)
      }, 1000)
    }
  }

  const addPlan = (e) => {
    e.preventDefault()
    if (!newPlan.topic || !newPlan.date) return
    const planToAdd = {
      id: Date.now(),
      topic: newPlan.topic,
      date: newPlan.date,
      status: 'Pending',
      file: newPlan.file
    }
    setPlans([planToAdd, ...plans])
    setNewPlan({ topic: '', date: '', file: null })
  }

  return (
    <div className="text-black space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lesson Planning</h1>
          <p className="text-slate-500 text-sm">Organize your teaching schedule and materials.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
          Total Plans: {plans.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Plan Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> New Lesson Plan
            </h3>
            <form onSubmit={addPlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Topic Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Binary Search Trees"
                  className="w-full p-3 bg-slate-50 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPlan.topic}
                  onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Planned Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-slate-50 border rounded-xl mt-1 outline-none"
                  value={newPlan.date}
                  onChange={(e) => setNewPlan({...newPlan, date: e.target.value})}
                  required
                />
              </div>

              {/* File Upload Section */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-all">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-600">
                    {uploading ? "Uploading..." : newPlan.file ? newPlan.file : "Upload Lesson Material"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">PDF, PPT, or DOCX</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                Create Plan
              </button>
            </form>
          </div>
        </div>

        {/* Planned Lessons List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" /> Planned Schedule
          </h3>
          
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-xl ${plan.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {plan.status === 'Completed' ? <CheckCircle size={24}/> : <FileText size={24}/>}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{plan.topic}</h4>
                  <p className="text-xs text-slate-500 font-medium">Date: {plan.date}</p>
                  {plan.file && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                      <FileText size={12}/> {plan.file}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                  plan.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {plan.status}
                </span>
                <button 
                  onClick={() => setPlans(plans.filter(p => p.id !== plan.id))}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}