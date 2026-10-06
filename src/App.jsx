import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ClipboardList,
  Edit3,
  Filter,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import Modal from './components/Modal'
import TaskForm from './components/TaskForm'
import { initialTasks } from './data/initialTasks'

const STORAGE_KEY = 'taskflow-crud-tasks'

const statusStyles = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-rose-100 text-rose-700',
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialTasks
    } catch {
      return initialTasks
    }
  })
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    progress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  }), [tasks])

  const filteredTasks = useMemo(() => {
    const q = query.toLowerCase().trim()
    return tasks.filter((task) => {
      const matchesQuery = !q || [task.title, task.description, task.owner].some(v => v.toLowerCase().includes(q))
      const matchesStatus = status === 'All' || task.status === status
      const matchesPriority = priority === 'All' || task.priority === priority
      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [tasks, query, status, priority])

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const saveTask = (task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t))
    } else {
      setTasks(prev => [{ ...task, id: Date.now() }, ...prev])
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const confirmDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteId))
    setDeleteId(null)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('All')
    setPriority('All')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500">
              <ClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold">TaskFlow</h1>
              <p className="text-xs text-slate-400">Employee task management</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Local demo data
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-indigo-600">Dashboard</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Manage your tasks</h2>
            <p className="mt-1 text-sm text-slate-500">Create, update, search and delete employee tasks.</p>
          </div>
          <button className="btn-primary w-full sm:w-auto" onClick={openCreate}>
            <Plus size={18} /> Add task
          </button>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total tasks', stats.total, ListTodo, 'text-indigo-600', 'bg-indigo-50'],
            ['To do', stats.todo, ClipboardList, 'text-slate-600', 'bg-slate-100'],
            ['In progress', stats.progress, TrendingUp, 'text-amber-600', 'bg-amber-50'],
            ['Completed', stats.completed, CheckCircle2, 'text-emerald-600', 'bg-emerald-50'],
          ].map(([label, value, Icon, iconColor, iconBg]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconBg} ${iconColor}`}>
                  <Icon size={19} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="input pl-10 pr-10" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by task, description or owner..." />
                {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={16} /></button>}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:flex">
                <select className="input sm:w-40" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="All">All status</option>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <select className="input sm:w-40" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="All">All priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                {(query || status !== 'All' || priority !== 'All') && (
                  <button className="btn-secondary col-span-2 sm:col-span-1" onClick={clearFilters}><Filter size={16} /> Clear</button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Task</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Due date</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="transition hover:bg-slate-50/80">
                    <td className="max-w-sm px-5 py-4">
                      <p className="font-semibold text-slate-800">{task.title}</p>
                      <p className="mt-1 truncate text-sm text-slate-500">{task.description || 'No description'}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{task.owner}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>{task.status}</span></td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span></td>
                    <td className="px-5 py-4 text-sm text-slate-600">{task.dueDate || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(task)} className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600" title="Edit"><Edit3 size={17} /></button>
                        <button onClick={() => setDeleteId(task.id)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600" title="Delete"><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredTasks.map(task => (
              <article key={task.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800">{task.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{task.description || 'No description'}</p>
                  </div>
                  <button className="rounded-lg p-2 text-slate-400" aria-label="More"><MoreHorizontal size={18} /></button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>{task.status}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-slate-500"><Users size={15} /> {task.owner}</span>
                  <span className="text-slate-500">{task.dueDate || 'No due date'}</span>
                </div>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <button className="btn-secondary flex-1" onClick={() => openEdit(task)}><Edit3 size={15} /> Edit</button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50" onClick={() => setDeleteId(task.id)}><Trash2 size={15} /> Delete</button>
                </div>
              </article>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400"><Search size={20} /></div>
              <h3 className="mt-3 font-semibold text-slate-800">No tasks found</h3>
              <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing {filteredTasks.length} of {tasks.length} tasks · Data is persisted in browser localStorage
          </div>
        </section>
      </main>

      <Modal open={modalOpen} title={editingTask ? 'Edit task' : 'Create task'} onClose={() => setModalOpen(false)}>
        <TaskForm task={editingTask} onSave={saveTask} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={deleteId !== null} title="Delete task?" onClose={() => setDeleteId(null)}>
        <div className="p-5">
          <p className="text-sm leading-6 text-slate-600">This action will permanently remove the task from this browser's local data.</p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700" onClick={confirmDelete}><Trash2 size={16} /> Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App