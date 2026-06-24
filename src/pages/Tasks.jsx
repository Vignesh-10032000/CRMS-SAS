import React, { useState } from 'react';
import { Plus, Check, Clock, AlertTriangle, Filter, MoreHorizontal, User, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials, getPriorityBadge, getStatusBadge } from '../utils/formatters';

const taskPriorities = ['High', 'Medium', 'Low'];
const taskStatuses = ['Todo', 'In Progress', 'Review', 'Done'];

const emptyTask = { title: '', description: '', priority: 'Medium', status: 'Todo', assignedToId: '', dueDate: '', type: 'To Do', lead: null };

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, users } = useApp();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTask);

  const openAdd = () => {
    setForm({ ...emptyTask, assignedToId: users.length > 0 ? users[0].id : '' });
    setEditingId(null);
    setShowModal(true);
  };

  const columns = ['Todo', 'In Progress', 'Review', 'Done'];
  const filterGroups = ['All', 'Todo', 'In Progress', 'Done', 'Urgent', 'High'];

  const filtered = tasks.filter(t =>
    filter === 'All' ? true :
    filter === 'Urgent' || filter === 'High' ? t.priority === filter :
    t.status === filter
  );

  const handleSave = () => {
    if (editingId) {
      updateTask(editingId, form);
    } else {
      addTask(form);
    }
    setShowModal(false);
    setEditingId(null);
    setForm(emptyTask);
  };

  const handleEdit = (t) => {
    setForm({ title: t.title||'', description: t.description||'', priority: t.priority||'Medium', status: t.status||'Todo', assignedToId: t.assignedToId||'', dueDate: t.dueDate||'', type: t.type||'To Do', lead: t.lead||null });
    setEditingId(t.id);
    setShowModal(true);
  };

  const stats = [
    { label: 'Total', value: tasks.length, color: '#6366f1' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#3b82f6' },
    { label: 'Completed', value: tasks.filter(t => t.completed).length, color: '#10b981' },
    { label: 'Overdue', value: tasks.filter(t => !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length, color: '#ef4444' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">{tasks.filter(t => !t.completed).length} pending tasks</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <Plus size={14} /> Add Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {filterGroups.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Kanban Task Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {columns.map(col => {
          const colTasks = filtered.filter(t => t.status === col);
          const colColors2 = { 'Todo': '#94a3b8', 'In Progress': '#3b82f6', 'Review': '#f59e0b', 'Done': '#10b981' };
          return (
            <div key={col} style={{ background: 'var(--bg-base)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--border-subtle)', borderTop: `3px solid ${colColors2[col]}` }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{col}</span>
                  <span className="kanban-count">{colTasks.length}</span>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm"><Plus size={14} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {colTasks.map(task => {
                  const assignee = users.find(u => u.id === task.assignedToId);
                  return (
                    <div key={task.id} className="deal-card" style={{ opacity: task.completed ? 0.6 : 1 }}>
                      <div className="flex items-start gap-3">
                        <div
                          onClick={() => toggleTask(task.id)}
                          style={{
                            width: 18, height: 18, borderRadius: 4, flexShrink: 0, cursor: 'pointer', marginTop: 1,
                            background: task.completed ? '#10b981' : 'transparent',
                            border: task.completed ? 'none' : '1px solid var(--border-strong)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          {task.completed && <Check size={12} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', lineHeight: 1.4 }}>{task.title}</div>
                          {task.description && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.5 }}>{task.description}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={() => handleEdit(task)}><Edit3 size={12} /></button>
                          <button className="btn btn-ghost btn-sm text-danger" style={{ padding: 4 }} onClick={() => deleteTask(task.id)}><Trash2 size={12} /></button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-2)' }}>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                          {task.lead && <span className="badge badge-gray">{task.lead}</span>}
                        </div>
                        {assignee && (
                          <div className="avatar avatar-sm" style={{ background: assignee.color, color: '#fff' }} title={assignee.name}>
                            {getInitials(assignee.name)}
                          </div>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                          <Clock size={10} />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>No tasks here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingId ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Enter task title..." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Add details..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    {taskPriorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {taskStatuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select className="input" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="input" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.title}>{editingId ? 'Save Changes' : 'Add Task'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
