import React, { useState } from 'react';
import {
  Plus, Search, Filter, MoreHorizontal, Trash2, Edit3, Eye, Star,
  TrendingUp, Phone, Mail, Calendar, Tag, Download, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const leadStages = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const leadSources = ['Website', 'Referral', 'Cold Call', 'Social Media', 'Other'];
const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'];
import { formatCurrency, getInitials, getStageBadge, getStageColor, getScoreColor, formatDate } from '../utils/formatters';

const emptyLead = { name: '', contact: '', email: '', phone: '', stage: 'New Lead', score: 50, value: 0, source: 'Website', assignee: 1, tags: [], notes: '', industry: 'Technology' };

export default function Leads() {
  const { leads, users, addLead, updateLead, deleteLead } = useApp();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState(emptyLead);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const filtered = leads.filter(l =>
    (stageFilter === 'All' || l.stage === stageFilter) &&
    ((l.name || '').toLowerCase().includes(search.toLowerCase()) || 
     (l.contact || '').toLowerCase().includes(search.toLowerCase()) || 
     (l.email || '').toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(emptyLead); setEditingLead(null); setShowModal(true); };
  const openEdit = (lead) => { setForm({ ...lead }); setEditingLead(lead.id); setShowModal(true); };

  const handleSave = () => {
    if (editingLead) updateLead(editingLead, form);
    else addLead(form);
    setShowModal(false);
  };

  const stageStats = leadStages.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">{leads.length} total leads · {leads.filter(l => l.stage === 'New Lead').length} new</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Lead</button>
        </div>
      </div>

      {/* Stage Filter Pills */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {['All', ...leadStages].map(s => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className="btn btn-sm"
            style={{
              background: stageFilter === s ? (s === 'All' ? 'var(--gradient-primary)' : getStageColor(s)) : 'var(--bg-elevated)',
              color: stageFilter === s ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${stageFilter === s ? 'transparent' : 'var(--border-default)'}`,
            }}
          >
            {s}
            {s !== 'All' && <span style={{ marginLeft: 4, opacity: 0.8 }}>{stageStats.find(st => st.stage === s)?.count}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div className="input-group" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={16} className="input-icon" />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary btn-sm"><Filter size={14} /> Filters</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company / Contact</th>
              <th>Stage</th>
              <th>Score</th>
              <th>Value</th>
              <th>Source</th>
              <th>Assignee</th>
              <th>Last Activity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => {
              const assignee = users?.find(u => u.id === lead.assignedToId);
              return (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md" style={{ background: getStageColor(lead.stage) + '22', color: getStageColor(lead.stage), border: `1px solid ${getStageColor(lead.stage)}33` }}>
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{lead.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{lead.contact} · {lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${getStageBadge(lead.stage)}`}>{lead.stage}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 40, height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${lead.score}%`, background: getScoreColor(lead.score), borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: getScoreColor(lead.score) }}>{lead.score}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{formatCurrency(lead.value)}</td>
                  <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{lead.source}</td>
                  <td>
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <div className="avatar avatar-sm" style={{ background: assignee.color, color: '#fff' }}>{getInitials(assignee.name)}</div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{assignee.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{lead.lastActivity}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="dropdown">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenu === lead.id && (
                        <div className="dropdown-menu">
                          <div className="dropdown-item" onClick={() => { setSelectedLead(lead); setActiveMenu(null); }}><Eye size={14} /> View Details</div>
                          <div className="dropdown-item" onClick={() => { openEdit(lead); setActiveMenu(null); }}><Edit3 size={14} /> Edit Lead</div>
                          <div className="dropdown-divider" />
                          <div className="dropdown-item danger" onClick={() => { deleteLead(lead.id); setActiveMenu(null); }}><Trash2 size={14} /> Delete</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><TrendingUp size={28} /></div>
            <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>No leads found</div>
            <p style={{ fontSize: 'var(--text-sm)' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Close menu outside */}
      {activeMenu && <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setActiveMenu(null)} />}

      {/* Lead Detail Panel */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-4">
                <div className="avatar avatar-lg" style={{ background: getStageColor(selectedLead.stage) + '22', color: getStageColor(selectedLead.stage), fontSize: 'var(--text-lg)', border: `1px solid ${getStageColor(selectedLead.stage)}33` }}>
                  {getInitials(selectedLead.name)}
                </div>
                <div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{selectedLead.name}</h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selectedLead.industry} · {selectedLead.contact}</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedLead(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
                {[
                  { label: 'Stage', value: <span className={`badge ${getStageBadge(selectedLead.stage)}`}>{selectedLead.stage}</span> },
                  { label: 'Deal Value', value: formatCurrency(selectedLead.value) },
                  { label: 'Lead Score', value: `${selectedLead.score}/100` },
                  { label: 'Source', value: selectedLead.source },
                  { label: 'Email', value: selectedLead.email },
                  { label: 'Phone', value: selectedLead.phone },
                  { label: 'Created', value: formatDate(selectedLead.createdAt) },
                  { label: 'Last Activity', value: formatDate(selectedLead.lastActivity) },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="label">{item.label}</div>
                    <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {selectedLead.notes && (
                <div>
                  <div className="label">Notes</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-base)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    {selectedLead.notes}
                  </p>
                </div>
              )}
              {selectedLead.tags && selectedLead.tags.length > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <div className="label">Tags</div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedLead.tags.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { openEdit(selectedLead); setSelectedLead(null); }}><Edit3 size={14} /> Edit Lead</button>
              <button className="btn btn-primary" onClick={() => setSelectedLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Acme Corp" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person *</label>
                  <input className="input" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="John Smith" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@acme.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select className="input" value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}>
                    {leadStages.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deal Value (₹)</label>
                  <input className="input" type="number" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} placeholder="50000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select className="input" value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
                    {leadSources.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <select className="input" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
                    {industries.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lead Score (0-100)</label>
                <input className="input" type="range" min="0" max="100" value={form.score} onChange={e => setForm({...form, score: Number(e.target.value)})} />
                <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{form.score}/100</div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="input" rows={3} value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Add notes about this lead..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingLead ? 'Save Changes' : 'Add Lead'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
