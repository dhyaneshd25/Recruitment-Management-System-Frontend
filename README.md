# recruitEdge Frontend

A modern SaaS-like Recruitment Management System built with **Vite + React + Redux + Three.js**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Build Tool | Vite 5 |
| UI Library | React 18 |
| State Management | Redux Toolkit + Redux Persist |
| 3D / Animation | Three.js |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Styling | Pure CSS (glassmorphism design system) |
| Fonts | Syne (display) + DM Sans (body) |

---

## 🎨 Design System

- **Theme:** Dark glassmorphism (#0f172a background)
- **Accent:** Blue-Purple gradient (#6366f1 → #8b5cf6)
- **3D Background:** Three.js particle system with animated wave grid and floating geometric shapes
- **Cards:** Frosted-glass effect with backdrop-filter

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.jsx       # Sidebar + Navbar wrapper
│   ├── Sidebar.jsx         # Role-aware navigation
│   ├── Navbar.jsx          # Top header
│   ├── ProtectedRoute.jsx  # Auth + role guard
│   └── ThreeBackground.jsx # Three.js animated canvas
│
├── pages/
│   ├── LandingPage.jsx         # Public job board for candidates
│   ├── auth/
│   │   ├── Login.jsx           # JWT + Google login
│   │   └── Register.jsx        # User registration
│   ├── dashboard/
│   │   └── Dashboard.jsx       # Role-based overview
│   ├── jobs/
│   │   └── Jobs.jsx            # Full CRUD: Job postings
│   ├── candidates/
│   │   ├── Candidates.jsx      # Full CRUD: Candidates
│   │   └── MyApplications.jsx  # Candidate view: applications + tracker
│   ├── interviews/
│   │   ├── Interviews.jsx      # Full CRUD: Interviews
│   │   └── MyInterviews.jsx    # Candidate view: interview schedule
│   └── users/
│       └── Users.jsx           # Full CRUD: Users (Admin only)
│
├── store/
│   ├── index.js            # Redux store + persist config
│   └── slices/
│       ├── authSlice.js    # Auth state (JWT + Google mock)
│       ├── jobSlice.js     # Jobs CRUD state
│       ├── candidateSlice.js
│       ├── interviewSlice.js
│       └── userSlice.js
│
├── services/
│   └── api.js              # Axios instance with JWT interceptors
│
├── App.jsx                 # Router
├── main.jsx                # Entry point
└── index.css               # Full design system
```

---

## 🔐 Roles & Access

| Role | Access |
|------|--------|
| **ADMIN** | Dashboard, Jobs, Candidates, Interviews, Users (full CRUD all) |
| **HR** | Dashboard, Jobs, Candidates, Interviews (full CRUD) |
| **CANDIDATE** | Landing Page, My Applications, My Interviews |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recruitEdge.com | admin123 |
| HR | hr@recruitEdge.com | hr123 |
| Candidate | candidate@recruitEdge.com | cand123 |

---

## ⚡ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server
npm run dev
```

Open **http://localhost:3000**

---

## 🔌 Connecting to Your Backend

Edit `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

The Axios instance in `src/services/api.js` automatically:
- Attaches `Authorization: Bearer <token>` to all requests
- Redirects to `/login` on 401 responses
- Falls back to mock data if the backend is unavailable

### Expected API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

GET    /api/candidates
POST   /api/candidates
PUT    /api/candidates/:id
DELETE /api/candidates/:id

GET    /api/interviews
POST   /api/interviews
PUT    /api/interviews/:id
DELETE /api/interviews/:id

GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

## 📦 Build for Production

```bash
npm run build
# Output in /dist
```

---

## ✨ Features

- [x] JWT Authentication (mock + real API ready)
- [x] Google Sign-In button (mock flow, plug in real OAuth)
- [x] Role-based routing (Admin / HR / Candidate)
- [x] Three.js animated particle background
- [x] Public landing page with job board
- [x] Apply modal with auth gate (sign in / register to apply)
- [x] Full CRUD: Jobs, Candidates, Interviews, Users
- [x] Candidate application progress tracker
- [x] Interview schedule with meeting link join
- [x] Redux Persist (session survives refresh)
- [x] Glassmorphism dark UI with gradient accents
- [x] Responsive design

---

*recruitEdge — Smart Hiring Platform*
# Recruitment-Management-System-Frontend
