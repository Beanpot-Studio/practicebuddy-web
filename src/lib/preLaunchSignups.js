import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

/**
 * Submit a pre-launch signup to Firebase Firestore
 * @param {Object} signupData - The signup data
 * @param {string} signupData.email - Email address
 * @param {string} signupData.role - User role (student, teacher, parent, other)
 * @param {string} signupData.instrument - Primary instrument (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
export const submitPreLaunchSignup = async (signupData) => {
  try {
    // Validate required fields
    if (!signupData.email || !signupData.role) {
      throw new Error('Email and role are required')
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) {
      throw new Error('Invalid email format')
    }

    // Prepare data for Firestore
    const signupDoc = {
      email: signupData.email.toLowerCase().trim(),
      role: signupData.role,
      instrument: signupData.instrument?.trim() || '',
      mailingListOptIn: signupData.mailingListOptIn || false,
      createdAt: serverTimestamp(),
      source: 'pre-launch-screen',
      status: 'pending'
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'emails'), signupDoc)
    
    
    return {
      success: true,
      id: docRef.id,
      message: 'Signup submitted successfully!'
    }
    
  } catch (error) {
    
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      throw new Error('Unable to submit signup. Please try again later.')
    }
    
    if (error.code === 'already-exists') {
      throw new Error('This email is already registered.')
    }
    
    throw new Error('Failed to submit signup. Please try again.')
  }
}

/**
 * Get pre-launch signup statistics
 * @returns {Promise<Object>} - Statistics object
 */
export const getPreLaunchStats = async () => {
  try {
    // This would typically query Firestore for statistics
    // For now, return mock data
    return {
      totalSignups: 500,
      musicSchools: 50,
      students: 1000
    }
  } catch (error) {
    return {
      totalSignups: 0,
      musicSchools: 0,
      students: 0
    }
  }
}

/**
 * Check if email is already signed up
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if already signed up
 */
export const isEmailAlreadySignedUp = async (email) => {
  try {
    // This would typically query Firestore
    // For now, check localStorage for demo purposes
    const signups = JSON.parse(localStorage.getItem('practiceBuddySignups') || '[]')
    return signups.some(signup => signup.email.toLowerCase() === email.toLowerCase())
  } catch (error) {
    console.error('Error checking email signup status:', error)
    return false
  }
} 