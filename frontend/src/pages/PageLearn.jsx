import React from 'react';

export default function PageLearn() {
  return (
    <>
<div id="page-learn" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', maxWidth: '125px', gap: '5px'}}><img src="/assets/LearnPage/learn.png" alt="" style={{height: '16px', width: '20px'}} /> Education</span>
      <h1>Learn UPI – Step by Step</h1>
      <p>Everything you need to use digital payments safely and confidently.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div className="learn-tabs">
        <button className="learn-tab active" onClick={() => window.learnTab('cash-vs-digital',this)}><img src="/assets/LearnPage/icons8-digital-wallet-64.png" alt="" style={{height: '50px'}} /> Cash vs Digital</button>
        <button className="learn-tab" onClick={() => window.learnTab('fraud-detection',this)}><img src="/assets/LearnPage/icons8-fraud-64.png" alt="" style={{height: '50px'}} /> Detect Fraud</button>
        <button className="learn-tab" onClick={() => window.learnTab('how-to-use',this)}><img src="/assets/LearnPage/icons8-ability-to-use-positive-language-50.png" alt="" style={{height: '50px'}} /> How to Use UPI</button>
        <button className="learn-tab" onClick={() => window.learnTab('pdf-resources',this)}><img src="/assets/LearnPage/icons8-digital-signature-64.png" alt="" style={{height: '45px'}} /> Digital Literacy PDFs</button>
      </div>

      <div className="learn-section active" id="learn-cash-vs-digital">
        <h3 style={{marginBottom: '18px'}}>Cash vs Digital Payments</h3>
        <div className="compare-grid">
          <div className="compare-card cash"><h4 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/icons8-rupee-64.png" alt="" style={{height: '40px'}} /> Cash Payments</h4><ul><li>Must travel to ATM (fare: ₹20–50)</li><li>Risk of theft while carrying cash</li><li>Exact change often not available</li><li>No transaction history</li><li>Cannot transact at midnight</li><li>Vulnerable to counterfeit notes</li></ul></div>
          <div className="compare-card digital"><h4 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/rupeeUpi.png" alt="" style={{height: '40px'}} /> UPI / Digital</h4><ul><li>Pay from home — no travel needed</li><li>Secured by PIN + bank encryption</li><li>Send any amount instantly</li><li>Full transaction history always available</li><li>24/7 — even on holidays</li><li>Fraud protection by NPCI & RBI</li></ul></div>
        </div>
        <div style={{background: 'var(--primary-tint)', borderRadius: 'var(--radius-md)', padding: '24px', marginTop: '24px', borderLeft: '4px solid var(--primary)'}}>
          <h4 style={{marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/icons8-did-you-know-64.png" alt="" style={{height: '40px'}} /> Did You Know?</h4>
          <p style={{color: 'var(--text-muted)'}}>India processes over <strong>10 billion UPI transactions per month</strong>. Switching from cash to UPI saves an average rural family ₹2,000–5,000/year.</p>
        </div>
      </div>

      <div className="learn-section" id="learn-fraud-detection">
        <h3 style={{marginBottom: '8px'}}>How to Detect Fake Apps & Scams</h3>
        <p style={{marginBottom: '20px'}}>Customers sometimes try to scam vendors with fake payment screenshots. Learn to spot them.</p>
        <div className="scam-grid">
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> Fake Screenshots</h5><p>Always check your bank SMS or UPI app — never trust a screenshot alone. Payment confirmation comes directly from your bank.</p></div>
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> Fake UPI Apps</h5><p>Apps named "PhonePay", "GooglePe" are fakes! Download only from official Google Play. Check developer name carefully.</p></div>
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> QR Code Scams</h5><p>QR codes are for PAYING, not receiving. If someone asks you to scan to receive money, it's a scam.</p></div>
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> OTP Fraud</h5><p>No bank or UPI app will EVER ask for your OTP over call. Sharing your OTP = instant account breach.</p></div>
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> Collect Request Scam</h5><p>Entering PIN on a collect request SENDS money from your account. Only enter PIN when YOU are sending.</p></div>
          <div className="scam-card"><h5 style={{display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/LearnPage/alert-fraud.png" alt="" style={{height: '20px'}} /> Fake Customer Care</h5><p>Always get helpline numbers from the official app or NPCI website only. Never call numbers found on social media.</p></div>
        </div>
      </div>

      <div className="learn-section" id="learn-how-to-use">
        <h3 style={{marginBottom: '14px'}}>How to Use UPI Apps</h3>
        <div className="app-selector">
          <button className="app-btn active" onClick={() => window.selectApp('phonepe',this)}><img src="/assets/LearnPage/apps/icons8-phone-pe-100.png" alt="" /> PhonePe</button>
          <button className="app-btn" onClick={() => window.selectApp('googlepay',this)}><img src="/assets/LearnPage/apps/icons8-google-pay-100.png" alt="" /> Google Pay</button>
          <button className="app-btn" onClick={() => window.selectApp('paytm',this)}><img src="/assets/LearnPage/apps/icons8-paytm-100.png" alt="" /> Paytm</button>
          <button className="app-btn" onClick={() => window.selectApp('bhim',this)}><img src="/assets/LearnPage/apps/icons8-bhim-100.png" alt="" /> BHIM</button>
        </div>
        <div className="app-selector">
          <button className="app-btn active" onClick={() => window.selectOp('pay',this)}>↑ How to Pay</button>
          <button className="app-btn" onClick={() => window.selectOp('receive',this)}>↓ How to Receive</button>
          <button className="app-btn" onClick={() => window.selectOp('setup',this)}><img src="/assets/LearnPage/apps/icons8-gear-48.png" alt="" /> How to Setup</button>
        </div>
        <div className="learn-split" style={{marginTop: '24px'}}>
          <div>
            <h4 id="steps-title" style={{marginBottom: '14px'}}>PhonePe – How to Pay</h4>
            <ul className="steps-list" id="steps-list"></ul>
          </div>
          <div>
            <div className="learn-app-img" id="app-image-panel">
              <div className="app-logo" id="app-emoji"><img src={''} alt="" /></div>
              <h3 id="app-name-display">PhonePe</h3>
              <p id="app-desc-display">India's most trusted UPI payment app with secure transactions and instant transfers.</p>
            </div>
            <div style={{background: 'var(--neutral-silver)', borderRadius: 'var(--radius-md)', padding: '20px', marginTop: '16px'}}>
              <h4 style={{marginBottom: '12px'}}><img src="/assets/LearnPage/apps/icons8-video-tutorial-66.png" alt="" /> Video Tutorials</h4>
              <div className="video-grid" id="video-grid"></div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="learn-section" id="learn-pdf-resources">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px'}}>
          <div>
            <span className="section-tag">📚 Digital Literacy Library</span>
            <h2 style={{marginTop: '8px'}}>Free PDF Resources</h2>
            <p style={{marginTop: '6px'}}>Download free guides on UPI, digital payments, and financial literacy. All PDFs are fetched from our database.</p>
          </div>
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}} id="pdf-filter-row">
            <button className="filter-chip active" onClick={() => window.filterPDFs('all',this)}>All</button>
            <button className="filter-chip" onClick={() => window.filterPDFs('upi',this)}>UPI Basics</button>
            <button className="filter-chip" onClick={() => window.filterPDFs('fraud',this)}>Fraud Safety</button>
            <button className="filter-chip" onClick={() => window.filterPDFs('banking',this)}>Banking</button>
            <button className="filter-chip" onClick={() => window.filterPDFs('literacy',this)}>Literacy</button>
          </div>
        </div>
        <div style={{position: 'relative', margin: '20px 0'}}>
          <input type="text" placeholder="🔍  Search PDFs by name or topic..." id="pdf-search-input"
            onInput={() => window.searchPDFs(this.value)}
            style={{width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', background: 'var(--card-bg)', color: 'var(--text)', transition: 'border 0.2s'}}
            onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"/>
        </div>
        <div id="pdf-loading" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
          <div style={{fontSize: '36px', marginBottom: '12px'}}>📄</div>
          <p>Loading PDFs from database...</p>
        </div>
        <div id="pdf-grid" style={{display: 'none', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '20px'}}></div>
        <div id="pdf-empty" style={{display: 'none', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
          <div style={{fontSize: '36px', marginBottom: '10px'}}>🔍</div>
          <p>No PDFs found. Try a different search.</p>
        </div>
      </div>

    </div>
  </section>
</div>
    </>
  );
}
