/**
 * Firebase Error Handler Service
 * Provides user-friendly error messages for Firebase authentication and Firestore errors
 */

// Firebase Auth Error Codes and their user-friendly messages
const AUTH_ERROR_MESSAGES = {
  // Registration errors
  'auth/email-already-in-use': 'An account with this email already exists. Please try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  
  // Login errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
  // Friendly guidance for provider-specific sign-in
  'auth/use-google': 'This account uses Google sign-in. Please click “Continue with Google” to log in.',
  'auth/use-password': 'This account uses email and password. Please sign in with your email address and password.',
  
  // Password reset errors
  'auth/invalid-action-code': 'The password reset link is invalid or has expired.',
  'auth/expired-action-code': 'The password reset link has expired. Please request a new one.',
  'auth/invalid-continue-uri': 'The continue URL provided in the request is invalid.',
  'auth/missing-continue-uri': 'A continue URL must be provided in the request.',
  'auth/unauthorized-continue-uri': 'The domain of the continue URL is not whitelisted.',
  
  // Network and general errors
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the sign-in.',
  'auth/cancelled-popup-request': 'The sign-in popup was cancelled.',
  'auth/popup-blocked': 'The sign-in popup was blocked by the browser. Please allow popups for this site.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
  
  // Default error
  'auth/unknown': 'An unexpected error occurred. Please try again.',
  'auth/wrong-role': 'You attempted to log in with the wrong role. Please switch to the correct login tab and try again.',
  
  // Tab switching errors
  'tab-switch': 'Please resolve form errors before switching tabs.'
}

// Firestore Error Messages
const FIRESTORE_ERROR_MESSAGES = {
  'permission-denied': 'You don\'t have permission to perform this action.',
  'unavailable': 'The service is currently unavailable. Please try again later.',
  'deadline-exceeded': 'The request timed out. Please try again.',
  'resource-exhausted': 'The service is temporarily overloaded. Please try again later.',
  'failed-precondition': 'The operation was rejected because the system is not in a state required for the operation\'s execution.',
  'aborted': 'The operation was aborted.',
  'out-of-range': 'The operation was attempted past the valid range.',
  'unimplemented': 'The operation is not implemented or not supported.',
  'internal': 'An internal error occurred. Please try again.',
  'data-loss': 'Unrecoverable data loss or corruption.',
  'unauthenticated': 'The request does not have valid authentication credentials.',
  'already-exists': 'The resource already exists.',
  'not-found': 'The requested resource was not found.',
  'invalid-argument': 'The request contains an invalid argument.',
  'unknown': 'An unknown error occurred. Please try again.'
}

/**
 * Get user-friendly error message for Firebase Auth errors
 * @param {string} errorCode - Firebase error code
 * @param {string} fallbackMessage - Fallback message if error code not found
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (errorCode, fallbackMessage = 'An error occurred. Please try again.') => {
  if (!errorCode) return fallbackMessage
  
  // Check if we have a specific message for this error code
  const message = AUTH_ERROR_MESSAGES[errorCode]
  if (message) return message
  
  // If no specific message, return fallback
  return fallbackMessage
}

/**
 * Get user-friendly error message for Firestore errors
 * @param {string} errorCode - Firestore error code
 * @param {string} fallbackMessage - Fallback message if error code not found
 * @returns {string} User-friendly error message
 */
export const getFirestoreErrorMessage = (errorCode, fallbackMessage = 'A database error occurred. Please try again.') => {
  if (!errorCode) return fallbackMessage
  
  // Check if we have a specific message for this error code
  const message = FIRESTORE_ERROR_MESSAGES[errorCode]
  if (message) return message
  
  // If no specific message, return fallback
  return fallbackMessage
}

/**
 * Handle Firebase errors and return user-friendly messages
 * @param {Error} error - Firebase error object
 * @param {string} context - Context where the error occurred (e.g., 'registration', 'login', 'firestore')
 * @returns {Object} Error object with user-friendly message
 */
export const handleFirebaseError = (error, context = 'general') => {
  
  let errorCode = null
  let userMessage = 'An unexpected error occurred. Please try again.'
  
  // Extract error code from Firebase error
  if (error && error.code) {
    errorCode = error.code
  } else if (error && error.message) {
    // Try to extract error code from message
    const codeMatch = error.message.match(/\(([^)]+)\)/)
    if (codeMatch) {
      errorCode = codeMatch[1]
    }
  }
  
  // Get appropriate error message based on context
  if (errorCode) {
    if (errorCode.startsWith('auth/')) {
      userMessage = getAuthErrorMessage(errorCode)
      // Context-specific refinements to avoid overly generic guidance across the app
      if ((context.includes('login') || context.includes('signin')) && errorCode === 'auth/account-exists-with-different-credential') {
        userMessage = 'This email is linked to Google sign-in. Please click “Continue with Google” to log in.'
      }
    } else if (errorCode.startsWith('firestore/') || errorCode in FIRESTORE_ERROR_MESSAGES) {
      userMessage = getFirestoreErrorMessage(errorCode)
    } else {
      // Try auth errors first, then firestore
      userMessage = getAuthErrorMessage(errorCode) || getFirestoreErrorMessage(errorCode)
    }
  }
  
  return {
    code: errorCode,
    message: userMessage,
    originalError: error,
    context: context
  }
}

/**
 * Handle form validation errors
 * @param {Object} validationErrors - Object containing validation errors
 * @returns {string} First validation error message
 */
export const handleValidationError = (validationErrors) => {
  if (!validationErrors || typeof validationErrors !== 'object') {
    return 'Please check your input and try again.'
  }
  
  // Return the first error message
  const firstError = Object.values(validationErrors).find(error => error)
  return firstError || 'Please check your input and try again.'
}

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {string} context - Error context
 * @returns {Object} Standardized error object
 */
export const createErrorResponse = (message, code = null, context = 'general') => {
  return {
    success: false,
    error: message,
    code: code,
    context: context,
    timestamp: new Date().toISOString()
  }
}

/**
 * Log error for debugging (only in development)
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = 'general') => {
  if (import.meta.env.DEV) {
    console.group(`🚨 Error in ${context}`)
    console.error('Error:', error)
    console.error('Stack:', error.stack)
    console.error('Context:', context)
    console.groupEnd()
  }
}

/**
 * Check if error is a network error
 * @param {Error} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  if (!error) return false
  
  const networkErrorCodes = [
    'auth/network-request-failed',
    'firestore/unavailable',
    'firestore/deadline-exceeded'
  ]
  
  return networkErrorCodes.includes(error.code) || 
         error.message?.includes('network') ||
         error.message?.includes('fetch')
}

/**
 * Check if error is a permission error
 * @param {Error} error - Error object
 * @returns {boolean} True if permission error
 */
export const isPermissionError = (error) => {
  if (!error) return false
  
  const permissionErrorCodes = [
    'auth/requires-recent-login',
    'firestore/permission-denied',
    'firestore/unauthenticated'
  ]
  
  return permissionErrorCodes.includes(error.code)
}

/**
 * Get retry suggestion based on error type
 * @param {Error} error - Error object
 * @returns {string} Retry suggestion or null
 */
export const getRetrySuggestion = (error) => {
  if (isNetworkError(error)) {
    return 'Please check your internet connection and try again.'
  }
  
  if (isPermissionError(error)) {
    return 'Please log in again to continue.'
  }
  
  if (error.code === 'auth/too-many-requests') {
    return 'Please wait a few minutes before trying again.'
  }
  
  return null
} 