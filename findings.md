# Findings & Decisions

## Requirements
<!-- Captured from user request -->
- Implement a Node.js/Express backend for the MovieApp.
- Use PostgreSQL as the database.
- Integrate Prisma ORM for database interactions.
- Implement user-specific data storage: favorites, watchlist, custom lists.
- Use 'better-auth' for user authentication (registration, login, protection of routes).
- Integrate the new backend APIs and authentication with the existing React frontend.
- Provide a register/login page on the frontend.
- Follow best practices and OWASP recommendations for security.

## Research Findings
<!-- Key discoveries during exploration -->
- Reviewed `docs/plans/2026-01-21-add-backend.plan.md` for initial backend structure and database models.
- Reviewed `package.json` to understand existing frontend dependencies and versions for compatibility.
- Investigated `better-auth.com` to understand its features, benefits, and how it abstracts various authentication methods. It supports TypeScript, various frameworks, email/password, social sign-on, 2FA, multi-tenancy, and has a plugin ecosystem.
- Understood that `better-auth` simplifies the implementation of secure authentication by providing a higher-level abstraction over traditional JWT, session, and OAuth methods.
- Drafted example code for Session-based and JWT-based authentication with OWASP considerations into `docs/auth.md`.

## Technical Decisions
<!-- Decisions made with rationale -->
| Decision | Rationale |
|----------|-----------|
| Prisma ORM for database interaction | Provides type-safety, efficient query building, and simplifies database schema management compared to raw SQL or `node-postgres`. |
| `better-auth` for authentication | Offers a comprehensive, developer-friendly solution for authentication, abstracting away complexities of JWTs/sessions/OAuth, with TypeScript support and out-of-the-box features, aligning with modern security practices. |
| Node.js/Express for backend | Leverages existing JavaScript ecosystem knowledge from the frontend, robust and flexible for API development. |
| PostgreSQL for database | A powerful, reliable, and open-source relational database, well-supported by Prisma. |
| REST API architecture | Standard and well-understood for communication between the React frontend and Node.js backend. |
| Initial `better-auth` provider | Email/password, to simplify initial setup and focus on core features. |
| User roles/permissions | No roles or permissions will be implemented initially to streamline the MVP. |
| Frontend token storage | HttpOnly cookies will be used for authentication token/session storage, adhering to best security practices. |

## Issues Encountered
<!-- Errors and how they were resolved -->
| Issue | Resolution |
|-------|------------|
| Initial plan used `pg` (node-postgres) directly | User requested to switch to Prisma ORM for improved developer experience and type safety. Plan updated. |
| Discussion on "better auth lib" | Clarified that `better-auth` is a comprehensive framework that abstracts underlying methods, rather than being one of the traditional methods itself. User agreed to use it. |
| Prisma `P1001` error: Cannot reach database server | User needs to ensure their PostgreSQL database is running and `DATABASE_URL` in `server/.env` is correctly configured. Cannot proceed with migrations until this is resolved externally. |

## Resources
<!-- URLs, file paths, API references -->
- `docs/plans/2026-01-21-add-backend.plan.md` (updated with Prisma integration plan)
- `docs/auth.md` (authentication examples and OWASP considerations)
- `https://www.better-auth.com/`
- `package.json` (for existing dependencies)

## Visual/Browser Findings
<!-- CRITICAL: Update after every 2 view/browser operations -->
<!-- Multimodal content must be captured as text immediately -->
- The `better-auth` website showcases a simple API for setup and mentions "auto generated my drizzle schemas for users, sessions etc, full type safe and dead simple api", which indicates it handles schema generation and type safety for user/session related data, potentially interacting with Prisma or managing its own schema. This needs further investigation during implementation.

---
*Update this file after every 2 view/browser operations*
*This prevents visual information from being lost*
