<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <!-- Header Section -->
      <StudentHeader :student-name="studentName" />

      <!-- Stats Card - Full Width -->
      <StatsCard 
        :total-practice-minutes="totalPracticeMinutes"
        :assignments-completed="assignmentsCompleted"
        :assignments-pending="assignmentsPending"
        :next-assignment-due-date="nextAssignmentDueDate"
        :current-goal="currentGoal"
      />

      <!-- Other Cards - Half Width Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Start Practicing Card or Timer Card -->
        <PracticeSessionCard
          v-if="!showTimer"
          v-model:selected-instrument="selectedInstrument"
          v-model:practice-time="practiceTime"
          v-model:practice-description="practiceDescription"
          v-model:selected-class="selectedClass"
          :enrolled-classes="enrolledClasses"
          :current-goal="currentGoal"
          @start-practice="startPractice"
        />
        
        <!-- Practice Timer Card (replaces practice card when active) -->
        <PracticeTimer
          v-if="showTimer"
          :practice-data="currentPracticeData"
          :total-time="practiceTime"
          :user-id="currentUser?.uid"
          @session-complete="onSessionComplete"
          @session-cancelled="onSessionCancelled"
        />

        <!-- Your Practice Sessions Card -->
        <MusicalCreationsCard
          ref="musicalCreationsCard"
          :user-id="currentUser?.uid"
        />
      </div>



      <!-- Class Enrollment/Assignments Section - Full Width -->
      <div class="mb-8">
        <!-- Class Enrollment Section -->
        <!-- Combined Classes and Assignments Section -->
        <ClassesAndAssignmentsCard
          v-if="enrolledClasses.length > 0"
          :enrolled-classes="enrolledClasses"
          :assignments="assignments"
          @assignment-completed="handleAssignmentCompletion"
        />

        <!-- Class Enrollment Section - Always show to allow joining additional classes -->
        <ClassEnrollmentCard
          @join-class="joinClass"
        />
      </div>

      <!-- Practice History Chart -->
      <div class="mb-8">
        <PracticeHistoryChart :user-id="currentUser?.uid" />
      </div>




    </div>

    <!-- Recording functionality is now integrated into PracticeTimer component -->

    <!-- Success Toast Notification -->
    <div 
      v-if="showSuccessToast"
      class="fixed top-4 right-4 z-[9999] bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 ease-out pointer-events-none"
      :class="showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
    >
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <CheckCircle class="w-4 h-4" />
        </div>
        <div>
          <div class="font-semibold">{{ successToastTitle }}</div>
          <div class="text-sm opacity-90">{{ successToastMessage }}</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
  @keyframes confetti-fall {
    0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { CheckCircle } from 'lucide-vue-next'
import { instruments } from '../lib/instruments'

// Import child components
import StudentHeader from './StudentDashboard/StudentHeader.vue'
import StatsCard from './StudentDashboard/StatsCard.vue'
import PracticeHistoryChart from './StudentDashboard/PracticeHistoryChart.vue'
import PracticeSessionCard from './StudentDashboard/PracticeSessionCard.vue'
import PracticeTimer from './StudentDashboard/PracticeTimer.vue'
import MusicalCreationsCard from './StudentDashboard/MusicalCreationsCard.vue'
import ClassEnrollmentCard from './StudentDashboard/ClassEnrollmentCard.vue'
import ClassesAndAssignmentsCard from './StudentDashboard/ClassesAndAssignmentsCard.vue'

const props = defineProps({
  studentName: {
    type: String,
    default: 'Student'
  }
})

const { 
  currentUser, 
  fetchClassAssignments, 
  fetchStudentStandaloneAssignments, 
  joinClassAsStudent, 
  updateStudentLoginActivity, 
  updateStudentPracticeActivity,
  createStandalonePractice,
  // getStandalonePractices removed - practice sessions handled differently
  getUserPracticeStats,
  getTeacherClasses,
  getClassData // Fixed: use getClassData instead of fetchClassData
} = useAuth()

const totalPracticeMinutes = ref(0)
// Replaced streak with assignment metrics
const assignmentsCompleted = ref(0)
const assignmentsPending = ref(0)
const nextAssignmentDueDate = ref(null)
const stickerCount = ref(0)
const currentGoal = ref(null)

const selectedInstrument = ref('')
const practiceTime = ref(30)
const practiceDescription = ref('')
const selectedClass = ref(null)
const enrolledClasses = ref([])

// Timer state
const showTimer = ref(false)
const currentPracticeData = ref({})
const musicalCreationsCard = ref(null)

// Practice sessions are now shown in the Musical Creations card
const userPracticeStats = ref(null)

// Success toast notification
const showSuccessToast = ref(false)
const successToastTitle = ref('')
const successToastMessage = ref('')

// Practice sessions are loaded from Firebase via loadStandalonePractices()

const achievements = ref([]) // Empty array for teacher-provided stickers

// Recording functionality is now handled in PracticeTimer component

// Class assignments
const assignments = ref([])
const isLoadingAssignments = ref(false)

const showSuccessNotification = (title, message) => {
  successToastTitle.value = title
  successToastMessage.value = message
  showSuccessToast.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const startPractice = (practiceData) => {
  currentPracticeData.value = practiceData
  showTimer.value = true
}

const onSessionComplete = async (sessionData) => {
  showTimer.value = false
  await handlePracticeSession(sessionData)
}

const onSessionCancelled = async (sessionData) => {
  showTimer.value = false
  await handlePracticeSession(sessionData)
}

const refreshPracticeSessions = async () => {
  if (musicalCreationsCard.value) {
    await musicalCreationsCard.value.loadPracticeSessions()
  }
}

const handlePracticeSession = async (practiceData) => {
  const selectedInstrumentObj = instruments.find(instr => instr.value === practiceData.instrument)
  const instrumentName = selectedInstrumentObj ? selectedInstrumentObj.name : practiceData.instrument
  
  // Update total practice time with actual duration, rounded up to next minute
  const actualMinutes = practiceData.actualDuration || 0
  const roundedMinutes = Math.ceil(actualMinutes) // Round up to next whole minute
  
  totalPracticeMinutes.value += roundedMinutes
  
  // Record practice session in Firebase
  try {
    if (practiceData.classCode) {
      // Record in class if enrolled
      const result = await updateStudentPracticeActivity(
        practiceData.classCode,
        currentUser.value.uid,
        roundedMinutes
      )
      
      if (!result.success) {
        // Failed to record class practice
      }
    }
    
    // Create practice session in unified practices collection
    const practiceDataForStorage = {
      instrument: practiceData.instrument,
      instrumentName: instrumentName,
      practiceMinutes: roundedMinutes,
      description: practiceData.description || `${instrumentName} practice session`,
      completed: practiceData.completed,
      actualDuration: actualMinutes,
      roundedDuration: roundedMinutes,
      timestamp: new Date().toISOString(),
      studentName: currentUser.value.displayName || 'Student',
      studentEmail: currentUser.value.email,
      className: practiceData.className,
      classId: practiceData.classCode,
      recording: practiceData.recording,
      recordingDuration: practiceData.recordingDuration
    }
    
    const { createPractice } = await import('../lib/auth.js')
    const result = await createPractice(
      currentUser.value.uid,
      practiceDataForStorage
    )
    
    if (result.success) {
      
      // If there's a recording, update the practice session with recording data
      if (practiceData.recording) {
        try {
          const { updatePracticeWithRecording } = await import('../lib/auth.js')
          const recordingData = {
            publicId: practiceData.recording.publicId || `practice_${Date.now()}`,
            url: practiceData.recording,
            duration: practiceData.recordingDuration || 0,
            format: 'mp3',
            provider: 'cloudinary'
          }
          
          await updatePracticeWithRecording(
            result.practiceId,
            currentUser.value.uid,
            recordingData
          )
        } catch (recordingError) {
          console.error('Failed to save recording data:', recordingError)
        }
      }
    } else {
      console.error('Failed to create practice session:', result)
    }
    
    // Refresh practice sessions to show the new recording
    await refreshPracticeSessions()
    
    // Refresh practice stats after a short delay to ensure the stats are updated
    setTimeout(async () => {
      await loadUserPracticeStats()
    }, 1000)
    
    // Update goal progress and check for completion
    const goalCompletion = await updateGoalProgressAndCheckCompletion(practiceData)
    
    if (goalCompletion.completed) {
      showGoalCelebration(goalCompletion.goal)
    }
  } catch (error) {
    console.error('Error recording practice session:', error)
  }
  
  // Show success notification with rounded time
  const classInfo = practiceData.classCode ? ` for ${practiceData.className || practiceData.classCode}` : ''
  const recordingInfo = practiceData.recording ? ' with recording' : ''
  
  if (practiceData.completed) {
    showSuccessNotification(
      '🎉 Practice Complete!',
      `Great job! You completed ${roundedMinutes} minutes of ${instrumentName} practice${classInfo}${recordingInfo}.`
    )
  } else {
    showSuccessNotification(
      'Practice Session Ended',
      `You practiced ${roundedMinutes} minutes of ${instrumentName}${classInfo}${recordingInfo}.`
    )
  }
  
  // Reset form
  selectedInstrument.value = ''
  practiceTime.value = 30
  practiceDescription.value = ''
  selectedClass.value = null
}



const loadEnrolledClasses = async () => {
  if (!currentUser.value?.uid) return
  
  try {

    
    // Query all classes and filter for those containing this student
    const classesQuery = query(collection(db, 'classes'))
    const querySnapshot = await getDocs(classesQuery)
    const enrolledClassesList = []
    
    querySnapshot.forEach((doc) => {
      const classData = doc.data()
      // Check if this student is in the students array
      const studentData = classData.students?.find(s => 
        s.studentId === currentUser.value.uid || 
        s.id === currentUser.value.uid ||
        s.uid === currentUser.value.uid
      )
      
      if (studentData) {
        enrolledClassesList.push({
          id: doc.id,
          code: classData.code,
          name: classData.name,
          teacherName: classData.teacherName || 'Music Teacher',
          instrument: studentData?.instrument || classData.instrument,
          level: classData.level,
          schedule: classData.schedule,
          studentData: studentData
        })
      }
    })
    
    enrolledClasses.value = enrolledClassesList
    
    // Don't create fallback classes - let the user join properly
    // If student has a classCode but no enrolled classes found, they need to join
  } catch (error) {
    console.error('Error loading enrolled classes:', error)
    enrolledClasses.value = []
  }
}

const loadUserPracticeStats = async () => {
  if (!currentUser.value?.uid) return
  
  try {
    const result = await getUserPracticeStats(currentUser.value.uid)
    if (result.success) {
      userPracticeStats.value = result.practiceStats
      // Update the display values
      totalPracticeMinutes.value = result.practiceStats.totalPracticeMinutes || 0
      
      // Use the calculated streak from the practice stats
      currentStreak.value = result.practiceStats.currentStreak || 0
      
      // Calculate sticker count from practice sessions
      await calculateStickerCount()
    }
  } catch (error) {
    console.error('Error loading practice stats:', error)
  }
}



const calculateStickerCount = async () => {
  try {
    // Get all practice sessions to count stickers
    const { getStudentPractices } = await import('../lib/auth.js')
    const result = await getStudentPractices(currentUser.value.uid)
    
    if (result.success) {
      let totalStickers = 0
      result.practices.forEach(practice => {
        if (practice.feedback) {
          const stickers = practice.feedback.filter(f => f.type === 'sticker' || f.stickerType)
          totalStickers += stickers.length
        }
      })
      
      stickerCount.value = totalStickers
    }
  } catch (error) {
    console.error('Error calculating sticker count:', error)
    stickerCount.value = 0
  }
}

const loadGoalProgress = async () => {
  if (!currentUser.value?.uid) return
  
  try {
    const { getStudentPracticeGoals } = await import('../lib/auth.js')
    const result = await getStudentPracticeGoals(currentUser.value.uid)
    
    if (result.success && result.goals.length > 0) {
      // Get the first active goal
      const activeGoal = result.goals.find(goal => 
        goal.status === 'active' || goal.status === undefined
      )
      
      if (activeGoal) {
        currentGoal.value = activeGoal
      } else {
        currentGoal.value = null
      }
    } else {
      // No active goals found
      currentGoal.value = null
    }
  } catch (error) {
    console.error('Error loading goal progress:', error)
    currentGoal.value = null
  }
}

const updateGoalProgressAndCheckCompletion = async (practiceData) => {
  if (!currentUser.value?.uid || !currentGoal.value) {
    return { completed: false, goal: null }
  }
  
  try {
    const { updatePracticeGoalProgress } = await import('../lib/auth.js')
    
    // Update progress for the current goal
    const result = await updatePracticeGoalProgress(
      currentUser.value.uid,
      currentGoal.value.id,
      currentGoal.value.type,
      practiceData.classCode,
      Math.ceil(practiceData.actualDuration || practiceData.practiceMinutes || 0)
    )
    
    if (result.success) {
      // Reload the goal to get updated progress
      await loadGoalProgress()
      
      // Check if goal is completed
      if (currentGoal.value && currentGoal.value.status === 'completed') {
        const completedGoal = { ...currentGoal.value }
        
        // Reset the goal after completion
        await resetCompletedGoal(currentGoal.value.id, currentGoal.value.type, practiceData.classCode)
        
        return { completed: true, goal: completedGoal }
      }
    } else if (result.error) {
      // Inform the student when the session didn't meet required minutes
      showSuccessNotification('Goal Not Updated', result.error)
    }
    
    return { completed: false, goal: null }
  } catch (error) {
    console.error('Error updating goal progress:', error)
    return { completed: false, goal: null }
  }
}

const resetCompletedGoal = async (goalId, goalType, classCode) => {
  try {
    const { resetPracticeGoal } = await import('../lib/auth.js')
    await resetPracticeGoal(goalId, goalType, currentUser.value.uid, classCode)
    
    // Reload goal progress to show next goal
    await loadGoalProgress()
  } catch (error) {
    console.error('Error resetting goal:', error)
  }
}

const showGoalCelebration = (goal) => {
  // Show celebration toast
  showSuccessNotification(
    '🎉 Goal Achieved!',
    `Congratulations! You've completed "${goal.title}" and earned: ${goal.reward}`
  )
  
  // Trigger confetti animation
  triggerConfetti()
}

const triggerConfetti = () => {
  // Create confetti effect
  const confettiCount = 200
  const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div')
      confetti.style.position = 'fixed'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.top = '-10px'
      confetti.style.width = '10px'
      confetti.style.height = '10px'
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      confetti.style.borderRadius = '50%'
      confetti.style.pointerEvents = 'none'
      confetti.style.zIndex = '10000'
      confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`
      
      document.body.appendChild(confetti)
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti)
        }
      }, 5000)
    }, i * 10)
  }
}

const trackLoginActivity = async () => {
  if (currentUser.value?.classCode && currentUser.value?.uid) {
    try {
      await updateStudentLoginActivity(currentUser.value.classCode, currentUser.value.uid)
    } catch (error) {
      // Error tracking login activity
    }
  }
}



// Recording functionality is now handled in PracticeTimer component

const joinClass = async (classCode) => {
  try {
    const result = await joinClassAsStudent(
      classCode,
      currentUser.value.uid,
      currentUser.value.displayName,
      currentUser.value.instrument || ''
    )
    
    if (result && result.success) {
      // Reload the page to update the user data and show assignments
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      throw new Error(result.error || 'Failed to join class. Please check your class code.')
    }
  } catch (error) {
    throw error
  }
}

const handleAssignmentCompletion = async (completionData) => {
  try {
    // Optimistically update the UI: mark the assignment as complete locally
    const updated = assignments.value.map((a) => {
      if (a.id === completionData.assignmentId) {
        return {
          ...a,
          isComplete: true,
          completedAt: completionData.completedAt,
          completionNotes: completionData.notes
        }
      }
      return a
    })
    assignments.value = updated
    // Update metrics after completion
    assignmentsCompleted.value = updated.filter(a => a.isComplete).length
    assignmentsPending.value = updated.filter(a => !a.isComplete).length
    const pendingWithDue = updated
      .filter(a => !a.isComplete && !!a.dueDate)
      .map(a => new Date(a.dueDate))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b)
    nextAssignmentDueDate.value = pendingWithDue.length > 0 ? pendingWithDue[0].toISOString() : null

    // Show success toast
    showSuccessToast.value = true
    successToastTitle.value = 'Assignment Completed!'
    successToastMessage.value = `"${completionData.assignment.title}" has been marked as complete.`
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Error completing assignment:', error)
    showSuccessToast.value = true
    successToastTitle.value = 'Error'
    successToastMessage.value = 'Failed to mark assignment as complete. Please try again.'
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  }
}

const loadAssignments = async () => {
  if (!currentUser.value?.uid) return
  
  isLoadingAssignments.value = true
  try {
    let allAssignments = []
    
    // First load enrolled classes to get all class codes
    await loadEnrolledClasses()
    
    // Load assignments for each enrolled class
    for (const classItem of enrolledClasses.value) {
      // Get the class data which contains assignments arrays
      const classResult = await getClassData(classItem.code)
      if (classResult.success && classResult.class) {
        const classData = classResult.class
        
        // Extract class-wide assignments
        if (classData.assignments && classData.assignments.length > 0) {
          const classAssignments = classData.assignments.map(assignment => ({
            ...assignment,
            type: 'class',
            classCode: classItem.code,
            classId: classItem.id,
            className: classItem.name
          }))
          allAssignments.push(...classAssignments)
        }
        
        // Extract individual assignments for this student
        if (classData.individualAssignments && typeof classData.individualAssignments === 'object') {
          // Get assignments for this specific student
          const studentIndividualAssignments = classData.individualAssignments[currentUser.value.uid] || []
          
          const individualAssignments = studentIndividualAssignments.map(assignment => ({
            ...assignment,
            type: 'individual',
            classCode: classItem.code,
            classId: classItem.id,
            className: classItem.name
          }))
          
          allAssignments.push(...individualAssignments)
        }
      }
    }
    
    // Load standalone assignments for this student (these are stored separately)
    const standaloneResult = await fetchStudentStandaloneAssignments(currentUser.value.uid)
    if (standaloneResult.success) {
      const standaloneAssignments = standaloneResult.assignments.map(assignment => ({
        ...assignment,
        type: 'standalone'
      }))
      allAssignments.push(...standaloneAssignments)
    }
    
    assignments.value = allAssignments
    // Update assignment metrics for stats
    assignmentsCompleted.value = allAssignments.filter(a => a.isComplete).length
    assignmentsPending.value = allAssignments.filter(a => !a.isComplete).length
    // Compute next due date among pending items
    const pendingWithDue = allAssignments
      .filter(a => !a.isComplete && !!a.dueDate)
      .map(a => new Date(a.dueDate))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b)
    nextAssignmentDueDate.value = pendingWithDue.length > 0 ? pendingWithDue[0].toISOString() : null
  } catch (error) {
    console.error('Error loading assignments:', error)
  } finally {
    isLoadingAssignments.value = false
  }
}

onMounted(async () => {
  await loadEnrolledClasses() // Load enrolled classes first
  await loadAssignments() // Then load assignments for all enrolled classes
  await trackLoginActivity()
  await loadUserPracticeStats() // Load practice stats on mount
  await loadGoalProgress() // Load goal progress on mount
})
</script>