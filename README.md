# AI Resume Builder

A full-stack resume builder using React, Vite, Tailwind CSS, Node.js, Express, MongoDB/Mongoose, and Groq AI.

## Requirements

- Node.js 20.19+ (or a compatible newer LTS version)
- npm
- MongoDB local service or MongoDB Atlas account
- A Groq API key for hosted AI suggestions (offline rule-based fallback is available when Groq is unavailable)

## Project structure

- `src/` — React/Vite frontend
- `server/` — Express API, authentication, resume persistence, Groq integration and offline fallback

## Local setup (Windows PowerShell)

### 1. Frontend

From the project root:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend defaults to `http://localhost:5173`. Set `VITE_API_URL` in the root `.env` to your backend origin, without `/api`.

### 2. Backend

Open another PowerShell terminal:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` and set `MONGO_URI`, `JWT_SECRET`, and `GROQ_API_KEY`. Then run:

```powershell
npm run dev
```

The API defaults to `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## Useful commands

Frontend:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

Backend (run from `server`):

```powershell
npm run dev
npm start
```

## Environment variables

Frontend `.env`:

- `VITE_API_URL` — backend origin, e.g. `http://localhost:5000`. Vite variables are public; never put secrets here.

Backend `server/.env`:

- `PORT` — API port (default `5000`)
- `NODE_ENV` — environment mode
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — private JWT signing secret
- `GROQ_API_KEY` — private Groq API key; keep it only in the backend environment
- `GROQ_MODEL` — Groq model name supported by your API account (default: `openai/gpt-oss-120b`)
- `CLIENT_ORIGIN` — comma-separated allowed frontend origins

Never commit real `.env` files or share API keys. `.env.example` files contain placeholders only.

## API overview

- `GET /` — API status
- `GET /api/health` — health endpoint
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — log in
- `/api/resumes` — authenticated resume CRUD
- `POST /api/ai/analyze` — Groq → offline local resume analysis (requires Bearer token)
- `POST /api/ai/rewrite` — Groq → offline local content rewriting (requires Bearer token)

Resume endpoints require a Bearer token. The API scopes resume queries to the authenticated user.

## Production deployment outline

1. Deploy the Express server to a Node-compatible host.
2. Provision MongoDB Atlas or another reachable MongoDB deployment.
3. Configure backend environment variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `GROQ_MODEL`, `CLIENT_ORIGIN`, `NODE_ENV`).
4. Deploy the Vite frontend to a static host and set `VITE_API_URL` to the deployed API origin.
5. Ensure the frontend origin is listed in `CLIENT_ORIGIN`.
6. Run `npm run build` and smoke-test registration, login, resume CRUD, PDF download, and AI routes.

This README describes deployment setup; it does not imply the app has been deployed or that external credentials have been tested.

## AI provider fallback

The backend uses Groq as the primary AI provider. If Groq is unavailable or fails, the application automatically uses a local rule-based fallback engine that does not require an AI API key.

AI endpoints include a `provider` response field (`groq` or `local`) so the UI can identify the source of suggestions.

Analysis uses the resume's target role to tailor summary, project, experience, education and ATS guidance. Role-relevant technologies are shown separately as learning recommendations. The Apply Skills action is restricted to skills already present in the resume.

Suggestions must not be used to claim technologies, qualifications, work history, achievements or metrics the candidate cannot verify.
