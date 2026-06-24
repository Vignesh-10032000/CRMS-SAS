import React, { useState } from 'react';
import { Search, Mail, MessageSquare, Phone, Plus, Star, Archive, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInitials } from '../utils/formatters';

const channelConfig = {
  email: { icon: Mail, label: 'Email', color: '#6366f1' },
  whatsapp: { icon: MessageSquare, label: 'WhatsApp', color: '#10b981' },
  sms: { icon: Phone, label: 'SMS', color: '#f59e0b' },
};

export default function Communications() {
  const { messages, addMessage, deleteMessage } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMsgId, setSelectedMsgId] = useState(messages[0]?.id);
  const [reply, setReply] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', content: '', channel: 'email' });

  const selectedMsg = messages.find(m => m.id === selectedMsgId) || messages[0];

  const tabs = ['All', 'Email', 'WhatsApp', 'SMS'];
  const filtered = messages.filter(m => activeTab === 'All' || m.type?.toLowerCase() === activeTab.toLowerCase() || m.channel?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Communications</h1>
          <p className="page-subtitle">{messages.length} messages</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCompose(true)}><Plus size={14} /> Compose</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 'var(--space-4)', height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* Message List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="input-group">
              <Search size={15} className="input-icon" />
              <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search messages..." />
            </div>
            <div className="tabs" style={{ marginTop: 'var(--space-3)' }}>
              {tabs.map(t => <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setActiveTab(t)}>{t}</button>)}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map((msg, idx) => {
              const ch = channelConfig[msg.type?.toLowerCase()] || channelConfig[msg.channel?.toLowerCase()] || channelConfig.email;
              const contactName = msg.contactName || msg.from || 'Unknown';
              const isUnread = msg.unread || false;
              const color = msg.color || `hsl(${idx * 40 + 100}, 70%, 50%)`;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsgId(msg.id)}
                  style={{
                    padding: 'var(--space-4)', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)',
                    background: selectedMsgId === msg.id ? 'var(--bg-hover)' : isUnread ? 'rgba(99,102,241,0.04)' : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="avatar avatar-md" style={{ background: color, color: '#fff', flexShrink: 0 }}>{getInitials(contactName)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ fontWeight: isUnread ? 'var(--font-bold)' : 'var(--font-medium)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contactName}</span>
                        <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                          <ch.icon size={12} color={ch.color} />
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{msg.time}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 1 }}>{msg.company || 'Direct'}</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: isUnread ? 'var(--font-semibold)' : 'normal', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>{msg.subject || 'No Subject'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{msg.content || msg.preview}</div>
                    </div>
                    {isUnread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)', flexShrink: 0, marginTop: 4 }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Thread */}
        {selectedMsg ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Thread Header */}
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="flex items-center gap-3">
                <div className="avatar avatar-lg" style={{ background: selectedMsg.color || '#6366f1', color: '#fff' }}>{getInitials(selectedMsg.contactName || selectedMsg.from || 'Unknown')}</div>
                <div>
                  <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{selectedMsg.contactName || selectedMsg.from || 'Unknown'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{selectedMsg.company || 'Direct'} · {channelConfig[selectedMsg.type?.toLowerCase()]?.label || channelConfig[selectedMsg.channel?.toLowerCase()]?.label || 'Email'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-icon btn-sm" title="Star"><Star size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="Archive"><Archive size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="Delete" onClick={() => { deleteMessage(selectedMsg.id); setSelectedMsgId(null); }}><Trash2 size={16} /></button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                {selectedMsg.subject || 'No Subject'}
              </div>

              {/* Received Message */}
              <div className="ai-message" style={{ maxWidth: '75%' }}>
                <div className="avatar avatar-sm" style={{ background: selectedMsg.color || '#6366f1', color: '#fff', flexShrink: 0 }}>{getInitials(selectedMsg.contactName || selectedMsg.from || 'Unknown')}</div>
                <div>
                  <div className="ai-bubble">
                    {selectedMsg.content || selectedMsg.preview}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, paddingLeft: 4 }}>{selectedMsg.time}</div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: '#818cf8', fontWeight: 'var(--font-semibold)', marginBottom: 4 }}>✨ AI Suggested Reply</div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Thank you for reaching out! I'd be happy to address your concerns. I'll review the details and get back to you within 24 hours with a comprehensive response.
                </p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)' }}>Use This Reply</button>
              </div>
            </div>

            {/* Reply Box */}
            <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
              <textarea
                className="input"
                rows={3}
                placeholder={`Reply via ${channelConfig[selectedMsg.channel]?.label}...`}
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ resize: 'none', marginBottom: 'var(--space-3)' }}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.entries(channelConfig).map(([key, cfg]) => (
                    <button key={key} className="btn btn-ghost btn-sm" style={{ color: cfg.color }}>
                      <cfg.icon size={14} /> {cfg.label}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary btn-sm" disabled={!reply.trim()} onClick={() => {
                  addMessage({
                    from: 'You',
                    contactName: selectedMsg.contactName,
                    subject: `Re: ${selectedMsg.subject}`,
                    content: reply,
                    type: channelConfig[selectedMsg.channel?.toLowerCase()]?.label || 'Email',
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    unread: false
                  });
                  setReply('');
                }}>Send Reply</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-state">
              <div className="empty-icon"><Mail size={28} /></div>
              <div style={{ fontWeight: 'var(--font-semibold)' }}>Select a conversation</div>
            </div>
          </div>
        )}
      </div>
      {/* Compose Modal */}
      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 'var(--font-bold)' }}>Compose Message</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCompose(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">To *</label>
                <input className="input" value={composeForm.to} onChange={e => setComposeForm({...composeForm, to: e.target.value})} placeholder="Email or Phone Number" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="input" value={composeForm.subject} onChange={e => setComposeForm({...composeForm, subject: e.target.value})} placeholder="Message Subject" />
              </div>
              <div className="form-group">
                <label className="form-label">Channel</label>
                <select className="input" value={composeForm.channel} onChange={e => setComposeForm({...composeForm, channel: e.target.value})}>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="input" rows={5} value={composeForm.content} onChange={e => setComposeForm({...composeForm, content: e.target.value})} placeholder="Type your message..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!composeForm.to || !composeForm.content} onClick={() => {
                addMessage({
                  from: 'You',
                  contactName: composeForm.to,
                  subject: composeForm.subject,
                  content: composeForm.content,
                  type: composeForm.channel,
                  time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                  unread: false
                });
                setShowCompose(false);
                setComposeForm({ to: '', subject: '', content: '', channel: 'email' });
              }}>Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
