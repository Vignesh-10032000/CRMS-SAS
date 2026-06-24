import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="main-layout" data-theme-layout>
      <Sidebar />
      <TopBar />
      <main className={`page-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
