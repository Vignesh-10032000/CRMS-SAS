import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, XCircle, CheckCircle, MessageCircle, UserPlus,
  Database, Bell, TrendingUp, Star, Globe, ShoppingCart, Users,
  Bot, MapPin, Target, Wrench, Palette, Smartphone, ExternalLink, ChevronRight, Sparkles
} from 'lucide-react';
import vglLogo from '../assets/images/vgl-logo.jpg';
import founderImg from '../assets/images/founder.jpg';

const scrollToDemo = () => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' });

const problems = [
  'Customers ask price and disappear',
  'Missed follow-ups cost you sales',
  'Leads scattered across WhatsApp chats',
  'No organized customer database',
  'No way to track sales performance',
  'No system for repeat customers',
];
const solutions = [
  'Automatic lead capture from WhatsApp',
  'Smart follow-up reminders',
  'Organized customer database',
  'WhatsApp automation workflows',
  'Real-time sales tracking & reports',
  'Repeat customer engagement system',
];

const workflowSteps = [
  { icon: MessageCircle, title: 'Customer Sends WhatsApp Message', desc: 'A potential customer reaches out on WhatsApp asking about your product or service.' },
  { icon: UserPlus, title: 'Lead Automatically Captured', desc: 'Our system instantly captures the lead details — name, phone, query — no manual entry needed.' },
  { icon: Database, title: 'CRM Creates Customer Record', desc: 'A complete customer profile is created with full conversation history and notes.' },
  { icon: Bell, title: 'Follow-up Reminders Generated', desc: 'Smart reminders ensure you never miss a follow-up. Automated messages keep leads warm.' },
  { icon: TrendingUp, title: 'Customer Converted to Sale', desc: 'Track the entire journey from first message to final sale with full analytics.' },
];

const industries = [
  { icon: Smartphone, title: 'Mobile Shops', color: '#6366f1', benefits: ['Track customer enquiries', 'Manage inventory leads', 'Send price updates via WhatsApp', 'Follow up on repair jobs'] },
  { icon: ShoppingCart, title: 'Retail Stores', color: '#10b981', benefits: ['Build customer database', 'Send offers to repeat buyers', 'Track walk-in vs online leads', 'Manage seasonal campaigns'] },
  { icon: Palette, title: 'Boutiques', color: '#f59e0b', benefits: ['Manage order requests', 'Track measurements and preferences', 'Send collection updates', 'Handle custom orders'] },
  { icon: Wrench, title: 'Service Businesses', color: '#06b6d4', benefits: ['Schedule appointments', 'Manage service requests', 'Automate booking confirmations', 'Track service history'] },
];

const ecosystem = [
  { icon: Globe, title: 'Business Websites', desc: 'Professional websites that convert visitors into customers' },
  { icon: ShoppingCart, title: 'E-commerce', desc: 'Online stores with payment integration and inventory management' },
  { icon: Users, title: 'CRM Systems', desc: 'Customer management with lead tracking and pipeline visualization' },
  { icon: MessageCircle, title: 'WhatsApp Automation', desc: 'Automated responses, follow-ups, and broadcast messages' },
  { icon: Bot, title: 'AI Workflows', desc: 'Intelligent automation that saves hours of manual work every day' },
  { icon: MapPin, title: 'Google Business Profile', desc: 'Optimize your local presence and get found by nearby customers' },
  { icon: Target, title: 'Lead Management', desc: 'Capture, nurture, and convert leads with systematic follow-up' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Mobile Shop Owner', city: 'Coimbatore', initials: 'RK', color: '#6366f1', text: 'Before VGL CRM, I was losing 50% of my WhatsApp enquiries. Now every lead is tracked and followed up automatically. My sales increased by 40% in just 2 months.' },
  { name: 'Priya Sharma', role: 'Boutique Owner', city: 'Chennai', initials: 'PS', color: '#10b981', text: 'The WhatsApp automation alone saved me 3 hours every day. I can now focus on my designs while the CRM handles customer follow-ups.' },
  { name: 'Arun Prakash', role: 'Service Business', city: 'Madurai', initials: 'AP', color: '#f59e0b', text: 'I went from using notebooks to track customers to having a complete digital system. VGL set everything up and trained my team in just 2 days.' },
];

const screenshotTabs = ['Dashboard', 'Leads', 'Pipeline', 'Tasks', 'Analytics'];
const tabUrls = { Dashboard: 'app.vglcrm.in/dashboard', Leads: 'app.vglcrm.in/leads', Pipeline: 'app.vglcrm.in/pipeline', Tasks: 'app.vglcrm.in/tasks', Analytics: 'app.vglcrm.in/analytics' };

/* ── Mockup sub-components ── */
const BrowserChrome = ({ url }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
    <div style={{ display: 'flex', gap: 6 }}>
      {['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
    </div>
    <div style={{ flex: 1, background: 'var(--bg-app)', borderRadius: 'var(--radius-full)', padding: '4px 14px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{url}</div>
  </div>
);

const KpiCard = ({ label, value, color }) => (
  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 16, borderLeft: `3px solid ${color}` }}>
    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

const MockDashboard = () => (
  <div style={{ padding: 20 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
      <KpiCard label="Revenue" value="₹4.2L" color="#10b981" />
      <KpiCard label="Leads" value="847" color="#6366f1" />
      <KpiCard label="Pipeline" value="₹12.8L" color="#06b6d4" />
      <KpiCard label="Conversion" value="34%" color="#f59e0b" />
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
      {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: `linear-gradient(180deg, var(--brand-primary), var(--brand-secondary))`, opacity: 0.7 + i * 0.04 }} />
      ))}
    </div>
  </div>
);

const MockLeads = () => {
  const rows = [
    ['Anitha M.', '98765xxxxx', 'WhatsApp', 'New', '82'],
    ['Karthik R.', '90123xxxxx', 'Website', 'Contacted', '65'],
    ['Deepa S.', '87654xxxxx', 'Referral', 'Proposal', '91'],
    ['Suresh K.', '99887xxxxx', 'Walk-in', 'Won', '78'],
  ];
  const thStyle = { textAlign: 'left', padding: '8px 12px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' };
  const tdStyle = { padding: '8px 12px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' };
  return (
    <div style={{ padding: 16, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{['Name', 'Phone', 'Source', 'Stage', 'Score'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={tdStyle}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
};

const MockPipeline = () => {
  const cols = [{ name: 'New', color: '#6366f1', count: 12 }, { name: 'Contacted', color: '#06b6d4', count: 8 }, { name: 'Proposal', color: '#f59e0b', count: 5 }, { name: 'Won', color: '#10b981', count: 3 }];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: 16 }}>
      {cols.map(c => (
        <div key={c.name} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ background: c.color, padding: '6px 12px', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{c.name} ({c.count})</div>
          <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: Math.min(c.count, 3) }).map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Lead #{i + 1}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MockTasks = () => {
  const tasks = [
    { text: 'Follow up with Anitha — WhatsApp', done: true },
    { text: 'Send quotation to Karthik', done: true },
    { text: 'Call Deepa regarding custom order', done: false },
    { text: 'Update pricing catalog', done: false },
    { text: 'Schedule demo for new prospect', done: false },
  ];
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tasks.map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, border: t.done ? 'none' : '2px solid var(--border-strong)', background: t.done ? 'var(--brand-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {t.done && <CheckCircle size={14} color="#fff" />}
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: t.done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
};

const MockAnalytics = () => {
  const sources = [{ name: 'WhatsApp', pct: 45, color: '#10b981' }, { name: 'Website', pct: 25, color: '#6366f1' }, { name: 'Referral', pct: 20, color: '#f59e0b' }, { name: 'Walk-in', pct: 10, color: '#06b6d4' }];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard label="Total Leads" value="847" color="#6366f1" />
        <KpiCard label="Conversion Rate" value="34%" color="#10b981" />
        <KpiCard label="Avg Response Time" value="12 min" color="#f59e0b" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sources.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 70, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.name}</span>
            <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', height: 14, overflow: 'hidden' }}>
              <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', width: 32 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const mockScreens = { Dashboard: MockDashboard, Leads: MockLeads, Pipeline: MockPipeline, Tasks: MockTasks, Analytics: MockAnalytics };

/* ═══════════ LANDING PAGE ═══════════ */
export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [form, setForm] = useState({ name: '', business: '', phone: '', whatsapp: '', type: '', challenge: '' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); alert('Thank you! We will contact you within 2 hours.'); };

  const ActiveMock = mockScreens[activeTab];

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>

      {/* ── 1. NAV BAR ── */}
      <nav className="landing-nav" style={{ position: 'sticky', top: 0, zIndex: 'var(--z-sticky)' }}>
        <div className="flex items-center gap-3">
          <img src={vglLogo} alt="VGL" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xl)' }}>Vignesh Growth Lab</span>
        </div>
        <div className="landing-nav-links" style={{ display: 'flex' }}>
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#industries" className="landing-nav-link">Industries</a>
          <a href="#about" className="landing-nav-link">About</a>
        </div>
        <button className="btn btn-primary" onClick={scrollToDemo}>Book Free Demo</button>
      </nav>

      {/* ── 2. HERO SECTION ── */}
      <div className="landing-hero">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-primary" />
        <div className="hero-glow hero-glow-secondary" />
        <div className="hero-content">
          <div className="hero-pill animate-fade-in">
            <Sparkles size={14} /> WhatsApp-First CRM for Indian Businesses <ChevronRight size={14} />
          </div>
          <h1 className="hero-title">
            Stop Losing Customers<br /><span className="gradient-text">on WhatsApp.</span>
          </h1>
          <p className="hero-desc">
            Capture leads, automate follow-ups, track customers, and grow your business — with one simple system built for Indian MSMEs.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={scrollToDemo}>Book Free Demo <ArrowRight size={18} /></button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>See CRM in Action</button>
          </div>
          <div className="trust-badges" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            {['🏢 MSME Registered', '📍 Tamil Nadu Based', '🤖 AI Automation Specialist'].map(b => (
              <span key={b} className="trust-badge-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', backdropFilter: 'blur(8px)' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. PAIN POINTS ── */}
      <section id="problems" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Problems We Solve</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>Sound Familiar?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 540, margin: '0 auto' }}>You are not alone.</p>
        </div>
        <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {problems.map((p, i) => (
              <div key={i} className="pain-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <XCircle size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>❌ {p}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {solutions.map((s, i) => (
              <div key={i} className="pain-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-brand)' }}>
                <CheckCircle size={22} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>✅ {s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section id="how-it-works" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>How It Works</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>From WhatsApp Message to Closed Sale</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 580, margin: '0 auto' }}>Automatically.</p>
        </div>
        <div className="workflow-container" style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          {workflowSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 24 }}>
              {/* Numbered circle + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 'var(--text-lg)', flexShrink: 0, boxShadow: 'var(--shadow-glow)' }}>{i + 1}</div>
                {i < workflowSteps.length - 1 && (
                  <div className="workflow-connector" style={{ width: 2, flex: 1, minHeight: 40, background: 'linear-gradient(180deg, var(--brand-primary), var(--brand-secondary))' }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: i < workflowSteps.length - 1 ? 32 : 0, paddingTop: 4 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <step.icon size={20} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{step.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PRODUCT SCREENSHOTS ── */}
      <section id="features" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Product Preview</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>See the CRM in Action</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 540, margin: '0 auto' }}>Real screenshots from the actual platform</p>
        </div>
        <div className="screenshot-tabs" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {screenshotTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', border: activeTab === tab ? '1px solid var(--brand-primary)' : '1px solid var(--border-default)', background: activeTab === tab ? 'var(--brand-primary)' : 'var(--bg-surface)', color: activeTab === tab ? '#fff' : 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', transition: 'all var(--transition-base)' }}>{tab}</button>
          ))}
        </div>
        <div className="screenshot-display" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', maxWidth: 900, margin: '0 auto' }}>
          <BrowserChrome url={tabUrls[activeTab]} />
          <div style={{ minHeight: 280, background: 'var(--bg-app)' }}>
            <ActiveMock />
          </div>
        </div>
      </section>

      {/* ── 6. INDUSTRY USE CASES ── */}
      <section id="industries" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Industries</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>Built for Your Business</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto' }}>Whether you run a mobile shop or a service business</p>
        </div>
        <div className="industry-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {industries.map((ind, i) => (
            <div key={i} className="industry-card card" style={{ borderLeft: `4px solid ${ind.color}`, padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${ind.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <ind.icon size={22} color={ind.color} />
              </div>
              <h3 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 12, color: 'var(--text-primary)' }}>{ind.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ind.benefits.map((b, j) => (
                  <li key={j} className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} color={ind.color} style={{ flexShrink: 0 }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FOUNDER SECTION ── */}
      <section id="about" className="vgl-section">
        <div className="founder-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 360px) 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="founder-image" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 260, height: 260, borderRadius: '50%', padding: 4, background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)' }}>
              <img src={founderImg} alt="Vignesh — Founder" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-app)' }} />
            </div>
          </div>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Founder & AI Specialist</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 16 }}>Meet Vignesh</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: 16 }}>
              Founder of Vignesh Growth Lab. I build websites, AI workflows, CRM systems, WhatsApp automation, and business growth systems for MSMEs across Tamil Nadu.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: 24 }}>
              I started VGL because I saw small business owners losing customers simply because they did not have the right tools. Big companies use Salesforce and HubSpot — but those are expensive and complex. I built this CRM to give small businesses the same power, at a fraction of the cost.
            </p>
            <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)', padding: '16px 20px', marginBottom: 24 }}>
              <p style={{ color: 'var(--text-brand)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', margin: 0 }}>
                🎯 Mission: Help small businesses use technology to grow — without needing a large technical team.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { icon: ExternalLink, label: 'LinkedIn', href: '#' },
                { icon: MessageCircle, label: 'WhatsApp', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} title={s.label} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all var(--transition-base)' }}>
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. VGL ECOSYSTEM ── */}
      <section id="services" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Full-Stack Growth</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>The VGL Growth Ecosystem</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto' }}>CRM is just the beginning. We build your complete digital infrastructure.</p>
        </div>
        <div className="ecosystem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {ecosystem.map((svc, i) => (
            <div key={i} className="ecosystem-card card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svc.icon size={24} color="var(--brand-primary)" />
              </div>
              <h4 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 8, color: 'var(--text-primary)' }}>{svc.title}</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ── */}
      <section id="testimonials" className="vgl-section">
        <div className="vgl-section-header">
          <span className="badge badge-success" style={{ marginBottom: 12, display: 'inline-block' }}>Social Proof</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>Trusted by Business Owners</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic', flex: 1 }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{t.role}, {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. BOOK DEMO FORM ── */}
      <section id="demo-form" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="vgl-section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-block' }}>Free Consultation</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 'var(--font-bold)', marginBottom: 12 }}>Let's Grow Your Business</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto' }}>Book a free consultation with Vignesh Growth Lab. No commitment, no pressure.</p>
          </div>
          <form onSubmit={handleSubmit} className="demo-form-container card" style={{ maxWidth: 640, margin: '0 auto', padding: 32 }}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Full name" style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Business Name</label>
                <input name="business" value={form.business} onChange={handleChange} required className="input" placeholder="Your business name" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="input" placeholder="+91 98765 43210" style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input" placeholder="+91 98765 43210" style={{ width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Business Type</label>
              <select name="type" value={form.type} onChange={handleChange} required className="input" style={{ width: '100%' }}>
                <option value="">Select your business type</option>
                {['Mobile Shop', 'Retail Store', 'Boutique', 'Electronics Store', 'Service Business', 'Restaurant / Cafe', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Current Challenge</label>
              <textarea name="challenge" value={form.challenge} onChange={handleChange} rows={3} className="input" placeholder="Tell us your biggest business challenge..." style={{ width: '100%', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Book Free Consultation <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 14 }}>We typically respond within 2 hours during business hours.</p>
          </form>
        </div>
      </section>

      {/* ── 11. FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
          <img src={vglLogo} alt="VGL" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>Vignesh Growth Lab</span>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>© 2026 Vignesh Growth Lab. Empowering MSMEs with technology.</p>
        <div className="flex items-center justify-center gap-4 wrap" style={{ marginBottom: 16 }}>
          {['🏢 MSME Registered', '📍 Tamil Nadu, India', '🤖 AI Automation'].map(b => (
            <span key={b} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>{b}</span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6">
          {['Privacy', 'Terms', 'Support'].map(link => (
            <span key={link} style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>{link}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
