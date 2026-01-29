# Feature: Add Backend Server

## Summary

This plan outlines the steps to create a Node.js backend server using Express. The server will act as a proxy for all requests to the TMDB API. This will enhance security by hiding API keys from the frontend and provide a foundation for future backend features like caching and database integration.

## User Story

As a developer,
I want to introduce a backend server to proxy TMDB API requests,
So that I can secure API keys and improve the application's architecture.

## Problem Statement

Currently, the frontend application makes direct calls to the TMDB API, exposing API keys in the client-side code. This is a security vulnerability and limits the application's ability to implement server-side logic like caching.

## Solution Statement

We will create a Node.js Express server that exposes a set of API endpoints. The frontend will call these endpoints. The Express server will then call the corresponding TMDB API endpoints, using the securely stored API keys, and return the response to the frontend.

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | REFACTOR                               |
| Complexity       | MEDIUM                               |
| Systems Affected | src/services, server                            |
| Dependencies     | express, cors, dotenv, node-fetch                 |
| Estimated Tasks  | 7                                           |

---

## UX Design

### Before State
```
+-----------------+      +------------------+
| React Frontend  |----->|   TMDB API       |
| (Vite)          |      | (api.themoviedb.org) |
+-----------------+      +------------------+
- API keys are exposed in the frontend code.
```

### After State
```
+-----------------+      +------------------+      +------------------+
| React Frontend  |----->|  Node.js Backend |----->|   TMDB API       |
| (Vite)          |      |  (Express)       |      | (api.themoviedb.org) |
+-----------------+      +------------------+      +------------------+
- API keys are stored securely on the backend.
```

### Interaction Changes
| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| src/services/apiService.js | Makes direct calls to TMDB API | Makes calls to the new Node.js backend | None to the end-user, but improves security. |

---

## Files to Change

| File                             | Action | Justification                            |
| -------------------------------- | ------ | ---------------------------------------- |
| `server/package.json`            | CREATE | To manage backend dependencies.           |
| `server/.env`                    | CREATE | To store TMDB API keys securely.         |
| `server/server.js`               | CREATE | The main file for the Express server.    |
| `server/routes/tmdb.js`          | CREATE | To handle all TMDB API proxy routes.     |
| `src/services/apiService.js`     | UPDATE | To point API requests to the new backend. |
| `src/services/authService.js`    | DELETE | No longer needed as backend handles auth. |
| `package.json`                   | UPDATE | To add a script to run the server.       |

---

## NOT Building (Scope Limits)

- No database integration at this stage.
- No caching implementation in the backend.
- No user authentication system (the backend will just be a proxy).

---

## Step-by-Step Tasks

### Task 1: Initialize Node.js project in `server` directory

- **ACTION**: Create a `package.json` file for the server.
- **IMPLEMENT**: `cd server && npm init -y`
- **VALIDATE**: Check that `server/package.json` is created.

### Task 2: Install backend dependencies

- **ACTION**: Install `express`, `cors`, `dotenv`, `node-fetch`.
- **IMPLEMENT**: `cd server && npm install express cors dotenv node-fetch`
- **VALIDATE**: Check that dependencies are added to `server/package.json`.

### Task 3: Create `.env` file for the server

- **ACTION**: Create a `.env` file in the `server` directory to store environment variables.
- **IMPLEMENT**: Create `server/.env` with the following content:
```
TMDB_AUTH_KEY=your_tmdb_read_access_auth_token
TMDB_ACCESS_TOKEN_WITHWRITEPMS=your_tmdb_v4_access_token
TMDB_ACCOUNT_ID=your_tmdb_account_id
```
- **VALIDATE**: `cat server/.env` to check the content.

### Task 4: Create the Express server

- **ACTION**: Create the main server file `server/server.js` and the routes file `server/routes/tmdb.js`.
- **IMPLEMENT**:
  - Create `server/server.js`:
  ```javascript
  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import tmdbRoutes from './routes/tmdb.js';

  dotenv.config();

  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/tmdb', tmdbRoutes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  ```
  - Create `server/routes/tmdb.js`:
  ```javascript
  import express from 'express';
  import fetch from 'node-fetch';
  
  const router = express.Router();
  
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  // A generic proxy endpoint
  router.all('/*', async (req, res) => {
    const url = `${BASE_URL}${req.path}`;
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TMDB_AUTH_KEY
      }
    };
  
    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }
  
    try {
      const apiResponse = await fetch(url, options);
      const data = await apiResponse.json();
      res.status(apiResponse.status).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while proxying the request.' });
    }
  });
  
  export default router;
  ```
- **VALIDATE**: `node server/server.js`. The server should start without errors.

### Task 5: Refactor frontend services

- **ACTION**: Update `src/services/apiService.js` to use the backend proxy and delete `src/services/authService.js`.
- **IMPLEMENT**:
  - In `apiService.js`, change `BASE_URL` to `'http://localhost:3001/api/tmdb'`. Remove `getAuthHeaders` and all headers from fetch options.
  - Delete `src/services/authService.js`.
- **VALIDATE**: `npm run lint`

### Task 6: Update root `package.json`

- **ACTION**: Add a script to run the backend server.
- **IMPLEMENT**: In the `scripts` section of the root `package.json`, add:
`"server": "node server/server.js"`
- **VALIDATE**: `npm run server` should start the server.

### Task 7: Test the application

- **ACTION**: Run both frontend and backend and test the application's functionality.
- **IMPLEMENT**: Run `npm run dev` and `npm run server` in two separate terminals. Open the application in the browser and test features like searching for movies, adding to favorites, etc.
- **VALIDATE**: The application should work as before. Check the network tab in the browser's developer tools to confirm that requests are being sent to `http://localhost:3001/api/tmdb`.

---

## Validation Commands

### Level 1: STATIC_ANALYSIS
```bash
npm run lint
```
**EXPECT**: Exit 0, no errors or warnings

### Level 2: MANUAL_VALIDATION
1. Run `npm run server`.
2. Run `npm run dev`.
3. Open the app in the browser.
4. Verify that movies are loaded, search works, and user actions (favorites, watchlist) are functional.
5. Check browser dev tools to ensure requests go to `localhost:3001`.

---

## Acceptance Criteria

- [ ] Backend server is created and runs without errors.
- [ ] Frontend is refactored to use the backend for all TMDB API calls.
- [ ] API keys are no longer exposed in the frontend code.
- [ ] The application is fully functional.

---

## Risks and Mitigations

| Risk               | Likelihood   | Impact       | Mitigation                              |
| ------------------ | ------------ | ------------ | --------------------------------------- |
| CORS issues        | MEDIUM       | HIGH         | The `cors` middleware is used in the Express server to handle this. |
| Incorrectly proxied requests | MEDIUM | HIGH | The generic proxy endpoint should handle most cases, but might need adjustments for specific routes. Thorough testing is required. |

