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

  const countries = [
    { code: '+92', label: 'PK' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'GB' },
    { code: '+971', label: 'AE' },
    { code: '+966', label: 'SA' }
  ];

  const [showGuidelines, setShowGuidelines] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(null);

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
    if (step === 1 && !selectedCause) return alert("Please select a cause to continue.");
    if (step === 2) {
      if (!name) return alert("Please enter your full name.");
      if (!amount || amount <= 0) return alert("Please enter a valid donation amount.");
      if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) return alert("Please enter a valid WhatsApp number (minimum 10 digits).");
    }
    if (step === 4 && !receiptFile) return alert("Uploading a receipt screenshot is mandatory to proceed.");

    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSelectCause = (id) => {
    setSelectedCause(id);
    setTimeout(() => setStep(2), 300);
  };

  const handleSelectAmount = (val) => {
    setAmount(val);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAcc(id);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
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
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Mention Purpose:</strong> Specify if it’s Sadaqah, Zakat, or General Aid.</li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Donation Type:</strong> For example: school for children of GAZA.</li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong style={{ color: 'var(--secondary)' }}>Stay Connected</strong></li>
            </ul>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', textAlign: 'left', color: 'var(--secondary)' }}>✍️ Donor Agreement</h3>
            <p style={{ textAlign: 'left', lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              By donating, I acknowledge and agree that Takweyat has the right to allocate the donated amount where it is most needed for the welfare of people. I trust the organization’s discretion and decision-making in utilizing the funds effectively, including organizational needs that ensure long-term, greater impact and smooth operations.
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
          <div style={{ width: '28px', height: '28px', background: 'var(--secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>T</div>
          TAKWEYAT
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={() => setShowGuidelines(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>Guidelines</button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem' }}>

        {step === 1 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '1000px' }}>
              <h1>Select a Cause</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 500 }}>Select a program to direct your impact.</p>

              <div className="swipe-container" style={{ width: '100%', marginBottom: '3rem' }}>
                {causes.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCause(c.id)}
                    className={`premium-tile swipe-card ${selectedCause === c.id ? 'selected' : ''}`}
                  >
                    {c.image && <div className="premium-tile-bg" style={{ backgroundImage: `url(${c.image})` }} />}
                    {c.image && <div className="premium-tile-overlay" />}
                    <div className="premium-tile-content">
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{c.category}</span>
                      <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0', color: 'var(--secondary)', lineHeight: 1.2 }}>{c.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', flex: 1, lineHeight: 1.5 }}>{c.description}</p>

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

        {step === 2 && (
          <form className="wizard-step fade-in-up" onSubmit={nextStep}>
            <div className="wizard-step-content" style={{ maxWidth: '600px' }}>
              <h1 style={{ marginBottom: '1rem' }}>Donor Details</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '3rem', fontWeight: 500 }}>Please enter your details to continue.</p>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Your Name</label>
                <input
                  type="text"
                  className="apple-input"
                  placeholder="e.g. Ali Khan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ marginBottom: 0 }}
                  autoFocus
                />
              </div>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Donation Amount (Rs)</label>
                <div className="amount-grid" style={{ marginBottom: '1.5rem' }}>
                  {[1000, 5000, 10000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectAmount(val)}
                      className={`amount-btn ${Number(amount) === val ? 'selected' : ''}`}
                    >
                      Rs {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="apple-input"
                  placeholder="Custom Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ textAlign: 'left', width: '100%', marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>WhatsApp Number</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', position: 'relative' }}>
                  <div
                    className="apple-input"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    style={{ width: 'auto', textAlign: 'right', marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}
                  >
                    <span style={{ fontSize: '0.4em', fontWeight: 600, color: 'var(--text-muted)' }}>{countries.find(c => c.code === countryCode)?.label}</span>
                    <span>{countryCode}</span>
                    <span style={{ fontSize: '0.5em', opacity: 0.5 }}>⌄</span>
                  </div>

                  {showCountryDropdown && (
                    <div className="glass-panel fade-in-up" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 50, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '160px', boxShadow: 'var(--shadow-lg)' }}>
                      {countries.map(c => (
                        <div
                          key={c.code}
                          onClick={() => { setCountryCode(c.code); setShowCountryDropdown(false); }}
                          style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '12px', background: countryCode === c.code ? 'rgba(51, 138, 149, 0.1)' : 'transparent', color: countryCode === c.code ? 'var(--primary)' : 'var(--secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, transition: 'var(--transition)', fontSize: '1.25rem' }}
                        >
                          <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{c.label}</span> {c.code}
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="tel"
                    className="apple-input"
                    placeholder="3XX XXXXXXX"
                    value={whatsapp}
                    onChange={e => {
                      const val = e.target.value;
                      setWhatsapp(val);
                    }}
                    style={{ flex: 1, textAlign: 'left', marginBottom: 0, minWidth: '0' }}
                  />
                </div>
              </div>

              <div className="mobile-col" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">Go Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Proceed to Payment</button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '700px' }}>
              <h1>Payment Instructions</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 500 }}>
                Please transfer exactly <strong style={{ color: 'var(--secondary)', fontWeight: 800 }}>Rs {Number(amount).toLocaleString()}</strong>
              </p>

              <div className="glass-panel" style={{ padding: '0', marginBottom: '3rem', overflow: 'hidden', width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.4)' }}>
                  <button type="button" onClick={() => setPaymentMethod('bank')} className={`payment-tab-btn ${paymentMethod === 'bank' ? 'active-bank' : ''}`} style={{ flex: 1 }}>Bank Transfer (UBL)</button>
                  <button type="button" onClick={() => setPaymentMethod('easypaisa')} className={`payment-tab-btn ${paymentMethod === 'easypaisa' ? 'active-easypaisa' : ''}`} style={{ flex: 1 }}>Easypaisa / JazzCash</button>
                </div>

                <div className="glass-panel-content">
                  {paymentMethod === 'bank' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Account Title</p>
                          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>Muhammad Sohaib Ali</p>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Swift Code</p>
                          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>UNILPKKA</p>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Account Number</p>
                        <div className="copy-row">
                          <p className="iban-text">0022259935014</p>
                          <button type="button" className="copy-btn" onClick={() => handleCopy('0022259935014', 'bank-acc')}>
                            {copiedAcc === 'bank-acc' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>IBAN</p>
                        <div className="copy-row">
                          <p className="iban-text" style={{ fontSize: '1.1rem' }}>PK47UNIL0109000259935014</p>
                          <button type="button" className="copy-btn" onClick={() => handleCopy('PK47UNIL0109000259935014', 'bank-iban')}>
                            {copiedAcc === 'bank-iban' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {paymentMethod === 'easypaisa' && (
                    <>
                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <p style={{ fontSize: '0.85rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Mobile Number (Easypaisa / JazzCash)</p>
                        <div className="copy-row" style={{ marginTop: '0.5rem' }}>
                          <p className="iban-text">+92 314 5217958</p>
                          <button type="button" className="copy-btn" onClick={() => handleCopy('+92 314 5217958', 'easypaisa')}>
                            {copiedAcc === 'easypaisa' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mobile-col" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">Go Back</button>
                <button type="button" onClick={nextStep} className="btn btn-primary" style={{ flex: 1 }}>I've completed the transfer</button>
              </div>
            </div>
          </div>
        )}

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

        {step === 5 && (
          <div className="wizard-step fade-in-up">
            <div className="wizard-step-content" style={{ maxWidth: '600px', textAlign: 'center' }}>
              <h1 style={{ marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>JazakAllah Khair, {name}!</h1>
              <p style={{ color: 'var(--secondary)', fontSize: '1.15rem', fontStyle: 'italic', fontWeight: '500', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                "May Allah accept it and bestows you with the best alternative as He please. Ameen.."
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
                <button type="button" onClick={handleDownloadReceipt} className="btn btn-secondary" style={{ flex: 1 }}>
                  Download Receipt
                </button>
                <button type="button" onClick={() => window.location.reload()} className="btn btn-primary" style={{ flex: 1 }}>
                  Close & Return
                </button>
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
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`${API_URL}/causes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${password}` } });
    if (res.ok) fetchCauses(); else alert("Unauthorized! Wrong password.");
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

    // Upload image first if one was selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${password}` },
        body: formData
      });
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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${password}` },
      body: JSON.stringify({ title: newTitle, description: newDesc, category: newCategory, goalAmount: newGoal ? Number(newGoal) : undefined, image: imageUrl })
    });
    setUploading(false);
    if (res.ok) {
      setNewTitle(''); setNewDesc(''); setNewGoal(''); setNewCategory('General');
      setImageFile(null); setImagePreview(null);
      fetchCauses();
    } else alert("Unauthorized! Wrong password.");
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
            <option>General</option>
            <option>Emergency</option>
            <option>Zakat</option>
            <option>Sadaqah</option>
          </select>
          <input type="number" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '1rem', flex: 1, minWidth: '160px' }} placeholder="Target Goal (Rs)" value={newGoal} onChange={e => setNewGoal(e.target.value)} />

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.9rem 1.5rem', border: '2px dashed var(--border)', borderRadius: '12px', background: imagePreview ? 'rgba(51,138,149,0.05)' : 'transparent', flex: 1, minWidth: '220px' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '1.5rem' }}>{imagePreview ? '🖼️' : '📷'}</span>
              <span style={{ fontSize: '0.95rem', color: imagePreview ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                {imageFile ? imageFile.name : 'Upload Cause Background Image'}
              </span>
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
                  {c.image
                    ? <img src={c.image} alt={c.title} style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
                    : <div style={{ width: '60px', height: '42px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🖼️</div>
                  }
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
              <tr>
                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>No causes found. Add one above to get started.</td>
              </tr>
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
