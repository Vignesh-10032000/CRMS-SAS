import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Target, Activity,
  Plus, ArrowRight, Trophy, Star, CheckCircle2, Clock, UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber, getInitials, formatRelativeTime } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 'var(--text-sm)' }}>{p.name}: {typeof p.value === 'number' && p.name !== 'deals' ? formatCurrency(p.value) : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { leads, tasks, deals, dashboardMetrics } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPipelineValue = dashboardMetrics?.revenue || 0;
  const wonValue = dashboardMetrics?.revenue || 0;
  const activeLeads = dashboardMetrics?.activeLeads || 0;
  const pendingTasks = dashboardMetrics?.tasksDue || 0;
  const conversionRate = dashboardMetrics?.conversionRate || 0;

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(wonValue), change: '', up: true, icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Active Leads', value: activeLeads, change: '', up: true, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Pipeline Value', value: formatCurrency(totalPipelineValue), change: '', up: true, icon: Target, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: '', up: true, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ];

  const revenueData = reportsData?.revenueData || [];
  const leadSourceData = reportsData?.leadSourceData || [];
  const conversionFunnel = reportsData?.conversionFunnel || [];
  const teamPerformance = reportsData?.teamPerformance || [];
  const activityFeed = []; // Activity feed can be fetched later or left empty for now

  return (
    <div className="animate-fade-in">
      {/* Welcome Bar */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's what's happening with your sales today.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/leads')}>View Leads</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/leads')}>
              <Plus size={14} /> Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }} className="stagger-children">
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-card animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="stat-icon" style={{ background: kpi.bg }}>
                <kpi.icon size={22} color={kpi.color} />
              </div>
              <div className={`stat-change ${kpi.up ? 'up' : 'down'}`}>
                {kpi.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.change}
              </div>
            </div>
            <div>
              <div className="stat-value">{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        {/* Revenue Chart */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div>
              <div className="chart-title">Revenue Overview</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>Monthly performance vs target</div>
            </div>
            <div className="flex gap-2">
              {['1W', '1M', '3M', '6M', '1Y'].map((r, i) => (
                <button key={r} className={`btn btn-sm ${i === 3 ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '2px 10px', fontSize: 11 }}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
              <Area type="monotone" dataKey="target" stroke="#06b6d4" strokeWidth={2} fill="url(#tgtGrad)" strokeDasharray="5 3" name="Target" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source Pie */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div className="chart-title">Lead Sources</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="leads" paddingAngle={3}>
                {leadSourceData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name, props) => [val, props.payload.source]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: -8 }}>
            {leadSourceData.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{s.source}</span>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{s.leads}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-5)' }}>
        {/* Conversion Funnel */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div className="chart-title">Pipeline Funnel</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {conversionFunnel.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{stage.count}</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: COLORS[i] }}>{stage.percentage}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stage.percentage}%`, background: COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div className="chart-title">Team Performance</div>
            <Trophy size={18} color="var(--brand-accent)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {teamPerformance.map((member, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 20, fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', color: i === 0 ? '#f59e0b' : 'var(--text-tertiary)' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
                </div>
                <div className="avatar avatar-sm" style={{ background: COLORS[i], color: '#fff', flexShrink: 0 }}>{getInitials(member.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-fill" style={{ width: `${Math.min((member.revenue / member.target) * 100, 100)}%`, background: COLORS[i] }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{formatCurrency(member.revenue)}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{member.deals} deals</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="chart-wrapper" style={{ overflow: 'hidden' }}>
          <div className="chart-header">
            <div className="chart-title">Activity Feed</div>
            <span className="badge badge-primary">Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: 240 }}>
            {activityFeed.map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: `${act.color}20`, border: `1px solid ${act.color}30` }}>
                  <Activity size={14} color={act.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{act.actor}</span>
                    {' '}{act.action}{' '}
                    <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{act.target}</span>
                    {act.value && <span style={{ color: '#10b981', fontWeight: 'var(--font-semibold)' }}> {act.value}</span>}
                  </p>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tasks */}
      <div style={{ marginTop: 'var(--space-5)' }} className="chart-wrapper">
        <div className="chart-header">
          <div className="chart-title">Today's Tasks ({pendingTasks} pending)</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/tasks')}><Plus size={14} /> Add Task</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
          {tasks.slice(0, 6).map(task => (
            <div key={task.id} className="flex items-center gap-3" style={{
              padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              opacity: task.completed ? 0.5 : 1
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: task.completed ? 'none' : '1px solid var(--border-strong)',
                background: task.completed ? '#10b981' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer'
              }}>
                {task.completed && <CheckCircle2 size={18} color="white" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', gap: 8, marginTop: 2 }}>
                  <span className={`badge ${task.priority === 'Urgent' ? 'badge-danger' : task.priority === 'High' ? 'badge-warning' : 'badge-gray'}`}>{task.priority}</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
