import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { 
  initAuthState, 
  cleanupAuth, 
  registerTeacher, 
  registerStudent, 
  loginTeacher, 
  loginStudent, 
  logout, 
  resetPassword,
  createClass,
  getTeacherClasses,
  getClassRoster,
  createAssignment,
  getClassAssignments,
  deleteAssignment,
  joinClass,
  USER_ROLES 
} from '../lib/auth'

// Global auth state
const currentUser = ref(null)
const isAuthenticated = ref(false)
const isLoading = ref(true)
const authError = ref(null)

// Initialize auth state
const initializeAuth = () => {
  initAuthState((authState) => {
    if (authState.user && authState.userData) {
      // Combine Firebase user with Firestore user data
      currentUser.value = { ...authState.user, ...authState.userData }
    } else {
      currentUser.value = authState.user
    }
    isAuthenticated.value = !!authState.user
    isLoading.value = false
    authError.value = null
  })
}

// Computed properties
const userRole = computed(() => currentUser.value?.role || null)
const isTeacher = computed(() => userRole.value === USER_ROLES.TEACHER)
const isStudent = computed(() => userRole.value === USER_ROLES.STUDENT)
const displayName = computed(() => currentUser.value?.displayName || currentUser.value?.name || 'User')

// Authentication methods
const handleAuthError = (error) => {
  authError.value = error
  setTimeout(() => {
    authError.value = null
  }, 5000)
}

const clearError = () => {
  authError.value = null
}

const registerTeacherAccount = async (email, password, displayName, teacherData = {}) => {
  const result = await registerTeacher(email, password, displayName, teacherData)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const registerStudentAccount = async (email, password, displayName, studentData = {}) => {
  const result = await registerStudent(email, password, displayName, studentData)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}



const loginTeacherAccount = async (email, password) => {
  const result = await loginTeacher(email, password)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}



const loginStudentAccount = async (email, password, classCode = null) => {
  const result = await loginStudent(email, password, classCode)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const logoutUser = async () => {
  isLoading.value = true
  clearError()
  
  const result = await logout()
  
  if (!result.success) {
    handleAuthError(result.error)
  }
  
  isLoading.value = false
  return result
}

const resetUserPassword = async (email) => {
  clearError()
  
  const result = await resetPassword(email)
  
  if (!result.success) {
    handleAuthError(result.error)
  }
  
  return result
}

const createTeacherClass = async (teacherId, classData) => {
  const result = await createClass(teacherId, classData)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const fetchTeacherClasses = async (teacherId) => {
  const result = await getTeacherClasses(teacherId)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const fetchClassRoster = async (classCode) => {
  const result = await getClassRoster(classCode)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const createClassAssignment = async (classCode, assignmentData, assignmentType = 'class', studentId = null) => {
  const result = await createAssignment(classCode, assignmentData, assignmentType, studentId)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const fetchClassAssignments = async (classCode, studentId = null) => {
  const result = await getClassAssignments(classCode, studentId)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const deleteClassAssignment = async (classCode, assignmentId) => {
  const result = await deleteAssignment(classCode, assignmentId)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const joinClassAsStudent = async (classCode, studentId, studentName, instrument = '') => {
  const result = await joinClass(classCode, studentId, studentName, instrument)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

// Export the composable
export function useAuth() {
  onMounted(() => {
    initializeAuth()
  })

  onUnmounted(() => {
    cleanupAuth()
  })

  return {
    // State
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    authError: readonly(authError),
    
    // Computed
    userRole,
    isTeacher,
    isStudent,
    displayName,
    
    // Methods
    clearError,
    registerTeacherAccount,
    registerStudentAccount,
    loginTeacherAccount,
    loginStudentAccount,
    logoutUser,
    resetUserPassword,
    createTeacherClass,
    fetchTeacherClasses,
    fetchClassRoster,
    createClassAssignment,
    fetchClassAssignments,
    deleteClassAssignment,
    joinClassAsStudent,
    
    // Constants
    USER_ROLES
  }
} 