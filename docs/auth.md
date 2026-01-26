# Authentication Strategies for MovieApp (with OWASP Considerations)

This document outlines various authentication strategies for the MovieApp backend, providing code examples and highlighting best practices, particularly focusing on OWASP security recommendations.

## 1. Session-Based Authentication

**Overview:** In session-based authentication, the server creates a session for the user upon successful login, storing user-specific data on the server. A session ID is sent to the client (typically in an HTTP-only cookie), which is then sent back with subsequent requests to identify the user's session.

**Code Example (Node.js/Express with `express-session`):**

```javascript
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf'); // For CSRF protection
const helmet = require('helmet'); // For general security headers

const app = express();
const port = 3000;

// OWASP/Best Practice: Use Helmet for security headers
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// OWASP/Best Practice: Configure session securely
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-that-is-very-long-and-random', // Environment variable for production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // OWASP: Use secure cookies in production (HTTPS)
    httpOnly: true,                               // OWASP: Prevent client-side JavaScript access to cookie
    maxAge: 1000 * 60 * 60 * 24,                  // OWASP: Set appropriate cookie expiration (e.g., 24 hours)
    sameSite: 'Lax',                              // OWASP: Mitigate CSRF attacks (Strict or Lax)
  }
}));

// OWASP/Best Practice: CSRF Protection for state-changing requests
// Only apply CSURF after session middleware
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection); // Apply to all routes, or specifically to POST/PUT/DELETE routes

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).send('Unauthorized: Please log in.');
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome!</h1>
    <p><a href="/login">Login</a> | <a href="/dashboard">Dashboard (Protected)</a> | <a href="/logout">Logout</a></p>
    <p>Session ID: ${req.sessionID || 'No session'}</p>
    <p>User ID in Session: ${req.session.userId || 'None'}</p>
  `);
});

app.get('/login', csrfProtection, (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <input type="text" name="username" placeholder="username" required><br>
      <input type="password" name="password" placeholder="password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', csrfProtection, async (req, res) => {
  const { username, password } = req.body;

  // OWASP/Best Practice: Always hash passwords with a strong algorithm (e.g., bcrypt)
  // For this example, we'll use a dummy check. In real app, retrieve hashed password & salt from DB.
  // const user = await findUserInDB(username);
  // if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
  //   return res.status(401).send('Invalid credentials');
  // }

  // Dummy authentication check
  if (username === 'user' && password === 'pass') {
    req.session.userId = 123;
    req.session.username = username;
    // OWASP/Best Practice: Regenerate session ID after login to prevent session fixation attacks
    req.session.regenerate(err => {
      if (err) return res.status(500).send('Session regeneration failed');
      res.send(`Logged in as ${username}. Go to <a href="/dashboard">Dashboard</a>`);
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome, ${req.session.username}! Your user ID is ${req.session.userId}.</p>
    <p>This content is only visible to logged-in users.</p>
    <p><a href="/logout">Logout</a></p>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Could not log out');
    }
    res.send('Logged out successfully. <a href="/">Home</a>');
  });
});

app.listen(port, () => {
  console.log(`Session-based server running at http://localhost:${port}`);
  // OWASP/Best Practice: Do not expose sensitive info in logs/console in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Dummy credentials: user/pass');
  }
});

```

**OWASP & Best Practices for Session-Based Authentication:**

*   **Session ID Management (OWASP A7: Identification and Authentication Failures):**
    *   **HttpOnly Cookie:** The `httpOnly: true` flag prevents client-side JavaScript from accessing the session cookie, mitigating XSS attacks.
    *   **Secure Cookie:** The `secure: true` flag ensures the cookie is only sent over HTTPS, preventing eavesdropping. This should always be true in production.
    *   **Expiration (`maxAge`):** Set a reasonable expiration time to limit the window of opportunity for session hijacking.
    *   **Session Fixation Prevention:** Regenerate the session ID after a successful login (`req.session.regenerate()`) to prevent an attacker from using a session ID they might have already obtained.
*   **CSRF Protection (OWASP A4: Insecure Design):**
    *   **`csurf` middleware:** Use a CSRF token for all state-changing (POST, PUT, DELETE) requests. The token is generated by the server, embedded in the form, and verified upon submission.
    *   **`sameSite` Cookie Attribute:** Setting `sameSite: 'Lax'` or `sameSite: 'Strict'` for the session cookie helps mitigate CSRF attacks by instructing browsers when to send the cookie with cross-site requests.
*   **Password Storage (OWASP A2: Cryptographic Failures):**
    *   **Strong Hashing:** Always use a modern, computationally expensive hashing algorithm like bcrypt, scrypt, or Argon2 (with sufficient rounds/iterations) to store passwords. Never store plain text or weak hashes (like MD5, SHA1).
    *   **Salting:** Ensure salts are unique per user and stored with the hash. Hashing libraries usually handle this automatically.
*   **Authentication Failures (OWASP A7: Identification and Authentication Failures):**
    *   **Rate Limiting:** Implement rate limiting on login attempts to prevent brute-force attacks.
    *   **Generic Error Messages:** Avoid telling attackers which part of their login attempt (username or password) was incorrect.
*   **HTTPS Everywhere:** Always use HTTPS to protect all communication between client and server, preventing interception of session cookies.
*   **Session Storage:** In production, use a secure and persistent session store (e.g., Redis, PostgreSQL) instead of the default in-memory store for `express-session`.

## 2. Token-Based Authentication (JWTs)

**Overview:** With JWTs, upon successful login, the server issues a signed JSON Web Token to the client. This token contains user information (payload) and a signature. The client stores the JWT and sends it with each subsequent request (typically in an `Authorization` header). The server verifies the token's signature and expiration to authenticate the request, without needing to maintain server-side session state.

**Code Example (Node.js/Express with `jsonwebtoken` and `bcrypt`):**

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helmet = require('helmet'); // For general security headers
require('dotenv').config(); // Load environment variables like JWT_SECRET

const app = express();
const port = 3000;

// OWASP/Best Practice: Use Helmet for security headers
app.use(helmet());
app.use(bodyParser.json());

// OWASP/Best Practice: JWT_SECRET must be very strong and stored securely
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-long-random-jwt-secret-key-for-production';
const TOKEN_EXPIRATION = '1h'; // Token valid for 1 hour. OWASP: Keep JWTs short-lived.

// Dummy User Database (In a real app, this would be your Prisma/PostgreSQL database)
const users = [];

// Simulate a user registration (in a real app, this would be a separate /register endpoint)
async function registerDummyUser() {
  const hashedPassword = await bcrypt.hash('pass123', 10); // Hash password with salt rounds = 10 (OWASP: use enough rounds)
  users.push({ id: 1, username: 'testuser', password: hashedPassword });
  console.log('Dummy user registered:', users[0]);
}
registerDummyUser(); // Register a dummy user when the server starts

// Middleware to protect routes with JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // OWASP: Be specific about error if debugging, but generic to client
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ message: 'Access Denied: Invalid or expired token' });
    }
    req.user = user; // Attach user payload from token to request
    next();
  });
}

// Routes

// Login Endpoint: Authenticate user and issue JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' }); // OWASP: Generic error
  }

  // OWASP/Best Practice: Compare provided password with hashed password from database
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(400).json({ message: 'Invalid username or password' }); // OWASP: Generic error
  }

  const userPayload = { id: user.id, username: user.username };
  const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  // OWASP/Best Practice: How client stores JWT is critical.
  // If stored in localStorage: Vulnerable to XSS.
  // If stored in httpOnly, secure cookie: Mitigates XSS, but vulnerable to CSRF if not handled.
  res.json({ accessToken: accessToken });
});

// Protected Endpoint: Only accessible with a valid JWT
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}! This is your protected profile.`,
    userId: req.user.id,
    tokenPayload: req.user
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>JWT Authentication Example</h1>
    <p>Use POSTMAN or CURL to test:</p>
    <ul>
      <li><code>POST /login</code> with <code>{"username": "testuser", "password": "pass123"}</code> to get a token.</li>
      <li><code>GET /profile</code> with <code>Authorization: Bearer [YOUR_TOKEN]</code> in headers.</li>
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`JWT-based server running on http://localhost:${port}`);
});

```

**OWASP & Best Practices for Token-Based Authentication (JWTs):**

*   **JWT Secret (OWASP A5: Security Misconfiguration):**
    *   **Strong and Unique:** `JWT_SECRET` must be a very long, random, and cryptographically strong string. It should never be hardcoded in production; always use environment variables.
    *   **Server-Side Only:** Keep the secret strictly on the server. If it's compromised, attackers can forge tokens.
*   **Token Storage on Client (OWASP A7: Identification and Authentication Failures, A3: Injection):**
    *   **`localStorage`/`sessionStorage`:** Storing JWTs here makes them vulnerable to Cross-Site Scripting (XSS) attacks. If an attacker injects malicious JavaScript, they can steal the token.
    *   **HTTP-Only Cookies:** Storing JWTs in HTTP-only cookies mitigates XSS risks (JavaScript can't access them). However, this makes them vulnerable to Cross-Site Request Forgery (CSRF) attacks unless `sameSite: 'Lax'` or `sameSite: 'Strict'` is used and/or a separate CSRF token is implemented (as in session auth). This is a common and often preferred method for web browsers.
    *   **Memory/State Management:** In modern SPAs, tokens can be stored in memory within the application's state, but this means they disappear on refresh and still need to be retrieved securely initially.
*   **Token Expiration (OWASP A7: Identification and Authentication Failures):**
    *   **Short Lifespan:** JWTs should have short expiration times (`expiresIn: '1h'`). This limits the window of opportunity for an attacker to use a stolen token.
    *   **Refresh Tokens:** For longer sessions, implement refresh tokens. These are long-lived, single-use tokens sent only once to the client (often in an httpOnly cookie) and used to request new, short-lived access tokens. If a refresh token is stolen, its single-use nature and revocation mechanisms make it safer.
*   **Revocation (OWASP A7: Identification and Authentication Failures):**
    *   **No Native Revocation:** JWTs are stateless, meaning there's no native way to "logout" or "revoke" a token on the server before it expires.
    *   **Blacklisting:** For critical events (e.g., password change, security breach), implement a server-side blacklist (e.g., Redis) to store revoked JWTs, checking against it during verification.
*   **HTTPS Everywhere:** Crucial for protecting JWTs in transit from eavesdropping.
*   **Rate Limiting:** Protect login endpoints from brute-force attacks.
*   **Input Validation:** Validate all inputs (username, password) to prevent injection attacks.

## 3. OAuth 2.0 / OpenID Connect (Conceptual Outline)

**Overview:** This approach delegates user authentication to a third-party identity provider (IdP) like Google, GitHub, or Facebook. The user authenticates with the IdP, grants permission, and the IdP then informs your application of the user's identity. OpenID Connect is an authentication layer on top of OAuth 2.0, providing identity claims.

**Flow (Simplified):**

1.  **Client (Frontend) initiates:** User clicks "Login with Google." Frontend redirects the user's browser to Google's authentication server.
2.  **User authenticates with IdP:** User logs into Google (if not already) and grants your app permission.
3.  **IdP redirects back:** Google redirects the user's browser back to your application's specified redirect URL, including an `authorization code`.
4.  **Backend exchanges code:** Your backend receives the `authorization code` and exchanges it directly with Google's authentication server for an `access token` and optionally an `ID token` (OpenID Connect).
5.  **Backend identifies user:**
    *   The `ID token` (if using OIDC) contains verifiable identity information about the user.
    *   The `access token` can be used to fetch more user information from Google's API (e.g., user profile).
6.  **Backend creates/logs in local user:** Based on the information received from Google, your backend either:
    *   Creates a new user account in your own database (if it's their first time logging in).
    *   Logs in an existing user account linked to that Google ID.
7.  **Backend issues its own token/session:** Your backend then typically issues its own session cookie (for session-based) or a JWT (for token-based) to the client. This token/session is what the client will use for subsequent API calls to *your* backend.

**OWASP & Best Practices for OAuth 2.0 / OpenID Connect:**

*   **Client Configuration (OWASP A5: Security Misconfiguration):**
    *   **Redirect URIs:** Only register exact, specific redirect URIs with the IdP. Wildcards are dangerous.
    *   **Client Secrets:** Treat your application's client secret (issued by the IdP) like any other sensitive credential. Do not expose it in client-side code.
*   **State Parameter (OWASP A4: Insecure Design):**
    *   Use the `state` parameter in OAuth requests to prevent CSRF attacks. Your backend should generate a unique, unguessable `state` value, store it in the user's session, and verify it when the IdP redirects back.
*   **Proof Key for Code Exchange (PKCE) (OWASP A7: Identification and Authentication Failures):**
    *   **For Public Clients (SPAs, Mobile Apps):** PKCE is essential to prevent interception of authorization codes by malicious apps. It ensures that the client requesting the access token is the same one that initiated the authorization flow.
*   **Scope Management:** Request only the necessary permissions (scopes) from the IdP.
*   **HTTPS Everywhere:** All communication, especially redirects and token exchanges, must happen over HTTPS.
*   **Token Validation:** Always validate the `ID token` (signature, issuer, audience, expiry) received from the IdP on your backend.
*   **Link Accounts Securely:** When linking a social login to an existing local account, ensure the process is secure and verifies ownership of both accounts.