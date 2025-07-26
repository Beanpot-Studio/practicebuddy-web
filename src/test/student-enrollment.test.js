import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerStudent, loginStudent } from '../lib/auth.js'

// Mock Firebase modules
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
  isDemoMode: false
}))

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn()
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn()
}))

vi.mock('../lib/errorHandler', () => ({
  logError: vi.fn(),
  handleFirebaseError: vi.fn(),
  createErrorResponse: vi.fn()
}))

describe('Student Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully register a student with email and password', async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
    const { setDoc } = await import('firebase/firestore')
    
    // Mock successful user creation
    createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: 'student123',
        email: 'student@example.com'
      }
    })
    
    // Mock successful profile update
    updateProfile.mockResolvedValue(undefined)
    
    // Mock successful Firestore document creation
    setDoc.mockResolvedValue(undefined)
    
    const result = await registerStudent('student@example.com', 'password123', 'John Doe', {
      instrument: 'Piano'
    })
    
    expect(result.success).toBe(true)
    expect(result.user.email).toBe('student@example.com')
    expect(result.user.displayName).toBe('John Doe')
    expect(result.user.instrument).toBe('Piano')
  })

  it('should successfully login a student with email and password', async () => {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { getDoc } = await import('firebase/firestore')
    
    // Mock successful authentication
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: 'student123',
        email: 'student@example.com'
      }
    })
    
    // Mock successful user data retrieval
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        displayName: 'John Doe',
        role: 'student',
        instrument: 'Piano',
        practiceMinutes: 120,
        achievements: ['First Practice']
      })
    })
    
    const result = await loginStudent('student@example.com', 'password123')
    
    expect(result.success).toBe(true)
    expect(result.user.email).toBe('student@example.com')
    expect(result.user.displayName).toBe('John Doe')
    expect(result.user.instrument).toBe('Piano')
  })

  it('should handle invalid credentials gracefully', async () => {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { handleFirebaseError, createErrorResponse } = await import('../lib/errorHandler')
    
    // Mock authentication error
    const authError = new Error('Invalid credentials')
    authError.code = 'auth/user-not-found'
    signInWithEmailAndPassword.mockRejectedValue(authError)
    
    // Mock error handling
    handleFirebaseError.mockReturnValue({
      message: 'Invalid email or password',
      code: 'auth/user-not-found'
    })
    createErrorResponse.mockReturnValue({
      success: false,
      error: 'Invalid email or password',
      code: 'auth/user-not-found'
    })
    
    const result = await loginStudent('wrong@example.com', 'wrongpassword')
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email or password')
  })
}) 