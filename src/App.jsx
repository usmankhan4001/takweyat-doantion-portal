import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import html2canvas from 'html2canvas';

const API_URL = '/api';

/* ── Donation Wizard ─────────────────────────────────────────────── */
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
    { code: '+92', label: 'PK 🇵🇰' },
    { code: '+1', label: 'US 🇺🇸' },
    { code: '+44', label: 'GB 🇬🇧' },
    { code: '+971', label: 'AE 🇦🇪' },
    { code: '+966', label: 'SA 🇸🇦' },
  ];

  useEffect(() => {
    fetch(`${API_URL}/causes`)
      .then(r => r.json())
      .then(setCauses)
      .catch(console.error);
  }, []);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const nextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1 && !selectedCause) return alert('Please select a cause to continue.');
    if (step === 2) {
      if (!name.trim()) return alert('Please enter your full name.');
      if (!amount || Number(amount) <= 0) return alert('Please enter a valid donation amount.');
      if (!whatsapp || whatsapp.replace(/\D/g, '').length < 9) return alert('Please enter a valid WhatsApp number.');
    }
    if (step === 4 && !receiptFile) return alert('Please upload your payment screenshot to continue.');
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSelectCause = (id) => {
    setSelectedCause(id);
    setTimeout(() => setStep(2), 250);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAcc(id);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setReceiptFile(e.target.files[0]);
  };

  const handleDownloadReceipt = () => {
    const el = document.getElementById('receipt-container');
    if (!el) return;
    html2canvas(el, { scale: 2, backgroundColor: null }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Takweyat_Receipt_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="wizard-outer">
      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Guidelines bottom-sheet modal */}
      {showGuidelines && (
        <div className="modal-overlay" onClick={() => setShowGuidelines(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-pill" />
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>Donation Guidelines</h2>
            <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--muted)', paddingLeft: '0', listStyle: 'none' }}>
              {[
                ['Send Payment Screenshot:', 'After donating, share a screenshot for instant confirmation.'],
                ['Mention Purpose:', "Specify Sadaqah, Zakat, or General Aid in the WhatsApp message."],
                ['Donation Type:', 'For example: school for children of Gaza.'],
                ['Stay Connected:', 'Follow Takweyat on social media for updates.'],
              ].map(([bold, text]) => (
                <li key={bold} style={{ marginBottom: '0.9rem', paddingLeft: '1.25rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✅</span>
                  <strong style={{ color: 'var(--secondary)' }}>{bold}</strong> {text}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.6', marginTop: '1.25rem', textAlign: 'left', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '10px' }}>
              By donating, I acknowledge that Takweyat has the right to allocate the donated amount where it is most needed for the welfare of people.
            </p>
            <button onClick={() => setShowGuidelines(false)} className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Got it</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="app-header-logo">
          <img src="/logo.png" alt="Takweyat" />
          TAKWEYAT
        </div>
        <button
          type="button"
          onClick={() => setShowGuidelines(true)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', minHeight: '36px', borderRadius: '999px' }}
        >
          Guidelines
        </button>
      </header>

      {/* Main */}
      <main className="wizard-main">

        {/* ── Step 1: Choose a Cause ── */}
        {step === 1 && (
          <div className="wizard-step causes-step fade-in-up">
            <div className="wizard-step-content">
              <h1>Choose a Cause</h1>
              <p className="step-subtitle">Select a program to direct your impact.</p>
              <div className="causes-grid">
                {causes.map(c => (
                  <div
                    key={c.id}
                    className={`premium-tile${selectedCause === c.id ? ' selected' : ''}`}
                    onClick={() => handleSelectCause(c.id)}
                  >
                    {c.image && <div className="premium-tile-bg" style={{ backgroundImage: `url(${c.image})` }} />}
                    <div className="premium-tile-overlay" />
                    <div className="premium-tile-content">
                      <p className="tile-category">{c.category}</p>
                      <p className="tile-title">{c.title}</p>
                      <p className="tile-desc">{c.description}</p>
                      {c.goalAmount && (
                        <div className="tile-goal">
                          <p className="tile-goal-label">Goal Amount</p>
                          <p className="tile-goal-amount">Rs {Number(c.goalAmount).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Donor Details ── */}
        {step === 2 && (
          <form className="wizard-step fade-in-up" onSubmit={nextStep}>
            <div className="wizard-step-content">
              <h1>Your Details</h1>
              <p className="step-subtitle">Tell us a bit about you to continue.</p>

              {/* Name */}
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" placeholder="e.g. Ali Khan" value={name} onChange={e => setName(e.target.value)} autoFocus autoComplete="name" />
              </div>

              {/* Amount */}
              <div className="field-group">
                <label className="field-label">Donation Amount (Rs)</label>
                <div className="amount-grid">
                  {[1000, 5000, 10000].map(val => (
                    <button key={val} type="button" className={`amount-btn${Number(amount) === val ? ' selected' : ''}`} onClick={() => setAmount(val)}>
                      Rs {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input className="field-input" type="number" placeholder="Or enter custom amount" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>

              {/* WhatsApp */}
              <div className="field-group">
                <label className="field-label">WhatsApp Number</label>
                <div className="phone-row" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="phone-country-btn"
                    onClick={() => setShowCountryDropdown(v => !v)}
                  >
                    {countryCode} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>▾</span>
                    {showCountryDropdown && (
                      <div className="country-dropdown">
                        {countries.map(c => (
                          <div key={c.code} className={`country-option${countryCode === c.code ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setCountryCode(c.code); setShowCountryDropdown(false); }}>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.label}</span>
                            <span>{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                  <input className="field-input" type="tel" placeholder="3XX XXXXXXX" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={{ flex: 1 }} autoComplete="tel" />
                </div>
              </div>

              <div className="action-row">
                <button type="button" onClick={prevStep} className="btn btn-secondary">← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Continue →</button>
              </div>
            </div>
          </form>
        )}

        {/* ── Step 3: Payment Details ── */}
        {step === 3 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content">

              <div className="payment-badge">✓ Details Generated</div>
              <h1 style={{ marginBottom: '0.4rem' }}>Make Your Transfer</h1>
              <p className="step-subtitle">Use the details below to complete your donation.</p>

              <div className="payment-tabs">
                <button type="button" className={`payment-tab${paymentMethod === 'bank' ? ' active' : ''}`} onClick={() => setPaymentMethod('bank')}>
                  Bank Transfer
                </button>
                <button type="button" className={`payment-tab${paymentMethod === 'easypaisa' ? ' active' : ''}`} onClick={() => setPaymentMethod('easypaisa')}>
                  Mobile Wallet
                </button>
              </div>

              {paymentMethod === 'bank' && (
                <div style={{ width: '100%', textAlign: 'left' }}>
                  <div className="bank-header">
                    <div className="bank-logo">UBL</div>
                    <div>
                      <p className="bank-name">United Bank Limited</p>
                      <p className="bank-branch">Corporate Branch</p>
                    </div>
                  </div>

                  <div className="info-field">
                    <div>
                      <p className="info-field-label">Account Title</p>
                      <p className="info-field-value">Muhammad Sohaib Ali</p>
                    </div>
                    <button type="button" className={`info-field-copy${copiedAcc === 'title' ? ' copied' : ''}`} onClick={() => handleCopy('Muhammad Sohaib Ali', 'title')}>
                      {copiedAcc === 'title' ? '✓' : '⧉'}
                    </button>
                  </div>

                  <div className="info-field">
                    <div style={{ flex: 1 }}>
                      <p className="info-field-label">IBAN Number</p>
                      <p className="info-field-value" style={{ wordBreak: 'break-all', fontSize: '0.88rem', letterSpacing: '0.02em' }}>PK47 UNIL 0109 0002 5993 5014</p>
                    </div>
                    <button type="button" className={`info-field-copy${copiedAcc === 'iban' ? ' copied' : ''}`} onClick={() => handleCopy('PK47UNIL0109000259935014', 'iban')}>
                      {copiedAcc === 'iban' ? '✓' : '⧉'}
                    </button>
                  </div>

                  <div className="info-fields-2col">
                    <div className="info-field">
                      <p className="info-field-label">Account No.</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <p className="info-field-value" style={{ fontSize: '0.82rem' }}>0022259935014</p>
                        <button type="button" className={`info-field-copy${copiedAcc === 'accno' ? ' copied' : ''}`} onClick={() => handleCopy('0022259935014', 'accno')}>
                          {copiedAcc === 'accno' ? '✓' : '⧉'}
                        </button>
                      </div>
                    </div>
                    <div className="info-field">
                      <p className="info-field-label">Swift Code</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <p className="info-field-value">UNILPKKA</p>
                        <button type="button" className={`info-field-copy${copiedAcc === 'swift' ? ' copied' : ''}`} onClick={() => handleCopy('UNILPKKA', 'swift')}>
                          {copiedAcc === 'swift' ? '✓' : '⧉'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="info-alert">
                    <span className="info-alert-icon">ⓘ</span>
                    <p className="info-alert-text">Funds transferred? Send a screenshot to our <strong style={{ color: '#059669' }}>WhatsApp</strong> to instantly confirm your donation.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'easypaisa' && (
                <div style={{ width: '100%', textAlign: 'left' }}>
                  <div className="info-field">
                    <div>
                      <p className="info-field-label">Easypaisa / JazzCash</p>
                      <p className="info-field-value" style={{ fontSize: '1.1rem' }}>+92 314 5217958</p>
                    </div>
                    <button type="button" className={`info-field-copy${copiedAcc === 'mobile' ? ' copied' : ''}`} onClick={() => handleCopy('+923145217958', 'mobile')}>
                      {copiedAcc === 'mobile' ? '✓' : '⧉'}
                    </button>
                  </div>
                  <div className="info-alert">
                    <span className="info-alert-icon">ⓘ</span>
                    <p className="info-alert-text">Send exactly <strong style={{ color: 'var(--secondary)' }}>Rs {Number(amount).toLocaleString()}</strong> and share the screenshot to confirm your donation.</p>
                  </div>
                </div>
              )}

              <button type="button" onClick={nextStep} className="btn-cta">
                <span>💬</span> I have sent the payment
              </button>

              <button type="button" onClick={prevStep} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem', width: '100%', marginTop: '0.25rem' }}>
                Go Back
              </button>

              <p className="payment-footer">Secure Payments by Takweyat</p>
            </div>
          </div>
        )}

        {/* ── Step 4: Upload Receipt ── */}
        {step === 4 && (
          <form className="wizard-step fade-in-up" onSubmit={nextStep}>
            <div className="wizard-step-content">
              <h1>Upload Receipt</h1>
              <p className="step-subtitle">Attach your payment screenshot to continue.</p>

              <label className={`upload-zone${receiptFile ? ' has-file' : ''}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <span className="upload-icon">{receiptFile ? '✅' : '📸'}</span>
                <p className="upload-title">{receiptFile ? receiptFile.name : 'Tap to upload screenshot'}</p>
                <p className="upload-subtitle">{receiptFile ? 'Tap to replace' : 'JPG, PNG supported'}</p>
              </label>

              <div className="action-row">
                <button type="button" onClick={prevStep} className="btn btn-secondary">← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, opacity: receiptFile ? 1 : 0.45 }}>
                  Submit ✨
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── Step 5: Thank You ── */}
        {step === 5 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤲</div>
              <h1 style={{ marginBottom: '0.5rem' }}>JazakAllah Khair!</h1>
              <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                "May Allah accept it and bestow you with the best. Ameen."
              </p>

              <div id="receipt-container" className="receipt-card">
                <div className="receipt-header">
                  <span className="receipt-brand">TAKWEYAT</span>
                  <span className="receipt-label-tag">OFFICIAL RECEIPT</span>
                </div>
                <div className="receipt-row">
                  <p className="receipt-row-label">Donor Name</p>
                  <p className="receipt-row-value">{name}</p>
                </div>
                <div className="receipt-row">
                  <p className="receipt-row-label">Cause Supported</p>
                  <p className="receipt-row-value">{causes.find(c => c.id === selectedCause)?.title || 'General Aid'}</p>
                </div>
                <div className="receipt-footer-row">
                  <div>
                    <p className="receipt-row-label">WhatsApp</p>
                    <p className="receipt-row-value" style={{ fontSize: '0.88rem' }}>{countryCode} {whatsapp}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="receipt-amount-label" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>Amount Donated</p>
                    <p className="receipt-amount">Rs {Number(amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="action-row">
                <button type="button" onClick={handleDownloadReceipt} className="btn btn-secondary" style={{ flex: 1 }}>
                  ⬇ Download
                </button>
                <button type="button" onClick={() => window.location.reload()} className="btn btn-primary" style={{ flex: 1 }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* ── Admin Dashboard ─────────────────────────────────────────────── */
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

  const fetchCauses = () => fetch(`${API_URL}/causes`).then(r => r.json()).then(setCauses);
  useEffect(() => { if (authenticated) fetchCauses(); }, [authenticated]);

  const handleLogin = (e) => { e.preventDefault(); setAuthenticated(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cause?')) return;
    const res = await fetch(`${API_URL}/causes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) fetchCauses(); else alert('Unauthorized.');
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
      const fd = new FormData();
      fd.append('image', imageFile);
      const r = await fetch(`${API_URL}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${password}` }, body: fd });
      if (r.ok) { const { url } = await r.json(); imageUrl = url; }
      else { alert('Image upload failed.'); setUploading(false); return; }
    }
    const res = await fetch(`${API_URL}/causes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ title: newTitle, description: newDesc, category: newCategory, goalAmount: newGoal ? Number(newGoal) : undefined, image: imageUrl })
    });
    setUploading(false);
    if (res.ok) { setNewTitle(''); setNewDesc(''); setNewGoal(''); setNewCategory('General'); setImageFile(null); setImagePreview(null); fetchCauses(); }
    else alert('Unauthorized.');
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem' }}>
        <form style={{ background: 'white', borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)' }} onSubmit={handleLogin}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem', marginBottom: '2rem', color: 'var(--secondary)' }}>
            <img src="/logo.png" alt="" style={{ width: 32, height: 32 }} /> TAKWEYAT Admin
          </div>
          <input type="password" className="field-input" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1rem' }} />
          <button type="submit" className="btn btn-primary btn-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Manage Causes</h1>
        <button type="button" onClick={() => setAuthenticated(false)} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', minHeight: '40px' }}>Logout</button>
      </div>

      {/* Add Cause form */}
      <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Add New Cause</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input required type="text" className="field-input" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 2, minWidth: '180px' }} />
            <select className="field-input" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ flex: 1, minWidth: '130px' }}>
              <option>General</option><option>Emergency</option><option>Zakat</option><option>Sadaqah</option>
            </select>
          </div>
          <input required type="text" className="field-input" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <input type="number" className="field-input" placeholder="Goal Amount (Rs)" value={newGoal} onChange={e => setNewGoal(e.target.value)} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.75rem 1rem', border: '2px dashed var(--border)', borderRadius: 'var(--r-sm)', flex: 1, minWidth: '200px', background: imagePreview ? 'rgba(51,138,149,0.04)' : 'transparent' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '1.25rem' }}>{imagePreview ? '🖼️' : '📷'}</span>
              <span style={{ fontSize: '0.88rem', color: imagePreview ? 'var(--primary)' : 'var(--muted)', fontWeight: 600 }}>{imageFile ? imageFile.name : 'Upload Background Image'}</span>
            </label>
            {imagePreview && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={imagePreview} alt="" style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary)', display: 'block' }} />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={uploading} style={{ marginTop: '0.25rem' }}>
            {uploading ? 'Uploading…' : 'Publish Cause'}
          </button>
        </form>
      </div>

      {/* Causes table — scrollable on mobile */}
      <div style={{ background: 'white', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              {['Img', 'Title', 'Description', 'Goal', ''].map(h => (
                <th key={h} style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {causes.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {c.image
                    ? <img src={c.image} alt="" style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
                    : <div style={{ width: '50px', height: '36px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼️</div>}
                </td>
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--secondary)', fontSize: '0.9rem' }}>{c.title}</td>
                <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5, maxWidth: '260px' }}>{c.description}</td>
                <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{c.goalAmount ? `Rs ${c.goalAmount.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem' }}>
                  <button type="button" onClick={() => handleDelete(c.id)} style={{ padding: '0.4rem 0.85rem', background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Delete</button>
                </td>
              </tr>
            ))}
            {causes.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.95rem' }}>No causes yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── App routes ─────────────────────────────────────────────────── */
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
