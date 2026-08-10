# MarketingIRA — AI-Powered Social Suite

A Next.js front-end for managing brands, scheduling posts, generating AI captions/images, and analytics.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Ant Design 6, Tailwind CSS 4, React Icons
- **Charts:** Recharts
- **Auth:** Custom token-based (in-memory access token + httpOnly refresh cookie)
- **API Backend:** `https://agents.zettalgor.com/`

## Prerequisites

- Node.js >= 18
- npm (or yarn / pnpm / bun)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (already exists — edit if needed):

```env
NEXT_PUBLIC_API_URL=https://agents.zettalgor.com/
```

### 3. Run the development server

```bash
npm run dev
```

The app starts on **http://localhost:3002** (port 3002 is configured in `package.json`).

### 4. Open in your browser

Navigate to [http://localhost:3002/login](http://localhost:3002/login) to log in.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3002 |
| `npm run build` | Production build |
| `npm run start` | Start production server on port 3002 |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
+-- app/
¦   +-- (auth)/          # Login, register, forgot password, verify OTP
¦   +-- (admin)/         # Admin dashboard, brand categories, logos, slogans
¦   +-- (user)/          # User pages (dashboard, create-post, brands, settings, etc.)
¦   +-- api/             # Auth proxy routes (login, logout, refresh)
¦   +-- layout.js        # Root layout
¦   +-- globals.css      # Global styles + Tailwind
+-- components/
¦   +-- admin/           # Admin header, pages
¦   +-- common/          # Page loader
¦   +-- user/
¦   ¦   +-- header/      # User header, top bar
¦   ¦   +-- pages/       # All user-facing page components
¦   ¦   ¦   +-- createpost/  # 5-stage post creation wizard
¦   ¦   ¦   ¦   +-- CreatePost.jsx
¦   ¦   ¦   ¦   +-- StageOne.jsx    # Details (title, website, description)
¦   ¦   ¦   ¦   +-- Stagetwo.jsx    # Schedule, platforms, post types
¦   ¦   ¦   ¦   +-- StageThree.jsx   # Content review + regenerate
¦   ¦   ¦   ¦   +-- StageFour.jsx    # Image review + regenerate
¦   ¦   ¦   ¦   +-- StageFive.jsx    # Final review & submit
¦   ¦   ¦   +-- ...
¦   ¦   +-- sections/   # Layout sections
+-- context/
¦   +-- UserContext.jsx  # Theme (dark/light) + user context
+-- lib/
¦   +-- apiClient.js     # Centralized API client with auto-refresh
¦   +-- tokenStore.js    # In-memory access token store
+-- proxy.js             # API proxy config
```

## Key Features

### Authentication
- Token-based auth with automatic refresh on 401
- In-memory access token (XSS-safe, not in localStorage)
- HttpOnly refresh cookie via `/api/refresh` route

### Create Post Wizard (5 stages)
1. **Stage 1 — Details:** Title, website, description (with AI enhance)
2. **Stage 2 — Schedule:** Date range, timezone, post types, platforms, active days
3. **Stage 3 — Content:** Day-by-day AI caption review with regenerate
4. **Stage 4 — Images:** Day-by-day AI image review with regenerate
5. **Stage 5 — Review:** Final preview of all posts before scheduling

### Settings — Gemini API
- Save/update Gemini API key
- View key status (last 4 characters shown)
- Select default image & video models
- Models loaded dynamically from the API

### API Client
All API calls go through `apiFetch` from `lib/apiClient.js`:
- Attaches `Authorization: Bearer <token>` automatically
- On 401, refreshes the token via `/api/refresh` and retries
- Handles array-style error responses `[{"message": "..."}, 400]`

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `https://agents.zettalgor.com/`) |

## Content Security Policy (CSP)

CSP is configured in `next.config.mjs` to allow:
- Images from `agents.zettalgor.com` and `picsum.photos`
- Styles from `fonts.googleapis.com`
- Fonts from `fonts.gstatic.com`
- API connections to `agents.zettalgor.com`

If you add new external domains for assets, update the CSP headers in `next.config.mjs`.
