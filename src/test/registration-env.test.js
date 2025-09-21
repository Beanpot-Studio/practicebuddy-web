import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase before importing
vi.mock('../lib/firebase', () => {
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return () => {}
    }),
    signOut: vi.fn(() => Promise.resolve()),
    signInWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(() => Promise.resolve()),
    sendPasswordResetEmail: vi.fn(() => Promise.resolve())
  }

  const mockDb = {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(() => Promise.resolve({ exists: () => false })),
        set: vi.fn(() => Promise.resolve())
      }))
    })),
    doc: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve({ exists: () => false })),
      set: vi.fn(() => Promise.resolve())
    }))
  }

  return {
    auth: mockAuth,
    db: mockDb
  }
})

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn((callback) => {
    callback(null)
    return () => {}
  }),
  updateProfile: vi.fn(() => Promise.resolve()),
  sendPasswordResetEmail: vi.fn(() => Promise.resolve())
}))

// Mock Firebase firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({
    get: vi.fn(() => Promise.resolve({ exists: () => false })),
    set: vi.fn(() => Promise.resolve())
  })),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve({ exists: () => false })),
      set: vi.fn(() => Promise.resolve())
    }))
  })),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] }))
}))

// Import after mocking
import { registerTeacher, USER_ROLES } from '../lib/auth'
import { auth, db } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc } from 'firebase/firestore'

describe('Teacher Registration with Environment Variables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use environment variables for Firebase config', () => {
    // Check that environment variables are available
    expect(process.env.PUBLIC_FIREBASE_API_KEY).toBeDefined()
    expect(process.env.PUBLIC_FIREBASE_AUTH_DOMAIN).toBeDefined()
    expect(process.env.PUBLIC_FIREBASE_PROJECT_ID).toBeDefined()
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('should successfully register a new teacher', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'teacher@test.com'
    }

    createUserWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    })
    updateProfile.mockResolvedValue()
    setDoc.mockResolvedValue()

    const result = await registerTeacher(
      'teacher@test.com',
      'password123',
      'Test Teacher',
      { school: 'Test School' }
    )

    expect(result.success).toBe(true)
    expect(result.user).toEqual({
      uid: 'test-uid',
      email: 'teacher@test.com',
      displayName: 'Test Teacher',
      role: USER_ROLES.TEACHER,
      school: 'Test School'
    })
  })

  it('should handle registration errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use'
    })

    const result = await registerTeacher(
      'existing@test.com',
      'password123',
      'Test Teacher'
    )

    expect(result.success).toBe(false)
    expect(result.error).toBe('An account with this email already exists.')
  })

  it('should handle weak password errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/weak-password'
    })

    const result = await registerTeacher(
      'teacher@test.com',
      '123',
      'Test Teacher'
    )

    expect(result.success).toBe(false)
    expect(result.error).toBe('Password should be at least 6 characters long.')
  })

  it('should handle network errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/network-request-failed'
    })

    const result = await registerTeacher(
      'teacher@test.com',
      'password123',
      'Test Teacher'
    )

    expect(result.success).toBe(false)
    expect(result.error).toBe('Network error. Please check your connection.')
  })
})

describe('Environment Variable Validation', () => {
  it('should validate required Firebase environment variables', () => {
    const requiredVars = [
      'PUBLIC_FIREBASE_API_KEY',
      'PUBLIC_FIREBASE_AUTH_DOMAIN',
      'PUBLIC_FIREBASE_PROJECT_ID',
      'PUBLIC_FIREBASE_APP_ID'
    ]

    requiredVars.forEach(varName => {
      expect(process.env[varName]).toBeDefined()
      expect(process.env[varName]).toBeTruthy()
    })
  })

  it('should have correct test environment configuration', () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(process.env.PUBLIC_FIREBASE_API_KEY).toBe('test-api-key')
    expect(process.env.PUBLIC_FIREBASE_AUTH_DOMAIN).toBe('test.firebaseapp.com')
  })
}) 