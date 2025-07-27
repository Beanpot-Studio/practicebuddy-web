import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  registerTeacher, 
  registerStudent, 
  loginTeacher, 
  loginStudent, 
  logout, 
  resetPassword,
  USER_ROLES 
} from '../lib/auth'
import { auth, db } from '../lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { setDoc, getDoc, getDocs } from 'firebase/firestore'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return () => {}
    }),
    signOut: vi.fn(() => Promise.resolve()),
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

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Teacher Registration', () => {
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

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'teacher@test.com',
        'password123'
      )
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Test Teacher'
      })
      expect(setDoc).toHaveBeenCalled()
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
      expect(result.error).toBe('An account with this email already exists. Please try logging in instead.')
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
  })

  describe('Student Registration', () => {
    it('should successfully register a new student', async () => {
      const mockClassDoc = {
        exists: () => true,
        data: () => ({
          teacherId: 'teacher-123',
          className: 'Test Class'
        })
      }

      getDoc.mockResolvedValue(mockClassDoc)
      setDoc.mockResolvedValue()

      const result = await registerStudent(
        'Test Student',
        'CLASS123',
        { practiceMinutes: 0 }
      )

      expect(result.success).toBe(true)
      expect(result.user.role).toBe(USER_ROLES.STUDENT)
      expect(result.user.name).toBe('Test Student')
      expect(result.user.classCode).toBe('CLASS123')
    })

    it('should handle invalid class code', async () => {
      const mockClassDoc = {
        exists: () => false
      }

      getDoc.mockResolvedValue(mockClassDoc)

      const result = await registerStudent(
        'Test Student',
        'INVALID123'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid class code. Please check with your teacher.')
    })
  })

  describe('Teacher Login', () => {
    it('should successfully login a teacher', async () => {
      const mockUser = {
        uid: 'teacher-uid',
        email: 'teacher@test.com',
        displayName: 'Test Teacher'
      }

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      })

      const mockUserData = {
        role: USER_ROLES.TEACHER,
        school: 'Test School'
      }

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData
      })

      const result = await loginTeacher('teacher@test.com', 'password123')

      expect(result.success).toBe(true)
      expect(result.user.role).toBe(USER_ROLES.TEACHER)
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'teacher@test.com',
        'password123'
      )
    })

    it('should reject non-teacher accounts', async () => {
      const mockUser = {
        uid: 'student-uid',
        email: 'student@test.com'
      }

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      })

      const mockUserData = {
        role: USER_ROLES.STUDENT
      }

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData
      })

      signOut.mockResolvedValue()

      const result = await loginTeacher('student@test.com', 'password123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('This account is not registered as a teacher.')
      expect(signOut).toHaveBeenCalled()
    })

    it('should handle login errors', async () => {
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/user-not-found'
      })

      const result = await loginTeacher('nonexistent@test.com', 'password123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('No account found with this email address.')
    })
  })

  describe('Student Login', () => {
    it('should successfully login a student', async () => {
      const mockClassDoc = {
        exists: () => true,
        data: () => ({
          teacherId: 'teacher-123'
        })
      }

      const mockStudentDoc = {
        id: 'student-123',
        data: () => ({
          name: 'Test Student',
          classCode: 'CLASS123',
          teacherId: 'teacher-123',
          practiceMinutes: 120
        })
      }

      getDoc.mockResolvedValue(mockClassDoc)
      getDocs.mockResolvedValue({
        empty: false,
        docs: [mockStudentDoc]
      })

      const result = await loginStudent('Test Student', 'CLASS123')

      expect(result.success).toBe(true)
      expect(result.user.role).toBe(USER_ROLES.STUDENT)
      expect(result.user.name).toBe('Test Student')
    })

    it('should handle invalid class code for student login', async () => {
      const mockClassDoc = {
        exists: () => false
      }

      getDoc.mockResolvedValue(mockClassDoc)

      const result = await loginStudent('Test Student', 'INVALID123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid class code. Please check with your teacher.')
    })

    it('should handle student not found', async () => {
      const mockClassDoc = {
        exists: () => true
      }

      getDoc.mockResolvedValue(mockClassDoc)
      getDocs.mockResolvedValue({
        empty: true
      })

      const result = await loginStudent('Wrong Name', 'CLASS123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Student not found. Please check your name and class code.')
    })
  })

  describe('Logout', () => {
    it('should successfully logout', async () => {
      signOut.mockResolvedValue()

      const result = await logout()

      expect(result.success).toBe(true)
      expect(signOut).toHaveBeenCalled()
    })

    it('should handle logout errors', async () => {
      signOut.mockRejectedValue(new Error('Network error'))

      const result = await logout()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to logout. Please try again.')
    })
  })

  describe('Password Reset', () => {
    it('should successfully send password reset email', async () => {
      sendPasswordResetEmail.mockResolvedValue()

      const result = await resetPassword('teacher@test.com')

      expect(result.success).toBe(true)
      expect(result.message).toBe('Password reset email sent. Please check your inbox.')
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'teacher@test.com'
      )
    })

    it('should handle password reset errors', async () => {
      sendPasswordResetEmail.mockRejectedValue({
        code: 'auth/user-not-found'
      })

      const result = await resetPassword('nonexistent@test.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('No account found with this email address.')
    })
  })

  describe('Error Message Handling', () => {
    it('should handle unknown error codes', async () => {
      createUserWithEmailAndPassword.mockRejectedValue({
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
}) 