import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, CheckCircle, Clock, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials, getPriorityBadge, getStatusBadge } from '../utils/formatters';

const priorityColors = { Low: '#94a3b8', Medium: '#3b82f6', High: '#f59e0b', Urgent: '#ef4444' };
const statusColors = { Open: '#ef4444', 'In Progress': '#3b82f6', Resolved: '#10b981' };

export default function Support() {
  const { tickets, users, addTicket, updateTicket, deleteTicket } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ subject: '', client: '', priority: 'Medium', status: 'Open', category: 'General', assignedToId: '' });

  const handleSave = () => {
    if (editingId) {
      updateTicket(editingId, form);
    } else {
      addTicket(form);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ subject: '', client: '', priority: 'Medium', status: 'Open', category: 'General', assignedToId: '' });
  };

  const handleEdit = (t) => {
    setForm({ subject: t.subject||t.title||'', client: t.client||'', priority: t.priority||'Medium', status: t.status||'Open', category: t.category||'General', assignedToId: t.assignedToId||'' });
    setEditingId(t.id);
    setShowModal(true);
  };

  const filtered = tickets.filter(t =>
    (filter === 'All' || t.status === filter) &&
    ((t.subject || '').toLowerCase().includes(search.toLowerCase()) || (t.client || '').toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: '#ef4444' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: '#3b82f6' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: '#10b981' },
    { label: 'Urgent', value: tickets.filter(t => t.priority === 'Urgent').length, color: '#dc2626' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Support</h1>
          <p className="page-subtitle">{tickets.filter(t => t.status === 'Open').length} open tickets</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingId(null); setForm({ subject: '', client: '', priority: 'Medium', status: 'Open', category: 'General', assignedToId: '' }); setShowModal(true); }}>
          <Plus size={14} /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <div className="input-group" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="input-icon" />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tabs">
          {['All', 'Open', 'In Progress', 'Resolved'].map(f => (
            <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.map((ticket, idx) => {
          const assignee = users.find(u => u.id === ticket.assignedToId);
          return (
            <div key={ticket.id} className="ticket-item">
              <div style={{ width: 4, height: 48, borderRadius: 2, background: priorityColors[ticket.priority] || '#94a3b8', flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--brand-primary-light)', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{ticket.id.slice(0, 8)}</span>
                  <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{ticket.subject || ticket.title || 'Support Request'}</span>
                  <span className="badge badge-gray">{ticket.category || 'General'}</span>
                </div>
                <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Client: {ticket.client || 'Unknown'}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>·</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Opened: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4" style={{ flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>SLA</div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: ticket.sla === 'Resolved' ? '#10b981' : (ticket.sla?.includes('remaining') ? '#f59e0b' : '#ef4444') }}>
                    {ticket.sla || 'N/A'}
                  </span>
                </div>

                <span className={`badge ${getPriorityBadge(ticket.priority || 'Medium')}`}>{ticket.priority || 'Medium'}</span>

                <span style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
                  background: (statusColors[ticket.status] || '#ef4444') + '20', color: statusColors[ticket.status] || '#ef4444', border: `1px solid ${statusColors[ticket.status] || '#ef4444'}30`
                }}>{ticket.status}</span>

                {assignee ? (
                  <div className="avatar avatar-sm" style={{ background: `hsl(${idx * 40 + 200}, 70%, 50%)`, color: '#fff' }} title={assignee.name}>
                    {getInitials(assignee.name)}
                  </div>
                ) : (
                  <div className="avatar avatar-sm" style={{ background: '#334155', color: '#fff' }}>?</div>
                )}

                <button className="btn btn-secondary btn-sm"><MessageSquare size={12} /> Reply</button>
                <div className="flex gap-1">
                  <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={() => handleEdit(ticket)}><Edit3 size={12} /></button>
                  <button className="btn btn-ghost btn-sm text-danger" style={{ padding: 4 }} onClick={() => deleteTicket(ticket.id)}><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><CheckCircle size={28} /></div>
          <div style={{ fontWeight: 'var(--font-semibold)' }}>No tickets found</div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingId ? 'Edit Ticket' : 'New Ticket'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input className="input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="E.g. Login Issue" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <input className="input" value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Client Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>General</option>
                    <option>Technical</option>
                    <option>Billing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    {Object.keys(priorityColors).map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="input" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                    <option value="">Select Assignee</option>
                    {users && users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.subject}>{editingId ? 'Save Changes' : 'Create Ticket'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
