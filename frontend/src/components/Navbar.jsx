import React from 'react';

export default function Navbar() {
  return (
    <nav>
      <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); window.navigate && window.navigate('home'); }}>
        <img src="/assets/logo.png" alt="ScanSafe" />
        <span><span className="scan">Scan</span><span className="safe">Safe</span></span>
      </a>
      <div className="nav-right">
        <div className="nav-links" id="nav-links">
          <div className="nav-pill" id="nav-pill"></div>
          <button onClick={() => window.navigate && window.navigate('home')} className="active" id="nav-home">Home</button>
          <button onClick={() => window.navigate && window.navigate('programs')} id="nav-programs">Programs</button>
          <button onClick={() => window.navigate && window.navigate('survey')} id="nav-survey">Survey</button>
          <button onClick={() => window.navigate && window.navigate('dashboard')} id="nav-dashboard">Dashboard</button>
          <button onClick={() => window.navigate && window.navigate('learn')} id="nav-learn">Learn</button>
          <button onClick={() => window.navigate && window.navigate('quiz')} id="nav-quiz">Quiz</button>
          <button onClick={() => window.navigate && window.navigate('try')} id="nav-try">Try</button>
          <button onClick={() => window.navigate && window.navigate('community')} id="nav-community">Community</button>
        </div>
        <div className="nav-user" id="nav-user-area">
        </div>
        <button className="hamburger" id="hamburger" onClick={() => window.toggleSidebar && window.toggleSidebar()}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
