<p align="center">
  <img src="frontend/public/assets/logo.png" alt="ScanSafe Logo" width="80" />
</p>

<h1 align="center">ScanSafe – Be Safe 🛡️</h1>

<p align="center">
  <strong>Empowering Rural India with Digital Payments</strong><br/>
  A community-driven full-stack platform promoting UPI awareness, fraud prevention, and digital financial inclusion for rural & semi-urban India.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/License-ISC-blue" />
</p>

---

## ✨ Highlights

- **8 interactive pages** — Home, Programs, Survey, Dashboard, Learn, Quiz, Try UPI, Community
- **Real-time analytics** — Chart.js dashboards powered by live PostgreSQL survey data
- **Fraud awareness quiz** — 20-question certification with downloadable PDF certificate
- **UPI payment simulator** — Safe sandbox to practice digital payments
- **Community hub** — Social feed with posts, comments, likes & reviews
- **AI chatbot** — Built-in diagnostic assistant for fraud-related queries
- **Dark mode** — Full theme toggle across the entire UI
- **JWT authentication** — Secure registration, login, and profile management

---

## 🏗️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React 19, Vite 8, Chart.js, Vanilla CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL 15+ |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **AI** | OpenRouter API (GPT integration) |

---

## 📁 Project Structure

```
scansafe/
├── backend/                    # Node.js REST API
│   ├── server.js               # Express routes & middleware
│   ├── schema.sql              # DB schema + sample seed data
│   ├── package.json
│   └── .env.example            # Environment variable template
│
├── frontend/                   # React (Vite) SPA
│   ├── public/
│   │   ├── assets/             # Images, icons, logos
│   │   ├── script.js           # Legacy application logic
│   │   └── chatbot.js          # AI chatbot integration
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Footer, Modals, Chatbot
│   │   ├── pages/              # 8 page components
│   │   ├── styles.css          # Design system & global styles
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── vite.config.js          # Vite config with API proxy
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Version | Download |
|:-----|:--------|:---------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | v15+ | [postgresql.org](https://www.postgresql.org/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### 1. Clone the Repository

```bash
git clone https://github.com/saurav-misal/ScanSafe-frontend.git
cd ScanSafe-frontend
```

### 2. Set Up the Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE scansafe;"

# Import schema and seed data
psql -U postgres -d scansafe -f backend/schema.sql
```

### 3. Configure Environment Variables

```bash
# Copy the template
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scansafe
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5. Start the Application

**Terminal 1 — Backend API:**
```bash
cd backend
npm start
# ✅ http://localhost:5000
```

**Terminal 2 — Frontend Dev Server:**
```bash
cd frontend
npm run dev
# ✅ http://localhost:5173
```

> The Vite dev server proxies `/api` requests to the backend automatically.

Open **http://localhost:5173** in your browser 🎉

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/auth/register` | ✗ | Create account |
| `POST` | `/api/auth/login` | ✗ | Login & get JWT |
| `GET` | `/api/auth/me` | ✓ | Current user profile |
| `PUT` | `/api/auth/profile` | ✓ | Update profile |

### Platform
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/programs` | ✗ | List awareness programs |
| `POST` | `/api/programs` | ✓ | Host a new program |
| `POST` | `/api/survey` | ✗ | Submit UPI survey |
| `GET` | `/api/dashboard` | ✗ | Dashboard analytics |
| `GET` | `/api/home/stats` | ✗ | Home page statistics |

### Learning
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/learn/steps` | ✗ | UPI app step guides |
| `GET` | `/api/learn/videos` | ✗ | Video tutorials |
| `GET` | `/api/learn/pdfs` | ✗ | PDF resources |
| `GET` | `/api/quiz/questions` | ✗ | Random 20 questions |
| `POST` | `/api/quiz/submit` | ✓ | Submit quiz for certificate |

### Community
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `GET` | `/api/posts` | ✗ | Community feed |
| `POST` | `/api/posts` | ✓ | Create post |
| `POST` | `/api/posts/:id/like` | ✓ | Toggle like |
| `POST` | `/api/posts/:id/comments` | ✓ | Add comment |
| `GET/POST` | `/api/reviews` | ✗/✓ | Website reviews |
| `GET` | `/api/ngos` | ✗ | NGO directory |

---

## 🗄️ Database Schema

| Table | Description |
|:------|:------------|
| `users` | Accounts with auth, profile & quiz status |
| `programs` | Awareness programs with host info |
| `surveys` | 15-field UPI usage survey responses |
| `quiz_questions` | Fraud awareness questions |
| `quiz_attempts` | User quiz attempt history |
| `posts` | Community feed posts |
| `comments` | Post comments |
| `post_likes` / `comment_likes` | Like tracking |
| `reviews` | Website reviews with ratings |
| `ngos` | NGO directory for donations |
| `upi_app_steps` | Step-by-step UPI app guides |
| `video_tutorials` | Video tutorial links |
| `digital_literacy_pdfs` | Downloadable PDF resources |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|:---------|:------------|:--------:|
| `DB_HOST` | PostgreSQL host | ✓ |
| `DB_PORT` | PostgreSQL port (default: 5432) | ✓ |
| `DB_NAME` | Database name | ✓ |
| `DB_USER` | Database user | ✓ |
| `DB_PASSWORD` | Database password | ✓ |
| `JWT_SECRET` | Secret for JWT token signing | ✓ |
| `PORT` | Server port (default: 5000) | ✗ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|:---------|:------------|:--------:|
| `VITE_API_URL` | Backend API URL (production only) | ✗ |

> During development, the Vite proxy handles API routing automatically.

---

## 🚢 Deployment

### Render (Recommended)

**Backend** → Web Service
- Root directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Add env variables from `.env.example`

**Frontend** → Static Site
- Root directory: `frontend`
- Build: `npm install && npm run build`
- Publish: `dist`

**Database** → PostgreSQL on Render, import `schema.sql`

### Vercel (Frontend) + Railway (Backend)

```bash
# Frontend on Vercel
cd frontend && npx vercel --prod

# Backend on Railway
cd backend && railway up
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made with ❤️ for Digital India 🇮🇳
</p>
