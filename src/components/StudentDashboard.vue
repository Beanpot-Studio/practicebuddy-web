<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <!-- Header Section -->
      <StudentHeader :student-name="studentName" />

      <!-- Stats Card - Full Width -->
      <StatsCard 
        :total-practice-time="totalPracticeTime"
        :current-streak="currentStreak"
        :sticker-count="stickerCount"
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
          @start-practice="startPractice"
        />
        
        <!-- Practice Timer Card (replaces practice card when active) -->
        <PracticeTimer
          v-if="showTimer"
          :practice-data="currentPracticeData"
          :total-time="practiceTime"
          @session-complete="onSessionComplete"
          @session-cancelled="onSessionCancelled"
        />

        <!-- Your Musical Creations Card -->
        <MusicalCreationsCard
          :recordings="recordings"
          @show-recording-modal="showRecordingModal = true"
          @play-recording="playRecording"
        />
      </div>

      <!-- Class Enrollment/Assignments Section - Full Width -->
      <div class="mb-8">
        <!-- Class Enrollment Section -->
        <ClassEnrollmentCard
          v-if="!currentUser?.classCode && enrolledClasses.length === 0"
          @join-class="joinClass"
        />

        <!-- Combined Classes and Assignments Section -->
        <ClassesAndAssignmentsCard
          v-if="enrolledClasses.length > 0"
          :enrolled-classes="enrolledClasses"
          :assignments="assignments"
        />
      </div>

      <!-- Other Cards Section - Half Width Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Practice Goals Card -->
        <PracticeGoalsCard
          :student-id="currentUser?.uid"
        />
        
        <!-- Achievements Card -->
        <AchievementsCard :achievements="achievements" />
        
        <!-- Standalone Practice Sessions Section (for users not in a class) -->
        <StandalonePracticeCard
          v-if="!currentUser?.classCode"
          :standalone-practices="standalonePractices"
          :is-loading-practices="isLoadingPractices"
        />
      </div>
    </div>

    <!-- Recording Modal -->
    <RecordingModal
      :show-recording-modal="showRecordingModal"
      :is-recording="isRecording"
      :recording-time="recordingTime"
      @close-modal="showRecordingModal = false"
      @toggle-recording="toggleRecording"
    />

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
import PracticeSessionCard from './StudentDashboard/PracticeSessionCard.vue'
import PracticeTimer from './StudentDashboard/PracticeTimer.vue'
import MusicalCreationsCard from './StudentDashboard/MusicalCreationsCard.vue'
import ClassEnrollmentCard from './StudentDashboard/ClassEnrollmentCard.vue'
import ClassesAndAssignmentsCard from './StudentDashboard/ClassesAndAssignmentsCard.vue'
import AchievementsCard from './StudentDashboard/AchievementsCard.vue'
import StandalonePracticeCard from './StudentDashboard/StandalonePracticeCard.vue'
import RecordingModal from './StudentDashboard/RecordingModal.vue'
import PracticeGoalsCard from './StudentDashboard/PracticeGoalsCard.vue'

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
  fetchStandalonePractices,
  getUserPracticeStats,
  getTeacherClasses,
  getStudentPracticeGoals,
  updatePracticeGoalProgress,
  fetchClassData // Added fetchClassData to the composable
} = useAuth()

const totalPracticeTime = ref(45)
const currentStreak = ref(7)
const stickerCount = ref(0)

const selectedInstrument = ref('')
const practiceTime = ref(30)
const practiceDescription = ref('')
const selectedClass = ref(null)
const enrolledClasses = ref([])

// Timer state
const showTimer = ref(false)
const currentPracticeData = ref(null)

// Standalone practice sessions
const standalonePractices = ref([])
const isLoadingPractices = ref(false)
const userPracticeStats = ref(null)

// Success toast notification
const showSuccessToast = ref(false)
const successToastTitle = ref('')
const successToastMessage = ref('')

const recordings = ref([
  {
    id: 1,
    title: 'Piano Practice - Scales',
    date: new Date(2024, 0, 15),
    stickers: ['star', 'music', 'thumbs-up']
  },
  {
    id: 2,
    title: 'Guitar Creation - Chords',
    date: new Date(2024, 0, 14),
    stickers: ['guitar', 'sparkles']
  },
  {
    id: 3,
    title: 'Violin Performance',
    date: new Date(2024, 0, 13),
    stickers: ['violin', 'star', 'target']
  }
])

const achievements = ref([
  {
    id: 1,
    title: 'First Week Star',
    description: 'Practice 7 days in a row',
    icon: 'calendar',
    earned: true
  },
  {
    id: 2,
    title: 'Speed Musician',
    description: 'Practice 60 minutes in one day',
    icon: 'zap',
    earned: true
  },
  {
    id: 3,
    title: 'Multi-Instrumentalist',
    description: 'Practice with 3 different instruments',
    icon: 'music',
    earned: false
  },
  {
    id: 4,
    title: 'Recording Master',
    description: 'Create 10 musical recordings',
    icon: 'star',
    earned: false
  }
])

const showRecordingModal = ref(false)
const newRecordingTitle = ref('')
const isRecording = ref(false)
const recordingTime = ref(0)

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

const handlePracticeSession = async (practiceData) => {
  const selectedInstrumentObj = instruments.find(instr => instr.value === practiceData.instrument)
  const instrumentName = selectedInstrumentObj ? selectedInstrumentObj.name : practiceData.instrument
  
  // Update total practice time with actual duration, rounded up to next minute
  const actualMinutes = practiceData.actualDuration || 0
  const roundedMinutes = Math.ceil(actualMinutes) // Round up to next whole minute
  
  totalPracticeTime.value += roundedMinutes
  
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
    } else {
      // Record standalone practice if not enrolled in a class
      const standalonePracticeData = {
        instrument: practiceData.instrument,
        practiceMinutes: roundedMinutes,
        description: practiceData.description || `${instrumentName} practice session`,
        completed: practiceData.completed,
        actualDuration: actualMinutes, // Keep original for reference
        roundedDuration: roundedMinutes, // Add rounded value
        timestamp: new Date().toISOString()
      }
      
      const result = await createStandalonePractice(
        currentUser.value.uid,
        standalonePracticeData
      )
      
      if (result.success) {
        // Refresh practice sessions
        await loadStandalonePractices()
        await loadUserPracticeStats()
      }
    }

    // Update practice goal progress
    await updateLocalPracticeGoalProgress(practiceData)
    
  } catch (error) {
    // Error recording practice session
  }
  
  // Show success notification with rounded time
  const classInfo = practiceData.classCode ? ` for ${practiceData.className || practiceData.classCode}` : ''
  if (practiceData.completed) {
    showSuccessNotification(
      '🎉 Practice Complete!',
      `Great job! You completed ${roundedMinutes} minutes of ${instrumentName} practice${classInfo}.`
    )
  } else {
    showSuccessNotification(
      'Practice Session Ended',
      `You practiced ${roundedMinutes} minutes of ${instrumentName}${classInfo}.`
    )
  }
  
  // Reset form
  selectedInstrument.value = ''
  practiceTime.value = 30
  practiceDescription.value = ''
  selectedClass.value = null
}

const updateLocalPracticeGoalProgress = async (practiceData) => {
  try {
    // Get current practice goals
    const goalsResult = await getStudentPracticeGoals(currentUser.value.uid)
    
    if (goalsResult.success && goalsResult.goals.length > 0) {
      const activeGoals = goalsResult.goals.filter(goal => goal.status === 'active')
      
      // Update progress for each active goal
      for (const goal of activeGoals) {
        await updatePracticeGoalProgress(
          currentUser.value.uid,
          goal.id,
          goal.type,
          practiceData.classCode
        )
      }
    }
  } catch (error) {
    // Error updating practice goal progress
  }
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
    
    // If student has a classCode but no enrolled classes found, create a fallback
    if (currentUser.value?.classCode && enrolledClassesList.length === 0) {
      enrolledClasses.value = [
        {
          code: currentUser.value.classCode,
          name: 'Music Class',
          teacherName: 'Music Teacher',
          instrument: currentUser.value.instrument || 'Music'
        }
      ]
    }
  } catch (error) {
    // Fallback to hardcoded data if there's an error
    if (currentUser.value?.classCode) {
      enrolledClasses.value = [
        {
          code: currentUser.value.classCode,
          name: 'Music Class',
          teacherName: 'Music Teacher',
          instrument: currentUser.value.instrument || 'Music'
        }
      ]
    } else {
      enrolledClasses.value = []
    }
  }
}

const loadStandalonePractices = async () => {
  if (!currentUser.value?.uid) return
  
  isLoadingPractices.value = true
  try {
    const result = await fetchStandalonePractices(currentUser.value.uid)
    if (result.success) {
      standalonePractices.value = result.practices
    }
  } catch (error) {
  } finally {
    isLoadingPractices.value = false
  }
}

const loadUserPracticeStats = async () => {
  if (!currentUser.value?.uid) return
  
  try {
    const result = await getUserPracticeStats(currentUser.value.uid)
    if (result.success) {
      userPracticeStats.value = result.practiceStats
      // Update the display values
      totalPracticeTime.value = result.practiceStats.totalPracticeMinutes || 0
      currentStreak.value = Math.floor(result.practiceStats.totalPracticeMinutes / 30) || 0 // Simple streak calculation
    }
  } catch (error) {
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

const playRecording = (recording) => {
  alert(`Playing: ${recording.title}`)
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    const timer = setInterval(() => {
      recordingTime.value++
      if (!isRecording.value) {
        clearInterval(timer)
      }
    }, 1000)
  } else {
    if (newRecordingTitle.value) {
      recordings.value.unshift({
        id: Date.now(),
        title: newRecordingTitle.value,
        date: new Date(),
        stickers: []
      })
      newRecordingTitle.value = ''
      recordingTime.value = 0
      showRecordingModal.value = false
    }
  }
}

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
      const classResult = await fetchClassData(classItem.code)
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
  } catch (error) {
    // Failed to load assignments
  } finally {
    isLoadingAssignments.value = false
  }
}

onMounted(async () => {
  await loadEnrolledClasses() // Load enrolled classes first
  await loadAssignments() // Then load assignments for all enrolled classes
  await trackLoginActivity()
  await loadUserPracticeStats() // Load practice stats on mount
  await loadStandalonePractices() // Load standalone practices on mount
})
</script>