import React, { useState } from 'react';
import { Plus, Download, Eye, Send, DollarSign, Clock, CheckCircle, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getStatusBadge } from '../utils/formatters';

const statusColors = { Paid: '#10b981', Pending: '#f59e0b', Overdue: '#ef4444', Draft: '#94a3b8' };

export default function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useApp();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ client: '', amount: '', status: 'Draft', dueDate: '', items: 1 });

  const handleSave = () => {
    if (editingId) {
      updateInvoice(editingId, { ...form, amount: Number(form.amount), items: Number(form.items) });
    } else {
      addInvoice({ ...form, amount: Number(form.amount), items: Number(form.items), date: new Date().toISOString().split('T')[0] });
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ client: '', amount: '', status: 'Draft', dueDate: '', items: 1 });
  };

  const handleEdit = (inv) => {
    setForm({ client: inv.client||'', amount: inv.amount||'', status: inv.status||'Draft', dueDate: inv.dueDate||inv.date||'', items: inv.items||1 });
    setEditingId(inv.id);
    setShowModal(true);
  };

  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices & Payments</h1>
          <p className="page-subtitle">{invoices.length} invoices · {invoices.filter(i => i.status === 'Paid').length} paid</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingId(null); setForm({ client: '', amount: '', status: 'Draft', dueDate: '', items: 1 }); setShowModal(true); }}>
          <Plus size={14} /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Collected', value: formatCurrency(totalRevenue), icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Outstanding', value: formatCurrency(outstanding), icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Overdue', value: formatCurrency(overdue), icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Total Invoiced', value: formatCurrency(invoices.reduce((s, i) => s + i.amount, 0)), icon: DollarSign, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            </div>
            <div>
              <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="tabs" style={{ marginBottom: 'var(--space-5)' }}>
        {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--brand-primary-light)', fontFamily: 'monospace' }}>{inv.id}</span>
                </td>
                <td style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{inv.client}</td>
                <td style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>{formatCurrency(inv.amount)}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
                    background: statusColors[inv.status] + '20',
                    color: statusColors[inv.status],
                    border: `1px solid ${statusColors[inv.status]}30`,
                  }}>
                    {inv.status === 'Paid' && <CheckCircle size={10} />}
                    {inv.status === 'Overdue' && <AlertCircle size={10} />}
                    {inv.status}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: inv.status === 'Overdue' ? '#ef4444' : 'var(--text-secondary)' }}>
                  {inv.dueDate || inv.date || 'N/A'}
                  {inv.paidDate && <div style={{ fontSize: 10, color: '#10b981' }}>Paid {inv.paidDate}</div>}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{inv.items || 1} item{(inv.items || 1) !== 1 ? 's' : ''}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-icon btn-sm" title="View"><Eye size={14} /></button>
                    {inv.status !== 'Paid' && <button className="btn btn-ghost btn-icon btn-sm" title="Send Reminder"><Send size={14} /></button>}
                    <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => handleEdit(inv)}><Edit3 size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm text-danger" title="Delete" onClick={() => deleteInvoice(inv.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Invoice Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>{editingId ? 'Edit Invoice' : 'New Invoice'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Client *</label>
                <input className="input" value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Client Name" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="input" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Items</label>
                  <input className="input" type="number" value={form.items} onChange={e => setForm({...form, items: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}
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
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.client || !form.amount}>{editingId ? 'Save Changes' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
