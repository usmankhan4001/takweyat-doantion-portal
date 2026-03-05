import React from 'react';

const QRCodes = ({ amount }) => {
        return (
                <div style={{ marginTop: '3rem' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.5rem', fontFamily: 'Space Grotesk' }}>Scan to Pay</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>

                                {/* EasyPaisa Mock */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', transition: 'var(--transition)', cursor: 'pointer' }} className="qr-card">
                                        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '2rem', color: '#10b981', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
                                                EasyPaisa
                                        </div>
                                        <div style={{ width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)', zIndex: 1 }}></div>
                                                <div style={{ width: '120px', height: '120px', background: 'var(--text-main)', opacity: 0.1, borderRadius: '0.5rem' }}></div>
                                                <span style={{ position: 'absolute', color: 'var(--text-muted)', zIndex: 2, fontSize: '0.9rem', fontWeight: 500 }}>QR Mockup</span>
                                        </div>
                                </div>

                                {/* JazzCash Mock */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', transition: 'var(--transition)', cursor: 'pointer' }} className="qr-card">
                                        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '2rem', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)' }}>
                                                JazzCash
                                        </div>
                                        <div style={{ width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)', zIndex: 1 }}></div>
                                                <div style={{ width: '120px', height: '120px', background: 'var(--text-main)', opacity: 0.1, borderRadius: '0.5rem' }}></div>
                                                <span style={{ position: 'absolute', color: 'var(--text-muted)', zIndex: 2, fontSize: '0.9rem', fontWeight: 500 }}>QR Mockup</span>
                                        </div>
                                </div>

                        </div>

                        <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.2)', flexShrink: 0 }}>
                                        <span>🏦</span>
                                </div>
                                <div style={{ width: '100%' }}>
                                        <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontFamily: 'Space Grotesk' }}>Bank Transfer Details</h4>
                                        <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-main)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>Bank Name</span>
                                                        <span style={{ fontWeight: 500 }}>Example Islamic Bank</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>Account Title</span>
                                                        <span style={{ fontWeight: 500 }}>Takweyat Foundation</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>IBAN</span>
                                                        <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)' }}>PK00 EXIB 0000 0000 0000 0000</span>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <style>{`
        .qr-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
        }
      `}</style>
                </div>
        );
};

export default QRCodes;
