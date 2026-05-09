import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modals from './components/Modals';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';

import PageHome from './pages/PageHome';
import PagePrograms from './pages/PagePrograms';
import PageSurvey from './pages/PageSurvey';
import PageDashboard from './pages/PageDashboard';
import PageLearn from './pages/PageLearn';
import PageQuiz from './pages/PageQuiz';
import PageTry from './pages/PageTry';
import PageCommunity from './pages/PageCommunity';

import './styles.css';
import './chatbot.css';
import './intro-animations.css';

export default function App() {
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    setTimeout(async () => {
      try {
        await loadScript('/script.js');
        await loadScript('/chatbot.js');
      } catch (e) {
        console.error('Failed to load scripts:', e);
      }
    }, 100);
  }, []);

  return (
    <>
      <div className="prog-modal-overlay" id="prog-detail-modal" onClick={(e) => window.closeProgramModal && window.closeProgramModal(e)}>
        <div className="prog-modal" id="prog-modal-inner">
          <div className="prog-modal-header">
            <button className="prog-modal-close" onClick={() => window.closeProgramModal && window.closeProgramModal(null, true)}>✕</button>
            <h3 id="pmd-name">Program Name</h3>
            <p id="pmd-desc">Description goes here.</p>
          </div>
          <div className="prog-modal-body">
            <span className="prog-modal-badge" id="pmd-badge">✓ Free</span>
            <div className="prog-info-grid">
              <div className="prog-info-item"><span className="icon">📅</span><div><div className="info-label">Date</div><div className="info-val" id="pmd-date">—</div></div></div>
              <div className="prog-info-item"><span className="icon">🕐</span><div><div className="info-label">Time</div><div className="info-val" id="pmd-time">—</div></div></div>
              <div className="prog-info-item" style={{gridColumn:'1/-1'}}><span className="icon">📍</span><div><div className="info-label">Venue</div><div className="info-val" id="pmd-venue">—</div></div></div>
              <div className="prog-info-item"><span className="icon">📞</span><div><div className="info-label">Contact Phone</div><div className="info-val" id="pmd-phone">—</div></div></div>
              <div className="prog-info-item"><span className="icon">✉️</span><div><div className="info-label">Contact Email</div><div className="info-val" id="pmd-email">—</div></div></div>
              <div className="prog-info-item" id="pmd-host-wrap" style={{gridColumn:'1/-1'}}><span className="icon">👤</span><div><div className="info-label">Host</div><div className="info-val" id="pmd-host">—</div></div></div>
            </div>
            <div className="prog-modal-actions">
              <button className="btn btn-outline" onClick={() => window.closeProgramModal && window.closeProgramModal(null, true)}>Close</button>
              <button className="btn btn-primary" id="pmd-join-btn" onClick={() => window.joinFromModal && window.joinFromModal()}>Join Program</button>
            </div>
          </div>
        </div>
      </div>

      <Navbar />

      <div className="sidebar-overlay" id="sidebar-overlay" onClick={() => window.closeSidebar && window.closeSidebar()}></div>
      <Sidebar />

      <button className="theme-toggle-float" onClick={() => window.toggleTheme && window.toggleTheme()} title="Toggle Dark Mode" id="theme-btn">🌙</button>

      <PageHome />
      <PagePrograms />
      <PageSurvey />
      <PageDashboard />
      <PageLearn />
      <PageQuiz />
      <PageTry />
      <PageCommunity />

      <Modals />
      <Toast />
      <Chatbot />
    </>
  );
}
