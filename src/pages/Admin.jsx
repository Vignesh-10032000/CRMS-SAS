import React, { useState } from 'react';
import { Shield, Users, Settings, Plus, Edit3, Trash2, Check, X, Bell, Lock, Globe, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

const roles = ['Super Admin', 'Manager', 'Sales Rep', 'Support Agent', 'Client'];
import { getInitials, getStatusBadge } from '../utils/formatters';

const roleColors = {
  'Super Admin': '#ef4444',
  'Manager': '#8b5cf6',
  'Sales Rep': '#6366f1',
  'Support Agent': '#06b6d4',
  'Client': '#10b981',
};

const permissions = [
  { group: 'Leads', perms: ['View Leads', 'Create Leads', 'Edit Leads', 'Delete Leads', 'Export Leads'] },
  { group: 'Pipeline', perms: ['View Pipeline', 'Manage Deals', 'Move Deals'] },
  { group: 'Reports', perms: ['View Reports', 'Export Reports', 'Advanced Analytics'] },
  { group: 'Admin', perms: ['Manage Users', 'Manage Roles', 'System Settings', 'Billing'] },
];

const rolePerms = {
  'Super Admin': ['View Leads', 'Create Leads', 'Edit Leads', 'Delete Leads', 'Export Leads', 'View Pipeline', 'Manage Deals', 'Move Deals', 'View Reports', 'Export Reports', 'Advanced Analytics', 'Manage Users', 'Manage Roles', 'System Settings', 'Billing'],
  'Manager': ['View Leads', 'Create Leads', 'Edit Leads', 'Export Leads', 'View Pipeline', 'Manage Deals', 'Move Deals', 'View Reports', 'Export Reports', 'Advanced Analytics', 'Manage Users'],
  'Sales Rep': ['View Leads', 'Create Leads', 'Edit Leads', 'View Pipeline', 'Manage Deals', 'Move Deals', 'View Reports'],
  'Support Agent': ['View Leads', 'View Pipeline', 'View Reports'],
  'Client': ['View Reports'],
};

export default function Admin() {
  const { users } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedRole, setSelectedRole] = useState('Sales Rep');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage users, roles, and system settings</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Invite User</button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {['users', 'roles', 'settings', 'notifications'].map(t => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-md" style={{ background: user.color, color: '#fff' }}>{getInitials(user.name)}</div>
                        <div>
                          <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{user.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
                        background: (roleColors[user.role] || '#6366f1') + '18',
                        color: roleColors[user.role] || '#6366f1',
                        border: `1px solid ${(roleColors[user.role] || '#6366f1')}30`,
                      }}>{user.role}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.department}</td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-icon btn-sm"><Edit3 size={14} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--brand-danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-5)' }}>
          {/* Role List */}
          <div className="card" style={{ padding: 'var(--space-4)', height: 'fit-content' }}>
            <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>Roles</div>
            {roles.map(role => (
              <div key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  background: selectedRole === role ? `${roleColors[role] || '#6366f1'}12` : 'transparent',
                  border: selectedRole === role ? `1px solid ${roleColors[role] || '#6366f1'}30` : '1px solid transparent',
                  marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', transition: 'all 0.15s',
                }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: roleColors[role] || '#6366f1', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: selectedRole === role ? 'var(--font-semibold)' : 'var(--font-normal)', color: selectedRole === role ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{role}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-tertiary)' }}>{users.filter(u => u.role === role).length}</span>
              </div>
            ))}
          </div>

          {/* Permissions Matrix */}
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
              <div>
                <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{selectedRole} Permissions</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{(rolePerms[selectedRole] || []).length} permissions enabled</div>
              </div>
              <button className="btn btn-primary btn-sm"><Settings size={14} /> Edit Role</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {permissions.map(group => (
                <div key={group.group}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>{group.group}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    {group.perms.map(perm => {
                      const enabled = (rolePerms[selectedRole] || []).includes(perm);
                      return (
                        <div key={perm} className="flex items-center gap-2" style={{
                          padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-lg)',
                          background: enabled ? 'rgba(16,185,129,0.08)' : 'var(--bg-base)',
                          border: `1px solid ${enabled ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`,
                        }}>
                          <div style={{ width: 18, height: 18, borderRadius: 4, background: enabled ? '#10b981' : 'var(--bg-elevated)', border: enabled ? 'none' : '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {enabled ? <Check size={11} color="white" /> : <X size={11} color="var(--text-tertiary)" />}
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: enabled ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: enabled ? 'var(--font-medium)' : 'normal' }}>{perm}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-5)' }}>
          {[
            { title: 'General Settings', icon: Settings, items: ['Company Name', 'Timezone', 'Date Format', 'Currency', 'Language'] },
            { title: 'Security', icon: Lock, items: ['Two-Factor Auth', 'Session Timeout', 'Password Policy', 'IP Restrictions', 'Audit Logs'] },
            { title: 'Integrations', icon: Globe, items: ['Gmail / G Suite', 'WhatsApp Business', 'Slack', 'Zapier', 'REST API'] },
            { title: 'Data & Storage', icon: Database, items: ['Export All Data', 'Import Contacts', 'Data Retention Policy', 'Backup Schedule', 'GDPR Settings'] },
          ].map((section, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <section.icon size={18} color="var(--brand-primary-light)" />
                </div>
                <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{section.title}</span>
              </div>
              {section.items.map(item => (
                <div key={item} className="flex items-center justify-between" style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item}</span>
                  <button className="btn btn-ghost btn-sm">Configure</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ maxWidth: 680 }}>
          {[
            { category: 'Lead Notifications', items: [
              { label: 'New lead assigned', channels: ['in-app', 'email'] },
              { label: 'Lead stage changed', channels: ['in-app'] },
              { label: 'Lead score drops below 40', channels: ['in-app', 'email', 'whatsapp'] },
            ]},
            { category: 'Task & Calendar', items: [
              { label: 'Task due reminder (1h before)', channels: ['in-app', 'email'] },
              { label: 'Meeting reminder (30 min before)', channels: ['in-app', 'whatsapp'] },
              { label: 'Task assigned to me', channels: ['in-app', 'email'] },
            ]},
            { category: 'Deal & Revenue', items: [
              { label: 'Deal moved to Won', channels: ['in-app', 'email', 'whatsapp'] },
              { label: 'Invoice overdue', channels: ['in-app', 'email'] },
              { label: 'Contract signed', channels: ['in-app', 'email', 'whatsapp'] },
            ]},
          ].map(section => (
            <div key={section.category} className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>{section.category}</div>
              {section.items.map(item => (
                <div key={item.label} className="flex items-center justify-between" style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <div className="flex gap-2">
                    {['in-app', 'email', 'whatsapp'].map(ch => (
                      <span key={ch} className={`badge ${item.channels.includes(ch) ? 'badge-primary' : 'badge-gray'}`} style={{ opacity: item.channels.includes(ch) ? 1 : 0.4 }}>
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
