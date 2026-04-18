'use client'
import { useState } from 'react'
import { FileUp, FileText, Trash2, Download, Plus, Globe } from 'lucide-react'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Module 1: Introduction to Data Structures', subject: 'CSE-301', date: '2024-05-01', size: '2.4 MB' },
    { id: 2, title: 'Algorithm Complexity Cheat Sheet', subject: 'CSE-301', date: '2024-05-05', size: '1.1 MB' },
  ])

  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      alert("Material uploaded successfully! Students can now access this from their dashboard.")
    }, 1500)
  }

  return (
    <div className="text-black space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Course Materials</h1>
          <p className="text-slate-500 text-sm">Upload and manage resources for your students.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
          <Globe size={14}/> Live on Student Portal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Plus size={18} className="text-blue-600"/> Shared New Resource</h3>
          <input placeholder="Title (e.g. Unit 2 Notes)" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <select className="w-full p-3 bg-slate-50 border rounded-xl outline-none">
            <option>Select Subject</option>
            <option>CSE-301 (Data Structures)</option>
            <option>CSE-402 (Web Tech)</option>
          </select>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer">
            <FileUp className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-500">Click to select PDF or PPT</p>
          </div>
          <button 
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            {uploading ? "Uploading..." : "Share with Class"}
          </button>
        </div>

        {/* Uploaded Materials List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest ml-1">Uploaded Resources</h3>
          {materials.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center group hover:border-blue-300 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl"><FileText/></div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{item.subject} • {item.date} • {item.size}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Download size={20}/></button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}