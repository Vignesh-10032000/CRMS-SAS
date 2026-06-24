import React, { useState } from 'react';
import { Plus, Calendar, Users, Target, MoreHorizontal, Clock, CheckSquare, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials, formatCurrency, getStatusBadge } from '../utils/formatters';

const statusColors = { 'Planning': '#3b82f6', 'In Progress': '#6366f1', 'Review': '#f59e0b', 'Completed': '#10b981', 'On Hold': '#94a3b8' };

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useApp();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', client: '', status: 'Planning', budget: 0, progress: 0, dueDate: '' });

  const handleSave = () => {
    if (editingId) {
      updateProject(editingId, { ...form, progress: Number(form.progress) });
    } else {
      addProject({ ...form, progress: Number(form.progress) });
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', client: '', status: 'Planning', budget: 0, progress: 0, dueDate: '' });
  };

  const handleEdit = (p) => {
    setForm({ name: p.name||'', client: p.client||'', status: p.status||'Planning', budget: 0, progress: p.progress||0, dueDate: p.dueDate||'' });
    setEditingId(p.id);
    setShowModal(true);
  };

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">{projects.length} active projects</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingId(null); setForm({ name: '', client: '', status: 'Planning', budget: 0, progress: 0, dueDate: '' }); setShowModal(true); }}>
          <Plus size={14} /> New Project
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Projects', value: projects.length, color: '#6366f1' },
          { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
          { label: 'Total Budget', value: formatCurrency(projects.reduce((s, p) => s + p.budget, 0)), color: '#10b981' },
          { label: 'Avg Progress', value: `${projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0}%`, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--space-5)' }}>
        {['All', 'Planning', 'In Progress', 'Review', 'Completed'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-5)' }}>
        {filtered.map(project => {
          const team = project.contacts || []; // Use assigned contacts
          const budgetUsed = Math.round(((project.spent || 0) / (project.budget || 1)) * 100) || 0;
          return (
            <div key={project.id} className="card hover-lift" style={{ borderTop: `3px solid ${statusColors[project.status] || '#94a3b8'}` }}>
              <div className="flex items-start justify-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: 4 }}>{project.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{project.client || 'Internal'}</div>
                </div>
                <div className="flex gap-1 items-center">
                  <span className={`badge ${getStatusBadge(project.status)}`}>{project.status}</span>
                  <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={() => handleEdit(project)}><Edit3 size={12} /></button>
                  <button className="btn btn-ghost btn-sm text-danger" style={{ padding: 4 }} onClick={() => deleteProject(project.id)}><Trash2 size={12} /></button>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginTop: 'var(--space-4)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Progress</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: statusColors[project.status] }}>{project.progress}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${project.progress}%`, background: statusColors[project.status] }} />
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Budget</div>
                  <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{formatCurrency(project.budget || 0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Spent ({budgetUsed}%)</div>
                  <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', color: budgetUsed > 80 ? '#ef4444' : 'var(--text-primary)' }}>{formatCurrency(project.spent || 0)}</div>
                </div>
              </div>

              <div className="divider" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <CheckSquare size={12} />
                    {project.completed || 0}/{project.milestones || 0}
                  </div>
                  <div className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <Calendar size={12} />
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
                <div className="avatar-group">
                  {team.slice(0, 3).map((c, i) => (
                    <div key={c.id || i} className="avatar avatar-sm" style={{ background: `hsl(${i * 40 + 200}, 70%, 50%)`, color: '#fff', fontSize: 10 }} title={c.name}>
                      {getInitials(c.name || '?')}
                    </div>
                  ))}
                  {team.length > 3 && <div className="avatar avatar-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 9 }}>+{team.length - 3}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="E.g. Mobile App Development" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <input className="input" value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Client Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget (₹)</label>
                  <input className="input" type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Progress (%)</label>
                  <input className="input" type="number" min="0" max="100" value={form.progress} onChange={e => setForm({...form, progress: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="input" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>{editingId ? 'Save Changes' : 'Save Project'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
