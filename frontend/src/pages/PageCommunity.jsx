import React from 'react';

export default function PageCommunity() {
  return (
    <>
<div id="page-community" className="page">
  <div className="page-hero">
    <div className="container">
      <span className="section-tag" style={{background: 'rgba(40,203,139,0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', maxWidth: '138px'}}><img src="/assets/wuikNav/icons8-community-48.png" alt="" style={{height: '25px'}} /> Community</span>
      <h1>Community Hub</h1>
      <p>Connect, share experiences, and inspire others on their digital payment journey.</p>
    </div>
  </div>
  <section className="section">
    <div className="container">
      <div className="community-layout">
        
        <div>
          <div className="profile-card">
            <div className="avatar" id="comm-avatar">U</div>
            <div className="profile-info">
              <h4 id="comm-name">Guest User</h4>
              <p id="comm-location">—</p>
              <div style={{marginTop: '7px'}} id="comm-badge"></div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat"><div className="val" id="stat-posts">0</div><div className="lbl">Posts</div></div>
              <div className="profile-stat"><div className="val" id="stat-likes">0</div><div className="lbl">Likes</div></div>
              <div className="profile-stat"><div className="val" id="stat-comments">0</div><div className="lbl">Comments</div></div>
            </div>
            <hr className="divider"/>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <button className="btn btn-outline btn-sm" style={{justifyContent: 'center'}} onClick={() => window.showProfileModal()}><img src="/assets/profile/icons8-pencil-50.png" alt="" style={{height: '25px'}}  /> Edit Profile</button>
              <button className="btn btn-outline btn-sm" style={{justifyContent: 'center'}} onClick={() => window.showMyPosts()}><img src="/assets/profile/icons8-instagram-50.png" alt="" style={{height: '25px'}} /> My Posts</button>
              <button className="btn btn-outline btn-sm" style={{justifyContent: 'center', color: 'var(--error)', borderColor: 'var(--error)'}} onClick={() => window.logoutUser()}>Logout</button>
            </div>
          </div>
        </div>

        
        <div>
          <div className="post-composer">
            <textarea placeholder="Share your UPI experience or ask a question..." id="post-text" onKeyDown={() => window.handlePostKey(event)}></textarea>
            <div className="post-composer-footer"><button className="btn btn-primary btn-sm" onClick={() => window.submitPost()}>Post →</button></div>
          </div>
          <div id="posts-feed"></div>
        </div>

        
        <div>
          <div className="profile-card" style={{marginBottom: '18px'}}>
            <h4 style={{marginBottom: '12px'}}><img src="/assets/profile/share.png" alt="" style={{height: '45px'}} /> Search Posts</h4>
            <div className="sidebar-search"><input type="text" placeholder="Search by person or keyword..." onInput={() => window.filterPosts(this.value)}/></div>
          </div>
          <div className="profile-card">
            <h4 style={{marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px'}}><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}} /> Website Reviews</h4>
            <div id="reviews-list"></div>
            <hr className="divider"/>
            <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px'}}>Leave a Review:</p>
            <textarea className="survey-textarea" placeholder="Share your feedback..." style={{minHeight: '65px'}} id="review-text" onKeyDown={() => window.handleReviewKey(event)}></textarea>
            <div style={{display: 'flex', gap: '4px', margin: '9px 0', alignItems: 'center'}}>
              <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>Rating:</span>
              <span onClick={() => window.setRating(1)} className="star-btn" data-star="1"><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}}  /></span>
              <span onClick={() => window.setRating(2)} className="star-btn" data-star="2"><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}}  /></span>
              <span onClick={() => window.setRating(3)} className="star-btn" data-star="3"><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}}  /></span>
              <span onClick={() => window.setRating(4)} className="star-btn" data-star="4"><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}}  /></span>
              <span onClick={() => window.setRating(5)} className="star-btn" data-star="5"><img src="/assets/profile/icons8-star-filled-50.png" alt="" style={{height: '20px'}}  /></span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.submitReview()}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
    </>
  );
}
