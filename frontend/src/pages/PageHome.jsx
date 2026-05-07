import React from 'react';

export default function PageHome() {
  return (
    <>
<div id="page-home" className="page active">
  <section className="hero">
    <div className="hero-content">
      <span className="section-tag">🇮🇳 UPI Literacy Platform</span>
      <h1>Empowering Rural India with <span>Digital Payments</span></h1>
      <p>A community-driven platform to spread UPI awareness, fight fraud, and help rural & semi-urban communities embrace digital banking with confidence.</p>
      <div className="hero-btns" id="hero-btns">
        <button className="btn btn-primary btn-lg" onClick={() => window.showAuth('login')}>Login →</button>
        <button className="btn btn-info btn-lg" onClick={() => window.showAuth('register')}>Register Free</button>
      </div>
    </div>
    <div className="hero-img">
      <svg width="100%" max-width="460" viewBox="0 0 460 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="230" cy="360" rx="170" ry="18" fill="#ABBED1" opacity="0.2"/>
        <rect x="140" y="30" width="175" height="290" rx="22" fill="#263238"/>
        <rect x="150" y="44" width="155" height="262" rx="15" fill="#F0F2F5"/>
        <rect x="187" y="37" width="85" height="7" rx="3.5" fill="#37474F"/>
        <rect x="162" y="64" width="130" height="14" rx="5" fill="#28CB8B" opacity="0.2"/>
        <rect x="162" y="64" width="55" height="14" rx="5" fill="#28CB8B"/>
        <text x="168" y="75" fill="white" font-size="8" font-weight="700" font-family="sans-serif">Balance</text>
        <rect x="162" y="87" width="130" height="28" rx="7" fill="white"/>
        <text x="168" y="106" fill="#263238" font-size="13" font-weight="800" font-family="sans-serif">₹12,450</text>
        <rect x="162" y="124" width="58" height="46" rx="7" fill="#E8F5E9"/>
        <text x="191" y="145" fill="#28CB8B" font-size="16" text-anchor="middle" font-family="sans-serif">↑</text>
        <text x="191" y="161" fill="#263238" font-size="7" text-anchor="middle" font-family="sans-serif">Send</text>
        <rect x="228" y="124" width="58" height="46" rx="7" fill="#E3F2FD"/>
        <text x="257" y="145" fill="#2194f3" font-size="16" text-anchor="middle" font-family="sans-serif">↓</text>
        <text x="257" y="161" fill="#263238" font-size="7" text-anchor="middle" font-family="sans-serif">Receive</text>
        <rect x="162" y="180" width="130" height="1" fill="#ABBED1"/>
        <circle cx="174" cy="200" r="7" fill="#66BB69"/>
        <rect x="187" y="196" width="55" height="5" rx="2" fill="#89939E"/>
        <rect x="187" y="205" width="38" height="3" rx="1" fill="#ABBED1"/>
        <text x="283" y="203" fill="#28CB8B" font-size="8" text-anchor="end" font-family="sans-serif">+₹500</text>
        <circle cx="174" cy="222" r="7" fill="#FBC02D"/>
        <rect x="187" y="218" width="50" height="5" rx="2" fill="#89939E"/>
        <text x="283" y="225" fill="#E53835" font-size="8" text-anchor="end" font-family="sans-serif">-₹120</text>
        <circle cx="174" cy="244" r="7" fill="#2194f3"/>
        <rect x="187" y="240" width="45" height="5" rx="2" fill="#89939E"/>
        <text x="283" y="247" fill="#28CB8B" font-size="8" text-anchor="end" font-family="sans-serif">+₹1,000</text>
        <rect x="162" y="268" width="130" height="26" rx="7" fill="#28CB8B"/>
        <text x="227" y="285" fill="white" font-size="9" font-weight="700" text-anchor="middle" font-family="sans-serif">Scan & Pay</text>
        <rect x="40" y="70" width="88" height="56" rx="11" fill="white" opacity="0.95" style={{filter: 'drop-shadow(0 4px 12px rgba(171,190,209,0.5))'}}/>
        <text x="56" y="96" fill="#28CB8B" font-size="18" font-family="sans-serif">✓</text>
        <text x="78" y="94" fill="#263238" font-size="9" font-weight="700" font-family="sans-serif">Secure</text>
        <text x="78" y="107" fill="#89939E" font-size="8" font-family="sans-serif">Payment</text>
        <rect x="328" y="110" width="96" height="56" rx="11" fill="white" opacity="0.95" style={{filter: 'drop-shadow(0 4px 12px rgba(171,190,209,0.5))'}}/>
        <text x="344" y="136" fill="#FBC02D" font-size="18" font-family="sans-serif">⚡</text>
        <text x="366" y="134" fill="#263238" font-size="9" font-weight="700" font-family="sans-serif">Instant</text>
        <text x="366" y="147" fill="#89939E" font-size="8" font-family="sans-serif">Transfer</text>
      </svg>
    </div>
  </section>

  
  <div style={{padding: '0 5%'}}>
    <div className="stats-bar">
      <div className="stat-item"><div className="icon"><img src="/assets/statusBar/icons8-community-48.png" alt="" /></div><div className="num" id="home-stat-members">—</div><div className="label">Community Members</div></div>
      <div className="stat-item"><div className="icon"><img src="/assets/statusBar/completed.png" alt="" /></div><div className="num" id="home-stat-surveys">—</div><div className="label">Surveys Completed</div></div>
      <div className="stat-item"><div className="icon"><img src="/assets/statusBar/certified.png" alt="" /></div><div className="num" id="home-stat-certs">—</div><div className="label">Certificates Issued</div></div>
      <div className="stat-item"><div className="icon"><img src="/assets/statusBar/awareness.png" alt="" /></div><div className="num" id="home-stat-programs">—</div><div className="label">Awareness Programs</div></div>
    </div>
  </div>

  
  <section className="section">
    <div className="container text-center">
      <span className="section-tag">Quick Navigation</span>
      <h2>Everything You Need in One Place</h2>
      <div className="nav-grid">
        <div className="nav-card" onClick={() => window.navigate('home')}><div className="icon"><img src="/assets/wuikNav/home.png" alt="" /></div><h4>Home</h4><p>Platform overview</p></div>
        <div className="nav-card" onClick={() => window.navigate('programs')}><div className="icon"><img src="/assets/wuikNav/programs.png" alt="" /></div><h4>Programs</h4><p>Awareness events</p></div>
        <div className="nav-card" onClick={() => window.navigate('survey')}><div className="icon"><img src="/assets/wuikNav/survey.png" alt="" /></div><h4>Survey</h4><p>UPI usage data</p></div>
        <div className="nav-card" onClick={() => window.navigate('dashboard')}><div className="icon"><img src="/assets/wuikNav/dashboard.png" alt="" /></div><h4>Dashboard</h4><p>Charts & insights</p></div>
        <div className="nav-card" onClick={() => window.navigate('learn')}><div className="icon"><img src="/assets/wuikNav/learn.png" alt="" /></div><h4>Learn</h4><p>UPI tutorials</p></div>
        <div className="nav-card" onClick={() => window.navigate('quiz')}><div className="icon"><img src="/assets/wuikNav/test.png" alt="" /></div><h4>Quiz</h4><p>Fraud certification</p></div>
        <div className="nav-card" onClick={() => window.navigate('try')}><div className="icon"><img src="/assets/wuikNav/payment.png" alt="" /></div><h4>Try</h4><p>Demo UPI & NGOs</p></div>
        <div className="nav-card" onClick={() => window.navigate('community')}><div className="icon"><img src="/assets/wuikNav/icons8-community-48.png" alt="" /></div><h4>Community</h4><p>Posts & profiles</p></div>
      </div>
    </div>
  </section>

  
  <section className="section section-silver">
    <div className="container">
      <div className="text-center">
        <span className="section-tag">Why ScanSafe</span>
        <h2>Built for Rural India's Digital Future</h2>
      </div>
      <div className="features-grid">
        <div className="feature-card"><div className="icon"><img src="/assets/features/protection.png" alt="" /></div><h4>Fraud Protection</h4><p>Learn to identify fake UPI apps, phishing scams, and fraudulent QR codes with our interactive quiz.</p></div>
        <div className="feature-card"><div className="icon"><img src="/assets/features/database.png" alt="" /></div><h4>Real-time Data</h4><p>Survey data stored securely in PostgreSQL and visualized in live dashboards with real insights.</p></div>
        <div className="feature-card"><div className="icon"><img src="/assets/wuikNav/icons8-community-48.png" alt="" /></div><h4>Community Programs</h4><p>Host or join awareness programs in your locality. Connect with local NGOs and digital literacy volunteers.</p></div>
        <div className="feature-card"><div className="icon"><img src="/assets/features/stepbystep.png" alt="" /></div><h4>Step-by-Step Guides</h4><p>Learn PhonePe, Google Pay, Paytm, and BHIM with simple visual steps and video tutorials.</p></div>
        <div className="feature-card"><div className="icon"><img src="/assets/statusBar/certified.png" alt="" /></div><h4>Certification</h4><p>Complete the fraud awareness quiz with 75%+ and earn a downloadable PDF certificate.</p></div>
        <div className="feature-card"><div className="icon"><img src="/assets/features/donation.png" alt="" /></div><h4>NGO Donations</h4><p>Practice real QR scanning by donating to verified NGOs. Support digital literacy missions.</p></div>
      </div>
    </div>
  </section>

  
  <section className="section-sm" style={{padding: '48px 5%'}}>
    <div className="container">
      <div className="cta-band">
        <h2>Ready to join <span>India's digital payment</span> revolution?</h2>
        <button className="btn btn-primary btn-lg" onClick={() => window.showAuth('register')}>Register Free →</button>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
