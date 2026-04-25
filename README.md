# CareSetu 🏥

> A production-grade, full-stack centralized healthcare platform for India.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/caresetu
JWT_SECRET=caresetu_super_secret_jwt_key_2024
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here   # Get from console.cloud.google.com
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — `frontend/.env` is pre-configured for localhost proxy.

### 3. Seed Demo Data

```bash
cd backend
npm run seed
```

This creates:
| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@caresetu.in      | Admin@123     |
| Hospital | aiims@caresetu.in      | Hospital@123  |
| Hospital | apollo@caresetu.in     | Hospital@123  |
| Patient  | rahul@example.com      | Patient@123   |
| Patient  | priya@example.com      | Patient@123   |

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🏗️ Architecture

```
CareSetu/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Business logic (auth, admin, patient, hospital, chatbot)
│   ├── middleware/     # JWT auth, role guard, file upload
│   ├── models/         # Mongoose schemas (User, PatientProfile, HospitalProfile, Report, Treatment, ActivityLog)
│   ├── routes/         # Express route definitions
│   ├── utils/          # Token gen, Aadhaar masking, validators
│   ├── uploads/        # Uploaded medical reports
│   ├── server.js       # Express entry point
│   └── seed.js         # Demo data seeder
│
└── frontend/
    ├── src/
    │   ├── components/  # UI components (Button, Input, Card, Modal, Badge, Spinner)
    │   ├── contexts/    # AuthContext (JWT persistence)
    │   ├── layouts/     # DashboardLayout (Sidebar + Navbar)
    │   ├── pages/       # Admin, Patient, Hospital pages
    │   └── services/    # Axios API layer
    └── vite.config.js  # Vite + Tailwind CSS v4 config
```

## 🔑 Key Features

### Admin Panel
- Dashboard with live statistics
- Register hospitals with generated credentials
- Activate/Deactivate hospital accounts
- Full patient overview with reports & treatments

### Patient Portal
- 3-step registration wizard
- Personal QR Code generation (downloadable)
- Medical reports viewer
- Treatment plan viewer with expandable medication details
- AI Chatbot (Gemini) for:
  - Government healthcare schemes (Ayushman Bharat, PM-JAY)
  - Treatment explanation in simple language
  - Lab report interpretation
- Profile management

### Hospital Panel
- QR Code scanner (camera-based + manual ID fallback)
- Instant patient record access post-scan
- Upload medical reports (PDF/image)
- Add treatment plans with medication rows
- View all interacted patients

## 🔒 Security
- Passwords hashed with bcrypt (12 salt rounds)
- JWT authentication (7-day expiry)
- Aadhaar stored masked (`XXXX-XXXX-1234`)
- Role-based route protection (Frontend + Backend)
- Input validation with express-validator

## 🤖 AI Chatbot (Gemini)
Add your Gemini API key to `backend/.env`:
```
GEMINI_API_KEY=AIza...
```
Without a key, a fallback demo response is shown automatically.

## 📡 API Reference

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register/patient | Public |
| POST | /api/auth/login | Public |
| GET | /api/admin/dashboard | Admin |
| POST | /api/admin/hospitals/register | Admin |
| GET | /api/patient/dashboard | Patient |
| GET | /api/patient/qr | Patient |
| GET | /api/hospital/patient/:id | Hospital |
| POST | /api/hospital/reports | Hospital |
| POST | /api/hospital/treatments | Hospital |
| POST | /api/chatbot/chat | Patient |
