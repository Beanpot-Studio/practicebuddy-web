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
 * Register a new student with email and password
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @param {string} displayName - Student display name
 * @param {Object} studentData - Additional student data including optional classCode
 */
export const registerStudent = async (email, password, displayName, studentData = {}) => {
  if (isDemoMode) {
    // Demo mode - simulate successful registration
    return {
      success: true,
      user: {
        uid: 'demo-student-id',
        email: email,
        displayName: displayName,
        role: USER_ROLES.STUDENT,
        practiceMinutes: 0,
        achievements: [],
        classCode: studentData.classCode || null,
        teacherId: studentData.teacherId || null
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

    // If class code is provided, validate it and get teacher info
    let classCode = null
    let teacherId = null
    
    if (studentData.classCode) {
      try {
        const classDoc = await getDoc(doc(db, 'classes', studentData.classCode))
        
        if (classDoc.exists()) {
          const classData = classDoc.data()
          classCode = studentData.classCode
          teacherId = classData.teacherId
        } else {
          // Class doesn't exist, but don't fail registration
          console.warn('Class code provided but class not found:', studentData.classCode)
        }
      } catch (error) {
        // Class validation failed, but don't fail registration
        console.warn('Failed to validate class code:', error)
      }
    }

    // Store student data in Firestore
    const studentDoc = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: USER_ROLES.STUDENT,
      classCode: classCode,
      teacherId: teacherId,
      instrument: studentData.instrument || '',
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
        classCode: classCode,
        teacherId: teacherId,
        instrument: studentData.instrument || '',
        practiceMinutes: 0,
        achievements: [],
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
 * Login independent student with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const loginIndependentStudent = async (email, password) => {
  if (isDemoMode) {
    // Demo mode - simulate successful login for independent students
    if (email === 'student@example.com' && password === 'student123') {
      return {
        success: true,
        user: {
          uid: 'demo-independent-student-id',
          email: 'student@example.com',
          displayName: 'Demo Student',
          role: USER_ROLES.STUDENT,
          isIndependent: true,
          practiceMinutes: 60,
          achievements: ['First Practice']
        }
      }
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use student@example.com / student123 for demo mode.'
      }
    }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get additional user data from Firestore
    const userData = await getUserData(user.uid)
    
    // Check if the user is a student (either independent or class-based)
    if (userData.role !== USER_ROLES.STUDENT) {
      await signOut(auth)
      return {
        success: false,
        error: 'This account is not registered as a student.'
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
    logError(error, 'independent-student-login')
    const errorInfo = handleFirebaseError(error, 'independent-student-login')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'independent-student-login')
  }
}

/**
 * Login student with email and password
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @param {string} classCode - Optional class code for joining a class
 */
export const loginStudent = async (email, password, classCode = null) => {
  if (isDemoMode) {
    // Demo mode - simulate successful login for demo student
    if (email === 'student@example.com' && password === 'student123') {
      return {
        success: true,
        user: {
          uid: 'demo-student-id',
          email: email,
          displayName: 'Demo Student',
          role: USER_ROLES.STUDENT,
          practiceMinutes: 120,
          achievements: ['First Practice', 'Week Warrior'],
          classCode: classCode || null,
          teacherId: classCode ? 'demo-teacher-id' : null
        }
      }
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use student@example.com / student123 for demo mode.'
      }
    }
  }

  try {
    // Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Student account not found. Please check your credentials.'
      }
    }

    const userData = userDoc.data()
    
    // If class code is provided, try to join the class
    if (classCode) {
      try {
        const classDoc = await getDoc(doc(db, 'classes', classCode))
        
        if (classDoc.exists()) {
          const classData = classDoc.data()
          
          // Update user's class information
          await updateDoc(doc(db, 'users', user.uid), {
            classCode: classCode,
            teacherId: classData.teacherId,
            updatedAt: new Date().toISOString()
          })
          
          userData.classCode = classCode
          userData.teacherId = classData.teacherId
        } else {
          // Class doesn't exist, but don't fail the login
          console.warn('Class code provided but class not found:', classCode)
        }
      } catch (error) {
        // Class joining failed, but don't fail the login
        console.warn('Failed to join class:', error)
      }
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        role: USER_ROLES.STUDENT,
        classCode: userData.classCode,
        teacherId: userData.teacherId,
        instrument: userData.instrument,
        practiceMinutes: userData.practiceMinutes || 0,
        achievements: userData.achievements || [],
        ...userData
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

/**
 * Create a new class for a teacher
 * @param {string} teacherId - Teacher's user ID
 * @param {Object} classData - Class information
 */
export const createClass = async (teacherId, classData) => {
  if (isDemoMode) {
    // Demo mode - simulate successful class creation
    return {
      success: true,
      class: {
        id: `demo-class-${Date.now()}`,
        teacherId: teacherId,
        ...classData,
        createdAt: new Date().toISOString(),
        studentCount: 0,
        students: []
      }
    }
  }

  try {
    // Generate a unique class code
    const code = `${classData.instrument.toUpperCase()}${Date.now().toString().slice(-3)}`
    
    // Create class document
    const classDoc = {
      teacherId: teacherId,
      name: classData.name,
      description: classData.description || '',
      instrument: classData.instrument,
      level: classData.level,
      schedule: classData.schedule || '',
      code: code,
      status: 'active',
      studentCount: 0,
      students: [],
      createdAt: new Date().toISOString()
    }

    // Add to Firestore
    const classRef = doc(collection(db, 'classes'))
    await setDoc(classRef, classDoc)

    return {
      success: true,
      class: {
        id: classRef.id,
        ...classDoc
      }
    }
  } catch (error) {
    logError(error, 'class-creation')
    const errorInfo = handleFirebaseError(error, 'class-creation')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'class-creation')
  }
}

/**
 * Get all classes for a teacher
 * @param {string} teacherId - Teacher's user ID
 */
export const getTeacherClasses = async (teacherId) => {
  if (isDemoMode) {
    // Demo mode - return empty array
    return {
      success: true,
      classes: []
    }
  }

  try {
    const classesRef = collection(db, 'classes')
    const q = query(classesRef, where('teacherId', '==', teacherId))
    const querySnapshot = await getDocs(q)
    
    const classes = []
    querySnapshot.forEach((doc) => {
      classes.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return {
      success: true,
      classes: classes
    }
  } catch (error) {
    logError(error, 'get-teacher-classes')
    const errorInfo = handleFirebaseError(error, 'get-teacher-classes')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-teacher-classes')
  }
} 