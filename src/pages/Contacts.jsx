import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, Building2, Tag, Star, Edit3, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials, getStatusBadge } from '../utils/formatters';

export default function Contacts() {
  const { contacts, users, addContact, updateContact, deleteContact } = useApp();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', role: '', status: 'Active', assignedToId: '' });

  const handleSave = () => {
    if (editingId) {
      updateContact(editingId, { ...form, assignedToId: form.assignedToId || (users[0] && users[0].id) });
    } else {
      addContact({ ...form, assignedToId: form.assignedToId || (users[0] && users[0].id) });
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', email: '', phone: '', company: '', role: '', status: 'Active', assignedToId: '' });
  };

  const handleEdit = (c) => {
    setForm({ name: c.name||'', email: c.email||'', phone: c.phone||'', company: c.company||'', role: c.role||'', status: c.status||'Active', assignedToId: c.assignedToId||'' });
    setEditingId(c.id);
    setSelected(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteContact(id);
    setSelected(null);
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">{contacts.length} total contacts</p>
        </div>
        <div className="flex gap-3">
          <div className="tabs">
            <button className={`tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '', company: '', role: '', status: 'Active', assignedToId: '' }); setShowModal(true); }}>
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>

      <div className="input-group" style={{ maxWidth: 400, marginBottom: 'var(--space-5)' }}>
        <Search size={16} className="input-icon" />
        <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {filtered.map(contact => (
            <div key={contact.id} className="card hover-lift" style={{ cursor: 'pointer' }} onClick={() => setSelected(contact)}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-3)' }}>
                <div className="avatar avatar-xl" style={{ background: `${contact.color}22`, color: contact.color, border: `2px solid ${contact.color}33`, fontSize: 'var(--text-2xl)' }}>
                  {getInitials(contact.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{contact.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>{contact.role}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 1 }}>{contact.company}</div>
                </div>
                <span className={`badge ${getStatusBadge(contact.status)}`}>{contact.status}</span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <Mail size={12} color="var(--text-tertiary)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.email}</span>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <Phone size={12} color="var(--text-tertiary)" />
                  {contact.phone}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap" style={{ marginTop: 'var(--space-3)' }}>
                {contact.tags && contact.tags.slice(0, 3).map(t => <span key={t} className="badge badge-gray">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contact => (
                <tr key={contact.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(contact)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md" style={{ background: `${contact.color}22`, color: contact.color }}>
                        {getInitials(contact.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{contact.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{contact.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{contact.company}</td>
                  <td style={{ fontSize: 'var(--text-sm)' }}>
                    <div>{contact.email}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{contact.phone}</div>
                  </td>
                  <td><span className={`badge ${getStatusBadge(contact.status)}`}>{contact.status}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{contact.lastContact}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-icon btn-sm"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-4">
                <div className="avatar avatar-xl" style={{ background: `${selected.color}22`, color: selected.color, fontSize: 'var(--text-2xl)' }}>
                  {getInitials(selected.name)}
                </div>
                <div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{selected.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{selected.role} · {selected.company}</p>
                  <span className={`badge ${getStatusBadge(selected.status)}`} style={{ marginTop: 4, display: 'inline-block' }}>{selected.status}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { label: 'Email', value: selected.email, icon: Mail },
                  { label: 'Phone', value: selected.phone, icon: Phone },
                  { label: 'Company', value: selected.company, icon: Building2 },
                  { label: 'Last Contact', value: selected.lastContact, icon: null },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="label">{item.label}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      {item.icon && <item.icon size={14} color="var(--text-tertiary)" />}
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              {selected.tags && selected.tags.length > 0 && (
                <div>
                  <div className="label">Tags</div>
                  <div className="flex gap-2 flex-wrap">
                    {selected.tags.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(selected.id)}><Trash2 size={14} /> Delete</button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(selected)}><Edit3 size={14} /> Edit</button>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingId ? 'Edit Contact' : 'Add New Contact'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 555-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="CEO" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Lead</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="input" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                    <option value="">Select Assignee</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>{editingId ? 'Save Changes' : 'Save Contact'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
