import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, Plus, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/contacts': 'Contacts',
  '/pipeline': 'Sales Pipeline',
  '/tasks': 'Task Management',
  '/calendar': 'Calendar',
  '/communications': 'Communications',
  '/projects': 'Projects',
  '/invoices': 'Invoices & Payments',
  '/support': 'Customer Support',
  '/reports': 'Reports & Analytics',
  '/ai': 'AI Assistant',
  '/admin': 'Admin Panel',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { unreadNotifications, notifications, markNotificationRead, markAllRead, sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const { user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const title = pageTitles[location.pathname] || 'VGL CRM';

  return (
    <header className={`topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', lineHeight: 1 }}>{title}</h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="input-group" style={{ maxWidth: 380, flex: 1, margin: '0 2rem' }}>
        <Search size={16} className="input-icon" />
        <input
          className="input"
          placeholder="Search leads, contacts, deals..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
        <div style={{
          position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '2px',
          background: 'var(--bg-active)', padding: '2px 6px', borderRadius: 'var(--radius-sm)',
          fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)'
        }}>
          <Command size={10} /> K
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="dropdown">
          <button
            className="btn btn-ghost btn-icon"
            style={{ position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--brand-danger)',
                border: '2px solid var(--bg-glass)',
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel" onClick={e => e.stopPropagation()}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>Notifications</span>
                  {unreadNotifications > 0 && <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>{unreadNotifications} new</span>}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: 'var(--space-3) var(--space-5)',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', marginTop: 6, flexShrink: 0 }} />}
                      <div style={{ marginLeft: n.read ? 14 : 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {user && (
          <div
            className="avatar avatar-md"
            style={{ background: user.color, color: 'white', cursor: 'pointer', border: '2px solid var(--border-brand)' }}
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
        )}
      </div>

      {/* Close notification on outside click */}
      {showNotifications && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-notification) - 1)' }}
          onClick={() => setShowNotifications(false)} />
      )}
    </header>
  );
}
