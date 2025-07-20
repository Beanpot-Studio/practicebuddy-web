import { ref, computed } from 'vue'
import { 
  handleFirebaseError, 
  handleValidationError as handleValidationErrorLib, 
  createErrorResponse,
  logError,
  isNetworkError,
  isPermissionError,
  getRetrySuggestion 
} from '../lib/errorHandler'

/**
 * Vue composable for error handling
 * Provides reactive error state and error handling methods
 */
export function useErrorHandler() {
  // Reactive error state
  const currentError = ref(null)
  const errorHistory = ref([])
  const isLoading = ref(false)

  // Computed properties
  const hasError = computed(() => currentError.value !== null)
  const errorMessage = computed(() => currentError.value?.message || '')
  const errorCode = computed(() => currentError.value?.code || '')
  const errorContext = computed(() => currentError.value?.context || '')
  const isNetworkErrorState = computed(() => 
    currentError.value ? isNetworkError(currentError.value.originalError) : false
  )
  const isPermissionErrorState = computed(() => 
    currentError.value ? isPermissionError(currentError.value.originalError) : false
  )
  const retrySuggestion = computed(() => 
    currentError.value ? getRetrySuggestion(currentError.value.originalError) : null
  )

  /**
   * Handle Firebase errors
   * @param {Error} error - Firebase error object
   * @param {string} context - Error context
   * @param {Object} options - Additional options
   */
  const handleError = (error, context = 'general', options = {}) => {
    console.log('handleError called:', error.message, 'context:', context)
    // Log error for debugging
    logError(error, context)
    
    // Process error through Firebase error handler
    const errorInfo = handleFirebaseError(error, context)
    
    // Create error object with additional metadata
    const errorObject = {
      ...errorInfo,
      timestamp: new Date().toISOString(),
      options
    }
    
    // Set current error
    currentError.value = errorObject
    console.log('Error set:', errorObject.message)
    
    // Add to error history (keep last 10 errors)
    errorHistory.value.unshift(errorObject)
    if (errorHistory.value.length > 10) {
      errorHistory.value = errorHistory.value.slice(0, 10)
    }
    
    // Auto-clear error after specified time (default: 5 seconds)
    // Don't auto-clear authentication errors - let user fix them
    const autoClearTime = options.autoClearTime || (errorInfo.code?.startsWith('auth/') ? 0 : 5000)
    if (autoClearTime > 0) {
      setTimeout(() => {
        clearError()
      }, autoClearTime)
    }
    
    return errorObject
  }

  /**
   * Handle validation errors
   * @param {Object} validationErrors - Validation errors object
   * @param {Object} options - Additional options
   */
  const handleValidationError = (validationErrors, options = {}) => {
    const message = handleValidationErrorLib(validationErrors)
    const errorObject = createErrorResponse(message, 'validation', 'form-validation')
    
    currentError.value = {
      ...errorObject,
      timestamp: new Date().toISOString(),
      options
    }
    
    return errorObject
  }

  /**
   * Clear current error
   */
  const clearError = () => {
    console.log('clearError called, current error was:', currentError.value?.message)
    currentError.value = null
  }

  /**
   * Clear all errors (current and history)
   */
  const clearAllErrors = () => {
    currentError.value = null
    errorHistory.value = []
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  /**
   * Execute async function with error handling
   * @param {Function} asyncFn - Async function to execute
   * @param {string} context - Error context
   * @param {Object} options - Additional options
   */
  const executeWithErrorHandling = async (asyncFn, context = 'general', options = {}) => {
    try {
      const result = await asyncFn()
      return result
    } catch (error) {
      handleError(error, context, options)
      // Don't re-throw the error to prevent page refresh
      return { success: false, error: error.message }
    }
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} asyncFn - Async function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   */
  const retryWithBackoff = async (asyncFn, maxRetries = 3, baseDelay = 1000) => {
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFn()
      } catch (error) {
        lastError = error
        
        // Don't retry on certain errors
        if (isPermissionError(error) || error.code === 'auth/user-not-found') {
          throw error
        }
        
        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error
        }
        
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }

  /**
   * Get error history
   * @param {number} limit - Number of errors to return
   */
  const getErrorHistory = (limit = 10) => {
    return errorHistory.value.slice(0, limit)
  }

  /**
   * Check if error is of specific type
   * @param {string} errorType - Type of error to check
   */
  const isErrorType = (errorType) => {
    if (!currentError.value) return false
    
    switch (errorType) {
      case 'network':
        return isNetworkErrorState.value
      case 'permission':
        return isPermissionErrorState.value
      case 'validation':
        return errorCode.value === 'validation'
      case 'auth':
        return errorCode.value?.startsWith('auth/')
      case 'firestore':
        return errorCode.value?.startsWith('firestore/')
      default:
        return false
    }
  }

  return {
    // State
    currentError,
    errorHistory,
    isLoading,
    
    // Computed
    hasError,
    errorMessage,
    errorCode,
    errorContext,
    isNetworkErrorState,
    isPermissionErrorState,
    retrySuggestion,
    
    // Methods
    handleError,
    handleValidationError,
    clearError,
    clearAllErrors,
    setLoading,
    executeWithErrorHandling,
    retryWithBackoff,
    getErrorHistory,
    isErrorType
  }
} 