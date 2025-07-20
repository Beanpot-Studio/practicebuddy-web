import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase before importing auth
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return () => {}
    }),
    signOut: vi.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(() => Promise.resolve()),
    sendPasswordResetEmail: vi.fn(() => Promise.resolve())
  },
  db: {
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
}))

// Import after mocking
import { registerTeacher, USER_ROLES } from '../lib/auth'
import { auth, db } from '../lib/firebase'

describe('Teacher Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully register a new teacher', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'teacher@test.com'
    }

    auth.createUserWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    })
    auth.updateProfile.mockResolvedValue()
    db.doc().set.mockResolvedValue()

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
    auth.createUserWithEmailAndPassword.mockRejectedValue({
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
    auth.createUserWithEmailAndPassword.mockRejectedValue({
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
    auth.createUserWithEmailAndPassword.mockRejectedValue({
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

  it('should handle unknown error codes', async () => {
    auth.createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/unknown-error'
    })

    const result = await registerTeacher(
      'teacher@test.com',
      'password123',
      'Test Teacher'
    )

    expect(result.success).toBe(false)
    expect(result.error).toBe('An error occurred. Please try again.')
  })
})

describe('Registration Validation', () => {
  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    expect(emailRegex.test('valid@email.com')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
    expect(emailRegex.test('test@')).toBe(false)
    expect(emailRegex.test('@test.com')).toBe(false)
  })

  it('should validate password length', () => {
    const minLength = 6
    
    expect('password123'.length >= minLength).toBe(true)
    expect('123'.length >= minLength).toBe(false)
    expect('pass'.length >= minLength).toBe(false)
  })
}) 