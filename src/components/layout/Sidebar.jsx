import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCircle, GitBranch, CheckSquare, Calendar,
  MessageSquare, FolderOpen, Receipt, Headphones, BarChart3, Bot, Settings,
  ChevronLeft, ChevronRight, Bell, Building2, LogOut, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import vglLogo from '../../assets/images/vgl-logo.jpg';

const navItems = [
  { section: 'Main', items: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leads', icon: Users, label: 'Leads', badge: 3 },
    { path: '/contacts', icon: UserCircle, label: 'Contacts' },
    { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  ]},
  { section: 'Work', items: [
    { path: '/tasks', icon: CheckSquare, label: 'Tasks', badge: 6 },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/communications', icon: MessageSquare, label: 'Communications', badge: 2 },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
  ]},
  { section: 'Finance', items: [
    { path: '/invoices', icon: Receipt, label: 'Invoices' },
    { path: '/support', icon: Headphones, label: 'Support', badge: 4 },
  ]},
  { section: 'Intelligence', items: [
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/ai', icon: Bot, label: 'AI Assistant' },
  ]},
  { section: 'System', items: [
    { path: '/admin', icon: Shield, label: 'Admin Panel' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, unreadNotifications } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 'calc(var(--z-sticky) - 1)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={vglLogo} alt="VGL" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          {!sidebarCollapsed && <span className="logo-text">VGL CRM</span>}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              {!sidebarCollapsed && (
                <div className="nav-section-label">{section.section}</div>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="nav-icon" size={18} />
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', marginBottom: 'var(--space-2)' }}>
              <div
                className="avatar avatar-md"
                style={{ background: user.color, color: 'white', flexShrink: 0 }}
              >
                {getInitials(user.name)}
              </div>
              {!sidebarCollapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', truncate: true }}>{user.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{user.role}</div>
                </div>
              )}
            </div>
          )}
          <button
            className="btn btn-ghost btn-sm w-full"
            onClick={handleLogout}
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && 'Sign Out'}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)',
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'all var(--transition-fast)', zIndex: 1,
          }}
          className="hidden-mobile"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
