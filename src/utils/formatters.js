// Utility formatters
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getStageColor = (stage) => {
  const colors = {
    'New Lead': '#94a3b8',
    'Qualified': '#3b82f6',
    'Contacted': '#8b5cf6',
    'Proposal Sent': '#f59e0b',
    'Negotiation': '#06b6d4',
    'Won': '#10b981',
    'Lost': '#ef4444',
  };
  return colors[stage] || '#94a3b8';
};

export const getStageBadge = (stage) => {
  const map = {
    'New Lead': 'badge-gray',
    'Qualified': 'badge-info',
    'Contacted': 'badge-purple',
    'Proposal Sent': 'badge-warning',
    'Negotiation': 'badge-cyan',
    'Won': 'badge-success',
    'Lost': 'badge-danger',
  };
  return map[stage] || 'badge-gray';
};

export const getPriorityColor = (priority) => {
  const colors = { Low: '#94a3b8', Medium: '#f59e0b', High: '#ef4444', Urgent: '#dc2626' };
  return colors[priority] || '#94a3b8';
};

export const getPriorityBadge = (priority) => {
  const map = { Low: 'badge-gray', Medium: 'badge-warning', High: 'badge-danger', Urgent: 'badge-danger' };
  return map[priority] || 'badge-gray';
};

export const getStatusBadge = (status) => {
  const map = {
    'Todo': 'badge-gray', 'In Progress': 'badge-info', 'Review': 'badge-warning',
    'Done': 'badge-success', 'Open': 'badge-danger', 'Resolved': 'badge-success',
    'Active': 'badge-success', 'Inactive': 'badge-gray',
    'Paid': 'badge-success', 'Pending': 'badge-warning', 'Overdue': 'badge-danger', 'Draft': 'badge-gray',
    'Planning': 'badge-info', 'In Progress': 'badge-primary', 'Completed': 'badge-success', 'On Hold': 'badge-warning',
    'Customer': 'badge-success', 'Prospect': 'badge-info', 'Lead': 'badge-warning',
  };
  return map[status] || 'badge-gray';
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};
