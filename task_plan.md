# Task Plan: Implement Backend with Prisma and Better-Auth

## Goal
To integrate a Node.js/Express backend with PostgreSQL (using Prisma ORM) and the 'better-auth' authentication framework to manage user-specific movie data (favorites, watchlist, lists) and user authentication for the existing React frontend.

## Current Phase
Phase 4

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent (complete from previous chat)
- [x] Identify constraints and requirements (Prisma ORM, better-auth, Node.js/Express, React frontend, PostgreSQL)
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define technical approach
- [x] Create project structure if needed
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Backend Core Implementation (Prisma & Express)
- [x] Set up `server` directory and initialize Node.js project.
- [x] Install core backend dependencies (express, dotenv, cors, @prisma/client, prisma).
- [x] Initialize Prisma and define `schema.prisma` for User, Favorite, Watchlist, List, ListMovie models.
- [x] Run Prisma migrations (`npx prisma migrate dev`).
- [x] Create `server/utils/prisma.ts` for Prisma Client instantiation.
- [x] Create `server/app.ts` for Express app configuration and middleware.
- [x] Create `server/server.ts` as the application entry point.
- [x] Install TypeScript related dependencies (`typescript`, `@types/node`, `@types/express`, `@types/cors`, `ts-node`, `nodemon`).
- [x] Create `server/tsconfig.json`.
- [x] Update `server/package.json` scripts for TypeScript (`dev`, `build`, `start`).
- [x] Create initial directory structure (`server/controllers`, `server/services`, `server/routes`, `server/middleware`).
- [x] Implement a simple "health check" route (`/`) using `server/routes/index.ts` and `server/controllers/indexController.ts`).
- **Status:** completed

### Phase 4: Authentication Implementation (`better-auth`)
- [x] Install `better-auth` and its dependencies.
- [x] Configure `better-auth` in `server/utils/auth.ts` and mount in `server/app.ts`.
- [x] Define `better-auth` providers (email/password).
- [x] Implement user registration and login endpoints (handled automatically by better-auth).
- [x] Protect existing and new API endpoints using `authMiddleware.ts`.
- [x] Implement user session/token retrieval for frontend (`/api/user/me`).
- **Status:** complete

### Phase 5: User Data API Endpoints (Favorites, Watchlist, Lists)
- [x] Create API endpoints for Favorites (`server/routes/favorites.ts`) using Prisma.
- [x] Create API endpoints for Watchlist (`server/routes/watchlist.ts`) using Prisma.
- [x] Create API endpoints for Custom Lists (`server/routes/lists.ts`) using Prisma.
- [x] Integrate these routes into `server/app.ts`.
- **Status:** complete

### Phase 5.5: User Ratings API & Frontend Integration
- [x] Create API endpoints for Ratings (`server/routes/ratings.ts`) using Prisma.
- [x] Implement backend logic for adding, retrieving, and checking ratings.
- [x] Refactor `RatedMoviesPage` to handle backend-stored ratings.
- [x] Integrate ratings into `MovieDataService`.
- **Status:** complete

### Phase 6: Frontend Integration
- [x] Create `src/services/backendApiService.ts` for new backend calls.
- [x] Update `src/services/movieDataService.ts` to use `BackendApiService` for user-specific data.
- [x] Modify relevant React components (e.g., `FavoritesPage.jsx`, `WatchingListPage.jsx`, `MovieCard.jsx`) to interact with new backend APIs.
- [x] Implement register and login pages/components in the frontend.
- [x] Manage authentication state in the frontend (e.g., store JWT).
- **Status:** complete

### Phase 7: Testing & Verification
- [ ] Verify backend API endpoints with tools like Postman/cURL.
- [ ] Test user registration and login flow.
- [ ] Verify frontend integration for all user-specific features.
- [ ] Ensure all OWASP best practices are addressed.
- [ ] Document test results.
- **Status:** pending

### Phase 8: Delivery
- [ ] Review all output files and code.
- [ ] Ensure deliverables are complete.
- [ ] Deliver to user.
- **Status:** pending

## Key Questions
1. What specific `better-auth` providers will be prioritized for initial implementation (e.g., email/password only, or also Google/GitHub)?
2. How will user roles/permissions be handled, if at all, initially?
3. What is the preferred method for the frontend to store and send `better-auth` tokens/sessions (e.g., httpOnly cookies, localStorage, in-memory)?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Prisma ORM for database interaction | Provides type-safety, efficient query building, and simplifies database schema management compared to raw SQL or `node-postgres`. |
| `better-auth` for authentication | Offers a comprehensive, developer-friendly solution for authentication, abstracting away complexities of JWTs/sessions/OAuth, with TypeScript support and out-of-the-box features. |
| Initial `better-auth` provider | Email/password, to simplify initial setup and focus on core features. |
| User roles/permissions | No roles or permissions will be implemented initially to streamline the MVP. |
| Frontend token storage | HttpOnly cookies will be used for authentication token/session storage, adhering to best security practices. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- Update phase status as you progress: pending → in_progress → complete
- After completing each phase Update **Status:** of  `progress.md`
- Re-read this plan before major decisions (attention manipulation)
- Log ALL errors - they help avoid repetition
