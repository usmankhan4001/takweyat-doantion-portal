import React, { useState } from 'react';
import QRCodes from './QRCodes';

const presetAmounts = [1000, 5000, 10000, 50000];

const DonationForm = () => {
        const [step, setStep] = useState(1);
        const [amount, setAmount] = useState('');
        const [details, setDetails] = useState({ name: '', email: '', phone: '' });
        const [refCode, setRefCode] = useState('');
        const [isTransitioning, setIsTransitioning] = useState(false);

        const handleAmountClick = (val) => setAmount(val);

        const handleContinue = (e) => {
                e.preventDefault();
                if (!amount || amount <= 0) {
                        alert("Please select or enter a valid amount.");
                        return;
                }

                setIsTransitioning(true);
                setTimeout(() => {
                        const code = 'TKW-' + Math.floor(100000 + Math.random() * 900000);
                        setRefCode(code);
                        setStep(2);
                        setIsTransitioning(false);
                }, 400); // Wait for fade out
        };

        return (
                <div className={`glass-panel fade-in-up delay-2 ${isTransitioning ? 'transitioning' : ''}`} style={{ padding: 'clamp(2rem, 5vw, 4rem)', position: 'relative', zIndex: 10 }}>
                        {step === 1 ? (
                                <form onSubmit={handleContinue} style={{ animation: 'fadeInUp 0.5s ease forwards' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-1px' }}>Make a Donation</h2>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Step 1: Details & Intent</p>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--surface)' }}></div>
                                                </div>
                                        </div>

                                        <div style={{ marginBottom: '3rem' }}>
                                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Select Amount (PKR)</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                                        {presetAmounts.map(preset => (
                                                                <button
                                                                        key={preset}
                                                                        type="button"
                                                                        className={Number(amount) === preset ? 'btn btn-primary' : 'btn btn-secondary'}
                                                                        onClick={() => handleAmountClick(preset)}
                                                                        style={{ padding: '1.25rem' }}
                                                                >
                                                                        Rs. {preset.toLocaleString()}
                                                                </button>
                                                        ))}
                                                </div>
                                                <div style={{ position: 'relative' }}>
                                                        <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Rs.</span>
                                                        <input
                                                                type="number"
                                                                placeholder="Custom amount..."
                                                                className="input-field"
                                                                value={amount}
                                                                onChange={(e) => setAmount(e.target.value)}
                                                                style={{ paddingLeft: '3rem', fontSize: '1.1rem' }}
                                                        />
                                                </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                                                <div style={{ textAlign: 'left' }}>
                                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Full Name</label>
                                                        <input required type="text" className="input-field" placeholder="John Doe" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                                                        <div>
                                                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Email Address</label>
                                                                <input required type="email" className="input-field" placeholder="john@example.com" value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })} />
                                                        </div>
                                                        <div>
                                                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Phone Number <span style={{ textTransform: 'none', opacity: 0.5 }}>(Optional)</span></label>
                                                                <input type="tel" className="input-field" placeholder="+92 3XX XXXXXXX" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} />
                                                        </div>
                                                </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                                                Continue to Payment
                                                <span style={{ marginLeft: '10px' }}>→</span>
                                        </button>
                                </form>
                        ) : (
                                <div style={{ textAlign: 'left', animation: 'fadeInUp 0.5s ease forwards' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>✓</div>
                                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-1px' }}>Complete Payment</h2>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Step 2: Transfer & Verify</p>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }}></div>
                                                </div>
                                        </div>

                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                                <div>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Amount Commited</p>
                                                        <p style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk' }}>Rs. {Number(amount).toLocaleString()}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Reference Code</p>
                                                        <p className="gradient-text-primary" style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk' }}>{refCode}</p>
                                                </div>
                                        </div>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '3rem', textAlign: 'center', background: 'rgba(139, 92, 246, 0.15)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                                                <span style={{ color: '#a78bfa', marginRight: '0.5rem', fontSize: '1.2rem' }}>⚡</span>
                                                Please include this reference code in your transfer notes so we can instantly verify your donation.
                                        </p>

                                        <QRCodes amount={amount} />

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem' }}>
                                                <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: '1', padding: '1.25rem' }}>
                                                        ← Edit
                                                </button>
                                                <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ flex: '2', padding: '1.25rem', background: 'linear-gradient(135deg, var(--secondary), #059669)', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
                                                        I have completed the payment ✓
                                                </button>
                                        </div>
                                </div>
                        )}

                        <style>{`
        .transitioning { opacity: 0; transform: scale(0.98); }
        form, .step-2-container { transition: all 0.4s ease; }
      `}</style>
                </div>
        );
};

export default DonationForm;
