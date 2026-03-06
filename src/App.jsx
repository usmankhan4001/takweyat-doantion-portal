import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Guidelines from './components/Guidelines';
import { Check, Copy, Info, X, Camera, ImageIcon, Download, Sparkles, ChevronDown, FileText, Heart } from 'lucide-react';

const API_URL = '/api';

/* ── Custom UI Components ────────────────────────────────────────── */
const CopyField = ({ label, value, rawValue, onCopy, copiedAcc }) => (
  <div className="copyable-field" onClick={() => onCopy(rawValue, rawValue)}>
    <div>
      <p className="copy-label">{label}</p>
      <p className="copy-value">{value}</p>
    </div>
    <div className={`copy-icon${copiedAcc === rawValue ? ' copied' : ''}`}>
      {copiedAcc === rawValue ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
    </div>
  </div>
);

/* ── 2-Step Frictionless Donation Wizard ─────────────────────────── */
function DonationWizard() {
  const [step, setStep] = useState(1);

  // Form State
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCause, setSelectedCause] = useState('general'); // default
  const [showCauseDetails, setShowCauseDetails] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  // Data State
  const [causes, setCauses] = useState([]);

  // Payment & Upload State
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [receiptFile, setReceiptFile] = useState(null);
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
      .then(data => {
        setCauses(data);
        if (data.length > 0) setSelectedCause(data[0].id);
      })
      .catch(console.error);
  }, []);

  const totalSteps = 2; // Real functional steps (Success is considered step 3)
  const progress = Math.min((step / totalSteps) * 100, 100);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (!amount || Number(amount) <= 0) return alert('Please enter a valid donation amount.');
      if (!name.trim()) return alert('Please enter your full name.');
      if (!whatsapp || whatsapp.replace(/\D/g, '').length < 9) return alert('Please enter a valid WhatsApp number.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (step === 2) {
      if (!receiptFile) return alert('Please upload your payment screenshot to complete the donation.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
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
    document.fonts.ready.then(() => {
      html2canvas(el, { scale: 3, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Takweyat_Receipt_${name.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  return (
    <div className="wizard-outer">
      {/* Progress Bar */}
      {step < 3 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="app-header-logo">
          <img src="/logo_new.png" alt="Takweyat" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {step < 3 && (
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              STEP {step} OF 2
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowGuidelinesModal(true)}
            className="info-btn"
            title="Donation Guidelines"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="wizard-main">
        {step === 1 && (
          <form className="wizard-step fade-in-up" onSubmit={handleNext}>
            <div className="wizard-step-content">
              <h1>Make a Donation</h1>
              <p className="step-subtitle">Quick, secure, and impactful.</p>

              {/* 1. AMOUNT SELECTION */}
              <div className="form-section-title">
                <span className="step-number">1</span> Choose Amount
              </div>
              <div className="field-group">
                <div className="amount-grid">
                  {[1000, 5000, 10000].map(val => (
                    <button key={val} type="button" className={`amount-btn${Number(amount) === val ? ' selected' : ''}`} onClick={() => setAmount(val.toString())}>
                      Rs {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input className="field-input" type="number" placeholder="Or enter custom amount" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>

              {/* 2. CHOOSE A CAUSE (Horizontal Scroll) */}
              <div className="form-section-title" style={{ marginTop: '1.5rem' }}>
                <span className="step-number">2</span> Select Cause
              </div>
              <div className="causes-scroll-wrapper">
                <div className="causes-scroll-container">
                  {causes.length > 0 ? causes.map(c => (
                    <div
                      key={c.id}
                      className={`cause-card${selectedCause === c.id ? ' selected' : ''}`}
                      onClick={() => {
                        setSelectedCause(c.id);
                        setShowCauseDetails(true);
                      }}
                    >
                      {c.image && <div className="cause-card-bg" style={{ backgroundImage: `url(${c.image})` }} />}
                      <div className="cause-card-overlay" />
                      <div className="cause-card-content">
                        <p className="cause-category">{c.category}</p>
                        <p className="cause-title">{c.title}</p>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--muted)', background: 'white', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                      Loading Causes...
                    </div>
                  )}
                </div>
              </div>

              {/* Cause Details Panel */}
              {showCauseDetails && causes.length > 0 && selectedCause && (() => {
                const causeObj = causes.find(c => c.id === selectedCause) || causes[0];
                return (
                  <div className="cause-details-collapse fade-in-up">
                    <button type="button" className="close-details-btn" onClick={() => setShowCauseDetails(false)}>
                      <X size={16} />
                    </button>
                    <div className="cause-details-content">
                      <h4 className="cause-details-title">{causeObj.title}</h4>
                      <p className="cause-details-desc">{causeObj.description}</p>
                      {causeObj.goalAmount && (
                        <div className="cause-details-goal">
                          <span className="goal-label">Funds Needed</span>
                          <span className="goal-amount">Rs {causeObj.goalAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 3. YOUR DETAILS */}
              <div className="form-section-title">
                <span className="step-number">3</span> Your Details
              </div>
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" placeholder="e.g. Ali Khan" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="field-group">
                <label className="field-label">WhatsApp Number</label>
                <div className="phone-row" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="phone-country-btn"
                    onClick={() => setShowCountryDropdown(v => !v)}
                  >
                    {countryCode} <ChevronDown size={12} style={{ opacity: 0.5 }} />
                    {showCountryDropdown && (
                      <div className="country-dropdown">
                        {countries.map(c => (
                          <div key={c.code} className="country-option" onClick={e => { e.stopPropagation(); setCountryCode(c.code); setShowCountryDropdown(false); }}>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.label}</span>
                            <span>{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                  <input className="field-input" type="tel" placeholder="3XX XXXXXXX" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={{ flex: 1 }} required autoComplete="tel" />
                </div>
              </div>

            </div>
          </form>
        )}

        {step === 2 && (
          <form className="wizard-step fade-in-up" onSubmit={handleNext}>
            <div className="wizard-step-content" style={{ width: '100%' }}>
              <h1>Pay & Confirm</h1>
              <p className="step-subtitle">Transfer funds and attach proof.</p>

              {/* Segmented Control */}
              <div className="segmented-control">
                <div className="segment-indicator" style={{ width: '50%', transform: paymentMethod === 'bank' ? 'translateX(0)' : 'translateX(100%)' }} />
                <button type="button" className={`segment-btn ${paymentMethod === 'bank' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank')}>
                  Bank Transfer
                </button>
                <button type="button" className={`segment-btn ${paymentMethod === 'easypaisa' ? 'active' : ''}`} onClick={() => setPaymentMethod('easypaisa')}>
                  Mobile Wallet
                </button>
              </div>

              {/* Account Details Panel */}
              {paymentMethod === 'bank' && (
                <div className="payment-card fade-in-up">
                  <div className="bank-header">
                    <div className="bank-logo">UBL</div>
                    <div>
                      <p className="bank-name">United Bank Limited</p>
                      <p className="info-field-label" style={{ marginBottom: 0 }}>Corporate Branch</p>
                    </div>
                  </div>
                  <CopyField label="Account Title" value="Muhammad Sohaib Ali" rawValue="Muhammad Sohaib Ali" onCopy={handleCopy} copiedAcc={copiedAcc} />
                  <CopyField label="IBAN Number" value="PK47 UNIL 0109 0002 5993 5014" rawValue="PK47UNIL0109000259935014" onCopy={handleCopy} copiedAcc={copiedAcc} />
                  <CopyField label="Account No." value="0022259935014" rawValue="0022259935014" onCopy={handleCopy} copiedAcc={copiedAcc} />
                  <div className="info-alert" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    <span className="info-alert-icon">💡</span>
                    <p className="info-alert-text">After transfer, take a screenshot of the successful transaction.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'easypaisa' && (
                <div className="payment-card fade-in-up">
                  <div className="bank-header">
                    <div className="bank-logo" style={{ background: '#059669' }}>EP</div>
                    <div>
                      <p className="bank-name">Easypaisa / JazzCash</p>
                      <p className="info-field-label" style={{ marginBottom: 0 }}>Mobile Account</p>
                    </div>
                  </div>
                  <CopyField label="Mobile Number" value="+92 314 5217958" rawValue="+923145217958" onCopy={handleCopy} copiedAcc={copiedAcc} />
                  <div className="info-alert" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    <span className="info-alert-icon">💡</span>
                    <p className="info-alert-text">Transfer exactly <strong>Rs {Number(amount).toLocaleString()}</strong> then attach screenshot below.</p>
                  </div>
                </div>
              )}

              {/* Upload Zone */}
              <div className="form-section-title" style={{ marginTop: '1rem' }}>
                <span className="step-number">4</span> Attach Screenshot
              </div>
              <label className={`upload-zone${receiptFile ? ' has-file' : ''}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <span className="upload-icon">
                  {receiptFile ? <Check size={40} strokeWidth={2.5} color="var(--success)" /> : <Camera size={40} strokeWidth={1.5} color="var(--muted)" />}
                </span>
                <p className="upload-title">{receiptFile ? receiptFile.name : 'Tap to upload screenshot'}</p>
                <p className="upload-subtitle">{receiptFile ? 'Tap to change image' : 'Supports JPG, PNG'}</p>
              </label>

            </div>
          </form>
        )}

        {step === 3 && (
          <div className="wizard-step fade-in-up" style={{ textAlign: 'center', alignItems: 'center' }}>
            <span className="success-icon"><Heart size={48} strokeWidth={1.5} color="var(--primary)" fill="rgba(5,150,105,0.15)" /></span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>JazakAllah Khair!</h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '1rem' }}>
              "May Allah accept it and bestow you with the best. Ameen."
            </p>

            <div id="receipt-container" className="receipt-card">
              <div className="receipt-header">
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: '0.1rem' }}>TAKWEYAT</div>
                  <div className="receipt-label-tag">Donation Receipt</div>
                </div>
                {/* Visual Stamp */}
                <img src="/stamp.png" alt="Official Stamp" style={{ width: '64px', height: '64px', objectFit: 'contain', zIndex: 10, position: 'relative' }} />
              </div>

              <div className="receipt-row">
                <p className="receipt-row-label">Donor Name</p>
                <p className="receipt-row-value">{name}</p>
              </div>
              <div className="receipt-row">
                <p className="receipt-row-label">Cause Supported</p>
                <p className="receipt-row-value">{causes.find(c => c.id === selectedCause)?.title || 'General Aid'}</p>
              </div>
              <div className="receipt-row" style={{ marginBottom: 0 }}>
                <p className="receipt-row-label">WhatsApp Number</p>
                <p className="receipt-row-value" style={{ fontSize: '0.95rem' }}>{countryCode} {whatsapp}</p>
              </div>

              <div className="receipt-amount-block">
                <span className="receipt-amount-label">Amount<br />Donated</span>
                <span className="receipt-amount">Rs {Number(amount).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
              <button type="button" onClick={handleDownloadReceipt} className="btn btn-secondary" style={{ flex: 1 }}>
                <Download size={18} /> Save
              </button>
              <button type="button" onClick={() => window.location.reload()} className="btn btn-primary" style={{ flex: 2 }}>
                Done
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Actions */}
      {step < 3 && (
        <div className="sticky-action-bar">
          <div className="wizard-step" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '1rem', flexDirection: 'row' }}>
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              disabled={step === 2 && !receiptFile}
              style={{ flex: 1 }}
            >
              {step === 1 ? 'Continue' : <><Sparkles size={18} /> Submit Donation</>}
            </button>
          </div>
        </div>
      )}

      {/* Guidelines Modal Overlay */}
      {showGuidelinesModal && (
        <div className="modal-overlay" onClick={() => setShowGuidelinesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowGuidelinesModal(false)}><X size={18} /></button>
            <Guidelines />
          </div>
        </div>
      )}
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
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchCauses = () => fetch(`${API_URL}/causes`).then(r => r.json()).then(setCauses);
  useEffect(() => { if (authenticated) fetchCauses(); }, [authenticated]);

  const handleLogin = (e) => { e.preventDefault(); setAuthenticated(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cause?')) return;
    const res = await fetch(`${API_URL}/causes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) fetchCauses(); else alert('Unauthorized.');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setUploading(true);
    const res = await fetch(`${API_URL}/causes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ title: newTitle, description: newDesc, category: newCategory, goalAmount: newGoal ? Number(newGoal) : undefined, image: imageUrl })
    });
    setUploading(false);
    if (res.ok) { setNewTitle(''); setNewDesc(''); setNewGoal(''); setNewCategory('General'); setImageUrl(''); fetchCauses(); }
    else alert('Unauthorized.');
  };

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const text = target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      let successCount = 0;
      for (let i = 1; i < lines.length; i++) {
        let cols = [];
        let cur = '';
        let inQuotes = false;
        for (let c of lines[i]) {
          if (c === '"') inQuotes = !inQuotes;
          else if (c === ',' && !inQuotes) { cols.push(cur.trim()); cur = ''; }
          else cur += c;
        }
        cols.push(cur.trim());
        const [title, description, category, goalAmountStr, image] = cols;
        if (!title) continue;
        const goalAmount = goalAmountStr ? Number(goalAmountStr) : undefined;
        const res = await fetch(`${API_URL}/causes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
          body: JSON.stringify({ title, description, category: category || 'General', goalAmount, image })
        });
        if (res.ok) successCount++;
      }
      setUploading(false);
      alert(`Imported ${successCount} causes successfully.`);
      fetchCauses();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem' }}>
        <form style={{ background: 'white', borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)' }} onSubmit={handleLogin}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--secondary)' }}>
            <img src="/logo_new.png" alt="" style={{ height: '36px', width: 'auto' }} /> Admin
          </div>
          <input type="password" className="field-input" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1.5rem', width: '100%' }} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Manage Causes</h1>
        <button type="button" onClick={() => setAuthenticated(false)} className="btn btn-secondary">Logout</button>
      </div>

      {/* Add Cause form */}
      <div style={{ background: 'white', borderRadius: 'var(--r-lg)', padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Cause</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input required type="text" className="field-input" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 2, minWidth: '200px' }} />
            <select className="field-input" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ flex: 1, minWidth: '150px' }}>
              <option>General</option><option>Emergency</option><option>Zakat</option><option>Sadaqah</option>
            </select>
          </div>
          <input required type="text" className="field-input" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <input type="number" className="field-input" placeholder="Goal Amount (Rs)" value={newGoal} onChange={e => setNewGoal(e.target.value)} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <input type="url" className="field-input" placeholder="Image URL (e.g. https://example.com/img.jpg)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} onLoad={(e) => { e.target.style.display = 'block'; }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%' }}>
            <button type="submit" className="btn btn-primary" disabled={uploading} style={{ flex: 2 }}>
              {uploading ? 'Processing…' : <><Sparkles size={16} /> Publish Cause</>}
            </button>
            <label className="btn btn-secondary" style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}>
              <input type="file" accept=".csv" onChange={handleCsvImport} style={{ display: 'none' }} disabled={uploading} />
              {uploading ? 'Importing…' : <><FileText size={16} /> Import CSV</>}
            </label>
            <a href="/causes_example.csv" target="_blank" download className="btn btn-secondary" style={{ padding: '0 1rem', flex: 0, title: 'Download Template', minWidth: '60px' }}>
              <Download size={18} />
            </a>
          </div>
        </form>
      </div>

      {/* Causes table */}
      <div style={{ background: 'white', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
              {['Img', 'Title', 'Description', 'Goal', ''].map(h => (
                <th key={h} style={{ padding: '1.25rem 1rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {causes.map(c => (
              <tr key={c.id}>
                <td style={{ padding: '1rem' }}>
                  {c.image
                    ? <img src={c.image} alt="" style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '8px', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                    : <div style={{ width: '64px', height: '48px', background: 'var(--bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><ImageIcon size={24} color="var(--muted)" /></div>}
                </td>
                <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--secondary)', fontSize: '1.05rem' }}>{c.title}</td>
                <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '260px' }}>{c.description}</td>
                <td style={{ padding: '1rem', fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap' }}>{c.goalAmount ? `Rs ${c.goalAmount.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button type="button" onClick={() => handleDelete(c.id)} style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>Delete</button>
                </td>
              </tr>
            ))}
            {causes.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '1.05rem', fontWeight: 500 }}>No causes yet. Add one above.</td></tr>
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
