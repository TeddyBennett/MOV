# Movie App

A full-stack React + TypeScript application for browsing movies, managing favorites, and creating custom lists.

## 🏗 Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI (Radix Primitives)
- **State/Routing:** React Router v7, Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth

## 🚀 Setup & Installation

This project consists of a Client (Root) and a Server (`/server`). You will need to run both concurrently.

### 1. Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL Database

### 2. Backend Setup
The backend handles API requests, database interactions, and proxies calls to TMDB.

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `server` directory:
   ```env
   # Database connection
   DATABASE_URL="postgresql://user:password@localhost:5432/movie_app"

   # Server Port
   PORT=5000
   
   # Better Auth Secret
   BETTER_AUTH_SECRET="your_generated_secret"
   
   # TMDB API Key (if required by backend logic)
   TMDB_API_KEY="your_tmdb_api_key"
   ```
4. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start the Server:
   ```bash
   npm run dev
   ```
   *The server will start on port 5000.*

### 3. Frontend Setup

1. Open a new terminal in the **root** directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Client:
   ```bash
   npm run dev
   ```
   *The application will launch at `http://localhost:5173`.*

> **Note:** The Vite config is set up to proxy `/api` requests to `http://localhost:5000`. You do not need to configure backend URLs in the frontend `.env`.

## 🤖 Agentic Engineering & Documentation

This project utilizes the **PRP (Product Requirement Prompt)** methodology for AI-assisted development.

- **Implementation Plans:** Detailed architectural plans, refactoring logs, and decisions can be found in `docs/plans/`.
  - Check `docs/plans/2026-01-21-add-backend.plan.md` for the backend architecture.
  - Check `docs/plans/2026-01-29-refactor-to-typescript.plan.md` for the migration log.
- **Agents:** See [AGENTS.md](./AGENTS.md) for a list of specialized agents and their roles.
- **Guidelines:** Follow [PRPs-agentic-eng/CLAUDE.md](./PRPs-agentic-eng/CLAUDE.md) for contribution rules.

## 📜 Scripts

**Root:**
- `npm run dev`: Starts the frontend development server.
- `npm run build`: Builds both backend and frontend.
- `npm run lint`: Runs ESLint for the frontend.

**Server (`/server`):**
- `npm run dev`: Starts the backend in watch mode.
- `npm run build`: Compiles the backend and runs migrations.
- `npm run prisma:studio`: Opens the Prisma GUI to view database records.