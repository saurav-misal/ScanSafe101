import React from 'react';

export default function Chatbot() {
  return (
    <>
      <button id="chat-btn" aria-label="Open Diagnostics">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <div id="chatbot">
        <div className="chat-header">
          <div className="chat-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
              <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
              <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
              <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
              <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
            </svg>
          </div>
          <div className="chat-title">
            <h4>Diagnostic Assistant</h4>
            <p>System Online — Query Engine Active</p>
          </div>
          <button className="chat-close" id="chat-close" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="quick-replies" id="quick-replies">
          <button className="qr" data-query="Define collection routing attack vectors.">Collection Vectors</button>
          <button className="qr" data-query="Establish verification parameters for software applications.">App Check Protocol</button>
          <button className="qr" data-query="Detail immediate incident response steps.">Incident Response</button>
        </div>

        <div className="chat-messages" id="chat-messages"></div>

        <div className="chat-input-area">
          <input id="chat-input" className="chat-input" type="text"
            placeholder="Input explicit query parameters..." autoComplete="off" />
          <button className="chat-send" id="chat-send" aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
