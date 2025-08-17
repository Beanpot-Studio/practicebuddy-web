import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { getFirestore, doc, collection, onSnapshot, updateDoc } from 'firebase/firestore'
import { getPlanFromPriceId, getPlanLimits, getPlanLimitsAsync } from '../lib/stripe'
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
  getClassData,
  addStudentToClassRoster,
  getClassRoster,
  createAssignment,
  getClassAssignments,
  joinClass,
  USER_ROLES,
  getStudentStandaloneAssignments,
  updateStudentLoginActivity,
  updateStudentPracticeActivity,
  createStandalonePractice,
  updateUserPracticeStats,
  getUserPracticeStats,
  loginTeacherWithGoogle,
  loginStudentWithGoogle
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

    // Start listener to Stripe extension subscription docs for teachers
    if (authState.user && (authState.userData?.role === USER_ROLES.TEACHER)) {
      try {
        const db = getFirestore()
        const uid = authState.user.uid
        // With extension configured to mirror under `users`, subscriptions live at users/{uid}/subscriptions/{subId}
        const subsCol = collection(db, 'users', uid, 'subscriptions')
        const unsubscribe = onSnapshot(subsCol, async (querySnap) => {
          try {
            if (querySnap.empty) return
            // Prefer an active or trialing sub
            let picked = null
            querySnap.forEach((d) => {
              const st = (d.data()?.status || '').toLowerCase()
              if (!picked && (st === 'active' || st === 'trialing')) picked = d
            })
            if (!picked) {
              // fall back to first doc
              picked = querySnap.docs[0]
            }
            const sub = picked.data() || {}
            const status = (sub.status || '').toLowerCase()
            // Attempt to get price id from items array or top-level fields
            const priceId = sub.items?.[0]?.price?.id || sub.items?.[0]?.price || sub.price?.id || sub.price || sub.default_price || null

            const plan = await getPlanFromPriceId(priceId)

            // Avoid unnecessary writes if values are unchanged
            const currentPlan = currentUser.value?.subscriptionPlan
            const currentStatus = currentUser.value?.subscriptionStatus

            if (plan && status && (plan !== currentPlan || status !== currentStatus)) {
              const limits = await getPlanLimitsAsync(plan)
              await updateDoc(doc(db, 'users', uid), {
                subscriptionPlan: plan,
                subscriptionStatus: status,
                maxStudents: limits.maxStudents ?? null,
                updatedAt: new Date().toISOString()
              })
              currentUser.value = { ...currentUser.value, subscriptionPlan: plan, subscriptionStatus: status, maxStudents: limits.maxStudents ?? null }
            }
          } catch (e) {
            // ignore
          }
        })
        // Store unsubscribe on window for cleanup
        // eslint-disable-next-line no-undef
        window.__stripeCustomerUnsub = unsubscribe
      } catch (e) {
        // ignore if Firestore not available
      }
    }
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

const loginTeacherWithGoogleAccount = async () => {
  const result = await loginTeacherWithGoogle()
  return result
}

const loginStudentWithGoogleAccount = async (classCode = null) => {
  const result = await loginStudentWithGoogle(classCode)
  return result
}

const logoutUser = async () => {
  isLoading.value = true
  clearError()
  
  try {
    const result = await logout()
    
    if (!result.success) {
      handleAuthError(result.error)
    }
    
    return result
  } catch (error) {
    console.error('Logout error in composable:', error)
    return { success: false, error: error.message }
  } finally {
    // Ensure loading state is always reset
    isLoading.value = false
  }
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

const createClassAssignment = async (classCode, assignmentData, assignmentType = 'class', studentId = null, teacherId = null) => {
  const result = await createAssignment(classCode, assignmentData, assignmentType, studentId, teacherId)
  
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

const fetchStudentStandaloneAssignments = async (studentId) => {
  const result = await getStudentStandaloneAssignments(studentId)
  
  // Don't call handleAuthError here - let the component handle the error
  // This allows for better error display control
  
  return result
}

const updateStudentLoginActivityWrapper = async (classCode, studentId) => {
  try {
    const result = await updateStudentLoginActivity(classCode, studentId)
    return result
  } catch (error) {
    console.error('Error updating student login activity:', error)
    return { success: false, error: error.message }
  }
}

const updateStudentPracticeActivityWrapper = async (classCode, studentId, practiceMinutes) => {
  try {
    const result = await updateStudentPracticeActivity(classCode, studentId, practiceMinutes)
    return result
  } catch (error) {
    console.error('Error updating student practice activity:', error)
    return { success: false, error: error.message }
  }
}

const createStandalonePracticeWrapper = async (teacherId, practiceData) => {
  try {
    const result = await createStandalonePractice(teacherId, practiceData)
    return result
  } catch (error) {
    console.error('Error creating standalone practice:', error)
    return { success: false, error: error.message }
  }
}

const updateUserPracticeStatsWrapper = async (userId, practiceStats) => {
  try {
    const result = await updateUserPracticeStats(userId, practiceStats)
    return result
  } catch (error) {
    console.error('Error updating user practice stats:', error)
    return { success: false, error: error.message }
  }
}

const getUserPracticeStatsWrapper = async (userId) => {
  try {
    const result = await getUserPracticeStats(userId)
    return result
  } catch (error) {
    console.error('Error getting user practice stats:', error)
    return { success: false, error: error.message }
  }
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
    loginTeacherWithGoogleAccount,
    loginStudentWithGoogleAccount,
    logoutUser,
    resetUserPassword,
    createTeacherClass,
    fetchTeacherClasses,
    getClassData,
    fetchClassRoster,
    createClassAssignment,
    fetchClassAssignments,
    fetchStudentStandaloneAssignments,
    updateStudentLoginActivity: updateStudentLoginActivityWrapper,
    updateStudentPracticeActivity: updateStudentPracticeActivityWrapper,
    createStandalonePractice: createStandalonePracticeWrapper,
    updateUserPracticeStats: updateUserPracticeStatsWrapper,
    getUserPracticeStats: getUserPracticeStatsWrapper,
    joinClassAsStudent,
    
    // Constants
    USER_ROLES
  }
} 