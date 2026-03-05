import React from 'react';

const Hero = () => {
        return (
                <section style={{
                        padding: '8rem 1.5rem 6rem',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                }}>
                        <div className="container fade-in-up" style={{ maxWidth: '900px', position: 'relative', zIndex: 10 }}>
                                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', backdropFilter: 'blur(10px)' }}>
                                        <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✦</span>
                                        Make an Impact Today
                                </div>
                                <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '1.5rem' }}>
                                        Empower Communities <br />
                                        <span className="gradient-text-primary">Change Lives.</span>
                                </h1>
                                <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
                                        Your generous donation directly fuels our mission to bring sustainable development and hope to those who need it most. Every contribution counts.
                                </p>
                        </div>
                </section>
        );
};

export default Hero;
