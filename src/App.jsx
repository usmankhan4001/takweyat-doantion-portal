import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import html2canvas from 'html2canvas';

const API_URL = '/api';

function DonationWizard() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState(null);
  const [causes, setCauses] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [receiptFile, setReceiptFile] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(null);

  const countries = [
    { code: '+92', label: 'PK' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'GB' },
    { code: '+971', label: 'AE' },
    { code: '+966', label: 'SA' }
  ];

  useEffect(() => {
    fetch(`${API_URL}/causes`)
      .then(res => res.json())
      .then(data => setCauses(data))
      .catch(console.error);
  }, []);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const nextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1 && !selectedCause) return alert('Please select a cause to continue.');
    if (step === 2) {
      if (!name) return alert('Please enter your full name.');
      if (!amount || amount <= 0) return alert('Please enter a valid donation amount.');
      if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) return alert('Please enter a valid WhatsApp number (minimum 10 digits).');
    }
    if (step === 4 && !receiptFile) return alert('Uploading a receipt screenshot is mandatory to proceed.');
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSelectCause = (id) => {
    setSelectedCause(id);
    setTimeout(() => setStep(2), 300);
  };

  const handleSelectAmount = (val) => setAmount(val);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAcc(id);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setReceiptFile(e.target.files[0]);
  };

  const handleDownloadReceipt = () => {
    const receiptEl = document.getElementById('receipt-container');
    if (!receiptEl) return;
    html2canvas(receiptEl, { scale: 2, backgroundColor: null }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Takweyat_Receipt_${name.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      link.click();
    });
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>

      {showGuidelines && (
        <div className="modal-overlay" onClick={() => setShowGuidelines(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowGuidelines(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Donation Guidelines</h2>
            <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Send Payment Screenshot:</strong> After donating, kindly share a screenshot for confirmation.</li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Mention Purpose:</strong> Specify if it's Sadaqah, Zakat, or General Aid.</li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Donation Type:</strong> For example: school for children of GAZA.</li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Stay Connected</strong></li>
            </ul>
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', textAlign: 'left', color: 'var(--secondary)' }}>✍️ Donor Agreement</h3>
            <p style={{ textAlign: 'left', lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              By donating, I acknowledge and agree that Takweyat has the right to allocate the donated amount where it is most needed for the welfare of people. I trust the organization's discretion and decision-making in utilizing the funds effectively, including organizational needs that ensure long-term, greater impact and smooth operations.
            </p>
            <button onClick={() => setShowGuidelines(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Understood</button>
          </div>
        </div>
      )}

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 10 }}>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '-0.03em' }}>
          <img src="/logo.png" alt="Takweyat Foundation" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
          TAKWEYAT
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={() => setShowGuidelines(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>Guidelines</button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', width: '100%' }}>

        {/* ── STEP 1: Select a Cause ── */}
        {step === 1 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '1100px' }}>
              <h1>Select a Cause</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 500 }}>Select a program to direct your impact.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
                {causes.map(c => (
                  <div
                    key={c.id}
                    className={`premium-tile ${selectedCause === c.id ? 'selected' : ''}`}
                    onClick={() => handleSelectCause(c.id)}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '300px' }}
                  >
                    {c.image && (
                      <div className="premium-tile-bg" style={{ backgroundImage: `url(${c.image})`, position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    )}
                    <div className="premium-tile-overlay" style={{ position: 'absolute', inset: 0, background: c.image ? 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.5) 100%)' : 'transparent' }} />
                    <div className="premium-tile-content" style={{ position: 'relative', zIndex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{c.category}</p>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{c.title}</h3>
                      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem', flex: 1 }}>{c.description}</p>
                      {c.goalAmount && (
                        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase' }}>Goal Amount</p>
                          <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '-0.02em' }}>Rs {Number(c.goalAmount).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Donor Details ── */}
        {step === 2 && (
          <form className="wizard-step fade-in-up" onSubmit={nextStep}>
            <div className="wizard-step-content" style={{ maxWidth: '600px' }}>
              <h1 style={{ marginBottom: '1rem' }}>Donor Details</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '3rem', fontWeight: 500 }}>Please enter your details to continue.</p>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Your Name</label>
                <input type="text" className="apple-input" placeholder="e.g. Ali Khan" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 0 }} autoFocus />
              </div>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Donation Amount (Rs)</label>
                <div className="amount-grid" style={{ marginBottom: '1.5rem' }}>
                  {[1000, 5000, 10000].map(val => (
                    <button key={val} type="button" onClick={() => handleSelectAmount(val)} className={`amount-btn ${Number(amount) === val ? 'selected' : ''}`}>
                      Rs {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input type="number" className="apple-input" placeholder="Custom Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ marginBottom: 0 }} />
              </div>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>WhatsApp Number</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', position: 'relative' }}>
                  <div className="apple-input" onClick={() => setShowCountryDropdown(!showCountryDropdown)} style={{ width: 'auto', textAlign: 'right', marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
                    <span style={{ fontSize: '0.4em', fontWeight: 600, color: 'var(--text-muted)' }}>{countries.find(c => c.code === countryCode)?.label}</span>
                    <span>{countryCode}</span>
                    <span style={{ fontSize: '0.5em', opacity: 0.5 }}>⌄</span>
                  </div>
                  {showCountryDropdown && (
                    <div className="glass-panel fade-in-up" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 50, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '160px', boxShadow: 'var(--shadow-lg)' }}>
                      {countries.map(c => (
                        <div key={c.code} onClick={() => { setCountryCode(c.code); setShowCountryDropdown(false); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '12px', background: countryCode === c.code ? 'rgba(51, 138, 149, 0.1)' : 'transparent', color: countryCode === c.code ? 'var(--primary)' : 'var(--secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, transition: 'var(--transition)', fontSize: '1.25rem' }}>
                          <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{c.label}</span> {c.code}
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="tel" className="apple-input" placeholder="3XX XXXXXXX" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={{ flex: 1, textAlign: 'left', marginBottom: 0, minWidth: '0' }} />
                </div>
              </div>

              <div className="mobile-col" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">Go Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Proceed to Payment</button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP 3: Payment Details (redesigned) ── */}
        {step === 3 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '480px', width: '100%' }}>

              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.25)' }}>
                  ✓ Details Generated
                </span>
              </div>

              <h1 style={{ marginBottom: '0.6rem', fontSize: '1.9rem' }}>Make Your Transfer</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', fontWeight: 500 }}>
                Please use the details below to complete your donation.
              </p>

              {/* Pill tab switcher */}
              <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', width: '100%' }}>
                <button type="button" onClick={() => setPaymentMethod('bank')} style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', background: paymentMethod === 'bank' ? 'white' : 'transparent', color: paymentMethod === 'bank' ? 'var(--secondary)' : 'var(--text-muted)', boxShadow: paymentMethod === 'bank' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none' }}>
                  Bank Transfer
                </button>
                <button type="button" onClick={() => setPaymentMethod('easypaisa')} style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', background: paymentMethod === 'easypaisa' ? 'white' : 'transparent', color: paymentMethod === 'easypaisa' ? 'var(--secondary)' : 'var(--text-muted)', boxShadow: paymentMethod === 'easypaisa' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none' }}>
                  Mobile Wallet
                </button>
              </div>

              {/* Bank Transfer panel */}
              {paymentMethod === 'bank' && (
                <div style={{ width: '100%', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '1rem 1.25rem', background: 'white', borderRadius: '14px', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(51,138,149,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary)', flexShrink: 0 }}>UBL</div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: '0.95rem', marginBottom: '0.1rem' }}>United Bank Limited</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Corporate Branch</p>
                    </div>
                  </div>

                  {/* Account Title */}
                  <div style={{ background: 'white', borderRadius: '14px', padding: '1.1rem 1.25rem', marginBottom: '0.75rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Account Title</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '1rem' }}>Muhammad Sohaib Ali</p>
                      <button type="button" onClick={() => handleCopy('Muhammad Sohaib Ali', 'title')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedAcc === 'title' ? '#059669' : 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0, padding: '0.25rem' }}>
                        {copiedAcc === 'title' ? '✓' : '⧉'}
                      </button>
                    </div>
                  </div>

                  {/* IBAN */}
                  <div style={{ background: 'white', borderRadius: '14px', padding: '1.1rem 1.25rem', marginBottom: '0.75rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>IBAN Number</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.95rem', letterSpacing: '0.03em', wordBreak: 'break-all' }}>PK47 UNIL 0109 0002 5993 5014</p>
                      <button type="button" onClick={() => handleCopy('PK47UNIL0109000259935014', 'iban')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedAcc === 'iban' ? '#059669' : 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0, padding: '0.25rem' }}>
                        {copiedAcc === 'iban' ? '✓' : '⧉'}
                      </button>
                    </div>
                  </div>

                  {/* Account No + Swift (2-col) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '1.1rem 1.25rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Account No.</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.85rem', wordBreak: 'break-all' }}>0022259935014</p>
                        <button type="button" onClick={() => handleCopy('0022259935014', 'accno')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedAcc === 'accno' ? '#059669' : 'var(--text-muted)', fontSize: '1rem', padding: '0.1rem', flexShrink: 0 }}>
                          {copiedAcc === 'accno' ? '✓' : '⧉'}
                        </button>
                      </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '1.1rem 1.25rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Swift Code</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.9rem' }}>UNILPKKA</p>
                        <button type="button" onClick={() => handleCopy('UNILPKKA', 'swift')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedAcc === 'swift' ? '#059669' : 'var(--text-muted)', fontSize: '1rem', padding: '0.1rem', flexShrink: 0 }}>
                          {copiedAcc === 'swift' ? '✓' : '⧉'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info alert */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>ⓘ</span>
                    <p style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.5' }}>
                      Funds transferred? Please send a screenshot of your transaction to our <strong style={{ color: '#059669' }}>WhatsApp</strong> to instantly confirm your donation.
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Wallet panel */}
              {paymentMethod === 'easypaisa' && (
                <div style={{ width: '100%', textAlign: 'left' }}>
                  <div style={{ background: 'white', borderRadius: '14px', padding: '1.1rem 1.25rem', marginBottom: '0.75rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Easypaisa / JazzCash Number</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '1.1rem' }}>+92 314 5217958</p>
                      <button type="button" onClick={() => handleCopy('+923145217958', 'mobile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedAcc === 'mobile' ? '#059669' : 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0, padding: '0.25rem' }}>
                        {copiedAcc === 'mobile' ? '✓' : '⧉'}
                      </button>
                    </div>
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>ⓘ</span>
                    <p style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.5' }}>
                      Send the exact amount of <strong style={{ color: 'var(--secondary)' }}>Rs {Number(amount).toLocaleString()}</strong> and share your transaction screenshot to confirm your donation.
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button type="button" onClick={nextStep} style={{ width: '100%', padding: '1.1rem', background: '#1a3d35', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                <span style={{ fontSize: '1.15rem' }}>💬</span> I have sent the payment
              </button>
              <button type="button" onClick={prevStep} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem', width: '100%', padding: '0.5rem', fontWeight: 500 }}>
                Go Back
              </button>
              <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Secure Payments by Takweyat</p>
            </div>
          </div>
        )}

        {/* ── STEP 4: Upload Receipt ── */}
        {step === 4 && (
          <form className="wizard-step fade-in-up" onSubmit={nextStep}>
            <div className="wizard-step-content" style={{ maxWidth: '600px' }}>
              <h1>Upload Receipt</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', fontWeight: 500 }}>Please attach the transaction screenshot.</p>

              <label className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', border: `2px dashed ${receiptFile ? 'var(--primary)' : 'rgba(0,0,0,0.15)'}`, width: '100%', marginBottom: '3rem', cursor: 'pointer', background: receiptFile ? 'rgba(51, 138, 149, 0.05)' : 'rgba(255,255,255,0.4)', transition: 'transform 0.2s ease, border-color 0.2s ease', display: 'block' }}>
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,.pdf" />
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: receiptFile ? 1 : 0.8 }}>{receiptFile ? '✅' : '📄'}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: receiptFile ? 'var(--primary)' : 'var(--secondary)' }}>
                  {receiptFile ? receiptFile.name : 'Tap to select an image'}
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  {receiptFile ? 'Tap again to replace file' : 'Supports JPG, PNG, PDF'}
                </p>
                <div className="btn btn-secondary" style={{ pointerEvents: 'none', background: receiptFile ? 'white' : '' }}>
                  {receiptFile ? 'File Selected' : 'Choose File'}
                </div>
              </label>

              <div className="mobile-col" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">Go Back</button>
                <button type="submit" className={`btn ${receiptFile ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, opacity: receiptFile ? 1 : 0.5 }}>Submit Proof ✨</button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP 5: Thank You ── */}
        {step === 5 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '600px', textAlign: 'center' }}>
              <h1 style={{ marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>JazakAllah Khair, {name}!</h1>
              <p style={{ color: 'var(--secondary)', fontSize: '1.15rem', fontStyle: 'italic', fontWeight: '500', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                "May Allah accept it and bestow you with the best. Ameen."
              </p>

              <div id="receipt-container" className="glass-panel" style={{ background: 'white', padding: '2rem', margin: '2rem auto', textAlign: 'left', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed rgba(0,0,0,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '-0.03em' }}>TAKWEYAT</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFICIAL RECEIPT</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>Donor Name</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)' }}>{name}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>Cause Supported</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)' }}>{causes.find(c => c.id === selectedCause)?.title || 'General Aid'}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>Phone</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary)' }}>{countryCode} {whatsapp}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.25rem' }}>Amount Donated</p>
                    <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--secondary)' }}>Rs {Number(amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mobile-col" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button type="button" onClick={handleDownloadReceipt} className="btn btn-secondary" style={{ flex: 1 }}>Download Receipt</button>
                <button type="button" onClick={() => window.location.reload()} className="btn btn-primary" style={{ flex: 1 }}>Close &amp; Return</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [causes, setCauses] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchCauses = () => {
    fetch(`${API_URL}/causes`).then(res => res.json()).then(data => setCauses(data));
  };

  useEffect(() => { if (authenticated) fetchCauses(); }, [authenticated]);

  const handleLogin = (e) => { e.preventDefault(); setAuthenticated(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`${API_URL}/causes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) fetchCauses(); else alert('Unauthorized! Wrong password.');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await fetch(`${API_URL}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${password}` }, body: formData });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        imageUrl = url;
      } else {
        alert('Image upload failed. Check your password and try again.');
        setUploading(false);
        return;
      }
    }
    const res = await fetch(`${API_URL}/causes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ title: newTitle, description: newDesc, category: newCategory, goalAmount: newGoal ? Number(newGoal) : undefined, image: imageUrl })
    });
    setUploading(false);
    if (res.ok) { setNewTitle(''); setNewDesc(''); setNewGoal(''); setNewCategory('General'); setImageFile(null); setImagePreview(null); fetchCauses(); }
    else alert('Unauthorized! Wrong password.');
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <form className="glass-panel" style={{ padding: '3.5rem', width: '100%', maxWidth: '420px', background: 'white' }} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '2.5rem', textAlign: 'center', fontSize: '1.8rem' }}>Admin Portal</h2>
          <input type="password" style={{ width: '100%', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1.1rem', marginBottom: '2rem' }} placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login Securely</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Manage Causes</h1>
        <button type="button" onClick={() => setAuthenticated(false)} className="btn btn-secondary">Logout</button>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.7)' }}>
        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Add New Cause</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <input required type="text" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', flex: 1, minWidth: '200px' }} placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <input required type="text" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', flex: 2, minWidth: '300px' }} placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <select style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', flex: 1, minWidth: '140px', background: 'white', cursor: 'pointer' }} value={newCategory} onChange={e => setNewCategory(e.target.value)}>
            <option>General</option><option>Emergency</option><option>Zakat</option><option>Sadaqah</option>
          </select>
          <input type="number" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', flex: 1, minWidth: '160px' }} placeholder="Target Goal (Rs)" value={newGoal} onChange={e => setNewGoal(e.target.value)} />

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.9rem 1.5rem', border: '2px dashed var(--border)', borderRadius: '12px', background: imagePreview ? 'rgba(51,138,149,0.05)' : 'transparent', flex: 1, minWidth: '220px' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '1.5rem' }}>{imagePreview ? '🖼️' : '📷'}</span>
              <span style={{ fontSize: '0.95rem', color: imagePreview ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>{imageFile ? imageFile.name : 'Upload Cause Background Image'}</span>
            </label>
            {imagePreview && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '2px solid var(--primary)' }} />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', width: '100%', marginTop: '0.5rem' }} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Publish Cause'}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ background: 'white', overflow: 'hidden', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', width: '80px' }}>Image</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Title</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Goal Amount</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {causes.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {c.image ? <img src={c.image} alt={c.title} style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} /> : <div style={{ width: '60px', height: '42px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🖼️</div>}
                </td>
                <td style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{c.title}</td>
                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.description}</td>
                <td style={{ padding: '1.5rem', fontWeight: 700 }}>{c.goalAmount ? `Rs ${c.goalAmount.toLocaleString()}` : '-'}</td>
                <td style={{ padding: '1.5rem' }}>
                  <button type="button" onClick={() => handleDelete(c.id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>Delete</button>
                </td>
              </tr>
            ))}
            {causes.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>No causes found. Add one above to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DonationWizard />} />
        <Route path="/admin-donation" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
