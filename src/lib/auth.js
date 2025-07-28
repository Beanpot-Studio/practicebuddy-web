import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { handleFirebaseError, logError, createErrorResponse } from './errorHandler'

// User roles
export const USER_ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student'
}

/**
 * Initialize authentication state listener
 * @param {Function} callback - Callback function to handle auth state changes
 */
export const initAuthState = (callback) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userData = await getUserData(user.uid)
        callback({ user, userData })
      } catch (error) {
        console.error('Error getting user data:', error)
        callback({ user, userData: null })
      }
    } else {
      callback({ user: null, userData: null })
    }
  })
}

/**
 * Register a new teacher account
 * @param {string} email - Teacher's email
 * @param {string} password - Teacher's password
 * @param {string} displayName - Teacher's display name
 * @param {Object} teacherData - Additional teacher data
 */
export const registerTeacher = async (email, password, displayName, teacherData = {}) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, { displayName })

    // Store teacher data in Firestore
    const teacherDoc = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: USER_ROLES.TEACHER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...teacherData
    }

    await setDoc(doc(db, 'users', user.uid), teacherDoc)

    return { 
      success: true, 
      user: user,
      userData: teacherDoc
    }
  } catch (error) {
    logError(error, 'teacher-registration')
    const errorInfo = handleFirebaseError(error, 'teacher-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'teacher-registration')
  }
}

/**
 * Register a new student account
 * @param {string} email - Student's email
 * @param {string} password - Student's password
 * @param {string} displayName - Student's display name
 * @param {Object} studentData - Additional student data
 */
export const registerStudent = async (email, password, displayName, studentData = {}) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, { displayName })

    // Store student data in Firestore
    const studentDoc = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: USER_ROLES.STUDENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...studentData
    }

    await setDoc(doc(db, 'users', user.uid), studentDoc)

    // If class code is provided, attempt to join the class
    if (studentData.classCode) {
      try {
        const classRef = doc(db, 'classes', studentData.classCode)
        const classDoc = await getDoc(classRef)
        
        if (classDoc.exists()) {
          const classData = classDoc.data()
          
          // Update student's class info
          await updateDoc(doc(db, 'users', user.uid), {
            classCode: studentData.classCode,
            teacherId: classData.teacherId,
            updatedAt: new Date().toISOString()
          })

          // Add student to class roster
          await addStudentToClassRoster(studentData.classCode, user.uid, displayName, studentData.instrument || '')
          
          studentDoc.classCode = studentData.classCode
          studentDoc.teacherId = classData.teacherId
        }
      } catch (classError) {
        console.warn('Could not join class:', classError)
        // Registration still succeeds even if class joining fails
      }
    }

    return { 
      success: true, 
      user: user,
      userData: studentDoc
    }
  } catch (error) {
    logError(error, 'student-registration')
    const errorInfo = handleFirebaseError(error, 'student-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'student-registration')
  }
}

/**
 * Register an independent student (not enrolled in a class)
 * @param {string} email - Student's email
 * @param {string} password - Student's password
 * @param {string} displayName - Student's display name
 * @param {Object} studentData - Additional student data
 */
export const registerIndependentStudent = async (email, password, displayName, studentData = {}) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, { displayName })

    // Store student data in Firestore
    const studentDoc = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: USER_ROLES.STUDENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...studentData
    }

    await setDoc(doc(db, 'users', user.uid), studentDoc)

    return { 
      success: true, 
      user: user,
      userData: studentDoc
    }
  } catch (error) {
    logError(error, 'independent-student-registration')
    const errorInfo = handleFirebaseError(error, 'independent-student-registration')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'independent-student-registration')
  }
}

/**
 * Login a teacher
 * @param {string} email - Teacher's email
 * @param {string} password - Teacher's password
 */
export const loginTeacher = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userData = await getUserData(user.uid)
    
    if (!userData) {
      throw new Error('User data not found')
    }

    if (userData.role !== USER_ROLES.TEACHER) {
      throw new Error('This account is not registered as a teacher')
    }

    return { 
      success: true, 
      user: user,
      userData: userData
    }
  } catch (error) {
    logError(error, 'teacher-login')
    const errorInfo = handleFirebaseError(error, 'teacher-login')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'teacher-login')
  }
}

/**
 * Login an independent student (not enrolled in a class)
 * @param {string} email - Student's email
 * @param {string} password - Student's password
 */
export const loginIndependentStudent = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userData = await getUserData(user.uid)
    
    if (!userData) {
      throw new Error('User data not found')
    }

    if (userData.role !== USER_ROLES.STUDENT) {
      throw new Error('This account is not registered as a student')
    }

    return { 
      success: true, 
      user: user,
      userData: userData
    }
  } catch (error) {
    logError(error, 'independent-student-login')
    const errorInfo = handleFirebaseError(error, 'independent-student-login')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'independent-student-login')
  }
}

/**
 * Login a student (with optional class code)
 * @param {string} email - Student's email
 * @param {string} password - Student's password
 * @param {string} classCode - Optional class code to join
 */
export const loginStudent = async (email, password, classCode = null) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userData = await getUserData(user.uid)
    
    if (!userData) {
      throw new Error('User data not found')
    }

    if (userData.role !== USER_ROLES.STUDENT) {
      throw new Error('This account is not registered as a student')
    }

    // If class code is provided, attempt to join the class
    if (classCode) {
      try {
        const classRef = doc(db, 'classes', classCode)
        const classDoc = await getDoc(classRef)
        
        if (classDoc.exists()) {
          const classData = classDoc.data()
          
          // Update student's class info
          await updateDoc(doc(db, 'users', user.uid), {
            classCode: classCode,
            teacherId: classData.teacherId,
            updatedAt: new Date().toISOString()
          })

          // Add student to class roster
          await addStudentToClassRoster(classCode, user.uid, userData.displayName, userData.instrument || '')
          
          userData.classCode = classCode
          userData.teacherId = classData.teacherId
        }
      } catch (classError) {
        console.warn('Could not join class:', classError)
        // Login still succeeds even if class joining fails
      }
    }

    return { 
      success: true, 
      user: user,
      userData: userData
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
 * Reset password for a user
 * @param {string} email - User's email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
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
 * Cleanup authentication state
 */
export const cleanupAuth = () => {
  // Cleanup any auth listeners if needed
}

/**
 * Create a new class for a teacher
 * @param {string} teacherId - Teacher's user ID
 * @param {Object} classData - Class data
 */
export const createClass = async (teacherId, classData) => {
  try {
    // Generate a unique class code
    const classCode = generateClassCode()
    
    const classDoc = {
      teacherId: teacherId,
      code: classCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: [],
      assignments: [],
      studentCount: 0,
      ...classData
    }

    // Store class in Firestore with class code as document ID
    await setDoc(doc(db, 'classes', classCode), classDoc)

    return { 
      success: true, 
      classCode: classCode,
      classData: classDoc
    }
  } catch (error) {
    logError(error, 'create-class')
    const errorInfo = handleFirebaseError(error, 'create-class')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'create-class')
  }
}

/**
 * Get all classes for a teacher
 * @param {string} teacherId - Teacher's user ID
 */
export const getTeacherClasses = async (teacherId) => {
  try {
    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacherId)
    )
    
    const querySnapshot = await getDocs(classesQuery)
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

/**
 * Add a student to a class roster
 * @param {string} classCode - Class code
 * @param {string} studentId - Student's user ID
 * @param {string} studentName - Student's display name
 * @param {string} instrument - Student's instrument
 */
export const addStudentToClassRoster = async (classCode, studentId, studentName, instrument = '') => {
  try {
    console.log('addStudentToClassRoster called with:', { classCode, studentId, studentName, instrument })
    
    // First, try to find the class by document ID
    let classRef = doc(db, 'classes', classCode)
    let classDoc = await getDoc(classRef)
    console.log('Class document exists (by ID):', classDoc.exists())
    
    // If not found by ID, search by code field
    if (!classDoc.exists()) {
      console.log('Class not found by document ID, searching by code field...')
      
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        // Found by code field, use the first match
        const foundDoc = querySnapshot.docs[0]
        classRef = foundDoc.ref
        classDoc = foundDoc
        console.log('Class found by code field with document ID:', foundDoc.id)
      } else {
        console.log('Class not found by code field either')
        throw new Error('Class not found')
      }
    }

    const classData = classDoc.data()
    console.log('Class data retrieved:', classData)
    
    const students = classData.students || []
    console.log('Current students array:', students)
    
    // Check if student is already in the roster
    const existingStudent = students.find(s => s.studentId === studentId)
    if (existingStudent) {
      console.log('Student already in roster:', existingStudent)
      return { success: true } // Student already in roster
    }

    // Add student to roster
    const newStudent = {
      studentId: studentId,
      name: studentName,
      instrument: instrument,
      joinedAt: new Date().toISOString(),
      practiceMinutes: 0,
      assignments: []
    }
    console.log('New student object:', newStudent)

    students.push(newStudent)
    console.log('Updated students array:', students)

    // Update class document
    console.log('Updating class document with students array...')
    await updateDoc(classRef, {
      students: students,
      studentCount: students.length,
      updatedAt: new Date().toISOString()
    })
    console.log('Class document updated successfully')

    return { success: true }
  } catch (error) {
    console.error('Error in addStudentToClassRoster:', error)
    logError(error, 'add-student-to-roster')
    const errorInfo = handleFirebaseError(error, 'add-student-to-roster')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'add-student-to-roster')
  }
}

/**
 * Join a class as a student
 * @param {string} classCode - Class code to join
 * @param {string} studentId - Student's user ID
 * @param {string} studentName - Student's display name
 * @param {string} instrument - Student's instrument (optional)
 */
export const joinClass = async (classCode, studentId, studentName, instrument = '') => {
  try {
    console.log('joinClass called with:', { classCode, studentId, studentName, instrument })
    
    // First, try to find the class by document ID
    let classRef = doc(db, 'classes', classCode)
    let classDoc = await getDoc(classRef)
    console.log('Class document exists (by ID):', classDoc.exists())
    
    // If not found by ID, search by code field
    if (!classDoc.exists()) {
      console.log('Class not found by document ID, searching by code field...')
      
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        // Found by code field, use the first match
        const foundDoc = querySnapshot.docs[0]
        classRef = foundDoc.ref
        classDoc = foundDoc
        console.log('Class found by code field with document ID:', foundDoc.id)
      } else {
        console.log('Class not found by code field either')
        console.log('Available classes in database:')
        
        // List all classes for debugging
        try {
          const allClassesQuery = query(collection(db, 'classes'))
          const allQuerySnapshot = await getDocs(allClassesQuery)
          allQuerySnapshot.forEach((doc) => {
            console.log(`- Document ID: ${doc.id}, Code field: ${doc.data().code}`)
          })
        } catch (error) {
          console.log('Could not list classes:', error)
        }
        
        throw new Error('Class not found. Please check your class code.')
      }
    }

    const classData = classDoc.data()
    console.log('Class data:', classData)
    
    // Add student to class roster
    console.log('Calling addStudentToClassRoster...')
    const rosterResult = await addStudentToClassRoster(classCode, studentId, studentName, instrument)
    console.log('addStudentToClassRoster result:', rosterResult)
    
    // Update student's user document with class information
    console.log('Updating user document with class information...')
    await updateDoc(doc(db, 'users', studentId), {
      classCode: classCode,
      teacherId: classData.teacherId,
      updatedAt: new Date().toISOString()
    })
    console.log('User document updated successfully')

    return { 
      success: true,
      classData: classData
    }
  } catch (error) {
    console.error('Error in joinClass:', error)
    logError(error, 'join-class')
    const errorInfo = handleFirebaseError(error, 'join-class')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'join-class')
  }
}

/**
 * Get class roster for a teacher
 * @param {string} classCode - Class code
 */
export const getClassRoster = async (classCode) => {
  try {
    console.log('getClassRoster called with classCode:', classCode)
    
    // First, try to find the class by document ID
    let classDoc = await getDoc(doc(db, 'classes', classCode))
    console.log('Class document exists (by ID):', classDoc.exists())
    
    // If not found by ID, search by code field
    if (!classDoc.exists()) {
      console.log('Class not found by document ID, searching by code field...')
      
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        // Found by code field, use the first match
        classDoc = querySnapshot.docs[0]
        console.log('Class found by code field with document ID:', classDoc.id)
      } else {
        console.log('Class not found by code field either')
        return {
          success: false,
          error: 'Class not found'
        }
      }
    }

    const classData = classDoc.data()
    console.log('Class data:', classData)
    console.log('Students array:', classData.students || [])
    
    return {
      success: true,
      students: classData.students || []
    }
  } catch (error) {
    console.error('Error in getClassRoster:', error)
    logError(error, 'get-class-roster')
    const errorInfo = handleFirebaseError(error, 'get-class-roster')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-class-roster')
  }
}

/**
 * Create a new assignment for a class
 * @param {string} classCode - Class code
 * @param {Object} assignmentData - Assignment data
 */
export const createAssignment = async (classCode, assignmentData) => {
  try {
    // First, try to find the class by document ID
    let classRef = doc(db, 'classes', classCode)
    let classDoc = await getDoc(classRef)
    
    // If not found by ID, search by code field
    if (!classDoc.exists()) {
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        // Found by code field, use the first match
        const foundDoc = querySnapshot.docs[0]
        classRef = foundDoc.ref
        classDoc = foundDoc
      } else {
        throw new Error('Class not found')
      }
    }

    const classData = classDoc.data()
    const assignments = classData.assignments || []
    
    // Create new assignment
    const newAssignment = {
      id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assignmentData,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    assignments.push(newAssignment)

    // Update class document
    await updateDoc(classRef, {
      assignments: assignments,
      updatedAt: new Date().toISOString()
    })

    return { 
      success: true, 
      assignment: newAssignment
    }
  } catch (error) {
    logError(error, 'create-assignment')
    const errorInfo = handleFirebaseError(error, 'create-assignment')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'create-assignment')
  }
}

/**
 * Get assignments for a class
 * @param {string} classCode - Class code
 */
export const getClassAssignments = async (classCode) => {
  try {
    console.log('getClassAssignments called with classCode:', classCode)
    
    // First, try to find the class by document ID
    let classDoc = await getDoc(doc(db, 'classes', classCode))
    console.log('Class document exists (by ID):', classDoc.exists())
    
    // If not found by ID, search by code field
    if (!classDoc.exists()) {
      console.log('Class not found by document ID, searching by code field...')
      
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        // Found by code field, use the first match
        classDoc = querySnapshot.docs[0]
        console.log('Class found by code field with document ID:', classDoc.id)
      } else {
        console.log('Class not found by code field either')
        return {
          success: false,
          error: 'Class not found'
        }
      }
    }

    const classData = classDoc.data()
    console.log('Class data:', classData)
    console.log('Assignments array:', classData.assignments || [])
    
    return {
      success: true,
      assignments: classData.assignments || []
    }
  } catch (error) {
    console.error('Error in getClassAssignments:', error)
    logError(error, 'get-class-assignments')
    const errorInfo = handleFirebaseError(error, 'get-class-assignments')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-class-assignments')
  }
}



const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
} 