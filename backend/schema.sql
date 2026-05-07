-- =============================================
-- ScanSafe – PostgreSQL Schema + Seed Data
-- =============================================
-- Usage:
--   1. CREATE DATABASE scansafe;
--   2. psql -U postgres -d scansafe -f schema.sql
-- =============================================

-- ── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    location VARCHAR(120),
    profile_pic_url TEXT,
    quiz_status VARCHAR(15) DEFAULT 'none' CHECK (quiz_status IN ('none', 'attempted', 'certified')),
    quiz_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Programs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    host_user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    is_free BOOLEAN DEFAULT TRUE,
    price_amount DECIMAL(10,2) DEFAULT 0,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Surveys ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    participant_name VARCHAR(120),
    age INTEGER,
    gender VARCHAR(10),
    occupation TEXT[],
    accepts_upi BOOLEAN,
    upi_apps_used TEXT[],
    avg_upi_customers_out_of_10 INTEGER,
    upi_age_group VARCHAR(20),
    payment_preference VARCHAR(30),
    upi_problems TEXT[],
    had_transaction_issues VARCHAR(10),
    needs_digital_help VARCHAR(10),
    helps_others_with_payments VARCHAR(15),
    reasons_villagers_dont_use_upi TEXT,
    preference_explanation TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quiz Questions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL,
    difficulty VARCHAR(10) DEFAULT 'easy',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quiz Attempts ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    score INTEGER,
    total_questions INTEGER,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Posts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Post Likes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- ── Comments ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Comment Likes ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- ── Reviews ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── NGOs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ngos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    upi_id VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── UPI App Steps ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upi_app_steps (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(20) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    step_number INTEGER NOT NULL,
    step_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Video Tutorials ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_tutorials (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(20) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Digital Literacy PDFs ────────────────────────────────
CREATE TABLE IF NOT EXISTS digital_literacy_pdfs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    file_url TEXT,
    thumbnail_url TEXT,
    pages INTEGER,
    size_mb DECIMAL(5,1),
    downloads INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- SEED DATA (Sample / Demo)
-- ══════════════════════════════════════════════════════════

-- Programs (sample awareness events)
INSERT INTO programs (name, description, event_date, event_time, venue, is_free, price_amount, contact_phone, contact_email) VALUES
('UPI Safety Workshop', 'Learn to identify fraud and use UPI safely in rural areas.', '2024-04-10', '10:00', 'Community Hall, Nashik', true, 0, '+91 98765 43210', 'workshop@scansafe.in'),
('Digital Payment Drive', 'Hands-on session for shopkeepers on accepting UPI payments.', '2024-04-15', '14:00', 'Market Square, Pune', false, 0, '+91 87654 32109', 'digitalpay@gmail.com'),
('BHIM & PhonePe Basics', 'Beginner-friendly guide to setting up UPI apps.', '2024-04-20', '11:00', 'Online - Zoom', true, 0, '+91 76543 21098', 'bhim@awareness.in'),
('Women & Digital Finance', 'Special session for rural women on mobile banking safety.', '2024-04-25', '09:00', 'Women Center, Aurangabad', true, 0, '+91 65432 10987', 'women@finance.in'),
('Senior Citizens UPI Help', 'Special workshop for elderly people to learn UPI safely.', '2024-05-05', '15:00', 'Senior Center, Nagpur', true, 0, '+91 43210 98765', 'seniors@upi.in');

-- Quiz Questions (20 fraud-awareness questions)
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
('What does UPI stand for?', 'Universal Payment Interface', 'Unified Payment Interface', 'United Payment Interface', 'Unified Public Interface', 'b', 'easy'),
('Which government body developed BHIM UPI?', 'Reserve Bank of India (RBI)', 'State Bank of India (SBI)', 'National Payments Corporation of India (NPCI)', 'Ministry of Finance', 'c', 'easy'),
('What do you need to enter to RECEIVE money via UPI?', 'Your UPI PIN', 'Your bank account number', 'Nothing - just share your UPI ID or QR code', 'Your Aadhaar number', 'c', 'easy'),
('Which of these is a valid UPI ID format?', 'user@bank', 'user#bank', 'user$bank', 'user!bank', 'a', 'easy'),
('What is the maximum transaction limit per UPI payment (general)?', '₹5,000', '₹50,000', '₹1,00,000', '₹10,00,000', 'c', 'easy'),
('Which is the SAFEST way to pay via UPI?', 'Scan a QR code sent on WhatsApp', 'Scan QR at merchant counter directly', 'Pay using a link in SMS', 'Transfer to number given over call', 'b', 'easy'),
('What should you do if you get an unexpected collect request?', 'Accept it immediately', 'Enter your PIN to verify', 'Reject it and do not enter your PIN', 'Share PIN with sender', 'c', 'easy'),
('Someone calls claiming to be from your bank asking for UPI PIN. What do you do?', 'Share the PIN', 'Share last 2 digits', 'Hang up - banks never ask for PINs', 'Call back and share', 'c', 'medium'),
('You scan a QR and are asked to ENTER PIN to receive cashback. This is:', 'Legitimate cashback', 'A fraud - PIN on collect sends money FROM you', 'Normal UPI behavior', 'NPCI reward program', 'b', 'medium'),
('What is "SIM Swap" fraud?', 'Swapping SIM for better network', 'Fraudster gets duplicate SIM to access OTPs and UPI', 'Legitimate SIM transfer', 'Using two SIMs', 'b', 'medium'),
('Which is a RED FLAG in UPI transaction?', 'Merchant shows QR at shop', 'Collect request asking PIN for refund', 'Bank OTP for your transaction', 'Friend shares UPI ID', 'b', 'medium'),
('OLX seller asks you to scan QR and enter PIN to "confirm" purchase:', 'Standard OLX process', 'Fraud - you are paying them', 'Secure escrow method', 'OLX buyer protection', 'b', 'medium'),
('What is "Vishing"?', 'Fake bank emails', 'Fake bank website', 'Phone call tricking into sharing info', 'Malware via app', 'c', 'medium'),
('SMS: "Your UPI will be blocked. Click to update KYC". What to do?', 'Click and update', 'Call the number', 'Do NOT click - check via bank/app', 'Share link with family', 'c', 'medium'),
('Which detail is SAFE to share publicly?', 'UPI PIN', 'Bank password', 'OTP', 'Your UPI ID (e.g. 9876543210@upi)', 'd', 'medium'),
('Fraudster sends ₹1 then calls saying it was mistake, asks for ₹1000 back:', 'Phishing', 'Overpayment / Wrong Transfer Scam', 'SIM Swap', 'QR Tampering', 'b', 'hard'),
('What is QR Code Tampering fraud?', 'Scanning QR multiple times', 'Placing fake QR over merchant QR', 'Generating fake QR', 'Using outdated QR', 'b', 'hard'),
('Risk of downloading "screen sharing" app at agent request:', 'Phone slows down', 'Agent sees screen, reads OTPs, takes over UPI', 'Account temporarily blocked', 'Extra data usage', 'b', 'hard'),
('Best protection from UPI fraud:', 'Never use UPI', 'Share PIN only with family', 'Change PIN regularly, never share, verify requests, use official apps', 'Always screen share with support', 'c', 'hard'),
('Fraudster uses fake UPI ID like "sbi.care@upi". What to check?', 'Name displayed before confirming is real bank', 'UPI ID has "care" or "help"', 'Fraudster knows your name', 'Amount is small so safe', 'a', 'hard');

-- NGOs (sample organizations)
INSERT INTO ngos (name, description, upi_id, website_url) VALUES
('Digital Shakti Foundation', 'Empowering rural women with digital literacy across Maharashtra.', 'digitalshakti@upi', 'https://digitalshakti.org'),
('Gram Vikas Digital Trust', 'Bringing UPI adoption to 500+ villages through workshops.', 'gramvikas@upi', 'https://gramvikas.org'),
('PayLiterate India', 'Teaching UPI to senior citizens and rural communities.', 'payliterate@upi', 'https://payliterate.in'),
('SurakshaDigi NGO', 'Protecting rural users from digital payment fraud.', 'suraksha@upi', 'https://suraksha.ngo'),
('Pratham Education Foundation', 'India''s largest education NGO. Digital literacy programs across 21 states.', 'pratham@upi', 'https://www.pratham.org');

-- UPI App Steps (PhonePe pay example)
INSERT INTO upi_app_steps (app_name, operation, step_number, step_text) VALUES
('PhonePe', 'pay', 1, 'Open PhonePe app on your phone.'),
('PhonePe', 'pay', 2, 'Tap "Send Money" on the home screen.'),
('PhonePe', 'pay', 3, 'Enter recipient UPI ID, mobile number, or scan QR code.'),
('PhonePe', 'pay', 4, 'Enter the amount you want to send.'),
('PhonePe', 'pay', 5, 'Add a remark (optional) like "Vegetables" or "Rent".'),
('PhonePe', 'pay', 6, 'Tap "Proceed" and enter your 4 or 6-digit UPI PIN.'),
('PhonePe', 'pay', 7, 'Wait for the "Payment Successful" confirmation screen.'),
('PhonePe', 'pay', 8, 'Check your SMS from bank to confirm the transaction.'),
('PhonePe', 'receive', 1, 'Open PhonePe and tap "Receive Money".'),
('PhonePe', 'receive', 2, 'Your UPI ID and QR code will appear automatically.'),
('PhonePe', 'receive', 3, 'Share your UPI ID or show the QR code to the sender.'),
('PhonePe', 'receive', 4, 'You will receive an SMS when payment arrives.'),
('PhonePe', 'receive', 5, 'You NEVER need to enter your PIN to receive money!'),
('PhonePe', 'setup', 1, 'Download PhonePe from Google Play (developer: PhonePe Pvt Ltd).'),
('PhonePe', 'setup', 2, 'Open the app and enter your bank-registered mobile number.'),
('PhonePe', 'setup', 3, 'Enter the OTP received on your phone.'),
('PhonePe', 'setup', 4, 'Select your bank from the list shown.'),
('PhonePe', 'setup', 5, 'PhonePe will auto-detect your bank account.'),
('PhonePe', 'setup', 6, 'Set a 4 or 6-digit UPI PIN - keep it secret!'),
('PhonePe', 'setup', 7, 'Your UPI ID is created (e.g. 9876543210@ybl).'),
('Google Pay', 'pay', 1, 'Open Google Pay on your phone.'),
('Google Pay', 'pay', 2, 'Tap "New Payment" or the "+" button.'),
('Google Pay', 'pay', 3, 'Search by name, phone number, UPI ID, or scan QR.'),
('Google Pay', 'pay', 4, 'Enter the amount.'),
('Google Pay', 'pay', 5, 'Tap "Pay" and enter your UPI PIN.'),
('Google Pay', 'pay', 6, 'Wait for "Paid" confirmation in the app.');

-- Digital Literacy PDFs (sample resources)
INSERT INTO digital_literacy_pdfs (title, description, category, file_url, pages, size_mb, downloads) VALUES
('UPI Beginner Guide', 'Complete step-by-step guide for first-time UPI users in rural India.', 'upi', '/pdfs/upi-beginner.pdf', 24, 2.4, 1842),
('Fraud Prevention Handbook', 'Identify and avoid the most common UPI scams with real case studies.', 'fraud', '/pdfs/fraud-prevention.pdf', 36, 3.1, 2561),
('Digital Banking for Farmers', 'How farmers can use mobile banking for subsidies and benefit transfers.', 'banking', '/pdfs/banking-farmers.pdf', 18, 1.8, 934),
('QR Code Safety Guide', 'Learn to distinguish real QR codes from fake ones.', 'fraud', '/pdfs/qr-safety.pdf', 12, 0.9, 3102),
('Women & Digital Finance', 'Empowering rural women with digital payment tools.', 'literacy', '/pdfs/women-finance.pdf', 28, 2.7, 1455);

-- ══════════════════════════════════════════════════════════
-- Done! Register a user via the app to start using ScanSafe.
-- ══════════════════════════════════════════════════════════
