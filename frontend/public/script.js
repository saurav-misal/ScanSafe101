var API = window.location.hostname === 'localhost' && window.location.port !== '5000' ? 'http://localhost:5000/api' : '/api';


// ===== THEME =====
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
  const sc = document.getElementById('sidebar-theme-check');
  if(sc) sc.checked = !isDark;
  const dot = document.getElementById('sidebar-toggle-dot');
  if(dot) dot.style.transform = isDark ? 'translateX(0)' : 'translateX(20px)';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-btn').textContent = saved === 'dark' ? '☀️' : '🌙';
  const sc = document.getElementById('sidebar-theme-check');
  if(sc) sc.checked = saved === 'dark';
  const dot = document.getElementById('sidebar-toggle-dot');
  if(dot) dot.style.transform = saved === 'dark' ? 'translateX(20px)' : 'translateX(0)';
}

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  document.getElementById('hamburger').classList.remove('open');
}

// ===== NAV PILL ANIMATION =====
function updateNavPill(activeBtn) {
  const pill = document.getElementById('nav-pill');
  const container = document.getElementById('nav-links');
  if(!pill || !container || !activeBtn) return;
  const containerRect = container.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  pill.style.left = (btnRect.left - containerRect.left) + 'px';
  pill.style.width = btnRect.width + 'px';
}

// ===== NAVIGATION =====
let currentPage = 'home';
let chartsInited = false;

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + page);
  if(nb) { nb.classList.add('active'); setTimeout(() => updateNavPill(nb), 10); }
  currentPage = page;
  window.scrollTo(0,0);
  if(page === 'dashboard') { setTimeout(initCharts, 100); chartsInited = true; }
  if(page === 'survey') initSurvey();
  if(page === 'programs') loadPrograms();
  if(page === 'learn') initLearn();
  if(page === 'community') { loadPosts(); loadReviews(); setTimeout(updateCommunityProfile, 500); }
  if(page === 'try') showTry('options');
}

// Hover pill effect
document.querySelectorAll('.nav-links button').forEach(btn => {
  btn.addEventListener('mouseenter', () => updateNavPill(btn));
  btn.addEventListener('mouseleave', () => {
    const active = document.querySelector('.nav-links button.active');
    if(active) updateNavPill(active);
  });
});

// ===== AUTH =====
let authMode = 'login';
let currentUser = null;
let profilePicData = null;

function loadUserFromStorage() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if(token && user) { currentUser = JSON.parse(user); updateNavForUser(); }
}

function updateNavForUser() {
  const area = document.getElementById('nav-user-area');
  if(!area) return;

  // Update hero buttons
  const heroBtns = document.getElementById('hero-btns');
  if(heroBtns) {
    if(currentUser) {
      heroBtns.innerHTML = `
        <button class="btn btn-primary btn-lg" onclick="navigate('community')">Go to Community →</button>
        <button class="btn btn-outline btn-lg" onclick="logoutUser()">Logout</button>`;
    } else {
      heroBtns.innerHTML = `
        <button class="btn btn-primary btn-lg" onclick="showAuth('login')">Login →</button>
        <button class="btn btn-info btn-lg" onclick="showAuth('register')">Register Free</button>`;
    }
  }

  if(currentUser) {
    const initial = (currentUser.full_name||'U')[0].toUpperCase();
    const pic = currentUser.profile_pic_url;
    area.innerHTML = `
      <div class="nav-user">
        <button class="nav-user-btn" onclick="toggleProfileDropdown()">
          <div class="nav-avatar">${pic ? `<img src="${pic}" alt=""/>` : initial}</div>
          <span>${currentUser.full_name.split(' ')[0]}</span>
          <span style="font-size:10px;color:var(--text-muted);">▼</span>
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="pd-header">
            <div class="pd-avatar">${pic ? `<img src="${pic}" alt=""/>` : initial}</div>
            <div class="pd-info"><h4>${currentUser.full_name}</h4><p>${currentUser.email}</p><p style="margin-top:3px;">${currentUser.location||'—'}</p></div>
          </div>
          <div class="pd-stats">
            <div class="pd-stat"><div class="val" id="dd-posts">—</div><div class="lbl">Posts</div></div>
            <div class="pd-stat"><div class="val" id="dd-likes">—</div><div class="lbl">Likes</div></div>
            <div class="pd-stat"><div class="val">${currentUser.quiz_score||0}</div><div class="lbl">Quiz Score</div></div>
          </div>
          <div class="pd-menu">
            <button onclick="showProfileModal();toggleProfileDropdown()">✏️ Edit Profile</button>
            <button onclick="showMyPosts();toggleProfileDropdown()">📝 My Posts</button>
            <button onclick="showCertificateModal();toggleProfileDropdown()">🏆 My Certificate</button>
            <hr class="pd-divider"/>
            <button onclick="logoutUser()" style="color:var(--error);">🚪 Logout</button>
          </div>
        </div>
      </div>`;
    // Load real post/like stats for dropdown
    fetch(`${API}/posts`).then(r=>r.json()).then(posts => {
      const mine = posts.filter(p => p.user_id === currentUser.id);
      const likes = mine.reduce((s,p) => s+parseInt(p.likes_count||0), 0);
      const ddPosts = document.getElementById('dd-posts');
      const ddLikes = document.getElementById('dd-likes');
      if(ddPosts) ddPosts.textContent = mine.length;
      if(ddLikes) ddLikes.textContent = likes;
    }).catch(()=>{});
  } else {
    area.innerHTML = '';
  }
}

function showMyPosts() {
  navigate('community');
  setTimeout(async () => {
    const feed = document.getElementById('posts-feed');
    if(!feed || !currentUser) return;
    feed.innerHTML = '<p style="color:var(--text-muted);padding:20px;">Loading your posts...</p>';
    try {
      const res = await fetch(`${API}/posts`);
      const posts = await res.json();
      const mine = posts.filter(p => p.user_id === currentUser.id);
      if(mine.length === 0) {
        feed.innerHTML = '<p style="color:var(--text-muted);padding:20px;">You have no posts yet. Write your first post above!</p>';
        return;
      }
      renderPosts(mine);
    } catch {
      feed.innerHTML = '<p style="color:var(--error);padding:20px;">Could not load posts. Is server running?</p>';
    }
  }, 300);
}

function showCertificateModal() {
  if(!currentUser) { showAuth('login'); return; }
  const modal = document.getElementById('certificate-modal');
  const content = document.getElementById('cert-modal-content');
  const status = currentUser.quiz_status || 'none';
  const score = currentUser.quiz_score || 0;
  const name = currentUser.full_name || 'User';
  const date = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  if(status === 'certified') {
    content.innerHTML = `
      <h2 style="color:var(--primary);margin-bottom:6px;">🏆 Your Certificate</h2>
      <p style="margin-bottom:20px;font-size:14px;color:var(--text-muted);">You have successfully passed the UPI Fraud Awareness Quiz!</p>
      <div class="cert-box" style="text-align:center;">
        <p style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Certificate of Completion</p>
        <h2 style="margin-top:10px;color:var(--text);">UPI Fraud Awareness</h2>
        <p style="font-size:13px;color:var(--text-muted);margin:8px 0;">This is to certify that</p>
        <div class="cert-name" style="font-size:26px;font-weight:800;color:var(--primary-dark);margin:12px 0;font-family:var(--font-head);">${name}</div>
        <p style="font-size:13px;color:var(--text-muted);">has successfully completed the UPI Fraud Awareness Quiz<br/>with a score of <strong style="color:var(--primary);">${score}/20</strong></p>
        <div style="display:flex;justify-content:space-between;margin-top:24px;padding-top:14px;border-top:1px dashed var(--primary);">
          <div style="text-align:left;"><p style="font-size:11px;color:var(--text-muted);">Date</p><p style="font-size:13px;font-weight:600;color:var(--text);">${date}</p></div>
          <div><p style="font-size:11px;color:var(--text-muted);">Issued by</p><p style="font-size:13px;font-weight:600;color:var(--primary);">ScanSafe</p></div>
          <div style="text-align:right;"><p style="font-size:11px;color:var(--text-muted);">Status</p><span style="font-size:16px;">✅</span></div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center;" onclick="showToast('Downloading certificate PDF... ✅')">⬇️ Download Certificate PDF</button>`;
  } else if(status === 'attempted') {
    content.innerHTML = `
      <div style="font-size:56px;margin-bottom:14px;">🟡</div>
      <h2 style="margin-bottom:10px;">Quiz Attempted</h2>
      <p style="font-size:15px;color:var(--text-muted);margin-bottom:24px;">You attempted the quiz but didn't pass yet. Score 75% or above to earn your certificate!</p>
      <div style="background:var(--neutral-silver);border-radius:var(--radius-md);padding:20px;margin-bottom:24px;">
        <p style="font-size:14px;color:var(--text-muted);">Your last score: <strong style="color:var(--warning);font-size:18px;">${score}/20</strong></p>
        <p style="font-size:13px;color:var(--text-muted);margin-top:6px;">You need at least <strong>15/20</strong> to pass.</p>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="closeModal('certificate-modal');navigate('learn')">📚 Review Learn Section</button>
        <button class="btn btn-primary" onclick="closeModal('certificate-modal');navigate('quiz')">🔄 Try Again</button>
      </div>`;
  } else {
    content.innerHTML = `
      <div style="font-size:56px;margin-bottom:14px;">🔴</div>
      <h2 style="margin-bottom:10px;">No Certificate Yet</h2>
      <p style="font-size:15px;color:var(--text-muted);margin-bottom:24px;">You haven't taken the Fraud Awareness Quiz yet. Complete it with 75%+ to earn your certificate!</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="closeModal('certificate-modal');navigate('learn')">📚 Learn First</button>
        <button class="btn btn-primary" onclick="closeModal('certificate-modal');navigate('quiz')">🧠 Take Quiz Now</button>
      </div>`;
  }
  modal.classList.add('show');
}

function toggleProfileDropdown() {
  const dd = document.getElementById('profile-dropdown');
  if(dd) dd.classList.toggle('show');
}
document.addEventListener('click', e => {
  if(!e.target.closest('.nav-user')) {
    const dd = document.getElementById('profile-dropdown');
    if(dd) dd.classList.remove('show');
  }
});

async function updateCommunityProfile() {
  if(!currentUser) return;
  const initial = (currentUser.full_name||'U')[0].toUpperCase();
  const pic = currentUser.profile_pic_url;
  const av = document.getElementById('comm-avatar');
  if(av) av.innerHTML = pic ? `<img src="${pic}" alt=""/>` : initial;
  const nm = document.getElementById('comm-name');
  if(nm) nm.textContent = currentUser.full_name || 'Guest';
  const loc = document.getElementById('comm-location');
  if(loc) loc.textContent = currentUser.location || '—';
  const badge = document.getElementById('comm-badge');
  if(badge) {
    const status = currentUser.quiz_status||'none';
    const colors = {none:'var(--error)',attempted:'var(--warning)',certified:'var(--primary)'};
    const labels = {none:'Not Certified',attempted:'Quiz Attempted',certified:'Certified ✓'};
    badge.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:${colors[status]};font-weight:600;"><span style="width:9px;height:9px;border-radius:50%;background:${colors[status]};display:inline-block;"></span>${labels[status]}</span>`;
  }
  // Fetch real stats from DB
  try {
    const res = await fetch(`${API}/posts`);
    const posts = await res.json();
    const myPosts    = posts.filter(p => parseInt(p.user_id) === parseInt(currentUser.id));
    const myLikes    = myPosts.reduce((s,p) => s + parseInt(p.likes_count||0), 0);
    const myComments = myPosts.reduce((s,p) => s + parseInt(p.comment_count||0), 0);

    // Retry every 100ms until elements are found (max 10 tries)
    let tries = 0;
    const updateStats = () => {
      const sp = document.getElementById('stat-posts');
      const sl = document.getElementById('stat-likes');
      const sc = document.getElementById('stat-comments');
      if(sp && sl && sc) {
        sp.textContent = myPosts.length;
        sl.textContent = myLikes;
        sc.textContent = myComments;
        console.log('Stats updated ✅:', myPosts.length, myLikes, myComments);
      } else if(tries < 10) {
        tries++;
        setTimeout(updateStats, 100);
      }
    };
    updateStats();
  } catch(e) { console.log('Stats fetch error:', e); }
}

function showAuth(mode) {
  authMode = mode;
  document.getElementById('auth-modal').classList.add('show');
  document.getElementById('auth-title').textContent = mode==='login' ? 'Login to ScanSafe' : 'Create Free Account';
  document.getElementById('auth-subtitle').textContent = mode==='login' ? 'Access all platform features' : 'Join the community today';
  document.getElementById('auth-submit-btn').textContent = mode==='login' ? 'Login' : 'Register';
  document.getElementById('auth-name-field').style.display = mode==='register' ? 'flex' : 'none';
  document.getElementById('auth-switch-text').innerHTML = mode==='login'
    ? "Don't have an account? <a href='#' onclick='toggleAuth()' style='color:var(--primary);font-weight:600;'>Register</a>"
    : "Already have an account? <a href='#' onclick='toggleAuth()' style='color:var(--primary);font-weight:600;'>Login</a>";
}
function toggleAuth() { showAuth(authMode==='login'?'register':'login'); }

// Enter key navigation in auth form
function authKeyNav(e, nextId, submit=false) {
  if(e.key === 'Enter') {
    e.preventDefault();
    if(submit) doAuth();
    else if(nextId) document.getElementById(nextId)?.focus();
  }
}

async function doAuth() {
  const email = document.getElementById('auth-email-input').value.trim();
  const password = document.getElementById('auth-pass-input').value.trim();
  const nameInput = document.getElementById('auth-name-input');
  const full_name = nameInput ? nameInput.value.trim() : '';
  if(!email||!password) { showToast('Please fill in all fields'); return; }
  if(authMode==='register'&&!full_name) { showToast('Please enter your name'); return; }
  try {
    const body = authMode==='login' ? {email,password} : {full_name,email,password};
    const res = await fetch(`${API}/auth/${authMode}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    const data = await res.json();
    if(!res.ok) { showToast(data.error||'Something went wrong'); return; }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    closeModal('auth-modal');
    updateNavForUser();
    showToast(authMode==='login' ? `Welcome back, ${data.user.full_name}! ✅` : `Welcome to ScanSafe, ${data.user.full_name}! ✅`);
  } catch(err) { showToast('Cannot connect to server. Is it running?'); }
}

function requireLogin() {
  if(currentUser) return true;
  document.getElementById('login-required-modal').classList.add('show');
  return false;
}
function getToken() { return localStorage.getItem('token'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function logoutUser() {
  localStorage.removeItem('token'); localStorage.removeItem('user');
  currentUser = null; updateNavForUser(); location.reload();
}

// ===== PROFILE MODAL =====
async function showProfileModal() {
  if(!requireLogin()) return;
  document.getElementById('profile-modal').classList.add('show');
  if(currentUser) {
    document.getElementById('edit-name').value     = currentUser.full_name||'';
    document.getElementById('edit-email').value    = currentUser.email||'';
    document.getElementById('edit-dob').value      = currentUser.dob||'';
    document.getElementById('edit-phone').value    = currentUser.phone||'';
    document.getElementById('edit-location').value = currentUser.location||'';
    const prev = document.getElementById('edit-avatar-preview');
    if(prev) prev.innerHTML = currentUser.profile_pic_url
      ? `<img src="${currentUser.profile_pic_url}" alt=""/>`
      : (currentUser.full_name||'U')[0].toUpperCase();

    // Fetch and update modal stats
    try {
      // Posts + likes
      const postsRes = await fetch(`${API}/posts`);
      const posts    = await postsRes.json();
      const myPosts  = posts.filter(p => parseInt(p.user_id) === parseInt(currentUser.id));
      const myLikes  = myPosts.reduce((s,p) => s + parseInt(p.likes_count||0), 0);
      const myCommentCount = myPosts.reduce((s,p) => s + parseInt(p.comment_count||0), 0);
      document.getElementById('pd-posts-count').textContent = myPosts.length;
      document.getElementById('pd-total-likes').textContent = myLikes;
      document.getElementById('pd-comments').textContent    = myCommentCount;

      // Programs hosted
      const progRes  = await fetch(`${API}/programs`);
      const programs = await progRes.json();
      const hosted   = programs.filter(p => parseInt(p.host_user_id) === parseInt(currentUser.id));
      document.getElementById('pd-programs-hosted').textContent   = hosted.length;
      document.getElementById('pd-programs-attended').textContent = parseInt(localStorage.getItem('programs_attended') || '0');
      document.getElementById('pd-replies').textContent           = 0; // No replies table yet
    } catch(e) { console.log('Profile stats error:', e); }
  }
}
function handleProfilePic(input) {
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    profilePicData = e.target.result;
    const prev = document.getElementById('edit-avatar-preview');
    if(prev) prev.innerHTML = `<img src="${profilePicData}" alt=""/>`;
  };
  reader.readAsDataURL(file);
}
async function saveProfile() {
  const full_name = document.getElementById('edit-name').value.trim();
  const phone = document.getElementById('edit-phone').value.trim();
  const dob = document.getElementById('edit-dob').value;
  const location = document.getElementById('edit-location').value.trim();
  const profile_pic_url = profilePicData || currentUser?.profile_pic_url;
  try {
    await fetch(`${API}/auth/profile`, {
      method:'PUT',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},
      body: JSON.stringify({full_name,phone,dob,location,profile_pic_url})
    });
    currentUser = {...currentUser,full_name,phone,dob,location,profile_pic_url};
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateNavForUser(); updateCommunityProfile();
    closeModal('profile-modal');
    showToast('Profile updated! ✅');
  } catch(e) { showToast('Could not save profile. Is server running?'); }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

// ===== FAQ =====
function toggleFaq(el) {
  const ans = el.nextElementSibling;
  const icon = el.querySelector('span:last-child');
  ans.classList.toggle('open');
  icon.textContent = ans.classList.contains('open') ? '−' : '+';
}

// ===== PROGRAMS =====
let progFilter = 'all'; let allPrograms = [];
function setFilter(el,f) { document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); progFilter=f; renderPrograms(allPrograms); }
function filterPrograms() { renderPrograms(allPrograms); }
async function loadPrograms() {
  const grid = document.getElementById('programs-grid'); if(!grid) return;
  grid.innerHTML = '<p style="color:var(--text-muted);padding:20px;">Loading programs...</p>';
  try {
    const res = await fetch(`${API}/programs`);
    allPrograms = await res.json();
    renderPrograms(allPrograms);
  } catch { grid.innerHTML = '<p style="color:var(--error);padding:20px;">Could not load programs. Make sure server is running.</p>'; }
}
function renderPrograms(programs) {
  const grid = document.getElementById('programs-grid'); if(!grid) return;
  const search = (document.getElementById('prog-search')||{}).value?.toLowerCase()||'';
  let filtered = programs.filter(p => {
    if(search && !p.name.toLowerCase().includes(search) && !(p.description||'').toLowerCase().includes(search)) return false;
    if(progFilter==='free') return p.is_free;
    if(progFilter==='paid') return !p.is_free;
    if(progFilter==='online') return (p.venue||'').toLowerCase().includes('online');
    return true;
  });
  if(filtered.length===0) { grid.innerHTML='<p style="color:var(--text-muted);padding:20px;">No programs found. Be the first to host one!</p>'; return; }
  grid.innerHTML = filtered.map((p,i)=>`
    <div class="program-card" style="cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;" onclick="openProgramModal(${p.id||i})"
      onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-lg)'"
      onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <span class="program-badge ${p.is_free?'badge-free':'badge-paid'}">${p.is_free?'✓ Free':'₹ '+p.price_amount}</span>
      <h4>${p.name}</h4><p style="font-size:13px;">${p.description||''}</p>
      <div class="program-meta">
        <div class="program-meta-item">📅 ${p.event_date ? new Date(p.event_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'TBD'}</div>
        <div class="program-meta-item">🕐 ${p.event_time}</div>
        <div class="program-meta-item">📍 ${p.venue}</div>
      </div>
      <div class="btn btn-outline btn-sm" style="margin-top:14px;width:100%;justify-content:center;pointer-events:none;">View Details →</div>
    </div>`).join('');
  setTimeout(checkJoinedPrograms, 100);
}

let _currentModalProgramId = null;

function openProgramModal(id) {
  const p = allPrograms.find(x => (x.id||allPrograms.indexOf(x)) == id);
  if(!p) return;
  _currentModalProgramId = id;

  document.getElementById('pmd-name').textContent  = p.name || '—';
  document.getElementById('pmd-desc').textContent  = p.description || '';
  document.getElementById('pmd-date').textContent  = p.event_date
    ? new Date(p.event_date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
    : 'TBD';
  document.getElementById('pmd-time').textContent  = p.event_time || '—';
  document.getElementById('pmd-venue').textContent = p.venue || '—';
  document.getElementById('pmd-phone').textContent = p.contact_phone || 'N/A';
  document.getElementById('pmd-email').textContent = p.contact_email || 'N/A';

  const hostWrap = document.getElementById('pmd-host-wrap');
  if(p.host_name) {
    document.getElementById('pmd-host').textContent = p.host_name;
    hostWrap.style.display = 'flex';
  } else {
    hostWrap.style.display = 'none';
  }

  const badge = document.getElementById('pmd-badge');
  if(p.is_free) {
    badge.textContent = '✓ Free Entry';
    badge.className   = 'prog-modal-badge free';
  } else {
    badge.textContent = '₹ ' + (p.price_amount||'Paid');
    badge.className   = 'prog-modal-badge paid';
  }

  // Update join button state
  const joined = JSON.parse(localStorage.getItem('joined_programs') || '[]');
  const joinBtn = document.getElementById('pmd-join-btn');
  if(joined.includes(String(id)) || joined.includes(id)) {
    joinBtn.textContent = '✅ Already Joined';
    joinBtn.style.background = '#2E7D31';
    joinBtn.disabled = true;
  } else {
    joinBtn.textContent = 'Join Program';
    joinBtn.style.background = '';
    joinBtn.disabled = false;
  }

  document.getElementById('prog-detail-modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProgramModal(e, force) {
  if(!force && e && e.target !== document.getElementById('prog-detail-modal')) return;
  document.getElementById('prog-detail-modal').classList.remove('show');
  document.body.style.overflow = '';
}

function joinFromModal() {
  if(_currentModalProgramId === null) return;
  const joinBtn = document.getElementById('pmd-join-btn');
  joinProgram(_currentModalProgramId, null);
  // Sync button inside modal
  const joined = JSON.parse(localStorage.getItem('joined_programs') || '[]');
  if(joined.includes(String(_currentModalProgramId))) {
    joinBtn.textContent = '✅ Already Joined';
    joinBtn.style.background = '#2E7D31';
    joinBtn.disabled = true;
  }
  // Also sync the card list join buttons
  checkJoinedPrograms();
}
async function submitProgram() {
  if(!requireLogin()) return;
  const name = document.getElementById('prog-name').value.trim();
  const event_date = document.getElementById('prog-date').value;
  const event_time = document.getElementById('prog-time').value;
  const venue = document.getElementById('prog-venue').value.trim();
  const description = document.getElementById('prog-desc').value.trim();
  const contact_phone = document.getElementById('prog-phone').value.trim();
  const contact_email = document.getElementById('prog-email').value.trim();
  const is_free = document.querySelector('input[name="price"][value="free"]').checked;
  const price_amount = document.getElementById('prog-amount').value||0;
  if(!name||!event_date||!event_time||!venue) { showToast('Please fill in all required fields'); return; }
  try {
    const res = await fetch(`${API}/programs`, {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},
      body: JSON.stringify({name,description,event_date,event_time,venue,is_free,price_amount,contact_phone,contact_email})
    });
    if(!res.ok) { showToast('Failed to submit program'); return; }
    showToast('Program submitted! ✅'); loadPrograms();
  } catch { showToast('Cannot connect to server'); }
}

function joinProgram(id, btn) {
  if(!requireLogin()) return;
  // Get current joined list
  const joined = JSON.parse(localStorage.getItem('joined_programs') || '[]');
  if(joined.includes(String(id)) || joined.includes(id)) {
    showToast('You have already joined this program!');
    return;
  }
  // Save to localStorage
  joined.push(String(id));
  localStorage.setItem('joined_programs', JSON.stringify(joined));
  // Update button
  if(btn) {
    btn.textContent = '✅ Joined';
    btn.style.background = '#2E7D31';
    btn.style.borderColor = '#2E7D31';
    btn.disabled = true;
  }
  // Update attended count in localStorage
  const attended = parseInt(localStorage.getItem('programs_attended') || '0') + 1;
  localStorage.setItem('programs_attended', String(attended));
  showToast('You have joined the program! ✅');
}

function checkJoinedPrograms() {
  const joined = JSON.parse(localStorage.getItem('joined_programs') || '[]');
  joined.forEach(id => {
    const btn = document.getElementById(`join-btn-${id}`);
    if(btn) {
      btn.textContent = '✅ Joined';
      btn.style.background = '#2E7D31';
      btn.style.borderColor = '#2E7D31';
      btn.disabled = true;
    }
  });
}

// ===== SURVEY =====
const surveyQs = [
  {label:"Name of Participant?",type:"text",placeholder:"Enter full name"},
  {label:"Age?",type:"number",placeholder:"Enter age"},
  {label:"Gender?",type:"radio",options:["Male","Female","Other"]},
  {label:"Occupation?",type:"checkbox",options:["Farmer","Shopkeeper","Student","Homemaker","Street vendor","Other"]},
  {label:"Do you accept UPI payments in your shop?",type:"radio",options:["Yes","No"]},
  {label:"Which UPI apps do you accept?",type:"checkbox",options:["PhonePe","Google Pay","Paytm","BHIM","Other","I don't use UPI payments"]},
  {label:"On average, out of 10 customers, how many pay using UPI?",type:"text",placeholder:"e.g. 6"},
  {label:"Which age group of customers mostly uses UPI?",type:"radio",options:["18–30 yrs","31–50 yrs","50+ yrs"]},
  {label:"What do you prefer more – Cash or UPI payment?",type:"radio",options:["Cash","UPI payment","Both"]},
  {label:"Your problems with the UPI system?",type:"checkbox",options:["Poor network / Internet issues","Lack of digital literacy","Fraud / security concerns","App errors / transaction failures","No problems till now","Other"]},
  {label:"Have you ever had transaction failures or fraud?",type:"textarea",placeholder:"Describe your experience..."},
  {label:"Do you need help to make payments digitally?",type:"radio",options:["Yes","No","Sometimes"]},
  {label:"Do you help elders or neighbors with mobile payments?",type:"radio",options:["Yes","No","Sometimes"]},
  {label:"What are the main reasons some villagers don't use UPI?",type:"textarea",placeholder:"Share your thoughts..."},
  {label:"What do you prefer more – Cash or UPI? And why?",type:"textarea",placeholder:"Explain your preference..."},
];
let surveyIdx = 0; let surveyAnswers = {};
function initSurvey() { surveyIdx=0; surveyAnswers={}; renderSurveyQ(); }
function renderSurveyQ() {
  const q = surveyQs[surveyIdx]; const total = surveyQs.length;
  const pct = Math.round(((surveyIdx+1)/total)*100);
  document.getElementById('survey-progress-label').textContent = `Question ${surveyIdx+1} of ${total}`;
  document.getElementById('survey-pct').textContent = pct+'%';
  document.getElementById('survey-fill').style.width = pct+'%';
  document.getElementById('survey-prev').style.display = surveyIdx>0?'inline-flex':'none';
  document.getElementById('survey-next').textContent = surveyIdx===total-1?'Submit ✓':'Next →';
  let html = `<div class="survey-q"><div class="q-label"><span class="q-num">Q${surveyIdx+1}.</span>${q.label}</div>`;
  if(q.type==='text'||q.type==='number') html+=`<input class="survey-input" type="${q.type}" placeholder="${q.placeholder||''}" onkeydown="surveyKeyNav(event)"/>`;
  else if(q.type==='textarea') html+=`<textarea class="survey-textarea" placeholder="${q.placeholder||''}" onkeydown="surveyKeyNav(event)"></textarea>`;
  else if(q.type==='radio') html+=`<div class="option-list">${q.options.map(o=>`<label class="option-item"><input type="radio" name="sq${surveyIdx}" onkeydown="surveyKeyNav(event)"/><span>${o}</span></label>`).join('')}</div>`;
  else if(q.type==='checkbox') html+=`<div class="option-list">${q.options.map(o=>`<label class="option-item"><input type="checkbox"/><span>${o}</span></label>`).join('')}</div>`;
  html+='</div>';
  document.getElementById('survey-questions').innerHTML = html;
  document.querySelector('.survey-input, .survey-textarea')?.focus();
}

// Collect current question's answer before moving
function collectCurrentAnswer() {
  const q = surveyQs[surveyIdx];
  if(q.type==='text'||q.type==='number') {
    const val = document.querySelector('.survey-input')?.value?.trim();
    if(val) surveyAnswers[surveyIdx] = val;
  } else if(q.type==='textarea') {
    const val = document.querySelector('.survey-textarea')?.value?.trim();
    if(val) surveyAnswers[surveyIdx] = val;
  } else if(q.type==='radio') {
    const checked = document.querySelector(`input[name="sq${surveyIdx}"]:checked`);
    if(checked) surveyAnswers[surveyIdx] = checked.nextElementSibling?.textContent;
  } else if(q.type==='checkbox') {
    const checked = [...document.querySelectorAll('.option-item input[type="checkbox"]:checked')];
    if(checked.length) surveyAnswers[surveyIdx] = checked.map(c=>c.nextElementSibling?.textContent);
  }
}

function surveyKeyNav(e) { if(e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); surveyNext(); } }

async function surveyNext() {
  collectCurrentAnswer();
  if(surveyIdx < surveyQs.length-1) {
    surveyIdx++; renderSurveyQ();
  } else {
    // Map all answers to correct DB fields
    const a = surveyAnswers;
    const payload = {
      participant_name:               a[0]  || null,
      age:                            a[1]  ? parseInt(a[1]) : null,
      gender:                         a[2]  || null,
      occupation:                     Array.isArray(a[3]) ? a[3] : (a[3] ? [a[3]] : null),
      accepts_upi:                    a[4]==='Yes' ? true : a[4]==='No' ? false : null,
      upi_apps_used:                  Array.isArray(a[5]) ? a[5] : (a[5] ? [a[5]] : null),
      avg_upi_customers_out_of_10:    a[6]  ? parseInt(a[6]) : null,
      upi_age_group:                  a[7]  || null,
      payment_preference:             a[8]  || null,
      upi_problems:                   Array.isArray(a[9]) ? a[9] : (a[9] ? [a[9]] : null),
      had_transaction_issues:         a[10] || null,
      needs_digital_help:             a[11] || null,
      helps_others_with_payments:     a[12] || null,
      reasons_villagers_dont_use_upi: a[13] || null,
      preference_explanation:         a[14] || null,
    };
    try {
      const res = await fetch(`${API}/survey`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        showToast('Survey submitted! Thank you. ✅');
      } else {
        showToast('Survey submitted! ✅');
      }
    } catch(e) {
      showToast('Survey saved! Connect server to store in DB. ✅');
    }
    surveyAnswers = {};
    surveyIdx = 0;
    renderSurveyQ();
  }
}

function surveyPrev() {
  collectCurrentAnswer();
  if(surveyIdx>0){ surveyIdx--; renderSurveyQ(); }
}

// ===== DASHBOARD =====
let chartInstances = {};
async function initCharts() {
  const green='#28CB8B', dark='#263238', light='#66BB69', tint='#A5D6A7',
        blue='#2194f3', warn='#FBC02D', err='#E53835';

  // Destroy old charts first
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  // Show loading on KPI cards
  document.getElementById('kpi-total').textContent = '...';

  // Fetch real data from DB
  let d = null;
  try {
    const res = await fetch(`${API}/dashboard`);
    d = await res.json();
  } catch(e) {
    console.log('Dashboard: using fallback data');
  }

  const total = d?.total_responses || 0;
  document.getElementById('kpi-total').textContent = total.toLocaleString();

  // ── Helper: calculate percentage from count ──────────────
  function pct(count, sum) {
    if(!sum) return 0;
    return parseFloat(((count/sum)*100).toFixed(1));
  }

  // ── CHART 1 — UPI Acceptance ─────────────────────────────
  const accRows  = d?.upi_acceptance || [];
  const accTotal = accRows.reduce((s,r) => s + parseInt(r.count), 0);
  const accYes   = parseInt(accRows.find(r => r.accepts_upi === true)?.count  || 0);
  const accNo    = parseInt(accRows.find(r => r.accepts_upi === false)?.count || 0);
  const accYesPct = pct(accYes, accTotal);
  const accNoPct  = pct(accNo,  accTotal);
  // Update KPI
  document.querySelectorAll('.kpi-card')[1].querySelector('.kpi-val').textContent =
    accTotal > 0 ? accYesPct + '%' : '—';

  chartInstances.c1 = new Chart(document.getElementById('chart1'), {
    type: 'bar',
    data: {
      labels: [`Accepted UPI (${accYesPct}%)`, `Not Accepted (${accNoPct}%)`],
      datasets: [{ data: [accYes, accNo], backgroundColor: [green, err], borderRadius: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw} respondents (${pct(ctx.raw, accTotal)}%)` }}},
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 },
        title: { display: true, text: 'Number of Respondents' }}}
    }
  });

  // ── CHART 2 — Cash vs UPI ────────────────────────────────
  const prefRows  = d?.cash_vs_upi || [];
  const prefTotal = prefRows.reduce((s,r) => s + parseInt(r.count), 0);
  const upiCount  = parseInt(prefRows.find(r => r.payment_preference?.toLowerCase().includes('upi'))?.count  || 0);
  const cashCount = parseInt(prefRows.find(r => r.payment_preference?.toLowerCase() === 'cash')?.count || 0);
  const bothCount = parseInt(prefRows.find(r => r.payment_preference?.toLowerCase() === 'both')?.count || 0);
  const upiPct2   = pct(upiCount,  prefTotal);
  const cashPct2  = pct(cashCount, prefTotal);
  const bothPct2  = pct(bothCount, prefTotal);
  // Update KPI
  document.querySelectorAll('.kpi-card')[2].querySelector('.kpi-val').textContent =
    prefTotal > 0 ? upiPct2 + '%' : '—';

  chartInstances.c2 = new Chart(document.getElementById('chart2'), {
    type: 'pie',
    data: {
      labels: [`UPI (${upiPct2}%)`, `Cash (${cashPct2}%)`, `Both (${bothPct2}%)`],
      datasets: [{ data: [upiCount, cashCount, bothCount], backgroundColor: [green, warn, blue], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} respondents` }}}
    }
  });

  // ── CHART 3 — UPI Apps ───────────────────────────────────
  const appRows = d?.app_popularity || [];
  const appMap  = { 'phonepe': 0, 'phone pe': 0, 'google pay': 0, 'googlepay': 0,
                    'paytm': 0, 'bhim': 0, 'other': 0 };
  appRows.forEach(r => {
    const name = (r.app||'').toLowerCase();
    if(name.includes('phone'))  appMap['phonepe']     += parseInt(r.count);
    else if(name.includes('google')) appMap['google pay'] += parseInt(r.count);
    else if(name.includes('paytm'))  appMap['paytm']      += parseInt(r.count);
    else if(name.includes('bhim'))   appMap['bhim']        += parseInt(r.count);
    else if(!name.includes("don't") && !name.includes("dont"))
                                     appMap['other']       += parseInt(r.count);
  });
  const appTotal  = Object.values(appMap).reduce((s,v) => s+v, 0);
  const appLabels = ['PhonePe','Google Pay','Paytm','BHIM','Other'];
  const appValues = [appMap['phonepe'], appMap['google pay'], appMap['paytm'], appMap['bhim'], appMap['other']];
  const appPcts   = appValues.map(v => pct(v, appTotal));

  chartInstances.c3 = new Chart(document.getElementById('chart3'), {
    type: 'doughnut',
    data: {
      labels: appLabels.map((l,i) => `${l} (${appPcts[i]}%)`),
      datasets: [{ data: appValues, backgroundColor: [green, blue, warn, dark, light], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} respondents` }}}
    }
  });

  // ── CHART 4 — Age Groups ─────────────────────────────────
  const ageRows  = d?.age_groups || [];
  const ageTotal = ageRows.reduce((s,r) => s + parseInt(r.count), 0);
  const age1 = parseInt(ageRows.find(r => r.upi_age_group?.includes('18'))?.count || 0);
  const age2 = parseInt(ageRows.find(r => r.upi_age_group?.includes('31'))?.count || 0);
  const age3 = parseInt(ageRows.find(r => r.upi_age_group?.includes('50') || r.upi_age_group?.includes('51'))?.count || 0);
  const agePcts = [pct(age1,ageTotal), pct(age2,ageTotal), pct(age3,ageTotal)];
  // Update KPI
  document.querySelectorAll('.kpi-card')[3].querySelector('.kpi-val').textContent =
    ageTotal > 0 ? agePcts[0] + '%' : '—';

  chartInstances.c4 = new Chart(document.getElementById('chart4'), {
    type: 'bar',
    data: {
      labels: [`18–30 yrs (${agePcts[0]}%)`, `31–50 yrs (${agePcts[1]}%)`, `51+ yrs (${agePcts[2]}%)`],
      datasets: [{ data: agePcts, backgroundColor: [green, light, tint], borderRadius: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100,
        ticks: { callback: v => v + '%' },
        title: { display: true, text: 'Percentage (%)' }},
        x: { title: { display: true, text: 'Age Group' }}}
    }
  });

  // ── CHART 5 — Problems ───────────────────────────────────
  const probRows  = d?.problems || [];
  const probTotal = probRows.reduce((s,r) => s + parseInt(r.count), 0);
  const probMap = { network: 0, fraud: 0, errors: 0, literacy: 0, none: 0 };
  probRows.forEach(r => {
    const p = (r.problem||'').toLowerCase();
    if(p.includes('network') || p.includes('internet'))  probMap.network  += parseInt(r.count);
    else if(p.includes('fraud') || p.includes('security')) probMap.fraud  += parseInt(r.count);
    else if(p.includes('error') || p.includes('failure'))  probMap.errors += parseInt(r.count);
    else if(p.includes('literacy') || p.includes('digital')) probMap.literacy += parseInt(r.count);
    else if(p.includes('no problem') || p.includes('none'))  probMap.none += parseInt(r.count);
  });
  const probLabels = ['Poor Network','Fraud/Security','App Errors','Lack of Literacy','No Problem'];
  const probValues = [probMap.network, probMap.fraud, probMap.errors, probMap.literacy, probMap.none];
  const probPcts   = probValues.map(v => pct(v, probTotal));

  chartInstances.c5 = new Chart(document.getElementById('chart5'), {
    type: 'bar',
    data: {
      labels: probLabels.map((l,i) => `${l} (${probPcts[i]}%)`),
      datasets: [{ data: probPcts, backgroundColor: [warn, err, blue, light, green], borderRadius: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true,
        ticks: { callback: v => v + '%' },
        title: { display: true, text: 'Percentage (%)' }},
        x: { title: { display: true, text: 'Problem Type' }}}
    }
  });

  // ── CHART 6 — Payment Preference ────────────────────────
  const pref6Rows  = d?.payment_prefs || [];
  const pref6Total = pref6Rows.reduce((s,r) => s + parseInt(r.count), 0);
  const cashPref = parseInt(pref6Rows.find(r => r.payment_preference?.toLowerCase() === 'cash')?.count || 0);
  const bothPref = parseInt(pref6Rows.find(r => r.payment_preference?.toLowerCase() === 'both')?.count || 0);
  const upiPref  = parseInt(pref6Rows.find(r => r.payment_preference?.toLowerCase().includes('upi'))?.count || 0);
  const pref6Pcts = [pct(cashPref,pref6Total), pct(bothPref,pref6Total), pct(upiPref,pref6Total)];

  chartInstances.c6 = new Chart(document.getElementById('chart6'), {
    type: 'bar',
    data: {
      labels: [`Prefer Cash (${pref6Pcts[0]}%)`, `Prefer Both (${pref6Pcts[1]}%)`, `Prefer UPI (${pref6Pcts[2]}%)`],
      datasets: [{ data: pref6Pcts, backgroundColor: [warn, blue, green], borderRadius: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100,
        ticks: { callback: v => v + '%' },
        title: { display: true, text: 'Percentage (%)' }}}
    }
  });

  // Show message if no survey data yet
  if(total === 0) {
    showToast('No survey data yet. Submit surveys to see live charts! 📊');
  }
}

// ===== LEARN =====
let currentApp='phonepe', currentOp='pay';
const appInfo = {
  phonepe:{png:'./assets/LearnPage/apps/phonepe.png',name:'PhonePe',desc:'India\'s most popular UPI app with 500M+ users. Secure, fast, and easy to use.'},
  googlepay:{png:'./assets/LearnPage/apps/gpay.png',name:'Google Pay',desc:'Google\'s UPI payment app. Seamlessly integrated with Google services and widely accepted.'},
  paytm:{png:'./assets/LearnPage/apps/paytm.png',name:'Paytm',desc:'Pioneer in India\'s digital payment ecosystem. Supports UPI, wallet, and banking services.'},
  bhim:{png:'./assets/LearnPage/apps/bhim.png',name:'BHIM UPI',desc:'Government of India\'s official UPI app developed by NPCI. Simple, secure, and trusted.'}
};
const upiSteps = {
  phonepe:{
    pay:{title:'PhonePe – How to Pay',steps:['Open PhonePe app on your phone.','Tap "Send Money" on the home screen.','Enter the recipient\'s UPI ID, mobile number, or scan QR code.','Enter the amount you want to send.','Add a remark (optional) like "Vegetables" or "Rent".','Tap "Proceed" and enter your 4 or 6-digit UPI PIN.','Wait for the "Payment Successful" confirmation screen.','Check your SMS from bank to confirm.']},
    receive:{title:'PhonePe – How to Receive',steps:['Open PhonePe and tap "Receive Money".','Your UPI ID and QR code will appear automatically.','Share your UPI ID or show the QR code to the sender.','You will receive an SMS when payment arrives.','You NEVER need to enter your PIN to receive money!','Check your bank balance to confirm the credit.']},
    setup:{title:'PhonePe – How to Setup',steps:['Download PhonePe from Google Play (developer: PhonePe Pvt Ltd).','Open the app and enter your bank-registered mobile number.','Enter the OTP received on your phone.','Select your bank from the list shown.','PhonePe will auto-detect your bank account.','Set a 4 or 6-digit UPI PIN — keep it secret!','Your UPI ID is created (e.g. 9876543210@ybl).']}
  },
  googlepay:{
    pay:{title:'Google Pay – How to Pay',steps:['Open Google Pay on your phone.','Tap "New Payment" or the "+" button.','Search by name, phone number, UPI ID, or scan QR.','Enter the amount.','Add a note if you wish.','Tap "Pay" and enter your UPI PIN.','Wait for "Paid" confirmation.']},
    receive:{title:'Google Pay – How to Receive',steps:['Open Google Pay and tap your profile photo to show QR.','Display your QR code or share your UPI ID verbally.','You get a notification when money arrives.','No PIN entry is needed to receive money.']},
    setup:{title:'Google Pay – How to Setup',steps:['Install Google Pay from Play Store (developer: Google LLC).','Sign in with your Google account.','Enter your bank-registered mobile number.','Verify with OTP.','Add your bank account from the list.','Create UPI PIN using debit card details.','Your Google Pay UPI ID is ready.']}
  },
  paytm:{
    pay:{title:'Paytm – How to Pay',steps:['Open Paytm app (developer: One97 Communications).','Tap "Send" on the home screen.','Enter mobile number, Paytm ID, or scan QR.','Enter the amount.','Tap "Send" and enter your UPI PIN.','Transaction confirmed via SMS.']},
    receive:{title:'Paytm – How to Receive',steps:['Open Paytm and show your QR code from home screen.','Share QR or your Paytm UPI ID.','No PIN needed to receive — wait for confirmation.','Check your bank balance for credit.']},
    setup:{title:'Paytm – How to Setup',steps:['Download Paytm from Play Store (One97 Communications Ltd).','Register with your mobile number.','Verify via OTP.','Add bank account under settings.','Create UPI PIN using debit card.','Your Paytm UPI ID is set up.']}
  },
  bhim:{
    pay:{title:'BHIM – How to Pay',steps:['Open BHIM UPI app (developer: NPCI).','Select "Send" from main menu.','Enter UPI ID, mobile number, or scan QR.','Enter amount and remarks.','Confirm and enter your UPI PIN.','BHIM will show success or failure immediately.']},
    receive:{title:'BHIM – How to Receive',steps:['Open BHIM and tap "Receive".','Your UPI ID and QR are shown.','Share them with the sender.','Payment is credited to your linked bank account.','No PIN required to receive.']},
    setup:{title:'BHIM – How to Setup',steps:['Download BHIM from Play Store (developer: NPCI).','Select your preferred language.','Enter your bank-registered SIM mobile number.','BHIM will auto-detect your bank account.','Set a 4-digit BHIM app PIN.','Create UPI PIN using debit card.','Your BHIM UPI ID is ready (e.g. 9876543210@upi).']}
  }
};
// Video data cache: { app_name: { operation: [{title, video_url, thumbnail_url}] } }
let videoCache = {};
let videoLoading = false;

async function loadAndRenderVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  // Show skeleton while loading
  grid.innerHTML = `
    <div class="video-card" style="opacity:0.5;pointer-events:none;"><div class="play">⏳</div><p>Loading...</p></div>
    <div class="video-card" style="opacity:0.5;pointer-events:none;"><div class="play">⏳</div><p>Loading...</p></div>
    <div class="video-card" style="opacity:0.5;pointer-events:none;"><div class="play">⏳</div><p>Loading...</p></div>`;

  if (!videoLoading && Object.keys(videoCache).length === 0) {
    videoLoading = true;
    try {
      const res = await fetch(`${API}/learn/videos`);
      if (!res.ok) throw new Error('API failed');
      const rows = await res.json();
      // Build nested cache: videoCache[app_name][operation] = [{title, video_url, thumbnail_url}]
      rows.forEach(v => {
        const app = (v.app_name || '').toLowerCase();
        const op  = (v.operation || '').toLowerCase();
        if (!videoCache[app]) videoCache[app] = {};
        if (!videoCache[app][op]) videoCache[app][op] = [];
        videoCache[app][op].push({ title: v.title, url: v.video_url, thumb: v.thumbnail_url });
      });
    } catch {
      // Fallback: empty cache — renderVideos will show "add videos" message
      videoCache = { _fallback: true };
    }
    videoLoading = false;
  }
  renderVideos();
}

function initLearn() { renderSteps(); renderAppImage(); loadAndRenderVideos(); }
function learnTab(id, el) {
  document.querySelectorAll('.learn-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.learn-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('learn-' + id).classList.add('active');
  if(id === 'pdf-resources') loadPDFs();
}
function selectApp(app,el) {
  el.closest('.app-selector').querySelectorAll('.app-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active'); currentApp=app; renderSteps(); renderAppImage(); loadAndRenderVideos();
}
function selectOp(op,el) {
  el.closest('.app-selector').querySelectorAll('.app-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active'); currentOp=op; renderSteps(); loadAndRenderVideos();
}
function renderSteps() {
  const data = upiSteps[currentApp]?.[currentOp]; if(!data) return;
  document.getElementById('steps-title').textContent = data.title;
  document.getElementById('steps-list').innerHTML = data.steps.map((s,i)=>`<li><div class="step-circle">${i+1}</div><p>${s}</p></li>`).join('');
}
function renderAppImage() {
  const info = appInfo[currentApp];
  document.getElementById('app-emoji').innerHTML = `
    <img src="${info.png}" class="app-icon" alt="${info.name}">
  `;
  document.getElementById('app-name-display').textContent = info.name;
  document.getElementById('app-desc-display').textContent = info.desc;
}
function renderVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  const videos = videoCache[currentApp]?.[currentOp] || [];
  if (videos.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:24px 0;">
        <div style="font-size:36px;margin-bottom:8px;">🎬</div>
        <p style="color:var(--text-muted);font-size:13px;">No videos yet for this section.<br>Add rows to the <code>video_tutorials</code> table in your DB.</p>
      </div>`;
    return;
  }
  grid.innerHTML = videos.map((v, i) => `
    <div class="video-card" onclick="openVideo('${(v.url||'').replace(/'/g,'&#39;')}','${(v.title||'').replace(/'/g,'&#39;')}')">
      ${v.thumb
        ? `<img src="${v.thumb}" alt="${v.title}" style="width:100%;height:80px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:8px;" onerror="this.style.display='none'">`
        : `<div class="play">▶️</div>`}
      <p>${v.title}</p>
    </div>`).join('');
}

function openVideo(url, title) {
  if (!url || url === '#' || url === '') {
    showToast('⚠️ Video URL not set — add it to the video_tutorials table in DB');
    return;
  }
  // Convert YouTube watch URLs to embed URLs for in-page modal
  const embedUrl = url
    .replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
    .replace('https://youtu.be/', 'https://www.youtube.com/embed/');

  // If it looks like a YouTube embed, show inline modal; otherwise open in new tab
  if (embedUrl.includes('youtube.com/embed/')) {
    showVideoModal(embedUrl, title);
  } else {
    window.open(url, '_blank');
  }
}

// ── Inline video modal (auto-created) ─────────────────────────
function showVideoModal(embedUrl, title) {
  let modal = document.getElementById('_video_modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = '_video_modal';
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;
      display:flex;align-items:center;justify-content:center;padding:20px;`;
    modal.innerHTML = `
      <div style="background:var(--card-bg);border-radius:var(--radius-lg);overflow:hidden;
                  max-width:780px;width:100%;box-shadow:var(--shadow-lg);">
        <div style="display:flex;align-items:center;justify-content:space-between;
                    padding:16px 20px;border-bottom:1px solid var(--border);">
          <h4 id="_video_modal_title" style="margin:0;font-size:15px;"></h4>
          <button onclick="closeVideoModal()"
            style="background:none;border:none;font-size:22px;color:var(--text-muted);line-height:1;">✕</button>
        </div>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe id="_video_modal_iframe" frameborder="0" allowfullscreen
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) closeVideoModal(); });
    document.body.appendChild(modal);
  }
  document.getElementById('_video_modal_title').textContent = title;
  document.getElementById('_video_modal_iframe').src = embedUrl;
  modal.style.display = 'flex';
}
function closeVideoModal() {
  const modal = document.getElementById('_video_modal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('_video_modal_iframe').src = ''; // stop video
  }
}

// ===== QUIZ =====
const quizQs = [
  {q:"What should you NEVER share with anyone, including bank employees?",opts:["Your name","Your UPI PIN / OTP","Your UPI ID","Your bank name"],ans:1},
  {q:"You receive a collect request and someone says 'Accept it to receive ₹500'. What happens if you enter your PIN?",opts:["You receive ₹500","Nothing happens","₹500 is SENT from your account","Your account gets blocked"],ans:2},
  {q:"A customer shows a payment screenshot. What should you do?",opts:["Trust the screenshot","Check your own bank SMS","Ask them to pay again","Call the police"],ans:1},
  {q:"Which is a REAL PhonePe developer name?",opts:["PhonePe Payments Ltd","PhonePay Inc","PhonePe Pvt Ltd","PhonePe Technologies"],ans:2},
  {q:"QR codes are used for:",opts:["Receiving money only","Paying money only","Both sending and receiving","None of the above"],ans:1},
  {q:"BHIM UPI is developed by:",opts:["Reserve Bank of India","State Bank of India","NPCI","Google"],ans:2},
  {q:"If 'RBI customer care' calls asking for your OTP, you should:",opts:["Share the OTP quickly","Ask for their ID","Hang up — it's a scam","Write down the OTP"],ans:2},
  {q:"SAFEST way to find UPI customer care number?",opts:["Google Search","Social media","Official app Help section","WhatsApp forwards"],ans:2},
  {q:"What does UPI stand for?",opts:["Universal Payment Interface","Unified Payments Interface","United Payment Integration","Universal Prepaid Interface"],ans:1},
  {q:"A fake UPI app may be named:",opts:["PhonePe","GooglePay","PaytmPay","BHIM"],ans:2},
  {q:"UPI daily transaction limit on most apps is:",opts:["₹5,000","₹50,000","₹1,00,000","₹10,00,000"],ans:2},
  {q:"To receive UPI payment you need to:",opts:["Share your UPI ID or QR code","Enter your PIN","Visit the bank","Share bank password"],ans:0},
  {q:"Which regulator oversees UPI in India?",opts:["SEBI","IRDA","RBI and NPCI","Ministry of Finance"],ans:2},
  {q:"'Phishing' in digital payments means:",opts:["Fishing digitally","Tricking you to reveal sensitive data","A type of UPI transaction","Paying in installments"],ans:1},
  {q:"Your UPI PIN should be:",opts:["Your date of birth","Shared with family","Known only to you","Your Aadhaar last 4 digits"],ans:2},
  {q:"If UPI transaction fails but money is deducted, you should:",opts:["Accept the loss","Wait — it auto-reverses in 5 business days","Create another account","Never use UPI again"],ans:1},
  {q:"Which transaction does NOT require UPI PIN?",opts:["Sending money","Receiving money","Bill payment","Wallet top-up"],ans:1},
  {q:"What is *99#?",opts:["Police helpline","USSD mobile banking without internet","UPI fraud helpline","Bank branch code"],ans:1},
  {q:"UPI transaction history is accessible through:",opts:["UPI app passbook section","Only bank branch","Not possible","Only on computer"],ans:0},
  {q:"Best defense against UPI fraud is:",opts:["Using cash only","Never using UPI","Staying informed about scams","Keeping phone off"],ans:2},
];
let quizIdx=0, quizScore=0, quizAnswered=false, activeQuizQs=[];

async function startQuiz() {
  quizIdx=0; quizScore=0; quizAnswered=false;
  document.getElementById('quiz-start-screen').style.display='none';
  document.getElementById('quiz-result').style.display='none';
  document.getElementById('quiz-active').style.display='block';
  document.getElementById('quiz-q-text').textContent='Loading questions...';
  document.getElementById('quiz-options').innerHTML='';
  document.getElementById('quiz-next-btn').style.display='none';

  try {
    const res = await fetch(`${API}/quiz/questions`);
    if(!res.ok) throw new Error('API failed');
    const dbQs = await res.json();
    if(!dbQs || dbQs.length === 0) throw new Error('Empty');
    activeQuizQs = dbQs.map(q => ({
      q:   q.question_text,
      opts:[q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
      ans: ['a','b','c','d'].indexOf((q.correct_option||'').toLowerCase().trim())
    })).filter(q => q.ans >= 0);
    if(activeQuizQs.length === 0) throw new Error('Bad mapping');
    console.log('✅ Loaded', activeQuizQs.length, 'questions from DB');
  } catch(e) {
    console.log('Using hardcoded questions:', e.message);
    activeQuizQs = [...quizQs];
  }

  activeQuizQs = activeQuizQs.sort(() => Math.random() - 0.5);
  renderQuizQ();
}

function renderQuizQ() {
  const q = activeQuizQs[quizIdx]; quizAnswered=false;
  document.getElementById('quiz-q-num').textContent=`Question ${quizIdx+1} of ${activeQuizQs.length}`;
  document.getElementById('quiz-q-text').textContent=q.q;
  document.getElementById('quiz-prog-fill').style.width=((quizIdx+1)/activeQuizQs.length*100)+'%';
  document.getElementById('quiz-next-btn').style.display='none';
  document.getElementById('quiz-options').innerHTML=q.opts.map((o,i)=>`<button class="quiz-option" onclick="answerQuiz(${i},this)" onkeydown="quizKeyNav(event,${i},this)">${o}</button>`).join('');
  document.querySelector('.quiz-option')?.focus();
}

// Global Enter key for quiz — after answering, Enter moves to next
document.addEventListener('keydown', e => {
  if(e.key === 'Enter' && quizAnswered && document.getElementById('quiz-active')?.style.display !== 'none') {
    e.preventDefault();
    quizNext();
  }
});
function quizKeyNav(e,idx,el) {
  if(e.key==='Enter') {
    e.preventDefault();
    if(!quizAnswered) answerQuiz(idx,el);
    else quizNext();
  }
}
function answerQuiz(idx, el) {
  if(quizAnswered) return;
  quizAnswered = true;
  const correct = activeQuizQs[quizIdx].ans;
  const allOpts = Array.from(document.querySelectorAll('.quiz-option'));

  // Disable all buttons first
  allOpts.forEach(btn => { btn.disabled=true; btn.style.pointerEvents='none'; btn.style.transition='none'; });

  // Style correct answer — always green
  if(allOpts[correct]) {
    allOpts[correct].style.cssText = 'border:2px solid #28CB8B !important;background:#E8F5E9 !important;color:#1B5E20 !important;font-weight:700 !important;padding:12px 18px;border-radius:8px;font-size:14px;text-align:left;width:100%;pointer-events:none;';
  }

  if(idx === correct) {
    quizScore++;
  } else {
    // Style wrong answer — red
    el.style.cssText = 'border:2px solid #E53835 !important;background:#FFEBEE !important;color:#E53835 !important;font-weight:700 !important;padding:12px 18px;border-radius:8px;font-size:14px;text-align:left;width:100%;pointer-events:none;';
  }

  document.getElementById('quiz-next-btn').style.display = 'inline-flex';
}
function quizNext() { quizIdx++; if(quizIdx<activeQuizQs.length) renderQuizQ(); else showQuizResult(); }
async function showQuizResult() {
  document.getElementById('quiz-active').style.display='none';
  document.getElementById('quiz-result').style.display='block';
  const pct=Math.round(quizScore/activeQuizQs.length*100), passed=pct>=75;
  document.getElementById('cert-pass').style.display=passed?'block':'none';
  document.getElementById('cert-fail').style.display=passed?'none':'block';
  const userName=currentUser?currentUser.full_name:'Guest User';
  if(passed){
    document.getElementById('cert-score').textContent=pct+'% ('+quizScore+'/'+activeQuizQs.length+')';
    document.getElementById('cert-score2').textContent=pct+'%';
    document.getElementById('cert-name').textContent=userName;
    document.getElementById('cert-date').textContent=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  } else { document.getElementById('fail-score').textContent=pct+'%'; }
  if(currentUser) {
    try { await fetch(`${API}/quiz/submit`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify({score:quizScore,total_questions:activeQuizQs.length})}); } catch{}
  }
}

// ===== TRY PAYMENT =====
let simBalance=5000;
function showTry(view) {
  document.getElementById('try-options-view').style.display=view==='options'?'block':'none';
  document.getElementById('try-sim-view').style.display=view==='sim'?'block':'none';
  document.getElementById('try-ngo-view').style.display=view==='ngo'?'block':'none';
  if(view==='ngo') loadRandomNGO();
}
function simPay() {
  const upi=document.getElementById('sim-upi-id').value;
  const amt=parseFloat(document.getElementById('sim-amount').value);
  if(!upi||!amt||amt<=0){showToast('Please enter UPI ID and amount');return;}
  if(amt>simBalance){showToast('Insufficient balance!');return;}
  simBalance-=amt;
  document.getElementById('sim-balance').textContent='₹'+simBalance.toFixed(2);
  document.getElementById('sim-form').style.display='none';
  document.getElementById('sim-status').classList.add('show');
  document.getElementById('sim-result-text').textContent=`₹${amt.toFixed(2)} sent to ${upi} (DEMO)`;
}
function resetSim() {
  document.getElementById('sim-form').style.display='block';
  document.getElementById('sim-status').classList.remove('show');
  ['sim-upi-id','sim-amount','sim-remark'].forEach(id=>document.getElementById(id).value='');
}
async function loadRandomNGO() {
  const display=document.getElementById('ngo-display');
  display.innerHTML='<p style="text-align:center;padding:20px;color:var(--text-muted);">Loading NGO...</p>';
  try {
    const res=await fetch(`${API}/ngos/random`);
    const ngo=await res.json();
    const emojis=['🌸','🌾','📚','🛡️','💚','🤝'];
    const emoji=emojis[Math.floor(Math.random()*emojis.length)];
    display.innerHTML=`
      <div class="ngo-card">
        <div style="font-size:48px;margin-bottom:8px;">${emoji}</div>
        <h3>${ngo.name}</h3><p>${ngo.description||''}</p>
        <div class="ngo-qr">${emoji}</div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:5px;">UPI ID: <strong style="color:var(--text);">${ngo.upi_id}</strong></p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="showToast('Opening UPI to donate to ${ngo.name}... ✅')">Donate via UPI</button>
          <a href="${ngo.website_url||'#'}" target="_blank" class="btn btn-outline">Visit Website →</a>
        </div>
      </div>`;
  } catch { display.innerHTML='<p style="color:var(--error);text-align:center;padding:20px;">Could not load NGO. Make sure server is running.</p>'; }
}

// ===== COMMUNITY =====
let allPosts=[];
async function loadPosts(search='') {
  const feed=document.getElementById('posts-feed'); if(!feed) return;
  feed.innerHTML='<p style="color:var(--text-muted);padding:20px;">Loading posts...</p>';
  try {
    const res=await fetch(`${API}/posts?search=${encodeURIComponent(search)}`);
    allPosts=await res.json();
    renderPosts(allPosts);
    // Update stats here — posts are already loaded so just calculate
    if(currentUser) {
      const myPosts    = allPosts.filter(p => parseInt(p.user_id) === parseInt(currentUser.id));
      const myLikes    = myPosts.reduce((s,p) => s + parseInt(p.likes_count||0), 0);
      const myComments = myPosts.reduce((s,p) => s + parseInt(p.comment_count||0), 0);
      const sp = document.getElementById('stat-posts');
      const sl = document.getElementById('stat-likes');
      const sc = document.getElementById('stat-comments');
      if(sp) sp.textContent = myPosts.length;
      if(sl) sl.textContent = myLikes;
      if(sc) sc.textContent = myComments;
    }
  } catch {
    allPosts=[
      {id:1,full_name:"Priya Patil",quiz_status:"certified",content:"Just completed the fraud awareness quiz and got certified! 🏆 The QR code scam section was eye-opening.",likes_count:24,comment_count:5,created_at:new Date(Date.now()-7200000)},
      {id:2,full_name:"Suresh Kumar",quiz_status:"attempted",content:"Attended the UPI workshop in Nashik yesterday. Very useful for shopkeepers!",likes_count:18,comment_count:3,created_at:new Date(Date.now()-18000000)},
      {id:3,full_name:"Anita Devi",quiz_status:"none",content:"My mother (58) finally learned to use PhonePe after watching the tutorial here! So proud 😊",likes_count:47,comment_count:12,created_at:new Date(Date.now()-86400000)},
    ];
    renderPosts(allPosts);
  }
}
function renderPosts(posts) {
  const feed=document.getElementById('posts-feed'); if(!feed) return;
  if(posts.length===0){feed.innerHTML='<p style="color:var(--text-muted);padding:20px;">No posts yet. Be the first!</p>';return;}
  // Sort newest first
  const sorted=[...posts].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  feed.innerHTML=sorted.map((p,i)=>`
    <div class="post-card" id="post-${p.id||i}">
      <div class="post-header">
        <div class="post-avatar">${(p.full_name||'U')[0].toUpperCase()}</div>
        <div>
          <h5 style="display:flex;align-items:center;gap:5px;">${p.full_name||'User'} ${getQuizBadge(p.quiz_status||'none')}</h5>
          <span class="time">${timeAgo(p.created_at)}</span>
        </div>
        ${currentUser&&p.user_id===currentUser.id?`<div style="margin-left:auto;display:flex;gap:6px;">
          <button class="post-action" onclick="editPost(${p.id||i})">✏️ Edit</button>
          <button class="post-action" style="color:var(--error);" onclick="deletePost(${p.id||i})">🗑️ Delete</button>
        </div>`:''}
      </div>
      <p class="post-text">${p.content}</p>
      <div class="post-actions">
        <button class="post-action" onclick="likePost(${p.id||i},this)"> <img src='./assets/profile/like.png' style='height:20px'  /> ${p.likes_count||0} Likes</button>
        <button class="post-action" onclick="dislikePost(this)"> <img src='./assets/profile/dislike.png' style='height:20px'  /> Dislike</button>
        <button class="post-action" onclick="toggleComments(${p.id||i})"> <img src='./assets/profile/commnets.png' style='height:20px' /> ${p.comment_count||0} Comments</button>
        <button class="post-action"> <img src='./assets/profile/Share (2).png' style='height:20px' /> Share</button>
      </div>
      <div class="comments-section" id="comments-${p.id||i}">
        <div id="comments-list-${p.id||i}"></div>
        <div class="comment-input-wrap">
          <input type="text" placeholder="Write a comment... (Enter to post)" id="comment-input-${p.id||i}" onkeydown="handleCommentKey(event,${p.id||i})"/>
          <button class="btn btn-primary btn-sm" onclick="submitComment(${p.id||i})">Post</button>
        </div>
      </div>
    </div>`).join('');
}
function timeAgo(date) {
  const diff=Math.floor((Date.now()-new Date(date))/1000);
  if(diff<60) return 'Just now';
  if(diff<3600) return Math.floor(diff/60)+' min ago';
  if(diff<86400) return Math.floor(diff/3600)+' hrs ago';
  return Math.floor(diff/86400)+' days ago';
}
function filterPosts(val) { loadPosts(val); }
function handlePostKey(e) { if(e.key==='Enter'&&e.ctrlKey) submitPost(); }
function handleCommentKey(e,postId) { if(e.key==='Enter') submitComment(postId); }
function handleReviewKey(e) { if(e.key==='Enter'&&e.ctrlKey) submitReview(); }

async function likePost(id,el) {
  if(!requireLogin()) return;
  const isLiked = el.classList.contains('liked');
  try {
    await fetch(`${API}/posts/${id}/like`,{method:'POST',headers:{'Authorization':'Bearer '+getToken()}});
    const num = parseInt(el.textContent.match(/\d+/)[0]) || 0;
    if(isLiked) {
      el.classList.remove('liked');
      el.style.color = '';
      el.textContent = '❤️ ' + Math.max(0, num - 1) + ' Likes';
    } else {
      el.classList.add('liked');
      el.style.color = 'var(--error)';
      el.textContent = '❤️ ' + (num + 1) + ' Likes';
    }
  } catch { showToast('Could not like post'); }
}
function dislikePost(el) {
  if(!requireLogin()) return;
  el.classList.toggle('disliked');
  el.textContent = el.classList.contains('disliked') ? '👎 Disliked' : '👎 Dislike';
}
async function submitPost() {
  if(!requireLogin()) return;
  const content=document.getElementById('post-text').value.trim();
  if(!content){showToast('Please write something first');return;}
  try {
    await fetch(`${API}/posts`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify({content})});
    document.getElementById('post-text').value='';
    showToast('Post shared! ✅'); loadPosts();
  } catch { showToast('Could not submit post. Is server running?'); }
}
function editPost(id) {
  const postCard = document.getElementById(`post-${id}`);
  if(!postCard) { showToast('Post not found'); return; }
  const textEl = postCard.querySelector('.post-text');
  const oldContent = textEl.textContent;
  // Replace text with editable input
  textEl.innerHTML = `
    <textarea class="survey-textarea" id="edit-post-${id}" style="min-height:60px;margin-bottom:8px;">${oldContent}</textarea>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary btn-sm" onclick="saveEditPost(${id},'${oldContent.replace(/'/g,"\\'")}')">Save</button>
      <button class="btn btn-outline btn-sm" onclick="cancelEditPost(${id},'${oldContent.replace(/'/g,"\\'")}')">Cancel</button>
    </div>`;
}
function cancelEditPost(id, original) {
  const postCard = document.getElementById(`post-${id}`);
  if(postCard) postCard.querySelector('.post-text').innerHTML = original;
}
async function saveEditPost(id, original) {
  const textarea = document.getElementById(`edit-post-${id}`);
  const newContent = textarea?.value?.trim();
  if(!newContent) { showToast('Post cannot be empty'); return; }
  try {
    const res = await fetch(`${API}/posts/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},
      body: JSON.stringify({content: newContent})
    });
    if(res.ok) { showToast('Post updated! ✅'); loadPosts(); }
    else { showToast('Could not update post'); }
  } catch {
    // Fallback — update locally
    const postCard = document.getElementById(`post-${id}`);
    if(postCard) postCard.querySelector('.post-text').textContent = newContent;
    showToast('Post updated locally ✅');
  }
}
async function deletePost(id) {
  if(!confirm('Are you sure you want to delete this post?')) return;
  try {
    await fetch(`${API}/posts/${id}`, {
      method:'DELETE',
      headers:{'Authorization':'Bearer '+getToken()}
    });
    showToast('Post deleted ✅');
    loadPosts();
  } catch {
    // Fallback — remove from DOM
    document.getElementById(`post-${id}`)?.remove();
    showToast('Post deleted ✅');
  }
}

function editComment(id, btn) {
  const textEl = document.getElementById(`comment-text-${id}`);
  if(!textEl) return;
  const old = textEl.textContent;
  textEl.innerHTML = `
    <input type="text" value="${old.replace(/"/g,'&quot;')}" id="edit-comment-input-${id}"
      style="width:100%;padding:7px 10px;border:1.5px solid var(--primary);border-radius:var(--radius-sm);background:var(--card-bg);color:var(--text);font-family:var(--font-body);font-size:13px;margin-bottom:6px;"
      onkeydown="if(event.key==='Enter') saveEditComment('${id}','${old.replace(/'/g,"\\'")}')"/>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-primary btn-sm" onclick="saveEditComment('${id}','${old.replace(/'/g,"\\'")}')">Save</button>
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('comment-text-${id}').textContent='${old.replace(/'/g,"\\'")}' ">Cancel</button>
    </div>`;
  document.getElementById(`edit-comment-input-${id}`)?.focus();
}
async function saveEditComment(id, original) {
  const input = document.getElementById(`edit-comment-input-${id}`);
  const newContent = input?.value?.trim();
  if(!newContent) { showToast('Comment cannot be empty'); return; }
  try {
    await fetch(`${API}/comments/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},
      body: JSON.stringify({content: newContent})
    });
  } catch {}
  const textEl = document.getElementById(`comment-text-${id}`);
  if(textEl) textEl.textContent = newContent;
  showToast('Comment updated ✅');
}
async function deleteComment(id, postId) {
  if(!confirm('Delete this comment?')) return;
  try {
    await fetch(`${API}/comments/${id}`, {
      method:'DELETE',
      headers:{'Authorization':'Bearer '+getToken()}
    });
  } catch {}
  document.getElementById(`comment-item-${id}`)?.remove();
  showToast('Comment deleted ✅');
}
function getQuizBadge(status) {
  if(status === 'certified') return '<span title="Quiz Passed" style="font-size:13px;color:#28CB8B;font-weight:700;margin-left:4px;">✔</span>';
  if(status === 'attempted') return '<span title="Quiz Attempted" style="font-size:13px;color:#FBC02D;font-weight:700;margin-left:4px;">✔</span>';
  return '<span title="Quiz Not Attempted" style="font-size:13px;color:#E53835;font-weight:700;margin-left:4px;">✔</span>';
}

function toggleComments(postId) {
  const section=document.getElementById(`comments-${postId}`);
  section.classList.toggle('show');
  if(section.classList.contains('show')) loadComments(postId);
}
async function loadComments(postId) {
  const list=document.getElementById(`comments-list-${postId}`); if(!list) return;
  try {
    const res=await fetch(`${API}/posts/${postId}/comments`);
    const comments=await res.json();
    // Sort newest first
    const sorted=[...comments].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

    // If no comments from DB, show demo comments so styling is visible
    const displayComments = sorted.length > 0 ? sorted : [
      {id:'demo1', full_name:'Priya Patil', quiz_status:'certified', content:'This is very helpful! I learned how to use PhonePe safely. Thank you for this platform.', created_at: new Date(Date.now()-3600000), user_id:null},
      {id:'demo2', full_name:'Suresh Kumar', quiz_status:'attempted', content:'Great post! The fraud awareness section really opened my eyes about QR code scams.', created_at: new Date(Date.now()-7200000), user_id:null},
      {id:'demo3', full_name:'Anita Devi', quiz_status:'none', content:'I am new here, just starting to learn about UPI payments.', created_at: new Date(Date.now()-86400000), user_id:null},
    ];

    list.innerHTML=displayComments.map(c=>`
        <div class="comment-item" id="comment-item-${c.id}">
          <div class="comment-header">
            <div class="comment-user">
              <div class="comment-avatar">${(c.full_name||'U')[0].toUpperCase()}</div>
              <span class="comment-name">${c.full_name||'User'}</span>
              ${getQuizBadge(c.quiz_status||'none')}
              <span class="comment-time">${timeAgo(c.created_at)}</span>
            </div>
            <div class="comment-actions">
              <button class="comment-action" onclick="likeComment(this)">❤️ ${c.likes_count||0}</button>
              <button class="comment-action" onclick="dislikeComment(this)">👎</button>
              <button class="comment-action" onclick="showReplyInput(this)">↩️ Reply</button>
              ${currentUser&&c.user_id===currentUser.id?`<button class="comment-action" onclick="editComment('${c.id}',this)">✏️ Edit</button><button class="comment-action" style="color:var(--error);" onclick="deleteComment('${c.id}','${postId}')">🗑️ Delete</button>`:''}
            </div>
          </div>
          <p class="comment-text" id="comment-text-${c.id}">${c.content}</p>
          <div class="reply-section" id="replies-${c.id}"></div>
        </div>`).join('');
  } catch { list.innerHTML='<p style="font-size:13px;color:var(--error);">Could not load comments.</p>'; }
}
function likeComment(el) {
  if(!requireLogin()) return;
  const isLiked = el.classList.contains('liked');
  const n = parseInt(el.textContent.match(/\d+/)[0]) || 0;
  if(isLiked) {
    // Unlike
    el.classList.remove('liked');
    el.style.color = '';
    el.textContent = '❤️ ' + (n - 1);
  } else {
    // Like
    el.classList.add('liked');
    el.style.color = 'var(--error)';
    el.textContent = '❤️ ' + (n + 1);
  }
}
function dislikeComment(el) { el.classList.toggle('disliked'); el.textContent=el.classList.contains('disliked')?'👎 1':'👎'; }
function showReplyInput(btn) {
  const commentItem=btn.closest('.comment-item');
  const existing=commentItem.querySelector('.reply-input-wrap');
  if(existing){existing.remove();return;}
  const div=document.createElement('div');
  div.className='comment-input-wrap reply-input-wrap';
  div.style.marginTop='8px';
  div.innerHTML=`<input type="text" placeholder="Write a reply... (Enter to post)" style="font-size:12px;"/><button class="btn btn-primary btn-sm" onclick="submitReplyInline(this)">Reply</button>`;
  div.querySelector('input').addEventListener('keydown', e=>{if(e.key==='Enter') submitReplyInline(div.querySelector('button'));});
  commentItem.appendChild(div);
  div.querySelector('input').focus();
}
function submitReplyInline(btn) {
  if(!requireLogin()) return;
  const input=btn.previousElementSibling;
  const text=input.value.trim();
  if(!text){showToast('Please write a reply');return;}
  const commentItem=btn.closest('.comment-item');
  const replies=commentItem.querySelector('.reply-section');
  const replyDiv=document.createElement('div');
  replyDiv.className='reply-item';
  replyDiv.innerHTML=`<div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;"><div class="comment-avatar" style="width:22px;height:22px;font-size:9px;">${(currentUser?.full_name||'U')[0]}</div><span class="comment-name" style="font-size:12px;">${currentUser?.full_name||'You'}</span><span class="comment-time">Just now</span></div><p class="comment-text" style="font-size:12px;">${text}</p>`;
  replies.appendChild(replyDiv);
  btn.closest('.reply-input-wrap').remove();
  showToast('Reply posted! ✅');
}
async function submitComment(postId) {
  if(!requireLogin()) return;
  const input=document.getElementById(`comment-input-${postId}`);
  const content=input.value.trim();
  if(!content){showToast('Please write a comment');return;}
  try {
    await fetch(`${API}/posts/${postId}/comments`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify({content})});
    input.value=''; loadComments(postId); showToast('Comment posted! ✅');
  } catch { showToast('Could not post comment. Is server running?'); }
}

// ===== REVIEWS =====
let userRating=5;
function setRating(r) {
  userRating=r;
  document.querySelectorAll('.star-btn').forEach((s,i)=>{
    s.classList.toggle('active', i<r);
    s.style.opacity = i<r ? '1' : '0.3';
  });
}
async function loadReviews() {
  const el=document.getElementById('reviews-list'); if(!el) return;
  try {
    const res=await fetch(`${API}/reviews`);
    const reviews=await res.json();
    if(reviews.length===0){el.innerHTML='<p style="font-size:12px;color:var(--text-muted);">No reviews yet. Be first!</p>';return;}
    el.innerHTML=reviews.slice(0,5).map(r=>`
      <div class="review-card" id="review-card-${r.id}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px;">
          <div class="stars">${'⭐'.repeat(r.rating)}</div>
          ${currentUser && parseInt(r.user_id)===parseInt(currentUser.id) ? `
          <div style="display:flex;gap:6px;">
            <button class="comment-action" onclick="editReview(${r.id},'${(r.review_text||'').replace(/'/g,"\\'")}',${r.rating})" style="font-size:11px;">✏️ Edit</button>
            <button class="comment-action" onclick="deleteReview(${r.id})" style="font-size:11px;color:var(--error);">🗑️ Delete</button>
          </div>` : ''}
        </div>
        <p style="font-size:12px;color:var(--text-muted);" id="review-text-${r.id}">"${r.review_text}"</p>
        <p style="font-size:11px;color:var(--text-muted);margin-top:5px;">— ${r.full_name||'Anonymous'}</p>
      </div>`).join('');
  } catch { el.innerHTML='<p style="font-size:12px;color:var(--text-muted);">Could not load reviews.</p>'; }
}

function editReview(id, oldText, oldRating) {
  const card = document.getElementById(`review-card-${id}`);
  if(!card) return;
  const textEl = document.getElementById(`review-text-${id}`);
  textEl.innerHTML = `
    <textarea id="edit-review-textarea-${id}"
      style="width:100%;padding:7px;border:1.5px solid var(--primary);border-radius:var(--radius-sm);font-family:var(--font-body);font-size:12px;background:var(--card-bg);color:var(--text);margin-bottom:6px;resize:none;min-height:60px;"
    >${oldText}</textarea>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-primary btn-sm" onclick="saveReview(${id},${oldRating})">Save</button>
      <button class="btn btn-outline btn-sm" onclick="loadReviews()">Cancel</button>
    </div>`;
}

async function saveReview(id, rating) {
  const textarea = document.getElementById(`edit-review-textarea-${id}`);
  const newText = textarea?.value?.trim();
  if(!newText) { showToast('Review cannot be empty'); return; }
  try {
    await fetch(`${API}/reviews/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json','Authorization':'Bearer '+getToken()},
      body: JSON.stringify({rating, review_text: newText})
    });
    showToast('Review updated ✅');
    loadReviews();
  } catch {
    showToast('Could not update review');
  }
}

async function deleteReview(id) {
  if(!confirm('Delete this review?')) return;
  try {
    await fetch(`${API}/reviews/${id}`, {
      method: 'DELETE',
      headers: {'Authorization':'Bearer '+getToken()}
    });
  } catch {}
  document.getElementById(`review-card-${id}`)?.remove();
  showToast('Review deleted ✅');
}
async function submitReview() {
  if(!requireLogin()) return;
  const text=document.getElementById('review-text').value.trim();
  if(!text){showToast('Please write your review');return;}
  try {
    await fetch(`${API}/reviews`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify({rating:userRating,review_text:text})});
    document.getElementById('review-text').value='';
    showToast('Review submitted! ✅'); loadReviews();
  } catch { showToast('Could not submit review. Is server running?'); }
}

// ===== PDF RESOURCES =====
const samplePDFs = [
  { id:1, title:"UPI Beginner's Guide", description:"Complete step-by-step guide for first-time UPI users in rural India. Covers setup, payments, and safety.", category:"upi", file_url:"#", pages:24, size_mb:2.4, downloads:1842, color:"#E8F5E9", icon:"📱" },
  { id:2, title:"Fraud Prevention Handbook", description:"Identify and avoid the most common UPI scams. Includes real case studies from rural Maharashtra.", category:"fraud", file_url:"#", pages:36, size_mb:3.1, downloads:2561, color:"#FFEBEE", icon:"🛡️" },
  { id:3, title:"Digital Banking for Farmers", description:"How farmers can use mobile banking for government subsidies, insurance claims, and direct benefit transfers.", category:"banking", file_url:"#", pages:18, size_mb:1.8, downloads:934, color:"#FFF8E1", icon:"🌾" },
  { id:4, title:"QR Code Safety Guide", description:"Learn to distinguish real QR codes from fake ones. Practical tips for shopkeepers and customers.", category:"fraud", file_url:"#", pages:12, size_mb:0.9, downloads:3102, color:"#FCE4EC", icon:"🔍" },
  { id:5, title:"Women & Digital Finance", description:"Empowering rural women with digital payment tools. Easy Hindi-friendly language with illustrations.", category:"literacy", file_url:"#", pages:28, size_mb:2.7, downloads:1455, color:"#F3E5F5", icon:"👩" },
  { id:6, title:"PhonePe Complete Manual", description:"Everything about PhonePe — account setup, sending money, receiving payments, and troubleshooting.", category:"upi", file_url:"#", pages:32, size_mb:4.2, downloads:2890, color:"#E8EAF6", icon:"💜" },
  { id:7, title:"Senior Citizen UPI Guide", description:"Simple, large-font guide for elderly users. Step-by-step with pictures for every action.", category:"literacy", file_url:"#", pages:20, size_mb:3.5, downloads:687, color:"#E0F7FA", icon:"👴" },
  { id:8, title:"Internet Banking Safety", description:"Protect yourself online — passwords, two-factor authentication, and safe browsing for banking.", category:"banking", file_url:"#", pages:16, size_mb:1.2, downloads:1203, color:"#E8F5E9", icon:"🔐" },
  { id:9, title:"UPI for Shopkeepers", description:"Accept digital payments in your shop. Setup QR codes, track payments, and grow your business.", category:"upi", file_url:"#", pages:22, size_mb:2.0, downloads:4230, color:"#FFF3E0", icon:"🏪" },
  { id:10, title:"Digital Literacy Workbook", description:"Interactive exercises to practice digital payment skills. Includes quizzes and practice scenarios.", category:"literacy", file_url:"#", pages:48, size_mb:5.6, downloads:892, color:"#E3F2FD", icon:"📝" },
];

let allPDFs = [];
let currentPDFFilter = 'all';

async function loadPDFs() {
  const loading = document.getElementById('pdf-loading');
  const grid = document.getElementById('pdf-grid');
  const empty = document.getElementById('pdf-empty');
  if(loading) loading.style.display = 'block';
  if(grid) grid.style.display = 'none';
  if(empty) empty.style.display = 'none';
  try {
    const res = await fetch(`${API}/learn/pdfs`);
    if(res.ok) { allPDFs = await res.json(); }
    else { throw new Error('use sample'); }
  } catch { allPDFs = samplePDFs; }
  if(loading) loading.style.display = 'none';
  renderPDFs(allPDFs);
}

function renderPDFs(pdfs) {
  const grid = document.getElementById('pdf-grid');
  const empty = document.getElementById('pdf-empty');
  if(!grid) return;
  if(pdfs.length === 0) { grid.style.display='none'; if(empty) empty.style.display='block'; return; }
  if(empty) empty.style.display = 'none';
  grid.style.display = 'grid';
  grid.innerHTML = pdfs.map(pdf => `
    <div class="pdf-card">
      <div class="pdf-thumbnail" style="background:${pdf.color||'var(--primary-tint)'};">
        ${pdf.thumbnail_url
          ? `<img src="${pdf.thumbnail_url}" alt="${pdf.title}" onerror="this.parentElement.innerHTML='<div class=pdf-thumbnail-placeholder style=background:${pdf.color}><span style=font-size:44px>${pdf.icon||'📄'}</span></div>'"/>`
          : `<div class="pdf-thumbnail-placeholder" style="background:${pdf.color||'var(--primary-tint)'}; width:100%;height:140px;display:flex;align-items:center;justify-content:center;"><span style="font-size:52px;">${pdf.icon||'📄'}</span></div>`
        }
        <span class="pdf-badge">PDF</span>
      </div>
      <div class="pdf-info">
        <span class="pdf-category">${getCategoryLabel(pdf.category)}</span>
        <h5>${pdf.title}</h5>
        <p>${pdf.description}</p>
        <div class="pdf-meta">
          <span>📄 ${pdf.pages||'—'}pg</span>
          <span>💾 ${pdf.size_mb||'—'}MB</span>
          <span>⬇️ ${(pdf.downloads||0).toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;margin-top:auto;"
          onclick="downloadPDF('${pdf.title}','${pdf.file_url||'#'}')">⬇️ Download Free</button>
      </div>
    </div>`).join('');
}

function getCategoryLabel(cat) {
  const labels = { upi:'📱 UPI Basics', fraud:'🛡️ Fraud Safety', banking:'🏦 Banking', literacy:'📚 Literacy' };
  return labels[cat] || cat;
}

function filterPDFs(category, el) {
  currentPDFFilter = category;
  document.querySelectorAll('#pdf-filter-row .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  applyPDFFilters(document.getElementById('pdf-search-input')?.value?.toLowerCase()||'', category);
}

function searchPDFs(query) { applyPDFFilters(query.toLowerCase(), currentPDFFilter); }

function applyPDFFilters(search, category) {
  const filtered = allPDFs.filter(pdf => {
    const matchCat = category==='all' || pdf.category===category;
    const matchSearch = !search || pdf.title.toLowerCase().includes(search) || pdf.description.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });
  renderPDFs(filtered);
}

function downloadPDF(title, url) {
  if(url && url !== '#') { window.open(url, '_blank'); }
  else { showToast(`📄 Downloading "${title}"... (Add file URL in DB)`); }
}

// ===== INIT =====
// ===== HOME PAGE STATS — fetches from existing APIs =====
async function loadHomeStats() {
  const fmt = n => {
    if(n === 0) return '0';
    if(n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/,'') + 'K+';
    return n + '+';
  };
  const set = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = fmt(val);
  };

  try {
    // Fetch all in parallel using existing routes
    const [postsRes, surveysRes, programsRes] = await Promise.all([
      fetch(`${API}/posts`),
      fetch(`${API}/dashboard`),
      fetch(`${API}/programs`),
    ]);

    const posts    = postsRes.ok    ? await postsRes.json()    : [];
    const dash     = surveysRes.ok  ? await surveysRes.json()  : {};
    const programs = programsRes.ok ? await programsRes.json() : [];

    // Members = unique user_ids who posted (approximation)
    const uniqueUsers = new Set(posts.map(p => p.user_id)).size;
    // Surveys = from dashboard total_responses
    const surveys = dash.total_responses || 0;
    // Certs = we don't have a direct route, use posts as proxy for active users
    // Programs = count of programs
    const programCount = programs.length;

    set('home-stat-members', uniqueUsers || posts.length || 0);
    set('home-stat-surveys', surveys);
    set('home-stat-certs', 0); // Will update when /api/home/stats is available
    set('home-stat-programs', programCount);

    // Try the dedicated stats route if available
    try {
      const statsRes = await fetch(`${API}/home/stats`);
      if(statsRes.ok) {
        const s = await statsRes.json();
        set('home-stat-members', s.members  || 0);
        set('home-stat-surveys', s.surveys  || 0);
        set('home-stat-certs',   s.certs    || 0);
        set('home-stat-programs',s.programs || 0);
      }
    } catch {} // Silently ignore if route doesn't exist yet

  } catch(e) {
    // Server not reachable — show dashes
    ['home-stat-members','home-stat-surveys','home-stat-certs','home-stat-programs']
      .forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '—'; });
  }
}

// Init immediately since this script is loaded after React renders the DOM
(function() {
  // Close program modal on Escape key
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeProgramModal(null, true);
  });
  initTheme();
  loadUserFromStorage();
  loadPrograms();
  loadHomeStats();
  setTimeout(()=>{ const active=document.querySelector('.nav-links button.active'); if(active) updateNavPill(active); }, 100);
  setRating(5);
})();

