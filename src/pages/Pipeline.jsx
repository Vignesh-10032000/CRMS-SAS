import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, Calendar, TrendingUp, GripVertical, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getInitials } from '../utils/formatters';

const pipelineColumns = [
  { id: 'New', label: 'New Lead' },
  { id: 'Contacted', label: 'Contacted' },
  { id: 'Proposal', label: 'Proposal Sent' },
  { id: 'Negotiation', label: 'Negotiation' },
  { id: 'Won', label: 'Closed Won' }
];

const colColors = {
  'New': '#94a3b8',
  'Contacted': '#8b5cf6',
  'Proposal': '#f59e0b',
  'Negotiation': '#06b6d4',
  'Won': '#10b981',
};

function DealCard({ deal, isDragging }) {
  const { users } = useApp();
  const assignee = users.find(u => u.id === deal.assignedToId);
  return (
    <div className="deal-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>{deal.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{deal.company || 'Unknown Company'}</div>
        </div>
        <button className="btn btn-ghost btn-icon btn-sm" style={{ flexShrink: 0 }}><MoreHorizontal size={14} /></button>
      </div>

      <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
        {formatCurrency(deal.value)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Win probability</span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: deal.probability >= 70 ? '#10b981' : deal.probability >= 40 ? '#f59e0b' : '#94a3b8' }}>{deal.probability}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${deal.probability}%`, background: deal.probability >= 70 ? '#10b981' : deal.probability >= 40 ? '#f59e0b' : '#6366f1' }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          <Calendar size={11} />
          {deal.expectedDate ? new Date(deal.expectedDate).toLocaleDateString() : 'No date'}
        </div>
        {assignee && (
          <div className="avatar avatar-sm" style={{ background: assignee.color, color: '#fff' }} title={assignee.name}>
            {getInitials(assignee.name)}
          </div>
        )}
      </div>
    </div>
  );
}

function SortableDeal({ deal, columnId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id, data: { columnId } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} isDragging={isDragging} />
    </div>
  );
}

export default function Pipeline() {
  const { deals, moveDeal, addDeal, users } = useApp();
  const [activeDeal, setActiveDeal] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', value: 0, probability: 50, expectedDate: '', company: '', assignedToId: '', status: 'New' });

  const handleSave = () => {
    addDeal({ ...form, assignedToId: form.assignedToId || (users[0] && users[0].id) });
    setShowModal(false);
    setForm({ name: '', value: 0, probability: 50, expectedDate: '', company: '', assignedToId: '', status: 'New' });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const totalValue = Object.values(deals || {}).flat().reduce((s, d) => s + (d?.value || 0), 0);
  const wonValue = (deals['Won'] || []).reduce((s, d) => s + (d?.value || 0), 0);

  const handleDragStart = (event) => {
    const { active } = event;
    const colId = active.data.current?.columnId;
    const deal = deals[colId]?.find(d => d.id === active.id);
    setActiveDeal(deal || null);
    setActiveColumn(colId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDeal(null);
    setActiveColumn(null);
    if (!over) return;
    const fromCol = active.data.current?.columnId;
    const toCol = over.data.current?.columnId || over.id;
    if (fromCol && toCol && fromCol !== toCol) {
      moveDeal(active.id, fromCol, toCol);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Pipeline</h1>
          <p className="page-subtitle">
            {Object.values(deals || {}).flat().length} deals · Pipeline: {formatCurrency(totalValue)} · Won: {formatCurrency(wonValue)}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 badge badge-success" style={{ padding: '6px 14px' }}>
            <Target size={14} /> {Math.round((wonValue / (totalValue || 1)) * 100)}% Win Rate
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Deal
          </button>
        </div>
      </div>

      {/* Column Totals Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', overflowX: 'auto', paddingBottom: 4 }}>
        {pipelineColumns.map(col => {
          const colDeals = deals[col.id] || [];
          const colValue = colDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={col.id} className="card" style={{ flexShrink: 0, minWidth: 140, padding: 'var(--space-3)', borderTop: `3px solid ${colColors[col.id]}` }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' }}>{col.label}</div>
              <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{formatCurrency(colValue)}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{colDeals.length} deal{colDeals.length !== 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {pipelineColumns.map(col => {
            const colDeals = deals[col.id] || [];
            const colValue = colDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={col.id} className="kanban-column" id={col.id} data-columnId={col.id} style={{ borderTop: `3px solid ${colColors[col.id]}` }}>
                <div className="kanban-header">
                  <div className="kanban-title">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colColors[col.id] }} />
                    {col.label}
                    <span className="kanban-count">{colDeals.length}</span>
                  </div>
                </div>
                <div className="kanban-total">{formatCurrency(colValue)}</div>

                <SortableContext items={colDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                  {colDeals.map(deal => (
                    <SortableDeal key={deal.id} deal={deal} columnId={col.id} />
                  ))}
                </SortableContext>

                <button
                  className="btn btn-ghost btn-sm w-full"
                  style={{ border: '1px dashed var(--border-default)', marginTop: 'var(--space-2)' }}
                  onClick={() => { setForm({...form, status: col.id}); setShowModal(true); }}
                >
                  <Plus size={14} /> Add Deal
                </button>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isDragging={false} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Add Deal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>Add New Deal</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Deal Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="E.g. Website Redesign" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Value (₹)</label>
                  <input className="input" type="number" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} placeholder="10000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Probability (%)</label>
                  <input className="input" type="number" min="0" max="100" value={form.probability} onChange={e => setForm({...form, probability: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Close Date</label>
                  <input className="input" type="date" value={form.expectedDate} onChange={e => setForm({...form, expectedDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {pipelineColumns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>Save Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
