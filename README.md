# ✈️ VoyageMind AI – AI Travel Planner

> A full-stack, multi-user AI travel planner that generates complete day-by-day itineraries, budget estimates, hotel suggestions, and safety tips — powered by Google Gemini.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://ai-travel-planner-beta-orpin.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://ai-travel-planner-1vpd.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/avanishtatat/ai-travel-planner)

---

## 📌 Overview

VoyageMind AI lets users register, log in, and create fully AI-generated travel plans. Each trip includes a structured day-by-day itinerary, estimated budget, hotel suggestions, and local safety tips — all generated in one prompt call to Gemini 2.5 Flash Lite and persisted in MongoDB.

Users can later edit their trips: add or remove activities, regenerate specific days with custom instructions, or delete trips entirely. All data is scoped per user — no user can access another's trips.

---

## 🔗 Live URLs

| Service    | URL                                                             |
|------------|-----------------------------------------------------------------|
| Frontend   | https://ai-travel-planner-beta-orpin.vercel.app/               |
| Backend    | https://ai-travel-planner-1vpd.onrender.com/                   |
| Repository | https://github.com/avanishtatat/ai-travel-planner              |

---

## ✨ Features

**Authentication & Security**
- User registration and login with hashed passwords (bcryptjs)
- JWT-based authentication with Bearer token in Authorization header
- Protected routes on both frontend and backend
- Multi-user data isolation — every DB query is scoped by `userId`

**AI Trip Generation**
- Submit destination, trip duration, budget type, interests, travel style, start date, and traveler count
- Gemini generates a structured JSON response containing:
  - Day-by-day itinerary with activities and descriptions
  - Estimated trip budget breakdown
  - Hotel suggestions with details
  - Safety tips and local travel guidance
- AI call completes before the trip is saved — no empty trips on failure
- Exponential backoff retry mechanism for transient Gemini errors

**Trip Management**
- Dashboard with trip stats
- Trips list view
- Trip detail page
- Add a custom activity to any day
- Remove any activity from a day
- Regenerate a specific day with a custom instruction (sends existing trip context to Gemini)
- Delete trip with confirmation dialog

**UI**
- Responsive design built with Next.js App Router, Tailwind CSS, and shadcn/ui
- Toast notifications via Sonner
- Gradient-based trip cards

---

## 🛡️ Custom Feature — Travel Safety & Local Tips Advisor

Beyond itinerary generation, VoyageMind AI includes an integrated **Travel Safety & Local Tips Advisor**. Each trip surfaces practical safety advice, cultural etiquette, and local travel guidance for the destination — making the app meaningfully more useful than a standard itinerary generator, particularly for first-time visitors or international travel.

---

## 🏗️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js (App Router) | React framework, routing, SSR |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |
| Axios | HTTP client |
| Context API | Global auth state |
| Sonner | Toast notifications |
| Lucide React | Icon set |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Auth and password hashing |
| express-validator | Request validation |
| Gemini API | AI generation |

### Infrastructure
| Service | Role |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

## 🤖 AI Agent Design

```
User submits trip form (destination, days, budget, interests, style, dates, travelers)
         ↓
Backend builds a structured Gemini prompt
         ↓
Gemini 2.5 Flash Lite returns JSON: { itinerary, estimatedBudget, hotels, safetyTips }
         ↓
Response validated and saved to MongoDB (only on success)
         ↓
Trip detail served to frontend
```

**Day regeneration flow:**
```
User provides instruction for a specific day
         ↓
Backend sends existing trip context + instruction to Gemini
         ↓
Gemini returns updated activities for that day only
         ↓
MongoDB document updated — only that day's activities replaced
```

Transient Gemini errors are handled with exponential backoff retries to maximise reliability without manual intervention.

---

## 🗂️ Backend Architecture

```
backend/
├── routes/          # Express route definitions (auth, trips)
├── controllers/     # Business logic for each route
├── middleware/       # JWT auth middleware (attaches req.user)
├── models/          # Mongoose schemas (User, Trip)
├── validators/      # express-validator rules for inputs
├── services/        # Gemini API interaction logic
├── prompts/         # Prompt builder functions
└── utils/
    ├── asyncHandler.js   # Wraps async controllers to forward errors
    └── retryFetch.js     # Exponential backoff for Gemini calls
```

**Authentication flow:**
1. Passwords hashed with bcrypt before storage
2. JWT issued on register and login
3. Client stores token in `localStorage`, verified via `GET /api/auth/me`
4. Auth middleware reads `Authorization: Bearer <token>`, verifies JWT, attaches `req.user`
5. Every trip query filters by `userId` — cross-user data access is impossible at the DB level

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user profile |

### Trips

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trips/generate` | Generate a new AI trip |
| GET | `/api/trips` | List all trips for user |
| GET | `/api/trips/dashboard-stats` | Trip count and stats |
| GET | `/api/trips/:id` | Get single trip details |
| PATCH | `/api/trips/:id/add-activity` | Add custom activity to a day |
| PATCH | `/api/trips/:id/remove-activity` | Remove an activity from a day |
| PATCH | `/api/trips/:id/regenerate-day` | Regenerate a specific day |
| DELETE | `/api/trips/:id` | Delete a trip |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

---

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## 🌐 Production Environment Variables

### Backend (Render)
```
MONGO_URI
JWT_SECRET
GEMINI_API_KEY
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🎯 Key Design Decisions

- **Separate Express backend** — chosen to demonstrate backend engineering depth over a Next.js API routes approach
- **AI before save** — Gemini generation completes before writing to MongoDB; failed AI calls never create ghost trips
- **Service/prompt separation** — keeps controllers thin and makes prompt iteration easy without touching business logic
- **One-time generation for budget, hotels, safety tips** — reduces AI cost; only the itinerary is re-generatable
- **shadcn/ui** — enables polished UI fast without custom component overhead
- **Gradient trip cards** — avoids dependency on real destination photo APIs while keeping UI visually clean

---

## ⚠️ Known Limitations

- Hotel suggestions are AI-generated, not sourced from live booking APIs
- Budget estimates are approximate and not based on live pricing data
- No real flight or hotel price API integration
- No payment or subscription system
- Trip cover images are gradient-based, not real destination photos
- User profile editing is not implemented

---

