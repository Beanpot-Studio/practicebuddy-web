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
      // Store standalone assignments in the student's user document
      if (!teacherId) {
        throw new Error('Teacher ID is required for standalone assignments')
      }
      
      if (!studentId) {
        throw new Error('Student ID is required for standalone assignments')
      }
      
      const studentRef = doc(db, 'users', studentId)
      const studentDoc = await getDoc(studentRef)
      
      if (!studentDoc.exists()) {
        throw new Error('Student not found')
      }
      
      const studentData = studentDoc.data()
      const assignments = studentData.assignments || []
      
      // Add new assignment to the array
      assignments.unshift(newAssignment) // Add to beginning of array
      
      // Keep only the last 50 assignments to prevent document size issues
      if (assignments.length > 50) {
        assignments.splice(50)
      }
      
      await updateDoc(studentRef, {
        assignments: assignments,
        updatedAt: new Date().toISOString()
      })
      
      return { 
        success: true, 
        assignment: newAssignment
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
    
    if (studentId) {
      // Get standalone assignments for a specific student
      const studentRef = doc(db, 'users', studentId)
      const studentDoc = await getDoc(studentRef)
      
      if (!studentDoc.exists()) {
        return {
          success: false,
          error: 'Student not found'
        }
      }
      
      const studentData = studentDoc.data()
      const assignments = studentData.assignments || []
      
      // Filter assignments by teacher and status
      const teacherAssignments = assignments.filter(assignment => 
        assignment.teacherId === teacherId && assignment.status === 'active'
      )
      
      console.log('Teacher standalone assignments for student:', teacherAssignments)
      
      return {
        success: true,
        assignments: teacherAssignments
      }
    } else {
      // Get all standalone assignments for the teacher (requires querying all students)
      // This is less efficient but maintains the same API
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      )
      
      const querySnapshot = await getDocs(usersQuery)
      const allAssignments = []
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        const assignments = userData.assignments || []
        
        // Filter assignments by teacher and status
        const teacherAssignments = assignments.filter(assignment => 
          assignment.teacherId === teacherId && assignment.status === 'active'
        )
        
        allAssignments.push(...teacherAssignments)
      })
      
      console.log('All teacher standalone assignments:', allAssignments)
      
      return {
        success: true,
        assignments: allAssignments
      }
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
    
    const studentRef = doc(db, 'users', studentId)
    const studentDoc = await getDoc(studentRef)
    
    if (!studentDoc.exists()) {
      return {
        success: false,
        error: 'Student not found'
      }
    }
    
    const studentData = studentDoc.data()
    const assignments = studentData.assignments || []
    
    // Filter assignments by status
    const activeAssignments = assignments.filter(assignment => assignment.status === 'active')
    
    console.log('Student standalone assignments:', activeAssignments)
    
    return {
      success: true,
      assignments: activeAssignments
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
 * @param {string} studentId - Student ID (required for standalone assignments)
 */
export const deleteAssignment = async (classCode, assignmentId, assignmentType = 'class', studentId = null) => {
  try {
    console.log('deleteAssignment called with classCode:', classCode, 'assignmentId:', assignmentId, 'type:', assignmentType, 'studentId:', studentId)
    
    if (assignmentType === 'standalone') {
      // Delete standalone assignment from student's user document
      if (!studentId) {
        throw new Error('Student ID is required for standalone assignments')
      }
      
      const studentRef = doc(db, 'users', studentId)
      const studentDoc = await getDoc(studentRef)
      
      if (!studentDoc.exists()) {
        return {
          success: false,
          error: 'Student not found'
        }
      }
      
      const studentData = studentDoc.data()
      const assignments = studentData.assignments || []
      
      // Find the assignment to delete
      const assignmentIndex = assignments.findIndex(assignment => assignment.id === assignmentId)
      
      if (assignmentIndex === -1) {
        console.log('Standalone assignment not found')
        return {
          success: false,
          error: 'Assignment not found'
        }
      }
      
      // Remove the assignment from the array
      assignments.splice(assignmentIndex, 1)
      
      await updateDoc(studentRef, {
        assignments: assignments,
        updatedAt: new Date().toISOString()
      })
      
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

/**
 * Create a standalone practice session for a user (stored in users collection)
 * @param {string} userId - User ID
 * @param {Object} practiceData - Practice session data
 * @returns {Object} Success/error response
 */
export const createStandalonePractice = async (userId, practiceData) => {
  try {
    console.log('createStandalonePractice called with userId:', userId, 'practiceData:', practiceData)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    const practiceSessions = userData.practiceSessions || []
    
    // Round up practice minutes to nearest integer
    const roundedPracticeMinutes = Math.ceil(practiceData.practiceMinutes || 0)
    
    const practiceSession = {
      id: Date.now().toString(), // Simple ID generation
      instrument: practiceData.instrument || '',
      practiceMinutes: roundedPracticeMinutes,
      description: practiceData.description || '',
      createdAt: new Date().toISOString(),
      status: 'completed'
    }
    
    // Add new practice session to the array
    practiceSessions.unshift(practiceSession) // Add to beginning of array
    
    // Keep only the last 50 practice sessions to prevent document size issues
    if (practiceSessions.length > 50) {
      practiceSessions.splice(50)
    }
    
    // Update user's practice statistics
    const currentStats = userData.practiceStats || {
      totalPracticeMinutes: 0,
      currentWeekPracticeMinutes: 0,
      lastPracticeAt: null,
      weeklyPracticeGoal: 120
    }
    
    // Round up practice minutes for statistics
    const roundedMinutesForStats = Math.ceil(practiceData.practiceMinutes || 0)
    
    currentStats.totalPracticeMinutes += roundedMinutesForStats
    currentStats.lastPracticeAt = new Date().toISOString()
    
    // Check if we need to reset weekly practice (new week)
    const lastPracticeDate = currentStats.lastPracticeAt ? new Date(currentStats.lastPracticeAt) : new Date()
    const now = new Date()
    const daysSinceLastPractice = (now - lastPracticeDate) / (1000 * 60 * 60 * 24)
    
    if (daysSinceLastPractice > 7) {
      currentStats.currentWeekPracticeMinutes = roundedMinutesForStats
    } else {
      currentStats.currentWeekPracticeMinutes += roundedMinutesForStats
    }
    
    await updateDoc(userRef, {
      practiceSessions: practiceSessions,
      practiceStats: currentStats,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Standalone practice session created successfully:', practiceSession.id)
    
    return {
      success: true,
      practiceId: practiceSession.id,
      message: 'Practice session recorded successfully'
    }
  } catch (error) {
    console.error('Error in createStandalonePractice:', error)
    logError(error, 'create-standalone-practice')
    const errorInfo = handleFirebaseError(error, 'create-standalone-practice')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'create-standalone-practice')
  }
}

/**
 * Get standalone practice sessions for a user (from users collection)
 * @param {string} userId - User ID
 * @param {number} limit - Number of sessions to retrieve (default: 50)
 * @returns {Object} Success/error response with practice sessions
 */
export const getStandalonePractices = async (userId, limit = 50) => {
  try {
    console.log('getStandalonePractices called with userId:', userId, 'limit:', limit)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    const practiceSessions = userData.practiceSessions || []
    
    // Return limited number of sessions (they're already sorted by creation date)
    const limitedSessions = practiceSessions.slice(0, limit)
    
    console.log('User standalone practices:', limitedSessions)
    
    return {
      success: true,
      practices: limitedSessions
    }
  } catch (error) {
    console.error('Error in getStandalonePractices:', error)
    logError(error, 'get-standalone-practices')
    const errorInfo = handleFirebaseError(error, 'get-standalone-practices')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-standalone-practices')
  }
}

/**
 * Update user's practice statistics (independent of classes)
 * @param {string} userId - User ID
 * @param {number} practiceMinutes - Minutes practiced
 * @returns {Object} Success/error response
 */
export const updateUserPracticeStats = async (userId, practiceMinutes) => {
  try {
    console.log('updateUserPracticeStats called with userId:', userId, 'practiceMinutes:', practiceMinutes)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    const currentStats = userData.practiceStats || {
      totalPracticeMinutes: 0,
      currentWeekPracticeMinutes: 0,
      lastPracticeAt: null,
      weeklyPracticeGoal: 120
    }
    
    // Round up practice minutes for statistics
    const roundedMinutes = Math.ceil(practiceMinutes)
    
    // Update practice statistics
    currentStats.totalPracticeMinutes += roundedMinutes
    currentStats.lastPracticeAt = new Date().toISOString()
    
    // Check if we need to reset weekly practice (new week)
    const lastPracticeDate = currentStats.lastPracticeAt ? new Date(currentStats.lastPracticeAt) : new Date()
    const now = new Date()
    const daysSinceLastPractice = (now - lastPracticeDate) / (1000 * 60 * 60 * 24)
    
    if (daysSinceLastPractice > 7) {
      currentStats.currentWeekPracticeMinutes = roundedMinutes
    } else {
      currentStats.currentWeekPracticeMinutes += roundedMinutes
    }
    
    await updateDoc(userRef, {
      practiceStats: currentStats,
      updatedAt: new Date().toISOString()
    })
    
    console.log('User practice stats updated successfully')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user practice stats:', error)
    logError(error, 'update-user-practice-stats')
    const errorInfo = handleFirebaseError(error, 'update-user-practice-stats')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'update-user-practice-stats')
  }
}

/**
 * Get user's practice statistics (independent of classes)
 * @param {string} userId - User ID
 * @returns {Object} Success/error response with practice statistics
 */
export const getUserPracticeStats = async (userId) => {
  try {
    console.log('getUserPracticeStats called with userId:', userId)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    const practiceStats = userData.practiceStats || {
      totalPracticeMinutes: 0,
      currentWeekPracticeMinutes: 0,
      lastPracticeAt: null,
      weeklyPracticeGoal: 120
    }
    
    console.log('User practice stats:', practiceStats)
    
    return {
      success: true,
      practiceStats: practiceStats
    }
  } catch (error) {
    console.error('Error in getUserPracticeStats:', error)
    logError(error, 'get-user-practice-stats')
    const errorInfo = handleFirebaseError(error, 'get-user-practice-stats')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-user-practice-stats')
  }
}

/**
 * Delete a standalone practice session from user's document
 * @param {string} practiceId - Practice session ID
 * @param {string} userId - User ID (for verification)
 * @returns {Object} Success/error response
 */
export const deleteStandalonePractice = async (practiceId, userId) => {
  try {
    console.log('deleteStandalonePractice called with practiceId:', practiceId, 'userId:', userId)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'User not found'
      }
    }
    
    const userData = userDoc.data()
    const practiceSessions = userData.practiceSessions || []
    
    // Find the practice session to delete
    const practiceIndex = practiceSessions.findIndex(practice => practice.id === practiceId)
    
    if (practiceIndex === -1) {
      return {
        success: false,
        error: 'Practice session not found'
      }
    }
    
    const practiceToDelete = practiceSessions[practiceIndex]
    
    // Remove the practice session from the array
    practiceSessions.splice(practiceIndex, 1)
    
    // Update user's practice statistics (subtract the minutes)
    const currentStats = userData.practiceStats || {
      totalPracticeMinutes: 0,
      currentWeekPracticeMinutes: 0,
      lastPracticeAt: null,
      weeklyPracticeGoal: 120
    }
    
    currentStats.totalPracticeMinutes = Math.max(0, currentStats.totalPracticeMinutes - practiceToDelete.practiceMinutes)
    currentStats.currentWeekPracticeMinutes = Math.max(0, currentStats.currentWeekPracticeMinutes - practiceToDelete.practiceMinutes)
    
    await updateDoc(userRef, {
      practiceSessions: practiceSessions,
      practiceStats: currentStats,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Standalone practice session deleted successfully')
    
    return {
      success: true,
      message: 'Practice session deleted successfully'
    }
  } catch (error) {
    console.error('Error in deleteStandalonePractice:', error)
    logError(error, 'delete-standalone-practice')
    const errorInfo = handleFirebaseError(error, 'delete-standalone-practice')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'delete-standalone-practice')
  }
} 

/**
 * Create a practice goal for a student or class
 * @param {Object} goalData - Goal data
 * @param {string} goalData.title - Goal title
 * @param {string} goalData.description - Goal description
 * @param {number} goalData.targetPracticeSessions - Number of practice sessions required
 * @param {string} goalData.reward - Reward description
 * @param {string} goalData.type - 'individual' or 'class'
 * @param {string} goalData.studentId - Student ID (for individual goals)
 * @param {string} goalData.classCode - Class code (for class goals)
 * @param {string} goalData.createdBy - Admin/teacher ID who created the goal
 * @param {Date} goalData.dueDate - Optional due date
 * @returns {Object} Success/error response
 */
export const createPracticeGoal = async (goalData) => {
  try {
    console.log('Creating practice goal:', goalData)
    
    const goal = {
      id: Date.now().toString(),
      title: goalData.title,
      description: goalData.description,
      targetPracticeSessions: goalData.targetPracticeSessions,
      reward: goalData.reward,
      type: goalData.type, // 'individual' or 'class'
      studentId: goalData.studentId || null,
      classCode: goalData.classCode || null,
      createdBy: goalData.createdBy,
      dueDate: goalData.dueDate ? new Date(goalData.dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      completedSessions: 0
    }
    
    if (goalData.type === 'individual') {
      // Store in user's document
      const userRef = doc(db, 'users', goalData.studentId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        throw new Error('Student not found')
      }
      
      const userData = userDoc.data()
      const goals = userData.practiceGoals || []
      goals.push(goal)
      
      await updateDoc(userRef, {
        practiceGoals: goals,
        updatedAt: new Date().toISOString()
      })
      
      console.log('Individual practice goal created successfully:', goal.id)
    } else if (goalData.type === 'class') {
      // Store in class document
      let classRef = doc(db, 'classes', goalData.classCode)
      let classDoc = await getDoc(classRef)
      
      if (!classDoc.exists()) {
        const classesQuery = query(
          collection(db, 'classes'),
          where('code', '==', goalData.classCode)
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
      const goals = classData.practiceGoals || []
      goals.push(goal)
      
      await updateDoc(classRef, {
        practiceGoals: goals,
        updatedAt: new Date().toISOString()
      })
      
      console.log('Class practice goal created successfully:', goal.id)
    }
    
    return {
      success: true,
      goalId: goal.id,
      message: 'Practice goal created successfully'
    }
  } catch (error) {
    console.error('Error creating practice goal:', error)
    logError(error, 'create-practice-goal')
    const errorInfo = handleFirebaseError(error, 'create-practice-goal')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'create-practice-goal')
  }
}

/**
 * Get practice goals for a student
 * @param {string} studentId - Student ID
 * @returns {Object} Success/error response with goals
 */
export const getStudentPracticeGoals = async (studentId) => {
  try {
    console.log('Getting practice goals for student:', studentId)
    
    const userRef = doc(db, 'users', studentId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('Student not found')
    }
    
    const userData = userDoc.data()
    const individualGoals = userData.practiceGoals || []
    
    // Also get class goals if student is enrolled in a class
    let classGoals = []
    if (userData.classCode) {
      let classRef = doc(db, 'classes', userData.classCode)
      let classDoc = await getDoc(classRef)
      
      if (!classDoc.exists()) {
        const classesQuery = query(
          collection(db, 'classes'),
          where('code', '==', userData.classCode)
        )
        const querySnapshot = await getDocs(classesQuery)
        
        if (!querySnapshot.empty) {
          const foundDoc = querySnapshot.docs[0]
          classRef = foundDoc.ref
          classDoc = foundDoc
        }
      }
      
      if (classDoc.exists()) {
        const classData = classDoc.data()
        classGoals = classData.practiceGoals || []
      }
    }
    
    const allGoals = [...individualGoals, ...classGoals]
    
    console.log('Student practice goals:', allGoals)
    
    return {
      success: true,
      goals: allGoals
    }
  } catch (error) {
    console.error('Error getting student practice goals:', error)
    logError(error, 'get-student-practice-goals')
    const errorInfo = handleFirebaseError(error, 'get-student-practice-goals')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-student-practice-goals')
  }
}

/**
 * Update practice goal progress when a practice session is completed
 * @param {string} studentId - Student ID
 * @param {string} goalId - Goal ID
 * @param {string} goalType - 'individual' or 'class'
 * @param {string} classCode - Class code (for class goals)
 * @returns {Object} Success/error response
 */
export const updatePracticeGoalProgress = async (studentId, goalId, goalType, classCode = null) => {
  try {
    console.log('Updating practice goal progress:', { studentId, goalId, goalType, classCode })
    
    if (goalType === 'individual') {
      // Update individual goal
      const userRef = doc(db, 'users', studentId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        throw new Error('Student not found')
      }
      
      const userData = userDoc.data()
      const goals = userData.practiceGoals || []
      const goalIndex = goals.findIndex(g => g.id === goalId)
      
      if (goalIndex !== -1) {
        goals[goalIndex].completedSessions += 1
        goals[goalIndex].progress = Math.min(100, (goals[goalIndex].completedSessions / goals[goalIndex].targetPracticeSessions) * 100)
        
        if (goals[goalIndex].completedSessions >= goals[goalIndex].targetPracticeSessions) {
          goals[goalIndex].status = 'completed'
        }
        
        await updateDoc(userRef, {
          practiceGoals: goals,
          updatedAt: new Date().toISOString()
        })
        
        console.log('Individual goal progress updated successfully')
      }
    } else if (goalType === 'class' && classCode) {
      // Update class goal
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
        }
      }
      
      if (classDoc.exists()) {
        const classData = classDoc.data()
        const goals = classData.practiceGoals || []
        const goalIndex = goals.findIndex(g => g.id === goalId)
        
        if (goalIndex !== -1) {
          goals[goalIndex].completedSessions += 1
          goals[goalIndex].progress = Math.min(100, (goals[goalIndex].completedSessions / goals[goalIndex].targetPracticeSessions) * 100)
          
          if (goals[goalIndex].completedSessions >= goals[goalIndex].targetPracticeSessions) {
            goals[goalIndex].status = 'completed'
          }
          
          await updateDoc(classRef, {
            practiceGoals: goals,
            updatedAt: new Date().toISOString()
          })
          
          console.log('Class goal progress updated successfully')
        }
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating practice goal progress:', error)
    logError(error, 'update-practice-goal-progress')
    const errorInfo = handleFirebaseError(error, 'update-practice-goal-progress')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'update-practice-goal-progress')
  }
} 

/**
 * Get class data including assignments
 * @param {string} classCode - Class code
 */
export const getClassData = async (classCode) => {
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
    
    return { 
      success: true, 
      class: {
        id: classDoc.id,
        ...classData
      }
    }
  } catch (error) {
    logError(error, 'get-class-data')
    const errorInfo = handleFirebaseError(error, 'get-class-data')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'get-class-data')
  }
}

/**
 * Save audio recording to Cloudinary
 * @param {Blob} audioBlob - Audio recording blob
 * @param {string} userId - User ID
 * @returns {Object} Success/error response with recording data
 */
export const saveAudioRecording = async (audioBlob, userId) => {
  try {
    console.log('saveAudioRecording called with userId:', userId)
    
    // Import Cloudinary functions
    const { uploadAudioToCloudinary } = await import('./cloudinary.js')
    
    // Upload to Cloudinary
    const uploadResult = await uploadAudioToCloudinary(audioBlob, userId)
    
    console.log('Audio uploaded to Cloudinary:', uploadResult)
    
    return {
      success: true,
      recording: {
        publicId: uploadResult.publicId,
        url: uploadResult.url,
        duration: uploadResult.duration,
        format: uploadResult.format,
        provider: 'cloudinary'
      }
    }
  } catch (error) {
    console.error('Error saving audio recording to Cloudinary:', error)
    logError(error, 'save-audio-recording')
    const errorInfo = handleFirebaseError(error, 'save-audio-recording')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'save-audio-recording')
  }
}

/**
 * Delete audio recording from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} Success/error response
 */
export const deleteAudioRecording = async (publicId) => {
  try {
    console.log('deleteAudioRecording called with publicId:', publicId)
    
    // Import Cloudinary functions
    const { deleteAudioFromCloudinary } = await import('./cloudinary.js')
    
    // Delete from Cloudinary
    await deleteAudioFromCloudinary(publicId)
    
    console.log('Audio deleted from Cloudinary successfully')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting audio recording from Cloudinary:', error)
    logError(error, 'delete-audio-recording')
    const errorInfo = handleFirebaseError(error, 'delete-audio-recording')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'delete-audio-recording')
  }
}

/**
 * Update practice session with recording data
 * @param {string} practiceId - Practice session ID
 * @param {string} userId - User ID
 * @param {Object} recordingData - Recording data from Cloudinary
 * @returns {Object} Success/error response
 */
export const updatePracticeWithRecording = async (practiceId, userId, recordingData) => {
  try {
    console.log('updatePracticeWithRecording called with practiceId:', practiceId, 'userId:', userId, 'recordingData:', recordingData)
    
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data()
    const practiceSessions = userData.practiceSessions || []
    
    // Find the practice session to update
    const practiceIndex = practiceSessions.findIndex(practice => practice.id === practiceId)
    
    if (practiceIndex === -1) {
      throw new Error('Practice session not found')
    }
    
    // Update practice session with recording data
    practiceSessions[practiceIndex].recording = {
      publicId: recordingData.publicId,
      url: recordingData.url,
      duration: recordingData.duration,
      format: recordingData.format,
      provider: 'cloudinary',
      createdAt: new Date().toISOString()
    }
    
    await updateDoc(userRef, {
      practiceSessions: practiceSessions,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Practice session updated with recording successfully')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating practice with recording:', error)
    logError(error, 'update-practice-with-recording')
    const errorInfo = handleFirebaseError(error, 'update-practice-with-recording')
    return createErrorResponse(errorInfo.message, errorInfo.code, 'update-practice-with-recording')
  }
} 