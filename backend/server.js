// =============================================
// ScanSafe – Node.js + Express Backend API
// =============================================
// Install: npm install express pg bcryptjs jsonwebtoken cors dotenv
// Run: node server.js

const express = require('express');
const path    = require('path');
const { Pool } = require('pg');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ── DB Connection ─────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'scansafe',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 123,
});

// ── Auth Middleware ───────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'scansafe_secret_2024');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { full_name, email, password, phone } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (full_name,email,password_hash,phone) VALUES ($1,$2,$3,$4) RETURNING id,full_name,email,quiz_status,quiz_score',
      [full_name, email, hash, phone]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'scansafe_secret_2024', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'scansafe_secret_2024', { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT id,full_name,email,phone,dob,location,profile_pic_url,quiz_status,quiz_score,created_at FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(result.rows[0]);
});

// PUT /api/auth/profile
app.put('/api/auth/profile', auth, async (req, res) => {
  const { full_name, phone, dob, location, profile_pic_url } = req.body;
  await pool.query(
    'UPDATE users SET full_name=$1,phone=$2,dob=$3,location=$4,profile_pic_url=$5,updated_at=NOW() WHERE id=$6',
    [full_name, phone, dob, location, profile_pic_url, req.user.id]
  );
  const result = await pool.query(
    'SELECT id,full_name,email,phone,dob,location,profile_pic_url,quiz_status,quiz_score FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json({ message: 'Profile updated', user: result.rows[0] });
});

// ══════════════════════════════════════════════════════════════
// PROGRAMS
// ══════════════════════════════════════════════════════════════

// GET /api/programs
app.get('/api/programs', async (req, res) => {
  const { search, type } = req.query;
  let query = `SELECT p.*, u.full_name as host_name FROM programs p
               LEFT JOIN users u ON p.host_user_id=u.id WHERE p.is_approved=true`;
  const params = [];
  if (search) { params.push(`%${search}%`); query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`; }
  if (type === 'free') query += ' AND p.is_free=true';
  if (type === 'paid') query += ' AND p.is_free=false';
  query += ' ORDER BY p.event_date ASC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/programs
app.post('/api/programs', auth, async (req, res) => {
  const { name, description, event_date, event_time, venue, is_free, price_amount, contact_phone, contact_email } = req.body;
  if (!name || !event_date || !event_time || !venue)
    return res.status(400).json({ error: 'Name, date, time and venue are required' });
  const result = await pool.query(
    `INSERT INTO programs (host_user_id,name,description,event_date,event_time,venue,is_free,price_amount,contact_phone,contact_email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [req.user.id, name, description, event_date, event_time, venue, is_free, price_amount||0, contact_phone, contact_email]
  );
  res.status(201).json(result.rows[0]);
});

// ══════════════════════════════════════════════════════════════
// SURVEY
// ══════════════════════════════════════════════════════════════

// POST /api/survey
app.post('/api/survey', async (req, res) => {
  const {
    participant_name, age, gender, occupation, accepts_upi, upi_apps_used,
    avg_upi_customers_out_of_10, upi_age_group, payment_preference, upi_problems,
    had_transaction_issues, needs_digital_help, helps_others_with_payments,
    reasons_villagers_dont_use_upi, preference_explanation
  } = req.body;
  const result = await pool.query(
    `INSERT INTO surveys (participant_name,age,gender,occupation,accepts_upi,upi_apps_used,
     avg_upi_customers_out_of_10,upi_age_group,payment_preference,upi_problems,
     had_transaction_issues,needs_digital_help,helps_others_with_payments,
     reasons_villagers_dont_use_upi,preference_explanation)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
    [participant_name,age,gender,occupation,accepts_upi,upi_apps_used,
     avg_upi_customers_out_of_10,upi_age_group,payment_preference,upi_problems,
     had_transaction_issues,needs_digital_help,helps_others_with_payments,
     reasons_villagers_dont_use_upi,preference_explanation]
  );
  res.status(201).json({ message: 'Survey submitted successfully', id: result.rows[0].id });
});

// ══════════════════════════════════════════════════════════════
// HOME PAGE STATS — Real counts from DB
// ══════════════════════════════════════════════════════════════

// GET /api/home/stats
app.get('/api/home/stats', async (req, res) => {
  try {
    const [members, surveys, certs, programs] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM surveys'),
      pool.query("SELECT COUNT(*) FROM users WHERE quiz_status='certified'"),
      pool.query('SELECT COUNT(*) FROM programs WHERE is_approved=true'),
    ]);
    res.json({
      members:  parseInt(members.rows[0].count),
      surveys:  parseInt(surveys.rows[0].count),
      certs:    parseInt(certs.rows[0].count),
      programs: parseInt(programs.rows[0].count),
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// DASHBOARD — Live chart data from survey responses
// ══════════════════════════════════════════════════════════════

// GET /api/dashboard
app.get('/api/dashboard', async (req, res) => {
  const [total, upiAccept, cashVsUpi, apps, ageGroup, problems, prefs] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM surveys'),
    pool.query(`SELECT accepts_upi, COUNT(*) as count FROM surveys WHERE accepts_upi IS NOT NULL GROUP BY accepts_upi`),
    pool.query(`SELECT payment_preference, COUNT(*) as count FROM surveys WHERE payment_preference IS NOT NULL GROUP BY payment_preference`),
    pool.query(`SELECT UNNEST(upi_apps_used) as app, COUNT(*) as count FROM surveys WHERE upi_apps_used IS NOT NULL GROUP BY app ORDER BY count DESC`),
    pool.query(`SELECT upi_age_group, COUNT(*) as count FROM surveys WHERE upi_age_group IS NOT NULL GROUP BY upi_age_group`),
    pool.query(`SELECT UNNEST(upi_problems) as problem, COUNT(*) as count FROM surveys WHERE upi_problems IS NOT NULL GROUP BY problem ORDER BY count DESC`),
    pool.query(`SELECT payment_preference, COUNT(*) as count FROM surveys WHERE payment_preference IS NOT NULL GROUP BY payment_preference`),
  ]);
  res.json({
    total_responses: parseInt(total.rows[0].count),
    upi_acceptance:  upiAccept.rows,
    cash_vs_upi:     cashVsUpi.rows,
    app_popularity:  apps.rows,
    age_groups:      ageGroup.rows,
    problems:        problems.rows,
    payment_prefs:   prefs.rows,
  });
});

// ══════════════════════════════════════════════════════════════
// LEARN
// ══════════════════════════════════════════════════════════════

// GET /api/learn/steps?app=PhonePe&operation=pay
app.get('/api/learn/steps', async (req, res) => {
  const { app, operation } = req.query;
  const result = await pool.query(
    'SELECT * FROM upi_app_steps WHERE app_name=$1 AND operation=$2 ORDER BY step_number',
    [app, operation]
  );
  res.json(result.rows);
});

// GET /api/learn/videos?app=PhonePe&operation=pay
app.get('/api/learn/videos', async (req, res) => {
  const { app, operation } = req.query;
  let query = 'SELECT * FROM video_tutorials WHERE 1=1';
  const params = [];
  if (app)       { params.push(app);       query += ` AND app_name=$${params.length}`; }
  if (operation) { params.push(operation); query += ` AND operation=$${params.length}`; }
  query += ' ORDER BY app_name, operation';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// GET /api/learn/pdfs
app.get('/api/learn/pdfs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM digital_literacy_pdfs WHERE is_active=true ORDER BY downloads DESC'
    );
    res.json(result.rows);
  } catch {
    res.json([]);
  }
});

// ══════════════════════════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════════════════════════

// GET /api/quiz/questions
app.get('/api/quiz/questions', async (req, res) => {
  const result = await pool.query(
    'SELECT id,question_text,option_a,option_b,option_c,option_d,correct_option FROM quiz_questions ORDER BY RANDOM() LIMIT 20'
  );
  res.json(result.rows);
});

// POST /api/quiz/submit
app.post('/api/quiz/submit', auth, async (req, res) => {
  const { score, total_questions } = req.body;
  const pct    = parseFloat(((score / total_questions) * 100).toFixed(2));
  const passed = pct >= 75;
  const status = passed ? 'certified' : 'attempted';

  // Save attempt
  await pool.query(
    'INSERT INTO quiz_attempts (user_id,score,total_questions,percentage,passed) VALUES ($1,$2,$3,$4,$5)',
    [req.user.id, score, total_questions, pct, passed]
  );

  // Update user — only upgrade status (never downgrade certified to attempted)
  await pool.query(
    `UPDATE users SET quiz_score=$1,
     quiz_status = CASE
       WHEN quiz_status='certified' THEN 'certified'
       WHEN $2='certified' THEN 'certified'
       ELSE $2
     END,
     updated_at=NOW()
     WHERE id=$3`,
    [score, status, req.user.id]
  );

  // Return updated user
  const updated = await pool.query(
    'SELECT id,full_name,email,phone,dob,location,profile_pic_url,quiz_status,quiz_score FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json({ passed, percentage: pct, status, user: updated.rows[0] });
});

// ══════════════════════════════════════════════════════════════
// NGOs
// ══════════════════════════════════════════════════════════════

// GET /api/ngos/random
app.get('/api/ngos/random', async (req, res) => {
  const result = await pool.query('SELECT * FROM ngos WHERE is_active=true ORDER BY RANDOM() LIMIT 1');
  res.json(result.rows[0] || {});
});

// GET /api/ngos
app.get('/api/ngos', async (req, res) => {
  const result = await pool.query('SELECT * FROM ngos WHERE is_active=true ORDER BY name');
  res.json(result.rows);
});

// ══════════════════════════════════════════════════════════════
// COMMUNITY — POSTS
// ══════════════════════════════════════════════════════════════

// GET /api/posts?search=keyword
app.get('/api/posts', async (req, res) => {
  const { search } = req.query;
  let query = `SELECT p.*, u.full_name, u.profile_pic_url, u.quiz_status,
               (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.id) as comment_count
               FROM posts p JOIN users u ON p.user_id=u.id WHERE 1=1`;
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (p.content ILIKE $1 OR u.full_name ILIKE $1)`;
  }
  query += ' ORDER BY p.created_at DESC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/posts
app.post('/api/posts', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  const result = await pool.query(
    'INSERT INTO posts (user_id,content) VALUES ($1,$2) RETURNING *',
    [req.user.id, content]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/posts/:id
app.put('/api/posts/:id', auth, async (req, res) => {
  const { content } = req.body;
  const result = await pool.query(
    'UPDATE posts SET content=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *',
    [content, req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// DELETE /api/posts/:id
app.delete('/api/posts/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Post deleted' });
});

// POST /api/posts/:id/like  (toggle like)
app.post('/api/posts/:id/like', auth, async (req, res) => {
  const postId = req.params.id;
  try {
    await pool.query('INSERT INTO post_likes (post_id,user_id) VALUES ($1,$2)', [postId, req.user.id]);
    await pool.query('UPDATE posts SET likes_count=likes_count+1 WHERE id=$1', [postId]);
    res.json({ liked: true });
  } catch {
    // Already liked — unlike
    await pool.query('DELETE FROM post_likes WHERE post_id=$1 AND user_id=$2', [postId, req.user.id]);
    await pool.query('UPDATE posts SET likes_count=GREATEST(likes_count-1,0) WHERE id=$1', [postId]);
    res.json({ liked: false });
  }
});

// ══════════════════════════════════════════════════════════════
// COMMENTS
// ══════════════════════════════════════════════════════════════

// GET /api/comments/mine — get all comments by logged in user
app.get('/api/comments/mine', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT COUNT(*) as total FROM comments WHERE user_id=$1',
    [req.user.id]
  );
  res.json({ total: parseInt(result.rows[0].total) });
});

// GET /api/users/stats — get all stats for logged in user in one call
app.get('/api/users/stats', auth, async (req, res) => {
  const [posts, comments, programs, likes] = await Promise.all([
    // Total posts by user
    pool.query('SELECT COUNT(*) as total FROM posts WHERE user_id=$1', [req.user.id]),
    // Total comments by user
    pool.query('SELECT COUNT(*) as total FROM comments WHERE user_id=$1', [req.user.id]),
    // Programs hosted by user
    pool.query('SELECT COUNT(*) as total FROM programs WHERE host_user_id=$1', [req.user.id]),
    // Total likes received on user posts
    pool.query('SELECT COALESCE(SUM(likes_count),0) as total FROM posts WHERE user_id=$1', [req.user.id]),
  ]);
  res.json({
    posts:            parseInt(posts.rows[0].total),
    comments:         parseInt(comments.rows[0].total),
    programs_hosted:  parseInt(programs.rows[0].total),
    total_likes:      parseInt(likes.rows[0].total),
    replies:          parseInt(comments.rows[0].total), // replies stored as comments
    attended:         0, // no attendance table yet
  });
});

// GET /api/posts/:id/comments
app.get('/api/posts/:id/comments', async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, u.full_name, u.profile_pic_url, u.quiz_status
     FROM comments c JOIN users u ON c.user_id=u.id
     WHERE c.post_id=$1 ORDER BY c.created_at DESC`,
    [req.params.id]
  );
  res.json(result.rows);
});

// POST /api/posts/:id/comments
app.post('/api/posts/:id/comments', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  const result = await pool.query(
    'INSERT INTO comments (post_id,user_id,content) VALUES ($1,$2,$3) RETURNING *',
    [req.params.id, req.user.id, content]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/comments/:id
app.put('/api/comments/:id', auth, async (req, res) => {
  const { content } = req.body;
  if(!content) return res.status(400).json({ error: 'Content required' });
  const result = await pool.query(
    'UPDATE comments SET content=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    [content, req.params.id, req.user.id]
  );
  if(!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// DELETE /api/comments/:id
app.delete('/api/comments/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM comments WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Comment deleted' });
});

// POST /api/comments/:id/like  (toggle like)
app.post('/api/comments/:id/like', auth, async (req, res) => {
  const commentId = req.params.id;
  try {
    await pool.query('INSERT INTO comment_likes (comment_id,user_id) VALUES ($1,$2)', [commentId, req.user.id]);
    await pool.query('UPDATE comments SET likes_count=likes_count+1 WHERE id=$1', [commentId]);
    res.json({ liked: true });
  } catch {
    await pool.query('DELETE FROM comment_likes WHERE comment_id=$1 AND user_id=$2', [commentId, req.user.id]);
    await pool.query('UPDATE comments SET likes_count=GREATEST(likes_count-1,0) WHERE id=$1', [commentId]);
    res.json({ liked: false });
  }
});

// ══════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════

// GET /api/reviews
app.get('/api/reviews', async (req, res) => {
  const result = await pool.query(
    `SELECT r.id, r.user_id, r.rating, r.review_text, r.created_at, u.full_name
     FROM reviews r
     LEFT JOIN users u ON r.user_id=u.id
     ORDER BY r.created_at DESC LIMIT 20`
  );
  res.json(result.rows);
});

// POST /api/reviews
app.post('/api/reviews', auth, async (req, res) => {
  const { rating, review_text } = req.body;
  if (!rating) return res.status(400).json({ error: 'Rating is required' });
  const result = await pool.query(
    'INSERT INTO reviews (user_id,rating,review_text) VALUES ($1,$2,$3) RETURNING *',
    [req.user.id, rating, review_text]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/reviews/:id
app.put('/api/reviews/:id', auth, async (req, res) => {
  const { rating, review_text } = req.body;
  const result = await pool.query(
    'UPDATE reviews SET rating=$1,review_text=$2 WHERE id=$3 AND user_id=$4 RETURNING *',
    [rating, review_text, req.params.id, req.user.id]
  );
  if(!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// DELETE /api/reviews/:id
app.delete('/api/reviews/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Review deleted' });
});

// ══════════════════════════════════════════════════════════════
// CATCH ALL — Serve frontend for any unmatched route
// ══════════════════════════════════════════════════════════════
app.get('/{*path}', (req, res) => {
  if(req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ══════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ScanSafe API running on http://localhost:${PORT}`);
  console.log(`📁 Frontend served from ./frontend/`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'scansafe'}`);
});
