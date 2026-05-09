<p align="center">
  <img src="frontend/public/assets/logo.png" alt="ScanSafe Logo" width="80" />
</p>

<h1 align="center">ScanSafe - Be Safe</h1>

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

## Highlights

- 8 interactive pages -- Home, Programs, Survey, Dashboard, Learn, Quiz, Try UPI, Community
- Real-time analytics with Chart.js dashboards powered by live PostgreSQL survey data
- Fraud awareness quiz with 20-question certification and downloadable PDF certificate
- UPI payment simulator for practicing digital payments in a safe sandbox
- Community hub with posts, comments, likes & reviews
- Built-in AI chatbot for fraud-related queries
- Dark mode toggle across the entire UI
- JWT authentication for registration, login, and profile management

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 19, Vite 8, Chart.js, Vanilla CSS |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL 15+ |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| AI | OpenRouter API (GPT integration) |

---

## Project Structure

```
scansafe/
├── backend/
│   ├── server.js               # Express routes & middleware
│   ├── schema.sql              # DB schema + sample seed data
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── assets/             # Images, icons, logos
│   │   ├── script.js           # Legacy application logic
│   │   └── chatbot.js          # AI chatbot integration
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Footer, Modals, Chatbot
│   │   ├── pages/              # 8 page components
│   │   ├── styles.css          # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Quick Start

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
psql -U postgres -c "CREATE DATABASE scansafe;"
psql -U postgres -d scansafe -f backend/schema.sql
```

### 3. Configure Environment Variables

```bash
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

Terminal 1 -- Backend:
```bash
cd backend
npm start
# runs on http://localhost:5000
```

Terminal 2 -- Frontend:
```bash
cd frontend
npm run dev
# runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend automatically.

Open http://localhost:5173 in your browser.

---

## API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login & get JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| PUT | `/api/auth/profile` | Yes | Update profile |

### Platform
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| GET | `/api/programs` | No | List awareness programs |
| POST | `/api/programs` | Yes | Host a new program |
| POST | `/api/survey` | No | Submit UPI survey |
| GET | `/api/dashboard` | No | Dashboard analytics |
| GET | `/api/home/stats` | No | Home page statistics |

### Learning
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| GET | `/api/learn/steps` | No | UPI app step guides |
| GET | `/api/learn/videos` | No | Video tutorials |
| GET | `/api/learn/pdfs` | No | PDF resources |
| GET | `/api/quiz/questions` | No | Random 20 questions |
| POST | `/api/quiz/submit` | Yes | Submit quiz for certificate |

### Community
| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| GET | `/api/posts` | No | Community feed |
| POST | `/api/posts` | Yes | Create post |
| POST | `/api/posts/:id/like` | Yes | Toggle like |
| POST | `/api/posts/:id/comments` | Yes | Add comment |
| GET/POST | `/api/reviews` | No/Yes | Website reviews |
| GET | `/api/ngos` | No | NGO directory |

---

## Database Schema

| Table | Description |
|:------|:------------|
| users | Accounts with auth, profile & quiz status |
| programs | Awareness programs with host info |
| surveys | 15-field UPI usage survey responses |
| quiz_questions | Fraud awareness questions |
| quiz_attempts | User quiz attempt history |
| posts | Community feed posts |
| comments | Post comments |
| post_likes / comment_likes | Like tracking |
| reviews | Website reviews with ratings |
| ngos | NGO directory for donations |
| upi_app_steps | Step-by-step UPI app guides |
| video_tutorials | Video tutorial links |
| digital_literacy_pdfs | Downloadable PDF resources |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|:---------|:------------|:--------:|
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port (default: 5432) | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| JWT_SECRET | Secret for JWT token signing | Yes |
| PORT | Server port (default: 5000) | No |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|:---------|:------------|:--------:|
| VITE_API_URL | Backend API URL (production only) | No |

During development, the Vite proxy handles API routing automatically.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made for Digital India
</p>


