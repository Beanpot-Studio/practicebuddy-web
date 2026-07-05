import { vi } from 'vitest'

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

// Ensure environment variables are set for testing
if (!process.env.PUBLIC_FIREBASE_API_KEY) {
  process.env.PUBLIC_FIREBASE_API_KEY = 'test-api-key'
}
if (!process.env.PUBLIC_FIREBASE_AUTH_DOMAIN) {
  process.env.PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
}
if (!process.env.PUBLIC_FIREBASE_PROJECT_ID) {
  process.env.PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
}
if (!process.env.PUBLIC_FIREBASE_APP_ID) {
  process.env.PUBLIC_FIREBASE_APP_ID = '1:123456789:web:test'
}
process.env.NODE_ENV = 'test'

// Global test utilities
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
} 