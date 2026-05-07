import React from 'react';

export default function Modals() {
  return (
    <>

<div className="modal-overlay" id="auth-modal">
  <div className="modal">
    <button className="modal-close" onClick={() => window.closeModal('auth-modal')}>✕</button>
    <h3 id="auth-title">Login to ScanSafe</h3>
    <p id="auth-subtitle">Access all features of the platform</p>
    <div id="auth-form">
      <div id="auth-name-field" className="form-field" style={{marginBottom: '12px', display: 'none'}}><label>Full Name</label><input type="text" placeholder="Your full name" id="auth-name-input" onKeyDown={() => window.authKeyNav(event,'auth-email-input')}/></div>
      <div className="form-field" style={{marginBottom: '12px'}}><label>Email</label><input type="email" placeholder="your@email.com" id="auth-email-input" onKeyDown={() => window.authKeyNav(event,'auth-pass-input')}/></div>
      <div className="form-field" style={{marginBottom: '16px'}}><label>Password</label><input type="password" placeholder="••••••••" id="auth-pass-input" onKeyDown={() => window.authKeyNav(event,null,true)}/></div>
      <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => window.doAuth()} id="auth-submit-btn">Login</button>
      <p style={{textAlign: 'center', marginTop: '14px', fontSize: '13px'}} id="auth-switch-text">Don't have an account? <a href="#" onClick={() => window.toggleAuth()} style={{color: 'var(--primary)', fontWeight: '600'}}>Register</a></p>
    </div>
  </div>
</div>


<div className="modal-overlay" id="login-required-modal">
  <div className="modal" style={{textAlign: 'center'}}>
    <button className="modal-close" onClick={() => window.closeModal('login-required-modal')}>✕</button>
    <div style={{fontSize: '44px', marginBottom: '14px'}}>🔒</div>
    <h3>Login Required</h3>
    <p>You need to be logged in to access this feature.</p>
    <div className="modal-btns">
      <button className="btn btn-outline" onClick={() => { window.closeModal('login-required-modal'); window.navigate('home'); }}>← Home</button>
      <button className="btn btn-primary" onClick={() => { window.closeModal('login-required-modal'); window.showAuth('login'); }}>Login</button>
      <button className="btn btn-secondary" onClick={() => { window.closeModal('login-required-modal'); window.showAuth('register'); }}>Register</button>
    </div>
  </div>
</div>


<div className="modal-overlay" id="profile-modal">
  <div className="modal" style={{maxWidth: '520px'}}>
    <button className="modal-close" onClick={() => window.closeModal('profile-modal')}>✕</button>
    <h3 style={{marginBottom: '20px'}}>✏️ Edit Profile</h3>
    <div className="profile-edit-grid">
      <div className="profile-pic-upload full form-field">
        <div className="preview" id="edit-avatar-preview">U</div>
        <div>
          <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px'}}>Profile Picture</p>
          <input type="file" accept="image/*" onChange={(e) => window.handleProfilePic && window.handleProfilePic(e.currentTarget)} style={{fontSize: '13px', color: 'var(--text-muted)'}}/>
        </div>
      </div>
      <div className="form-field"><label>Full Name</label><input type="text" id="edit-name" placeholder="Your full name"/></div>
      <div className="form-field"><label>Email</label><input type="email" id="edit-email" placeholder="your@email.com"/></div>
      <div className="form-field"><label>Date of Birth</label><input type="date" id="edit-dob"/></div>
      <div className="form-field"><label>Phone</label><input type="tel" id="edit-phone" placeholder="+91 9876543210"/></div>
      <div className="form-field full"><label>Location / Place</label><input type="text" id="edit-location" placeholder="City, State"/></div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '16px 0', padding: '14px', background: 'var(--neutral-silver)', borderRadius: 'var(--radius-sm)'}}>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-programs-hosted">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Programs Hosted</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-programs-attended">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Attended</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-total-likes">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Total Likes</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-comments">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Comments</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-replies">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Replies</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)'}} id="pd-posts-count">0</div><div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Posts</div></div>
    </div>
    <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px'}}>
      <button className="btn btn-outline" onClick={() => window.closeModal('profile-modal')}>Cancel</button>
      <button className="btn btn-primary" onClick={() => window.saveProfile()}>Save Changes</button>
    </div>
  </div>
</div>


<div className="modal-overlay" id="certificate-modal">
  <div className="modal" style={{maxWidth: '560px'}}>
    <button className="modal-close" onClick={() => window.closeModal('certificate-modal')}>✕</button>
    <div id="cert-modal-content" style={{textAlign: 'center'}}>
      
    </div>
  </div>
</div>


    </>
  );
}
