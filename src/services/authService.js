// src/services/authService.js
// Single Responsibility: Handle authentication and authorization headers

/**
 * Get authentication headers for API requests
 * @param {string} authType - Type of authentication ('read' or 'write')
 * @returns {Object} Headers object with authorization
 */
export function getAuthHeaders(authType = 'read') {
  if (!["read", "write"].includes(authType)) {
    throw new Error(`Invalid auth type: ${authType}. Use "read" or "write".`);
  }

  const authKeys = {
    read: import.meta.env.VITE_TMDB_AUTH_KEY,
    write: import.meta.env.VITE_TMDB_ACCESS_TOKEN_WITHWRITEPMS,
  };

  return {
    "content-type": "application/json",
    Authorization: authKeys[authType],
  };
}

/**
 * Get request options for API calls
 * @param {string} method - HTTP method
 * @param {Object|null} body - Request body
 * @param {string} withWPms - Authentication type ('read' or 'write')
 * @returns {Object} Options object for fetch
 */
export function RequestOptions(method, body = null, withWPms = "read") {
  if (!["read", "write"].includes(withWPms)) {
    throw new Error(`Invalid auth type: ${withWPms}. Use "read" or "write".`);
  }

  const options = {
    method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getAuthHeaders(withWPms).Authorization,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}