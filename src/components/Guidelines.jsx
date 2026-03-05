import React from 'react';

const Guidelines = () => {
        return (
                <div className="glass-panel fade-in-up delay-3" style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontFamily: 'Space Grotesk' }}>Donation Guidelines</h3>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem', marginLeft: '1rem' }}>
                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                        <div style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                                All donations are processed with end-to-end encryption. 100% of your contribution goes directly to the Takweyat Foundation's on-ground initiatives.
                                        </p>
                                </div>
                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                        <div style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                                For direct bank transfers or QR payments, please include your <strong>reference code</strong> in the payment notes to ensure rapid processing.
                                        </p>
                                </div>
                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                        <div style={{ position: 'absolute', left: 0, top: '8px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }}></div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                                Digital receipts and impact reports will be issued automatically upon successful verification of your transaction.
                                        </p>
                                </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Need assistance? We're here to help.</p>
                                <a href="mailto:support@takweyat.org" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        support@takweyat.org <span>→</span>
                                </a>
                        </div>
                </div>
        );
};

export default Guidelines;
