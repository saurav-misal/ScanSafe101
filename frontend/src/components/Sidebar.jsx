import React from 'react';

export default function Sidebar() {
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%2328CB8B'/%3E%3Ctext y='.9em' font-size='72' x='12' font-family='Arial' fill='white'%3E🛡%3C/text%3E%3C/svg%3E" alt="" />
        <span>ScanSafe</span>
      </div>
      <div className="sidebar-nav">
        <button className="sidebar-btn active" onClick={() => { window.navigate && window.navigate('home'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/home.png" alt="" /></span> Home</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('programs'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/programs.png" alt="" /></span> Programs</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('survey'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/survey.png" alt="" /></span> Survey</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('dashboard'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/dashboard.png" alt="" /></span> Dashboard</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('learn'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/learn.png" alt="" /></span> Learn</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('quiz'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/quiz.png" alt="" /></span> Quiz</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('try'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/try.png" alt="" /></span> Try</button>
        <button className="sidebar-btn" onClick={() => { window.navigate && window.navigate('community'); window.closeSidebar && window.closeSidebar(); }}><span className="icon"><img src="/assets/wuikNav/community.png" alt="" /></span> Community</button>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-theme-toggle">
          <span>🌙 Dark Mode</span>
          <label style={{position:'relative',display:'inline-block',width:'44px',height:'24px'}}>
            <input type="checkbox" id="sidebar-theme-check" onChange={() => window.toggleTheme && window.toggleTheme()} style={{opacity:'0',width:'0',height:'0'}} />
            <span style={{position:'absolute',inset:'0',background:'#555',borderRadius:'24px',transition:'0.3s'}}></span>
            <span id="sidebar-toggle-dot" style={{position:'absolute',left:'3px',top:'3px',width:'18px',height:'18px',background:'#fff',borderRadius:'50%',transition:'0.3s'}}></span>
          </label>
        </div>
        <button className="sidebar-btn" onClick={() => window.logoutUser && window.logoutUser()}><span className="icon">🚪</span> Logout</button>
      </div>
    </div>
  );
}
