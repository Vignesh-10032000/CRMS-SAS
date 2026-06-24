import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, ArrowRight, ChevronDown } from 'lucide-react';
import vglLogo from '../assets/images/vgl-logo.jpg';

const plans = [
  {
    name: 'Starter Setup',
    price: '₹9,999',
    note: 'One-time setup fee',
    color: '#94a3b8',
    description: 'Perfect for small shops getting started with digital tools',
    features: [
      'CRM Setup & Configuration',
      'Up to 500 Contacts',
      'WhatsApp Business Integration',
      'Basic Lead Tracking',
      'Follow-up Reminders',
      '2 Hours Training',
      'Email Support',
      '1 Month Free Support'
    ],
    cta: 'Get Started'
  },
  {
    name: 'Growth Setup',
    price: '₹24,999',
    note: 'One-time setup fee',
    popular: true,
    color: '#6366f1',
    description: 'For growing businesses ready to automate and scale',
    features: [
      'Everything in Starter',
      'Business Website (5 pages)',
      'WhatsApp Automation Workflows',
      'Up to 5,000 Contacts',
      'Sales Pipeline Management',
      'Automated Follow-up Sequences',
      'Google Business Profile Setup',
      'Priority WhatsApp Support',
      '3 Months Free Support'
    ],
    cta: 'Choose Growth'
  },
  {
    name: 'Custom Business Solution',
    price: 'Custom',
    note: 'Tailored pricing',
    color: '#06b6d4',
    description: 'Complete digital transformation for your business',
    features: [
      'Everything in Growth',
      'E-commerce Website',
      'AI-Powered Workflows',
      'Unlimited Contacts',
      'Custom Integrations',
      'Advanced Analytics & Reports',
      'Dedicated Account Manager',
      'On-site Training',
      '6 Months Free Support',
      'Priority Phone Support'
    ],
    cta: 'Contact Vignesh'
  }
];

const faqs = [
  {
    q: 'Is this a monthly subscription?',
    a: 'No! Our pricing is one-time setup fee. You own the system. Optional monthly support plans are available if needed.'
  },
  {
    q: 'Will you set up everything for me?',
    a: 'Absolutely. We handle the complete setup, configuration, data migration, and training. You don\'t need any technical knowledge.'
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes. You can upgrade from Starter to Growth anytime. We\'ll credit your initial payment toward the upgrade.'
  },
  {
    q: 'Do you provide training?',
    a: 'Yes. Every plan includes hands-on training for you and your team. We also provide video tutorials and WhatsApp support.'
  },
  {
    q: 'What if I need a custom solution?',
    a: 'Contact us directly. We\'ll understand your business needs and create a tailored package — CRM, website, automation, everything.'
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
      {/* Header */}
      <div className="vgl-section-header" style={{ marginBottom: 'var(--space-12)' }}>
        <div className="badge badge-primary" style={{ marginBottom: 'var(--space-4)' }}>Simple, Transparent Pricing</div>
        <h2>Invest Once, Grow Forever</h2>
        <p>No monthly SaaS subscriptions. Pay once for setup, own your system forever.</p>
      </div>

      {/* Pricing Cards */}
      <div className="vgl-section" style={{ maxWidth: 1100, paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.popular && (
                <div className="pricing-popular-badge">
                  <Zap size={14} /> Most Popular
                </div>
              )}
              <div style={{ padding: 'var(--space-8)' }}>
                <h3 style={{ color: plan.color, marginBottom: 'var(--space-2)' }}>{plan.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', minHeight: 40 }}>{plan.description}</p>
                <div style={{ margin: 'var(--space-6) 0' }}>
                  <div className="pricing-price" style={{ color: 'var(--text-primary)' }}>{plan.price}</div>
                  <div className="pricing-period" style={{ color: 'var(--text-tertiary)' }}>{plan.note}</div>
                </div>
                <button
                  className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => navigate('/#demo-form')}
                >
                  {plan.cta}
                </button>
              </div>
              
              <div className="divider" style={{ margin: 0 }}></div>
              
              <div style={{ padding: 'var(--space-8)', flex: 1, background: 'var(--bg-glass)' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>What's included:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {plan.features.map((feature, j) => (
                    <div key={j} className="pricing-feature">
                      <Check size={16} color={plan.color} style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Included Grid */}
      <div className="vgl-section" style={{ maxWidth: 900 }}>
        <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', fontSize: 'var(--text-2xl)' }}>What's Included in Every Plan</h3>
        <div className="included-grid">
          <div className="included-item">
            <div className="included-item-icon">🛠️</div>
            <h4>Setup & Configuration</h4>
            <p>We build everything for you. Zero technical headaches.</p>
          </div>
          <div className="included-item">
            <div className="included-item-icon">👨‍🏫</div>
            <h4>Training & Onboarding</h4>
            <p>Hands-on training for your entire team to ensure success.</p>
          </div>
          <div className="included-item">
            <div className="included-item-icon">💬</div>
            <h4>WhatsApp Integration</h4>
            <p>Connect your business number and start automating.</p>
          </div>
          <div className="included-item">
            <div className="included-item-icon">🤝</div>
            <h4>Ongoing Support</h4>
            <p>We're just a WhatsApp message away when you need help.</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="vgl-section" style={{ maxWidth: 800 }}>
        <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', fontSize: 'var(--text-2xl)' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
              <div style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{faq.q}</span>
                <ChevronDown size={18} style={{ color: 'var(--text-tertiary)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 var(--space-5) var(--space-5) var(--space-5)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="vgl-section" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Not Sure Which Plan?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>Let's discuss your business needs and find the perfect fit.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/#demo-form')} style={{ margin: '0 auto' }}>
          Book Free Consultation <ArrowRight size={18} />
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
