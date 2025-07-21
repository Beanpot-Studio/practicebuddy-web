import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from './firebase'
import { handleFirebaseError, logError, createErrorResponse } from './errorHandler'

// Check if we're in demo mode
const isDemoMode = !import.meta.env.PUBLIC_FIREBASE_API_KEY || import.meta.env.PUBLIC_FIREBASE_API_KEY === "demo-api-key"

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher'
}

// Authentication state management
let authStateListener = null

/**
 * Initialize authentication state listener
 * @param {Function} callback - Callback function to handle auth state changes
 */
export const initAuthState = (callback) => {
  if (authStateListener) {
    authStateListener()
  }
  
  if (isDemoMode) {
    // Demo mode - always return not authenticated
    callback({
      user: null,
      isAuthenticated: false
    })
    return
  }
  
  authStateListener = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get additional user data from Firestore
      const userData = await getUserData(user.uid)
      callback({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userData
        },
        isAuthenticated: true
      })
    } else {
      callback({
        user: null,
        isAuthenticated: false
      })
    }
  })
}

/**
 * Register a new teacher account
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @param {Object} teacherData - Additional teacher data
 */
export const registerTeacher = async (email, password, displayName, teacherData = {}) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    })

    // Store additional teacher data in Firestore
    const teacherDoc = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: USER_ROLES.TEACHER,
      createdAt: new Date().toISOString(),
      ...teacherData
    }

    await setDoc(doc(db, 'users', user.uid), teacherDoc)

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: USER_ROLES.TEACHER,
        ...teacherData
      }
    }
  } catch (error) {
    logError(error, 'teacher-registration')
    const errorInfo = handleFirebaseError(error, 'teacher-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'teacher-registration')
  }
}

/**
 * Register a new student account with class code
 * @param {string} name - Student name
 * @param {string} classCode - Class code provided by teacher
 * @param {Object} studentData - Additional student data
 */
export const registerStudent = async (name, classCode, studentData = {}) => {
  try {
    // For students, we'll use a simple system with class codes
    // In a real app, you might want to generate temporary passwords or use email links
    
    // Check if class code exists and get teacher info
    const classDoc = await getDoc(doc(db, 'classes', classCode))
    
    if (!classDoc.exists()) {
      return {
        success: false,
        error: 'Invalid class code. Please check with your teacher.'
      }
    }

    const classData = classDoc.data()
    
    // Create student document
    const studentDoc = {
      name: name,
      classCode: classCode,
      teacherId: classData.teacherId,
      role: USER_ROLES.STUDENT,
      createdAt: new Date().toISOString(),
      practiceMinutes: 0,
      achievements: [],
      ...studentData
    }

    // Generate a unique student ID
    const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await setDoc(doc(db, 'students', studentId), studentDoc)

    return {
      success: true,
      user: {
        uid: studentId,
        name: name,
        classCode: classCode,
        teacherId: classData.teacherId,
        role: USER_ROLES.STUDENT,
        ...studentData
      }
    }
  } catch (error) {
    logError(error, 'student-registration')
    const errorInfo = handleFirebaseError(error, 'student-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'student-registration')
  }
}

/**
 * Register a new independent student account with email/password
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @param {string} displayName - Student display name
 * @param {Object} studentData - Additional student data
 */
export const registerIndependentStudent = async (email, password, displayName, studentData = {}) => {
  if (isDemoMode) {
    // Demo mode - simulate successful registration
    return {
      success: true,
      user: {
        uid: 'demo-independent-student-id',
        email: email,
        displayName: displayName,
        role: USER_ROLES.STUDENT,
        isIndependent: true,
        practiceMinutes: 0,
        achievements: []
      }
    }
  }

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    })

    // Store additional student data in Firestore
    const studentDoc = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: USER_ROLES.STUDENT,
      isIndependent: true,
      createdAt: new Date().toISOString(),
      practiceMinutes: 0,
      achievements: [],
      ...studentData
    }

    await setDoc(doc(db, 'users', user.uid), studentDoc)

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: USER_ROLES.STUDENT,
        isIndependent: true,
        ...studentData
      }
    }
  } catch (error) {
    logError(error, 'independent-student-registration')
    const errorInfo = handleFirebaseError(error, 'independent-student-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'independent-student-registration')
  }
}

/**
 * Login with email and password (for teachers)
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const loginTeacher = async (email, password) => {
  if (isDemoMode) {
    // Demo mode - simulate successful login for demo@example.com
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        success: true,
        user: {
          uid: 'demo-teacher-id',
          email: 'demo@example.com',
          displayName: 'Demo Teacher',
          role: USER_ROLES.TEACHER,
          school: 'Demo Music School'
        }
      }
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use demo@example.com / demo123 for demo mode.'
      }
    }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get additional user data from Firestore
    const userData = await getUserData(user.uid)
    
    if (userData.role !== USER_ROLES.TEACHER) {
      await signOut(auth)
      return {
        success: false,
        error: 'This account is not registered as a teacher.'
      }
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData
      }
    }
  } catch (error) {
    logError(error, 'teacher-login')
    const errorInfo = handleFirebaseError(error, 'teacher-login')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'teacher-login')
  }
}

/**
 * Login student with name and class code
 * @param {string} name - Student name
 * @param {string} classCode - Class code
 */
export const loginStudent = async (name, classCode) => {
  if (isDemoMode) {
    // Demo mode - simulate successful login for demo student
    if (name && classCode === 'DEMO123') {
      return {
        success: true,
        user: {
          uid: 'demo-student-id',
          name: name,
          classCode: 'DEMO123',
          teacherId: 'demo-teacher-id',
          role: USER_ROLES.STUDENT,
          practiceMinutes: 120,
          achievements: ['First Practice', 'Week Warrior']
        }
      }
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use any name with class code DEMO123 for demo mode.'
      }
    }
  }

  try {
    // Check if class code exists
    const classDoc = await getDoc(doc(db, 'classes', classCode))
    
    if (!classDoc.exists()) {
      return {
        success: false,
        error: 'Invalid class code. Please check with your teacher.'
      }
    }

    // Find student by name and class code
    // In a real app, you might want to use a more secure authentication method
    const studentsRef = collection(db, 'students')
    const q = query(
      studentsRef, 
      where('name', '==', name),
      where('classCode', '==', classCode)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'Student not found. Please check your name and class code.'
      }
    }

    const studentDoc = querySnapshot.docs[0]
    const studentData = studentDoc.data()

    return {
      success: true,
      user: {
        uid: studentDoc.id,
        name: studentData.name,
        classCode: studentData.classCode,
        teacherId: studentData.teacherId,
        role: USER_ROLES.STUDENT,
        ...studentData
      }
    }
  } catch (error) {
    logError(error, 'student-login')
    const errorInfo = handleFirebaseError(error, 'student-login')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'student-login')
  }
}

/**
 * Logout current user
 */
export const logout = async () => {
  if (isDemoMode) {
    // Demo mode - simulate successful logout
    return { success: true }
  }

  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    logError(error, 'logout')
    const errorInfo = handleFirebaseError(error, 'logout')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'logout')
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    }
  } catch (error) {
    logError(error, 'password-reset')
    const errorInfo = handleFirebaseError(error, 'password-reset')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'password-reset')
  }
}

/**
 * Get user data from Firestore
 * @param {string} uid - User ID
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    logError(error, 'get-user-data')
    return null
  }
}



/**
 * Clean up auth state listener
 */
export const cleanupAuth = () => {
  if (authStateListener) {
    authStateListener()
    authStateListener = null
  }
} 