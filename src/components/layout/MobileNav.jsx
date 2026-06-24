import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, Calendar, UserCircle } from 'lucide-react';

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/contacts', icon: UserCircle, label: 'Contacts' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-items">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <div className={isActive ? 'nav-icon-dot' : ''} style={{ borderRadius: 'var(--radius-lg)', padding: isActive ? '6px' : 0, background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent' }}>
                  <item.icon size={22} />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
