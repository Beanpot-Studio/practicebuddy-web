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
    currentUser.value = authState.user
    isAuthenticated.value = authState.isAuthenticated
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

const registerStudentAccount = async (name, classCode, studentData = {}) => {
  const result = await registerStudent(name, classCode, studentData)
  
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

const loginStudentAccount = async (name, classCode) => {
  const result = await loginStudent(name, classCode)
  
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
    
    // Constants
    USER_ROLES
  }
} 