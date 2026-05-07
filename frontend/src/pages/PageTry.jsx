import React from 'react';

export default function PageTry() {
  return (
    <>
<div id="page-try" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', maxWidth: '125px'}}><img src="/assets/LearnPage/icons8-rupee-64.png" alt="" style={{height: '30px'}} /> Practice</span>
      <h1>Try UPI Payments</h1>
      <p>Practice digital payments safely — simulation or real NGO donation.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div id="try-options-view">
        <div className="try-options">
          <div className="try-card" onClick={() => window.showTry('sim')}>
            <div className="icon"><img src="/assets/features/trial.png" alt="" /></div><h3>UPI Simulator</h3>
            <p>Practice in a 100% safe demo environment. No real money.</p>
            <button className="btn btn-primary" style={{marginTop: '18px'}}>Launch Simulator →</button>
          </div>
          <div className="try-card" onClick={() => window.showTry('ngo')}>
            <div className="icon"><img src="/assets/features/ngo.png" alt="" /></div><h3>Donate to NGO</h3>
            <p>Make a real UPI donation to a verified NGO from our database.</p>
            <button className="btn btn-secondary" style={{marginTop: '18px'}}>Choose NGO →</button>
          </div>
        </div>
      </div>
      <div id="try-sim-view" style={{display: 'none'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px'}}>
          <button className="btn btn-outline btn-sm" onClick={() => window.showTry('options')}>← Back</button>
          <h3 style={{margin: '0'}}>UPI Payment Simulator</h3>
          <span className="chip chip-green">DEMO MODE</span>
        </div>
        <div className="upi-sim">
          <div className="phone-mock">
            <div className="phone-screen">
              <div className="phone-header"><div className="app-icon"><img src="/assets/LearnPage/apps/bhim.png" alt="" style={{height: '20px'}} /></div><span>SimUPI</span><span style={{marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)'}}>DEMO</span></div>
              <div className="sim-balance"><span>Balance</span><strong id="sim-balance">₹5,000.00</strong></div>
              <div id="sim-form">
                <input className="sim-input" type="text" placeholder="Enter UPI ID" id="sim-upi-id"/>
                <input className="sim-input" type="number" placeholder="Enter amount ₹" id="sim-amount"/>
                <input className="sim-input" type="text" placeholder="Remark (optional)" id="sim-remark"/>
                <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => window.simPay()}>Pay Now →</button>
              </div>
              <div className="sim-status" id="sim-status"><div className="sim-success">✅</div><h4 style={{color: 'var(--primary)'}}>Payment Successful!</h4><p id="sim-result-text" style={{fontSize: '13px', marginTop: '7px'}}></p><button className="btn btn-outline btn-sm" style={{marginTop: '14px'}} onClick={() => window.resetSim()}>Make Another</button></div>
            </div>
          </div>
        </div>
        <div style={{textAlign: 'center', marginTop: '16px', padding: '14px', background: 'var(--neutral-silver)', borderRadius: 'var(--radius-sm)'}}>
          <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>🔒 Simulated environment. No real transactions processed.</p>
        </div>
      </div>
      <div id="try-ngo-view" style={{display: 'none'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px'}}>
          <button className="btn btn-outline btn-sm" onClick={() => window.showTry('options')}>← Back</button>
          <h3 style={{margin: '0'}}>Donate to a Random NGO</h3>
        </div>
        <p style={{marginBottom: '24px', color: 'var(--text-muted)'}}>A verified NGO has been randomly selected from our database:</p>
        <div id="ngo-display"></div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button className="btn btn-outline" onClick={() => window.loadRandomNGO()}><img src="/assets/profile/icons8-refresh-40.png" alt="" style={{height: '25px'}} /> Select Different NGO</button>
        </div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
