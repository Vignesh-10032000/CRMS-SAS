import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();
const API_URL = 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const { isAuthenticated, user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState({ New: [], Contacted: [], Proposal: [], Won: [] });
  const [tasks, setTasks] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const fetchHeaders = () => {
    const token = localStorage.getItem('vgl_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setLeads([]); setContacts([]); setTasks([]);
      setDeals({ New: [], Contacted: [], Proposal: [], Won: [] });
      setDashboardMetrics(null); setReportsData(null);
      setInvoices([]); setTickets([]); setProjects([]); setMessages([]); setCalendarEvents([]); setUsers([]);
      return;
    }

    try {
      const headers = fetchHeaders();
      const [
        leadsRes, contactsRes, tasksRes, dealsRes, metricsRes, reportsRes,
        invoicesRes, ticketsRes, projectsRes, messagesRes, calendarRes, usersRes
      ] = await Promise.all([
        fetch(`${API_URL}/leads`, { headers }),
        fetch(`${API_URL}/contacts`, { headers }),
        fetch(`${API_URL}/tasks`, { headers }),
        fetch(`${API_URL}/deals`, { headers }),
        fetch(`${API_URL}/dashboard/metrics`, { headers }),
        fetch(`${API_URL}/dashboard/reports`, { headers }),
        fetch(`${API_URL}/invoices`, { headers }),
        fetch(`${API_URL}/support`, { headers }),
        fetch(`${API_URL}/projects`, { headers }),
        fetch(`${API_URL}/communications`, { headers }),
        fetch(`${API_URL}/calendar`, { headers }),
        fetch(`${API_URL}/users`, { headers }) // For admin and assignment dropdowns
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (dealsRes.ok) setDeals(await dealsRes.json());
      if (metricsRes.ok) setDashboardMetrics(await metricsRes.json());
      if (reportsRes.ok) setReportsData(await reportsRes.json());
      
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (calendarRes.ok) setCalendarEvents(await calendarRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // LEADS
  const addLead = useCallback(async (lead) => {
    try {
      const res = await fetch(`${API_URL}/leads`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(lead) });
      if (res.ok) { const data = await res.json(); setLeads(prev => [data, ...prev]); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  const updateLead = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setLeads(prev => prev.map(l => l.id === id ? updated : l)); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  const deleteLead = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { setLeads(prev => prev.filter(l => l.id !== id)); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  // CONTACTS
  const addContact = useCallback(async (contact) => {
    try {
      const res = await fetch(`${API_URL}/contacts`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(contact) });
      if (res.ok) { const data = await res.json(); setContacts(prev => [data, ...prev]); }
    } catch (error) { console.error(error); }
  }, []);

  const updateContact = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setContacts(prev => prev.map(c => c.id === id ? updated : c)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteContact = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  // TASKS
  const addTask = useCallback(async (task) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(task) });
      if (res.ok) { const data = await res.json(); setTasks(prev => [data, ...prev]); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  const toggleTask = useCallback(async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify({ completed: !taskToToggle.completed, status: !taskToToggle.completed ? 'Done' : 'Todo' }) });
      if (res.ok) { const updated = await res.json(); setTasks(prev => prev.map(t => t.id === id ? updated : t)); loadData(); }
    } catch (error) { console.error(error); }
  }, [tasks, loadData]);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setTasks(prev => prev.map(t => t.id === id ? updated : t)); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  const deleteTask = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { setTasks(prev => prev.filter(t => t.id !== id)); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  // PIPELINE DEALS
  const moveDeal = useCallback(async (dealId, fromCol, toCol) => {
    try {
      setDeals(prev => {
        const deal = prev[fromCol].find(d => d.id === dealId);
        if (!deal) return prev;
        return { ...prev, [fromCol]: prev[fromCol].filter(d => d.id !== dealId), [toCol]: [deal, ...prev[toCol]] };
      });
      await fetch(`${API_URL}/deals/${dealId}/move`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify({ status: toCol }) });
      loadData();
    } catch (error) { console.error(error); }
  }, [loadData]);

  const addDeal = useCallback(async (column, deal) => {
    try {
      const res = await fetch(`${API_URL}/deals`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ ...deal, status: column }) });
      if (res.ok) { const newDeal = await res.json(); setDeals(prev => ({ ...prev, [column]: [newDeal, ...prev[column]] })); loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  const updateDeal = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/deals/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { loadData(); } // Since deals are complex objects grouped by status, reload is safest
    } catch (error) { console.error(error); }
  }, [loadData]);

  const deleteDeal = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/deals/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { loadData(); }
    } catch (error) { console.error(error); }
  }, [loadData]);

  // SUPPORT TICKETS
  const addTicket = useCallback(async (ticket) => {
    try {
      const res = await fetch(`${API_URL}/support`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(ticket) });
      if (res.ok) { const data = await res.json(); setTickets(prev => [data, ...prev]); }
    } catch (error) { console.error(error); }
  }, []);
  
  const updateTicket = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/support/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setTickets(prev => prev.map(t => t.id === id ? updated : t)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteTicket = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/support/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setTickets(prev => prev.filter(t => t.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  // INVOICES
  const addInvoice = useCallback(async (invoice) => {
    try {
      const res = await fetch(`${API_URL}/invoices`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(invoice) });
      if (res.ok) { const data = await res.json(); setInvoices(prev => [data, ...prev]); }
    } catch (error) { console.error(error); }
  }, []);

  const updateInvoice = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/invoices/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setInvoices(prev => prev.map(i => i.id === id ? updated : i)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteInvoice = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/invoices/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setInvoices(prev => prev.filter(i => i.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  // PROJECTS
  const addProject = useCallback(async (project) => {
    try {
      const res = await fetch(`${API_URL}/projects`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(project) });
      if (res.ok) { const data = await res.json(); setProjects(prev => [data, ...prev]); }
    } catch (error) { console.error(error); }
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setProjects(prev => prev.map(p => p.id === id ? updated : p)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  // CALENDAR EVENTS
  const addCalendarEvent = useCallback(async (event) => {
    try {
      const res = await fetch(`${API_URL}/calendar`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(event) });
      if (res.ok) { const data = await res.json(); setCalendarEvents(prev => [...prev, data]); }
    } catch (error) { console.error(error); }
  }, []);

  const updateCalendarEvent = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/calendar/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setCalendarEvents(prev => prev.map(e => e.id === id ? updated : e)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteCalendarEvent = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/calendar/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setCalendarEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  // COMMUNICATIONS
  const addMessage = useCallback(async (message) => {
    try {
      const res = await fetch(`${API_URL}/communications`, { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(message) });
      if (res.ok) { const data = await res.json(); setMessages(prev => [data, ...prev]); }
    } catch (error) { console.error(error); }
  }, []);

  const updateMessage = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/communications/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setMessages(prev => prev.map(m => m.id === id ? updated : m)); }
    } catch (error) { console.error(error); }
  }, []);

  const deleteMessage = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/communications/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) { console.error(error); }
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      leads, setLeads, addLead, updateLead, deleteLead,
      contacts, setContacts, addContact, updateContact, deleteContact,
      deals, setDeals, moveDeal, addDeal,
      tasks, setTasks, addTask, updateTask, deleteTask, toggleTask,
      dashboardMetrics, reportsData, loadData,
      notifications, unreadNotifications, markNotificationRead, markAllRead,
      invoices, setInvoices, addInvoice, updateInvoice, deleteInvoice,
      tickets, setTickets, addTicket, updateTicket, deleteTicket,
      projects, setProjects, addProject, updateProject, deleteProject,
      messages, setMessages, addMessage, updateMessage, deleteMessage,
      calendarEvents, setCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      users, setUsers,
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
