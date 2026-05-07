import React from 'react';

export default function PagePrograms() {
  return (
    <>
<div id="page-programs" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', maxWidth: '125px'}}><img src="/assets/wuikNav/programs.png" alt="" style={{height: '20px', width: '20px'}} /> Programs</span>
      <h1>Awareness Programs</h1>
      <p>Find, join, or host digital literacy programs in your area.</p>
      <div className="search-bar-wrap">
        <input type="text" placeholder="🔍  Search programs..." id="prog-search" onInput={() => window.filterPrograms()}/>
        <button className="btn btn-primary" onClick={() => window.loadPrograms()}>Search</button>
      </div>
      <div className="filter-row">
        <button className="filter-chip active" onClick={() => window.setFilter(this,'all')}>All</button>
        <button className="filter-chip" onClick={() => window.setFilter(this,'free')}>Free</button>
        <button className="filter-chip" onClick={() => window.setFilter(this,'paid')}>Paid</button>
        <button className="filter-chip" onClick={() => window.setFilter(this,'online')}>Online</button>
      </div>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <h3 style={{marginBottom: '6px'}}>Active Programs</h3>
      <p className="text-muted">Login to join or host a program.</p>
      <div className="programs-grid" id="programs-grid"></div>
      <div className="host-form-wrap">
        <h3 style={{display: 'flex', alignItems: 'center'}}><img src="/assets/programs/icons8-speech-80.png" alt="" /> Host a Program</h3>
        <p className="text-muted" style={{marginBottom: '22px'}}>Share your digital literacy event with the community.</p>
        <div className="form-grid">
          <div className="form-field"><label>Program Name *</label><input type="text" id="prog-name" placeholder="e.g. UPI Safety Workshop"/></div>
          <div className="form-field"><label>Date *</label><input type="date" id="prog-date"/></div>
          <div className="form-field"><label>Time *</label><input type="time" id="prog-time"/></div>
          <div className="form-field"><label>Venue *</label><input type="text" id="prog-venue" placeholder="Village Hall or Online"/></div>
          <div className="form-field full"><label>Description</label><textarea id="prog-desc" placeholder="What participants will learn..."></textarea></div>
          <div className="form-field"><label>Contact Number</label><input type="tel" id="prog-phone" placeholder="+91 9876543210"/></div>
          <div className="form-field"><label>Email</label><input type="email" id="prog-email" placeholder="organizer@email.com"/></div>
          <div className="form-field"><label>Price</label>
            <div className="radio-group">
              <label><input type="radio" name="price" value="free" checked/> Free</label>
              <label><input type="radio" name="price" value="paid"/> Paid (₹)</label>
            </div>
          </div>
          <div className="form-field"><label>Amount (if paid)</label><input type="number" id="prog-amount" placeholder="₹ 0"/></div>
        </div>
        <div style={{marginTop: '20px'}}><button className="btn btn-primary" onClick={() => window.submitProgram()}>Submit Program →</button></div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
