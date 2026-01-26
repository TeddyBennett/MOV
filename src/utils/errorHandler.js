// src/utils/errorHandler.js
// Single Responsibility: Handle and format errors consistently across the application

/**
 * Format API error response
 * @param {Object} error - Error object
 * @returns {string} Formatted error message
 */
export function formatApiError(error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error: Please check your internet connection.';
  }

  if (error.response) {
    // Server responded with error status
    return `Server error (${error.response.status}): ${error.response.statusText}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Request failed: No response from server.';
  } else {
    // Something else happened
    return `Error: ${error.message || 'An unknown error occurred.'}`;
  }
}

/**
 * Log error with context
 * @param {string} context - Context where error occurred
 * @param {Object} error - Error object
 */
export function logError(context, error) {
  console.error(`[${context}] Error:`, error);
}

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {any} originalError - Original error object
 * @returns {Object} Standardized error object
 */
export function createError(message, code = 'UNKNOWN_ERROR', originalError = null) {
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
    originalError,
  };
}

/**
 * Handle API response and throw appropriate errors
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 */
export async function handleApiResponse(response) {
  // 1. Handle Errors Immediately (Fail Fast)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[Frontend Agent] API Error ${response.status}:`, errorData);

    const errorMessage = errorData.message || errorData.status_message || `HTTP error! Status: ${response.status}`;

    // Custom error keeps your stack traces clean
    throw createError(errorMessage, `HTTP_${response.status}`, {
      status: response.status,
      ...errorData
    });
  }

  // 2. Handle No Content (Essential for 204 or empty responses)
  const isNoContent = response.status === 204;
  const isEmpty = response.headers.get('content-length') === '0';

  if (isNoContent || isEmpty) {
    return null;
  }

  // 3. Robust JSON Parsing
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch (e) {
      console.warn('[Frontend Agent] Expected JSON but parsing failed.');
      return null;
    }
  }

  return null;
}
