import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 'var(--text-sm)' }}>{p.name}: {p.name === 'revenue' || p.name === 'target' ? formatCurrency(p.value) : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { reportsData, dashboardMetrics } = useApp();
  const [dateRange, setDateRange] = useState('6M');

  if (!reportsData || !dashboardMetrics) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;

  const { leadSourceData, conversionFunnel, revenueData, teamPerformance } = reportsData;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive insights for your business</p>
        </div>
        <div className="flex gap-3">
          <div className="tabs">
            {['1M', '3M', '6M', '1Y'].map(r => (
              <button key={r} className={`tab ${dateRange === r ? 'active' : ''}`} onClick={() => setDateRange(r)}>{r}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export PDF</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(dashboardMetrics.revenue || 0), change: '+18.2%', icon: DollarSign, color: '#10b981' },
          { label: 'Total Leads', value: dashboardMetrics.totalLeads || 0, change: '+24.6%', icon: Users, color: '#6366f1' },
          { label: 'Deals Won', value: dashboardMetrics.wonDeals || 0, change: '+12.5%', icon: Target, color: '#f59e0b' },
          { label: 'Conversion Rate', value: `${dashboardMetrics.conversionRate || 0}%`, change: '+3.1%', icon: TrendingUp, color: '#06b6d4' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: kpi.color + '18' }}><kpi.icon size={20} color={kpi.color} /></div>
            <div>
              <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
              <div className="stat-change up" style={{ marginTop: 4 }}><TrendingUp size={12} />{kpi.change} vs prev period</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="chart-wrapper" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="chart-header">
          <div>
            <div className="chart-title">Revenue vs Target</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Monthly revenue performance</div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div style={{ width: 12, height: 3, background: '#6366f1', borderRadius: 2 }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Revenue</span></div>
            <div className="flex items-center gap-2"><div style={{ width: 12, height: 3, background: '#06b6d4', borderRadius: 2, borderTop: '1px dashed #06b6d4' }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Target</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" name="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="target" fill="rgba(6,182,212,0.25)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        {/* Lead Source Performance */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div className="chart-title">Lead Source Performance</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leadSourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="source" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v, n, p) => [v, 'Leads']} />
              <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
                {leadSourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="chart-wrapper">
          <div className="chart-header">
            <div className="chart-title">Pipeline Conversion</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {conversionFunnel.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{stage.count} leads</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: COLORS[i], minWidth: 36, textAlign: 'right' }}>{stage.percentage}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${stage.percentage}%`, background: COLORS[i], transition: 'width 1.2s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="chart-wrapper">
        <div className="chart-header">
          <div className="chart-title">Team Performance</div>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
        </div>
        <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Deals Closed</th>
                <th>Revenue</th>
                <th>Target</th>
                <th>Achievement</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((member, i) => {
                const achievement = member.target > 0 ? Math.round((member.revenue / member.target) * 100) : 0;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{member.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{member.role}</td>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: '#6366f1' }}>{member.deals}</td>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{formatCurrency(member.revenue)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatCurrency(member.target)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(achievement, 100)}%`, background: achievement >= 100 ? '#10b981' : achievement >= 80 ? '#f59e0b' : '#ef4444', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: achievement >= 100 ? '#10b981' : achievement >= 80 ? '#f59e0b' : '#ef4444', minWidth: 36 }}>{achievement}%</span>
                      </div>
                    </td>
                    <td><span className="badge badge-success">{member.conversion}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
