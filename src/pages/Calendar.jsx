import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Video, Users, Phone, FileText } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useApp } from '../context/AppContext';

const getEventIcon = (type) => {
  switch(type) {
    case 'video': return <Video size={16} />;
    case 'call': return <Phone size={16} />;
    case 'meeting': return <Users size={16} />;
    default: return <FileText size={16} />;
  }
};

const getEventColor = (type) => {
  switch(type) {
    case 'video': return { bg: 'rgba(99, 102, 241, 0.1)', border: 'var(--brand-primary)', text: 'var(--brand-primary)' };
    case 'call': return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', text: '#10b981' };
    case 'meeting': return { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#f59e0b' };
    default: return { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6', text: '#8b5cf6' };
  }
};

export default function Calendar() {
  const { calendarEvents, addCalendarEvent, users } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, day
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00 AM', duration: '1h', type: 'meeting', assignedToId: '' });

  const handleSave = () => {
    addCalendarEvent({ ...form, assignedToId: form.assignedToId || (users[0] && users[0].id) });
    setShowModal(false);
    setForm({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00 AM', duration: '1h', type: 'meeting', assignedToId: '' });
  };

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 11 }).map((_, i) => i + 8); // 8 AM to 6 PM

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendarEvents.filter(e => e.date === dateStr);
  };

  // Simplified Upcoming Events view
  const upcomingEvents = calendarEvents
    .filter(e => new Date(e.date) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: 'var(--space-6)', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <button className="btn btn-primary w-full" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Event
        </button>

        <div className="glass-strong" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            Upcoming Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {upcomingEvents.map(evt => (
              <div key={evt.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-primary)', fontWeight: 'var(--font-bold)' }}>
                    {format(new Date(evt.date), 'MMM')}
                  </div>
                  <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-black)', lineHeight: 1 }}>
                    {format(new Date(evt.date), 'dd')}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Clock size={12} /> {evt.time} ({evt.duration})
                  </div>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>No upcoming events.</p>}
          </div>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="glass-strong" style={{ flex: 1, borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div style={{ display: 'flex', gap: 2 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={prevWeek}><ChevronLeft size={18} /></button>
              <button className="btn btn-ghost btn-sm" onClick={today}>Today</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={nextWeek}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-base)', padding: 4, borderRadius: 'var(--radius-md)' }}>
            <button className={`btn btn-sm ${view === 'day' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('day')}>Day</button>
            <button className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('week')}>Week</button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 800 }}>
          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div /> {/* Empty corner */}
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div key={i} style={{ padding: 'var(--space-3)', textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', background: isToday ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: isToday ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>
                    {format(day, 'EEE')}
                  </div>
                  <div style={{ fontSize: 'var(--text-lg)', color: isToday ? 'var(--brand-primary)' : 'var(--text-primary)', fontWeight: isToday ? 'var(--font-black)' : 'var(--font-medium)' }}>
                    {format(day, 'dd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div style={{ position: 'relative', flex: 1 }}>
            {hours.map(hour => (
              <div key={hour} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: 60 }}>
                <div style={{ textAlign: 'right', padding: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                {weekDays.map((day, i) => (
                  <div key={i} style={{ borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }} />
                ))}
              </div>
            ))}

            {/* Render Events */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDate(day);
              return dayEvents.map(evt => {
                const colors = getEventColor(evt.type);
                let topPos = 60;
                if (evt.time) {
                  const [hStr, mStr] = evt.time.split(':');
                  const h = parseInt(hStr) || 9;
                  const m = parseInt(mStr) || 0;
                  const hoursFrom8 = (h + m/60) - 8;
                  topPos = Math.max(0, hoursFrom8 * 60);
                }

                return (
                  <div key={evt.id} style={{
                    position: 'absolute',
                    left: `calc(60px + (${dayIndex} * ((100% - 60px) / 7)))`,
                    width: `calc(((100% - 60px) / 7) - 8px)`,
                    top: topPos,
                    background: colors.bg,
                    borderLeft: `3px solid ${colors.border}`,
                    padding: 'var(--space-2)',
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    marginLeft: 4,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    zIndex: 10
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: colors.text, marginBottom: 2 }}>{evt.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{evt.time} ({evt.duration})</div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>Add New Event</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="E.g. Team Sync" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="input" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select className="input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}>
                    <option>15m</option>
                    <option>30m</option>
                    <option>45m</option>
                    <option>1h</option>
                    <option>1.5h</option>
                    <option>2h</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="meeting">Meeting</option>
                    <option value="call">Call</option>
                    <option value="video">Video Call</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer / Assignee</label>
                  <select className="input" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                    <option value="">Select Assignee</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.title}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
