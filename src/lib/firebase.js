import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration
// In production, these should be environment variables
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "practice-buddy-demo.firebaseapp.com",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "practice-buddy-demo",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "practice-buddy-demo.appspot.com",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
}

// Check if we're in demo mode (no real Firebase config)
const isDemoMode = !import.meta.env.PUBLIC_FIREBASE_API_KEY || import.meta.env.PUBLIC_FIREBASE_API_KEY === "demo-api-key"

// Initialize Firebase
let app, auth, db

if (isDemoMode) {
  console.log('Running in demo mode - Firebase not initialized')
  // Create mock objects for demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Mock auth state listener
      callback(null)
      return () => {}
    }
  }
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: () => false }),
        set: () => Promise.resolve()
      })
    })
  }
} else {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)

  // Only connect to emulators if explicitly enabled
  if (import.meta.env.DEV && import.meta.env.PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('Connected to Firebase emulators')
    } catch (error) {
      console.log('Firebase emulators not running, using production services')
    }
  }
}

export { auth, db }
export default app 