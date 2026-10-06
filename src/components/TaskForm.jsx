import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'

const emptyTask = {
  title: '',
  description: '',
  owner: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '',
}

export default function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState(emptyTask)

  useEffect(() => {
    setForm(task ? { ...task } : emptyTask)
  }, [task])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.owner.trim()) return
    onSave({
      ...form,
      title: form.title.trim(),
      owner: form.owner.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Task title *</label>
        <input className="input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Enter task title" autoFocus />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea className="input min-h-24 resize-none" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What needs to be done?" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Owner *</label>
          <input className="input" value={form.owner} onChange={(e) => update('owner', e.target.value)} placeholder="Employee name" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Due date</label>
          <input type="date" className="input" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select className="input" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary"><Save size={17} /> Save task</button>
      </div>
    </form>
  )
}