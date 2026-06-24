import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, Mail, MessageSquare, Target, Lightbulb, RefreshCw, Copy, Check, ChevronRight } from 'lucide-react';

const suggestions = [
  "Summarize my top 5 leads this week",
  "Generate a follow-up email for TechVision Corp",
  "Which leads are most likely to close this month?",
  "Create a task for the GreenPath follow-up",
  "Show me team performance for June",
  "What's my pipeline value right now?",
];

const aiCards = [
  { title: 'Lead Scoring AI', desc: 'Predict conversion likelihood based on engagement patterns', icon: TrendingUp, color: '#6366f1', action: 'Analyze Leads', sample: 'GreenPath Realty has a 92% conversion probability based on 8 touchpoints and budget confirmation.' },
  { title: 'Email Generator', desc: 'Write personalized follow-up emails for any prospect', icon: Mail, color: '#10b981', action: 'Generate Email', sample: 'Subject: Next Steps for TechVision Enterprise Partnership\n\nHi David, thank you for your interest in our Enterprise tier...' },
  { title: 'Deal Insights', desc: 'Get AI-powered recommendations for closing deals faster', icon: Target, color: '#f59e0b', action: 'Get Insights', sample: 'To close SkyNet Telecom, consider: 1. Offering a 10% annual discount, 2. Scheduling a C-suite demo this week.' },
  { title: 'WhatsApp Templates', desc: 'Generate WhatsApp messages optimized for engagement', icon: MessageSquare, color: '#25d366', action: 'Create Template', sample: 'Hi {{name}} 👋 Quick follow-up on our proposal. Would you have 15 min this week to discuss?' },
];

const chatHistory = [
  { role: 'ai', content: "Hello! I'm your AI Sales Assistant. I can help you analyze leads, generate emails, create tasks, and search your CRM data. What would you like to do?" },
  { role: 'user', content: "Which leads have the highest chance of closing this month?" },
  { role: 'ai', content: "Based on your current pipeline, here are your top 3 leads most likely to close this month:\n\n🏆 **GreenPath Realty** — Score: 92 | Stage: Negotiation | Value: $42,000\n- Budget confirmed, in final contract review\n- Recommendation: Send contract by June 25th\n\n🥈 **SkyNet Telecom** — Score: 88 | Stage: Negotiation | Value: $93,000\n- Decision expected by June 26th\n- Recommendation: Schedule CEO call ASAP\n\n🥉 **TechVision Corp** — Score: 87 | Stage: Proposal Sent | Value: $85,000\n- HIPAA docs pending\n- Recommendation: Send compliance documents today\n\nTotal potential: **$220,000** if all 3 close this month 🎯" },
];

export default function AI() {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [copied, setCopied] = useState(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const aiResponse = {
      role: 'ai',
      content: `I've analyzed your CRM data regarding "${text}". Based on current pipeline data:\n\n✅ I found 3 relevant matches in your database\n📊 Your conversion rate for this segment is 28%\n💡 Recommendation: Schedule follow-ups with leads in the Negotiation stage this week\n\n*This is a demo response. In production, this would be powered by GPT-4 with full CRM context.*`
    };
    setMessages(prev => [...prev, aiResponse]);
    setLoading(false);
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Assistant</h1>
          <p className="page-subtitle">Powered by GPT-4 · Your intelligent sales copilot</p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} className="animate-pulse" />
          <span style={{ fontSize: 'var(--text-sm)', color: '#10b981', fontWeight: 'var(--font-semibold)' }}>AI Active</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-5)', height: 'calc(100vh - 200px)', minHeight: 520 }}>
        {/* Chat Interface */}
        <div className="ai-chat">
          <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.04) 100%)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>Nexus AI</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#10b981' }}>● Online · GPT-4 Powered</div>
            </div>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role === 'user' ? 'user' : ''}`}>
                {msg.role === 'ai' && (
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="white" />
                  </div>
                )}
                <div>
                  <div className="ai-bubble" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {msg.content}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 4, paddingLeft: 4 }}>
                    <button onClick={() => copyText(msg.content, i)} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '2px 8px', color: 'var(--text-tertiary)' }}>
                      {copied === i ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message">
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} color="white" />
                </div>
                <div className="ai-bubble">
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-3) 0', overflowX: 'auto' }}>
              {suggestions.map((s, i) => (
                <button key={i} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: 11 }} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-chat-input">
            <input
              className="input" style={{ flex: 1 }}
              placeholder="Ask me anything about your CRM..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
            />
            <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* AI Feature Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
          <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Sparkles size={14} color="var(--brand-accent)" />
            AI Features
          </div>
          {aiCards.map((card, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', border: activeCard === i ? `1px solid ${card.color}40` : '1px solid var(--border-subtle)', background: activeCard === i ? `${card.color}08` : 'var(--bg-surface)' }}
              onClick={() => setActiveCard(activeCard === i ? null : i)}>
              <div className="flex items-start gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: card.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.icon size={20} color={card.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{card.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{card.desc}</div>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" style={{ transform: activeCard === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              {activeCard === i && (
                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-semibold)' }}>✨ Sample Output:</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{card.sample}</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)', width: '100%' }}
                    onClick={e => { e.stopPropagation(); sendMessage(card.action); }}>
                    <Sparkles size={12} /> {card.action}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
