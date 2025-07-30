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
  serverTimestamp,
  deleteDoc
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
      class: classDoc
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
      lastLoginAt: new Date().toISOString(),
      lastPracticeAt: null,
      lastAssignmentAt: null,
      lastRecordingAt: null,
      lastDashboardVisit: new Date().toISOString(),
      status: 'active', // active, inactive, suspended
      totalAssignmentsCompleted: 0,
      totalRecordingsCreated: 0,
      weeklyPracticeGoal: 120, // minutes per week
      currentWeekPracticeMinutes: 0,
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
 * Create a new assignment
 * @param {string} classCode - Class code (optional for standalone assignments)
 * @param {Object} assignmentData - Assignment data
 * @param {string} assignmentType - 'class', 'individual', or 'standalone'
 * @param {string} studentId - Student ID (required for individual assignments)
 * @param {string} teacherId - Teacher ID (required for standalone assignments)
 */
export const createAssignment = async (classCode, assignmentData, assignmentType = 'class', studentId = null, teacherId = null) => {
  try {
    // Create new assignment
    const newAssignment = {
      id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assignmentData,
      type: assignmentType,
      classCode: classCode, // null for standalone assignments
      studentId: studentId, // null for class assignments, student ID for individual
      teacherId: teacherId, // required for standalone assignments
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    if (assignmentType === 'standalone') {
      // Store standalone assignments in a separate collection
      if (!teacherId) {
        throw new Error('Teacher ID is required for standalone assignments')
      }
      
      if (!studentId) {
        throw new Error('Student ID is required for standalone assignments')
      }
      
      const standaloneAssignmentRef = doc(collection(db, 'standalone_assignments'))
      await setDoc(standaloneAssignmentRef, {
        ...newAssignment,
        id: standaloneAssignmentRef.id // Use Firestore-generated ID
      })
      
      return { 
        success: true, 
        assignment: { ...newAssignment, id: standaloneAssignmentRef.id }
      }
    } else {
      // Handle class-based assignments (existing logic)
      if (!classCode) {
        throw new Error('Class code is required for class-based assignments')
      }
      
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
      
      if (assignmentType === 'class') {
        // Store class assignments in the class document
        const assignments = classData.assignments || []
        assignments.push(newAssignment)
        
        await updateDoc(classRef, {
          assignments: assignments,
          updatedAt: new Date().toISOString()
        })
      } else if (assignmentType === 'individual') {
        if (!studentId) {
          throw new Error('Student ID is required for individual assignments')
        }
        
        // Store individual assignments in the class document under individualAssignments
        const individualAssignments = classData.individualAssignments || {}
        if (!individualAssignments[studentId]) {
          individualAssignments[studentId] = []
        }
        individualAssignments[studentId].push(newAssignment)
        
        await updateDoc(classRef, {
          individualAssignments: individualAssignments,
          updatedAt: new Date().toISOString()
        })
      }
      
      return { 
        success: true, 
        assignment: newAssignment
      }
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
 * @param {string} studentId - Student ID (optional, for getting individual assignments)
 */
export const getClassAssignments = async (classCode, studentId = null) => {
  try {
    console.log('getClassAssignments called with classCode:', classCode, 'studentId:', studentId)
    
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
    
    let allAssignments = []
    
    // Get class assignments (for all students)
    const classAssignments = classData.assignments || []
    allAssignments.push(...classAssignments)
    
    // Get individual assignments for this student (if studentId provided)
    if (studentId) {
      const individualAssignments = classData.individualAssignments || {}
      const studentIndividualAssignments = individualAssignments[studentId] || []
      allAssignments.push(...studentIndividualAssignments)
    }
    
    console.log('All assignments:', allAssignments)
    
    return {
      success: true,
      assignments: allAssignments,
      classAssignments: classData.assignments || [],
      individualAssignments: studentId ? (classData.individualAssignments || {})[studentId] || [] : []
    }
  } catch (error) {
    console.error('Error in getClassAssignments:', error)
    logError(error, 'get-class-assignments')
    const errorInfo = handleFirebaseError(error, 'get-class-assignments')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-class-assignments')
  }
}

/**
 * Get standalone assignments for a teacher
 * @param {string} teacherId - Teacher ID
 * @param {string} studentId - Student ID (optional, for getting assignments for a specific student)
 */
export const getStandaloneAssignments = async (teacherId, studentId = null) => {
  try {
    console.log('getStandaloneAssignments called with teacherId:', teacherId, 'studentId:', studentId)
    
    let standaloneQuery
    if (studentId) {
      // Get standalone assignments for a specific student
      standaloneQuery = query(
        collection(db, 'standalone_assignments'),
        where('teacherId', '==', teacherId),
        where('studentId', '==', studentId),
        where('status', '==', 'active')
      )
    } else {
      // Get all standalone assignments for the teacher
      standaloneQuery = query(
        collection(db, 'standalone_assignments'),
        where('teacherId', '==', teacherId),
        where('status', '==', 'active')
      )
    }
    
    const querySnapshot = await getDocs(standaloneQuery)
    const assignments = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    
    console.log('Standalone assignments:', assignments)
    
    return {
      success: true,
      assignments: assignments
    }
  } catch (error) {
    console.error('Error in getStandaloneAssignments:', error)
    logError(error, 'get-standalone-assignments')
    const errorInfo = handleFirebaseError(error, 'get-standalone-assignments')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-standalone-assignments')
  }
}

/**
 * Get standalone assignments for a student
 * @param {string} studentId - Student ID
 */
export const getStudentStandaloneAssignments = async (studentId) => {
  try {
    console.log('getStudentStandaloneAssignments called with studentId:', studentId)
    
    const standaloneQuery = query(
      collection(db, 'standalone_assignments'),
      where('studentId', '==', studentId),
      where('status', '==', 'active')
    )
    
    const querySnapshot = await getDocs(standaloneQuery)
    const assignments = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
    
    console.log('Student standalone assignments:', assignments)
    
    return {
      success: true,
      assignments: assignments
    }
  } catch (error) {
    console.error('Error in getStudentStandaloneAssignments:', error)
    logError(error, 'get-student-standalone-assignments')
    const errorInfo = handleFirebaseError(error, 'get-student-standalone-assignments')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-student-standalone-assignments')
  }
}

/**
 * Delete an assignment
 * @param {string} classCode - Class code (optional for standalone assignments)
 * @param {string} assignmentId - Assignment ID to delete
 * @param {string} assignmentType - 'class', 'individual', or 'standalone'
 */
export const deleteAssignment = async (classCode, assignmentId, assignmentType = 'class') => {
  try {
    console.log('deleteAssignment called with classCode:', classCode, 'assignmentId:', assignmentId, 'type:', assignmentType)
    
    if (assignmentType === 'standalone') {
      // Delete standalone assignment
      const standaloneRef = doc(db, 'standalone_assignments', assignmentId)
      const standaloneDoc = await getDoc(standaloneRef)
      
      if (!standaloneDoc.exists()) {
        console.log('Standalone assignment not found')
        return {
          success: false,
          error: 'Assignment not found'
        }
      }
      
      await deleteDoc(standaloneRef)
      console.log('Standalone assignment deleted successfully')
      return { 
        success: true,
        message: 'Standalone assignment deleted successfully'
      }
    } else {
      // Handle class-based assignments (existing logic)
      if (!classCode) {
        throw new Error('Class code is required for class-based assignments')
      }
      
      // First, try to find the class by document ID
      let classRef = doc(db, 'classes', classCode)
      let classDoc = await getDoc(classRef)
      
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
          return {
            success: false,
            error: 'Class not found'
          }
        }
      }

      const classData = classDoc.data()
      
      // Try to find and delete from class assignments
      const assignments = classData.assignments || []
      const assignmentIndex = assignments.findIndex(assignment => assignment.id === assignmentId)
      
      if (assignmentIndex !== -1) {
        // Found in class assignments
        assignments.splice(assignmentIndex, 1)
        
        await updateDoc(classRef, {
          assignments: assignments,
          updatedAt: new Date().toISOString()
        })
        
        console.log('Class assignment deleted successfully')
        return { 
          success: true,
          message: 'Class assignment deleted successfully'
        }
      }
      
      // Try to find and delete from individual assignments
      const individualAssignments = classData.individualAssignments || {}
      let deletedFromIndividual = false
      
      for (const studentId in individualAssignments) {
        const studentAssignments = individualAssignments[studentId]
        const individualIndex = studentAssignments.findIndex(assignment => assignment.id === assignmentId)
        
        if (individualIndex !== -1) {
          // Found in individual assignments
          studentAssignments.splice(individualIndex, 1)
          
          await updateDoc(classRef, {
            individualAssignments: individualAssignments,
            updatedAt: new Date().toISOString()
          })
          
          console.log('Individual assignment deleted successfully')
          deletedFromIndividual = true
          break
        }
      }
      
      if (!deletedFromIndividual) {
        console.log('Assignment not found')
        return {
          success: false,
          error: 'Assignment not found'
        }
      }
      
      return { 
        success: true,
        message: 'Individual assignment deleted successfully'
      }
    }
  } catch (error) {
    console.error('Error in deleteAssignment:', error)
    logError(error, 'delete-assignment')
    const errorInfo = handleFirebaseError(error, 'delete-assignment')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'delete-assignment')
  }
}

/**
 * Update student activity when they log in
 * @param {string} classCode - Class code
 * @param {string} studentId - Student ID
 */
export const updateStudentLoginActivity = async (classCode, studentId) => {
  try {
    // Find the class and update student's lastLoginAt
    let classRef = doc(db, 'classes', classCode)
    let classDoc = await getDoc(classRef)
    
    if (!classDoc.exists()) {
      // Try to find by code field
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        const foundDoc = querySnapshot.docs[0]
        classRef = foundDoc.ref
        classDoc = foundDoc
      } else {
        throw new Error('Class not found')
      }
    }

    const classData = classDoc.data()
    const students = classData.students || []
    
    const studentIndex = students.findIndex(s => s.studentId === studentId)
    if (studentIndex !== -1) {
      students[studentIndex].lastLoginAt = new Date().toISOString()
      students[studentIndex].lastDashboardVisit = new Date().toISOString()
      
      await updateDoc(classRef, {
        students: students,
        updatedAt: new Date().toISOString()
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating student login activity:', error)
    logError(error, 'update-student-login-activity')
    const errorInfo = handleFirebaseError(error, 'update-student-login-activity')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'update-student-login-activity')
  }
}

/**
 * Update student practice activity
 * @param {string} classCode - Class code
 * @param {string} studentId - Student ID
 * @param {number} practiceMinutes - Minutes practiced
 */
export const updateStudentPracticeActivity = async (classCode, studentId, practiceMinutes) => {
  try {
    let classRef = doc(db, 'classes', classCode)
    let classDoc = await getDoc(classRef)
    
    if (!classDoc.exists()) {
      const classesQuery = query(
        collection(db, 'classes'),
        where('code', '==', classCode)
      )
      const querySnapshot = await getDocs(classesQuery)
      
      if (!querySnapshot.empty) {
        const foundDoc = querySnapshot.docs[0]
        classRef = foundDoc.ref
        classDoc = foundDoc
      } else {
        throw new Error('Class not found')
      }
    }

    const classData = classDoc.data()
    const students = classData.students || []
    
    const studentIndex = students.findIndex(s => s.studentId === studentId)
    if (studentIndex !== -1) {
      const student = students[studentIndex]
      student.lastPracticeAt = new Date().toISOString()
      student.practiceMinutes += practiceMinutes
      student.currentWeekPracticeMinutes += practiceMinutes
      
      // Reset weekly practice if it's a new week
      const lastPracticeDate = new Date(student.lastPracticeAt)
      const now = new Date()
      const daysSinceLastPractice = (now - lastPracticeDate) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastPractice > 7) {
        student.currentWeekPracticeMinutes = practiceMinutes
      }
      
      await updateDoc(classRef, {
        students: students,
        updatedAt: new Date().toISOString()
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating student practice activity:', error)
    logError(error, 'update-student-practice-activity')
    const errorInfo = handleFirebaseError(error, 'update-student-practice-activity')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'update-student-practice-activity')
  }
}

/**
 * Determine if a student is active based on various metrics
 * @param {Object} student - Student object
 * @returns {Object} Activity status and details
 */
export const getStudentActivityStatus = (student) => {
  const now = new Date()
  const lastLoginDate = new Date(student.lastLoginAt || student.joinedAt)
  const lastPracticeDate = student.lastPracticeAt ? new Date(student.lastPracticeAt) : null
  const lastAssignmentDate = student.lastAssignmentAt ? new Date(student.lastAssignmentAt) : null
  const lastRecordingDate = student.lastRecordingAt ? new Date(student.lastRecordingAt) : null
  
  const daysSinceLogin = (now - lastLoginDate) / (1000 * 60 * 60 * 24)
  const daysSincePractice = lastPracticeDate ? (now - lastPracticeDate) / (1000 * 60 * 60 * 24) : null
  const daysSinceAssignment = lastAssignmentDate ? (now - lastAssignmentDate) / (1000 * 60 * 60 * 24) : null
  const daysSinceRecording = lastRecordingDate ? (now - lastRecordingDate) / (1000 * 60 * 60 * 24) : null
  
  // Activity thresholds
  const LOGIN_THRESHOLD = 30 // days
  const PRACTICE_THRESHOLD = 14 // days
  const ASSIGNMENT_THRESHOLD = 21 // days
  const RECORDING_THRESHOLD = 30 // days
  
  // Determine activity level
  let activityLevel = 'active'
  let activityReason = 'Engaged student'
  
  if (daysSinceLogin > LOGIN_THRESHOLD) {
    activityLevel = 'inactive'
    activityReason = `No login for ${Math.floor(daysSinceLogin)} days`
  } else if (daysSincePractice > PRACTICE_THRESHOLD && student.practiceMinutes > 0) {
    activityLevel = 'needs_attention'
    activityReason = `No practice for ${Math.floor(daysSincePractice)} days`
  } else if (daysSinceAssignment > ASSIGNMENT_THRESHOLD && student.totalAssignmentsCompleted > 0) {
    activityLevel = 'needs_attention'
    activityReason = `No assignment completion for ${Math.floor(daysSinceAssignment)} days`
  } else if (daysSinceRecording > RECORDING_THRESHOLD && student.totalRecordingsCreated > 0) {
    activityLevel = 'needs_attention'
    activityReason = `No recordings for ${Math.floor(daysSinceRecording)} days`
  }
  
  // Check weekly practice goals
  const weeklyProgress = student.currentWeekPracticeMinutes || 0
  const weeklyGoal = student.weeklyPracticeGoal || 120
  const weeklyPercentage = (weeklyProgress / weeklyGoal) * 100
  
  return {
    activityLevel, // 'active', 'needs_attention', 'inactive'
    activityReason,
    daysSinceLogin: Math.floor(daysSinceLogin),
    daysSincePractice: daysSincePractice ? Math.floor(daysSincePractice) : null,
    daysSinceAssignment: daysSinceAssignment ? Math.floor(daysSinceAssignment) : null,
    daysSinceRecording: daysSinceRecording ? Math.floor(daysSinceRecording) : null,
    weeklyProgress,
    weeklyGoal,
    weeklyPercentage,
    totalPracticeMinutes: student.practiceMinutes || 0,
    totalAssignmentsCompleted: student.totalAssignmentsCompleted || 0,
    totalRecordingsCreated: student.totalRecordingsCreated || 0
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