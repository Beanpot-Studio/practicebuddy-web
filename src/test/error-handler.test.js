import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getAuthErrorMessage, 
  getFirestoreErrorMessage, 
  handleFirebaseError,
  createErrorResponse,
  isNetworkError,
  isPermissionError 
} from '../lib/errorHandler'

describe('Error Handler Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAuthErrorMessage', () => {
    it('should return user-friendly message for known auth error codes', () => {
      expect(getAuthErrorMessage('auth/email-already-in-use'))
        .toBe('An account with this email already exists. Please try logging in instead.')
      
      expect(getAuthErrorMessage('auth/weak-password'))
        .toBe('Password should be at least 6 characters long.')
      
      expect(getAuthErrorMessage('auth/user-not-found'))
        .toBe('No account found with this email address.')
    })

    it('should return fallback message for unknown error codes', () => {
      expect(getAuthErrorMessage('auth/unknown-error'))
        .toBe('An error occurred. Please try again.')
      
      expect(getAuthErrorMessage('auth/unknown-error', 'Custom fallback'))
        .toBe('Custom fallback')
    })

    it('should return fallback message for null/undefined error codes', () => {
      expect(getAuthErrorMessage(null))
        .toBe('An error occurred. Please try again.')
      
      expect(getAuthErrorMessage(undefined))
        .toBe('An error occurred. Please try again.')
    })
  })

  describe('getFirestoreErrorMessage', () => {
    it('should return user-friendly message for known firestore error codes', () => {
      expect(getFirestoreErrorMessage('permission-denied'))
        .toBe('You don\'t have permission to perform this action.')
      
      expect(getFirestoreErrorMessage('unavailable'))
        .toBe('The service is currently unavailable. Please try again later.')
      
      expect(getFirestoreErrorMessage('not-found'))
        .toBe('The requested resource was not found.')
    })

    it('should return fallback message for unknown error codes', () => {
      expect(getFirestoreErrorMessage('unknown-error'))
        .toBe('A database error occurred. Please try again.')
      
      expect(getFirestoreErrorMessage('unknown-error', 'Custom fallback'))
        .toBe('Custom fallback')
    })
  })

  describe('handleFirebaseError', () => {
    it('should handle auth errors correctly', () => {
      const authError = new Error('Firebase: Error (auth/email-already-in-use).')
      authError.code = 'auth/email-already-in-use'
      
      const result = handleFirebaseError(authError, 'registration')
      
      expect(result.code).toBe('auth/email-already-in-use')
      expect(result.message).toBe('An account with this email already exists. Please try logging in instead.')
      expect(result.context).toBe('registration')
      expect(result.originalError).toBe(authError)
    })

    it('should handle firestore errors correctly', () => {
      const firestoreError = new Error('Firestore: Error (permission-denied).')
      firestoreError.code = 'permission-denied'
      
      const result = handleFirebaseError(firestoreError, 'firestore')
      
      expect(result.code).toBe('permission-denied')
      expect(result.message).toBe('You don\'t have permission to perform this action.')
      expect(result.context).toBe('firestore')
    })

    it('should handle errors without code but with message pattern', () => {
      const error = new Error('Firebase: Error (auth/network-request-failed).')
      
      const result = handleFirebaseError(error, 'login')
      
      expect(result.code).toBe('auth/network-request-failed')
      expect(result.message).toBe('Network error. Please check your internet connection and try again.')
    })

    it('should handle unknown errors gracefully', () => {
      const error = new Error('Unknown error occurred')
      
      const result = handleFirebaseError(error, 'general')
      
      expect(result.code).toBeNull()
      expect(result.message).toBe('An unexpected error occurred. Please try again.')
      expect(result.context).toBe('general')
    })
  })

  describe('createErrorResponse', () => {
    it('should create standardized error response', () => {
      const result = createErrorResponse('Test error message', 'test-code', 'test-context')
      
      expect(result).toEqual({
        success: false,
        error: 'Test error message',
        code: 'test-code',
        context: 'test-context',
        timestamp: expect.any(String)
      })
    })

    it('should create error response with default values', () => {
      const result = createErrorResponse('Test error message')
      
      expect(result).toEqual({
        success: false,
        error: 'Test error message',
        code: null,
        context: 'general',
        timestamp: expect.any(String)
      })
    })
  })

  describe('isNetworkError', () => {
    it('should identify network errors correctly', () => {
      const networkError = new Error('Network error')
      networkError.code = 'auth/network-request-failed'
      
      expect(isNetworkError(networkError)).toBe(true)
      
      const firestoreNetworkError = new Error('Firestore unavailable')
      firestoreNetworkError.code = 'firestore/unavailable'
      
      expect(isNetworkError(firestoreNetworkError)).toBe(true)
    })

    it('should identify network errors by message content', () => {
      const error = new Error('network request failed')
      expect(isNetworkError(error)).toBe(true)
      
      const fetchError = new Error('fetch failed')
      expect(isNetworkError(fetchError)).toBe(true)
      
      const networkError = new Error('network error')
      expect(isNetworkError(networkError)).toBe(true)
    })

    it('should return false for non-network errors', () => {
      const authError = new Error('Invalid password')
      authError.code = 'auth/wrong-password'
      
      expect(isNetworkError(authError)).toBe(false)
    })
  })

  describe('isPermissionError', () => {
    it('should identify permission errors correctly', () => {
      const permissionError = new Error('Permission denied')
      permissionError.code = 'firestore/permission-denied'
      
      expect(isPermissionError(permissionError)).toBe(true)
      
      const authPermissionError = new Error('Requires recent login')
      authPermissionError.code = 'auth/requires-recent-login'
      
      expect(isPermissionError(authPermissionError)).toBe(true)
    })

    it('should return false for non-permission errors', () => {
      const authError = new Error('Invalid password')
      authError.code = 'auth/wrong-password'
      
      expect(isPermissionError(authError)).toBe(false)
    })
  })
}) 