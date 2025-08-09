<template>
  <div class="min-h-screen bg-musical-primary p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
            <GraduationCap class="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-black">Teacher Dashboard</h1>
            <p class="text-black/80">Welcome back, {{ currentUser?.displayName || 'Teacher' }}!</p>
          </div>
        </div>
      
      </div>

      <!-- Success/Error Messages -->
      <div v-if="showSuccessMessage" class="mb-6 p-4 bg-green-100 border-2 border-green-400 rounded-xl text-green-800 font-medium animate-fadeIn">
        ✅ {{ successMessage }}
      </div>
      <div v-if="showErrorMessage" class="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 font-medium animate-fadeIn">
        ❌ {{ errorMessage }}
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-3xl p-2 mb-8 shadow-lg">
        <div class="flex space-x-2">
          <button
            @click="changeTab('overview')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'overview' ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
            ]"
          >
            <BarChart3 class="w-4 h-4" />
            Overview
          </button>
          <button
            @click="changeTab('roster')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'roster' ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
            ]"
          >
            <Users class="w-4 h-4" />
            Roster
          </button>
          <button
            @click="changeTab('classes')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'classes' ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
            ]"
          >
            <GraduationCap class="w-4 h-4" />
            Classes
          </button>
          <button
            @click="changeTab('assignments')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'assignments' ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
            ]"
          >
            <BookOpen class="w-4 h-4" />
            Assignments
          </button>
          <button
            @click="changeTab('goals')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'goals' ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
            ]"
          >
            <Target class="w-4 h-4" />
            Goals
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <OverviewTab
          v-if="activeTab === 'overview'"
          :current-user="currentUser"
          :classes="classes"
          :is-loading="isLoadingClasses"
          :error="classesError"
          :recent-activity="recentActivity"
          :student-goals="studentGoals"
          :class-goals="classGoals"
          :is-loading-recent-activity="isLoadingRecentActivity"
          :give-sticker="giveSticker"
          :add-comment="addComment"
          :mark-as-complete="markAsComplete"
          @load-classes="loadClasses"
        />
        <RosterTab
          v-if="activeTab === 'roster'"
          :classes="classes"
          :is-loading="isLoadingClasses"
          :error="classesError"
          :class-assignments="classAssignments"
          :student-goals="studentGoals"
          @load-classes="loadClasses"
          @view-student-details="viewStudentDetails"
          @create-individual-assignment="createIndividualAssignment"
          @send-email="sendIndividualEmail"
          @copy-student-id="copyStudentId"
        />
        <ClassesTab
          v-if="activeTab === 'classes'"
          :classes="classes"
          :is-loading="isLoadingClasses"
          :error="classesError"
          :new-class="newClass"
          :is-creating-class="isCreatingClass"
          @create-class="createClass"
          @update:new-class="newClass = $event"
          @load-classes="loadClasses"
          @select-class="selectClass"
          @copy-class-code="copyClassCode"
          @send-email="sendClassInvitation"
        />
        <AssignmentsTab
          v-if="activeTab === 'assignments'"
          :classes="classes"
          :class-assignments="classAssignments"
          :is-loading="isLoadingClasses"
          :new-assignment="newAssignment"
          :is-creating-assignment="isCreatingAssignment"
          @create-new-assignment="createNewAssignment"
          @update:new-assignment="newAssignment = $event"
          @delete-assignment="deleteAssignment"
          @edit-assignment="editAssignment"
          @copy-assignment-id="copyAssignmentId"
        />
        <GoalsTab
          v-if="activeTab === 'goals'"
          :current-user="currentUser"
        />
      </div>
    </div>
    
    <!-- Email Modal -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">
            {{ emailType === 'class-invitation' ? 'Send Class Invitation' : 'Send Email' }}
          </h3>
          <button @click="showEmailModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="sendEmailMessage" class="space-y-4">
          <!-- Recipient Email -->
          <div v-if="emailType !== 'class-invitation'">
            <label class="block mb-2 font-semibold text-gray-700">Recipient Email</label>
            <input 
              v-model="emailRecipient"
              type="email" 
              required
              placeholder="student@example.com"
              class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <!-- Subject -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Subject</label>
            <input 
              v-model="emailSubject"
              type="text" 
              required
              placeholder="Email subject"
              class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <!-- Message Body -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Message</label>
            <textarea 
              v-model="emailBody"
              rows="8"
              required
              placeholder="Your message here..."
              class="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-400"
            ></textarea>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="showEmailModal = false"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Success/Error Messages -->
    <div v-if="showSuccessMessage" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ successMessage }}
    </div>
    <div v-if="showErrorMessage" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { getInstrumentName } from '../lib/instruments'
import OverviewTab from './TeacherDashboard/OverviewTab.vue'
import RosterTab from './TeacherDashboard/RosterTab.vue'
import ClassesTab from './TeacherDashboard/ClassesTab.vue'
import AssignmentsTab from './TeacherDashboard/AssignmentsTab.vue'
import GoalsTab from './TeacherDashboard/GoalsTab.vue'
import { 
  GraduationCap, 
  BarChart3, 
  Plus, 
  BookOpen, 
  Target, Users
} from 'lucide-vue-next'

const { currentUser, fetchTeacherClasses, createTeacherClass, fetchClassRoster, fetchUserData } = useAuth()

const activeTab = ref('overview')
const classes = ref([])
const selectedClass = ref(null)
const isLoadingClasses = ref(false)
const classesError = ref(null)
const newClass = ref({
  name: '',
  description: '',
  instrument: '',
  level: '',
  schedule: ''
})
const isCreatingClass = ref(false)

// OverviewTab props
const allStudents = ref([])
const studentAssignments = ref({})
const recentActivity = ref([])
const selectedClassForRoster = ref(null)
const classRoster = ref([])
const isLoadingRoster = ref(false)
const studentGoals = ref({})
const classGoals = ref({})
const isLoadingRecentActivity = ref(false)

// Success/Error messages
const showSuccessMessage = ref(false)
const successMessage = ref('')
const showErrorMessage = ref(false)
const errorMessage = ref('')

// Feedback functions
const giveSticker = async (practiceId, studentId, stickerType, message = '') => {
  try {
    const { giveStickerToPractice } = await import('../lib/auth.js')
    const result = await giveStickerToPractice(practiceId, studentId, currentUser.value.uid, {
      stickerType,
      message,
      teacherName: currentUser.value.displayName || 'Teacher'
    })
    
    if (result.success) {
      // Refresh the recent activity to show the new feedback
      await loadRecentActivity()
    } else {
      console.error('Failed to give sticker:', result.error)
    }
  } catch (error) {
    console.error('Error giving sticker:', error)
  }
}

const addComment = async (practiceId, studentId, comment) => {
  try {
    const { addCommentToPractice } = await import('../lib/auth.js')
    const result = await addCommentToPractice(practiceId, studentId, currentUser.value.uid, {
      comment,
      teacherName: currentUser.value.displayName || 'Teacher'
    })
    
    if (result.success) {
      // Refresh the recent activity to show the new feedback
      await loadRecentActivity()
    } else {
      console.error('Failed to add comment:', result.error)
    }
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

const markAsComplete = async (practiceId, studentId) => {
  try {
    const { markPracticeAsComplete } = await import('../lib/auth.js')
    const result = await markPracticeAsComplete(practiceId, studentId, currentUser.value.uid)
    
    if (result.success) {
      // Refresh the recent activity to show the updated status
      await loadRecentActivity()
    } else {
      console.error('Failed to mark practice as complete:', result.error)
    }
  } catch (error) {
    console.error('Error marking practice as complete:', error)
  }
}

// AssignmentsTab props
const selectedClassForAssignments = ref(null)
const newAssignment = ref({
  type: 'class',
  title: '',
  description: '',
  practiceMinutes: '',
  dueDate: '',
  studentId: ''
})
const classAssignments = ref([])
const isLoadingAssignments = ref(false)
const isCreatingAssignment = ref(false)



const loadClasses = async () => {
  if (!currentUser.value?.uid) {
    // console.error('No current user found')
    return
  }

  try {
    isLoadingClasses.value = true
    classesError.value = null
    
    const result = await fetchTeacherClasses(currentUser.value.uid)
    
    if (result.success) {
      classes.value = result.classes || []
      
      // Load all students from all classes
      await loadAllStudents()
      
      // Extract assignments from class data
      await loadAllAssignments()
    } else {
      // console.error('Failed to load classes:', result.error)
      classesError.value = result.error || 'Failed to load classes'
    }
  } catch (error) {
    // console.error('Error loading classes:', error)
    classesError.value = error.message || 'Error loading classes'
  } finally {
    isLoadingClasses.value = false
  }
}

const loadAllStudents = async () => {
  if (classes.value.length === 0) {
    allStudents.value = []
    return
  }

  try {
    const allStudentsList = []
    
    // Collect students from all classes
    for (const classItem of classes.value) {
      if (classItem.students && classItem.students.length > 0) {
        classItem.students.forEach(student => {
          // Add class information to student data
          const studentWithClass = {
            ...student,
            className: classItem.name,
            classCode: classItem.code,
            classId: classItem.id
          }
          allStudentsList.push(studentWithClass)
        })
      }
    }
    
    allStudents.value = allStudentsList
    
    // Load goals for all students
    await loadStudentGoals()
    await loadClassGoals()
    
    // Load recent activity
    await loadRecentActivity()
  } catch (error) {
    // console.error('Error loading all students:', error)
  }
}

const loadRecentActivity = async () => {
  if (!currentUser.value?.uid) return
  
  try {
    isLoadingRecentActivity.value = true
    
    
    // Use the new unified practices collection
    const { getTeacherPractices } = await import('../lib/auth.js')
    const result = await getTeacherPractices(currentUser.value.uid)
    
    
    if (result.success) {
      // Filter out completed practices or show them separately
      const activePractices = result.practices.filter(practice => !practice.isComplete)
      const completedPractices = result.practices.filter(practice => practice.isComplete)
      
      // Show active practices first, then completed ones
      recentActivity.value = [...activePractices, ...completedPractices].slice(0, 20) // Limit to 20 items

    } else {
      console.error('❌ Failed to load recent activity:', result.error)
      recentActivity.value = []
    }
    
  } catch (error) {
    console.error('💥 Error loading recent activity:', error)
    recentActivity.value = []
  } finally {
    isLoadingRecentActivity.value = false
  }
}

const loadStudentGoals = async () => {
  try {
    const { getTeacherPracticeGoals } = await import('../lib/auth.js')
    const result = await getTeacherPracticeGoals(currentUser.value.uid)
    
    if (result.success) {
      // Group goals by student ID
      const goalsByStudent = {}
      result.goals.forEach(goal => {
        const studentId = goal.studentId
        if (!goalsByStudent[studentId]) {
          goalsByStudent[studentId] = []
        }
        goalsByStudent[studentId].push(goal)
      })
      
      studentGoals.value = goalsByStudent
    } else {
      studentGoals.value = {}
    }
  } catch (error) {
    console.error('Error loading student goals:', error)
    studentGoals.value = {}
  }
}

const loadClassGoals = async () => {
  try {
    // For now, class goals are not implemented in the current structure
    // They would be stored in /practices/{classCode}/goals
    // For now, set empty object
    classGoals.value = {}
  } catch (error) {
    console.error('Error loading class goals:', error)
    classGoals.value = {}
  }
}

const loadAllAssignments = async () => {
  if (classes.value.length === 0) {
    classAssignments.value = []
    return
  }

  try {
    isLoadingAssignments.value = true
    const allAssignmentsList = []


    // Extract assignments from each class
    for (const classItem of classes.value) {
      try {
        
        // Process class-wide assignments
        if (classItem.assignments && classItem.assignments.length > 0) {
          const classAssignmentsWithContext = classItem.assignments.map(assignment => ({
            ...assignment,
            type: 'class',
            className: classItem.name,
            classCode: classItem.code,
            classId: classItem.id
          }))
          allAssignmentsList.push(...classAssignmentsWithContext)
        }
        
        // Process individual assignments
        if (classItem.individualAssignments && classItem.individualAssignments.length > 0) {
          const individualAssignmentsWithContext = classItem.individualAssignments.map(assignment => ({
            ...assignment,
            type: 'individual',
            className: classItem.name,
            classCode: classItem.code,
            classId: classItem.id
          }))
          allAssignmentsList.push(...individualAssignmentsWithContext)
        }
        
        if (!classItem.assignments?.length && !classItem.individualAssignments?.length) {
        }
      } catch (error) {
      }
    }

    // Remove duplicates (in case an assignment is in multiple classes)
    const uniqueAssignments = allAssignmentsList.filter((assignment, index, self) =>
      index === self.findIndex(a => a.id === assignment.id)
    )

    classAssignments.value = uniqueAssignments
    
    // Update student assignments count
    updateStudentAssignmentsCount()
  } catch (error) {
    console.error('Error loading all assignments:', error)
  } finally {
    isLoadingAssignments.value = false
  }
}

const updateStudentAssignmentsCount = () => {
  const studentAssignmentCounts = {}
  
  // Count assignments per student
  classAssignments.value.forEach(assignment => {
    if (assignment.type === 'individual' && assignment.studentId) {
      // Individual assignment
      if (!studentAssignmentCounts[assignment.studentId]) {
        studentAssignmentCounts[assignment.studentId] = 0
      }
      studentAssignmentCounts[assignment.studentId]++
    } else if (assignment.type === 'class') {
      // Class assignment - count for all students in that class
      const classStudents = allStudents.value.filter(student => 
        student.classCode === assignment.classCode
      )
      classStudents.forEach(student => {
        const studentId = student.studentId || student.id
        if (!studentAssignmentCounts[studentId]) {
          studentAssignmentCounts[studentId] = 0
        }
        studentAssignmentCounts[studentId]++
      })
    }
  })
  
  studentAssignments.value = studentAssignmentCounts
}

const createClass = async () => {
  if (!currentUser.value?.uid) {
    console.error('No current user found')
    return
  }

  try {
    isCreatingClass.value = true
    
    const result = await createTeacherClass(currentUser.value.uid, newClass.value)
    
    if (result.success) {
      // Reset form
      newClass.value = {
        name: '',
        description: '',
        instrument: '',
        level: '',
        schedule: ''
      }
      // Refresh classes and switch to classes & assignments tab
      await loadClasses()
      activeTab.value = 'classes-assignments'
      
      // Show success message
      successMessage.value = `Class "${result.class.name}" created successfully!`
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } else {
      console.error('Failed to create class:', result.error)
      errorMessage.value = result.error || 'Failed to create class'
      showErrorMessage.value = true
      setTimeout(() => {
        showErrorMessage.value = false
      }, 5000)
    }
  } catch (error) {
    console.error('Error creating class:', error)
    errorMessage.value = error.message || 'An error occurred while creating the class'
    showErrorMessage.value = true
    setTimeout(() => {
      showErrorMessage.value = false
    }, 5000)
  } finally {
    isCreatingClass.value = false
  }
}

const onClassCreated = () => {
  loadClasses()
  activeTab.value = 'classes-assignments'
}

const changeTab = (tab) => {
  activeTab.value = tab
}

const selectClass = async (classItem) => {
  selectedClass.value = classItem
  // Load class roster for the selected class
  if (classItem) {
    try {
      await loadClassRoster(classItem.code)
      // Assignments are already loaded from class data in loadAllAssignments
      // No need to load them separately
    } catch (error) {
      console.error('Error loading class data:', error)
      // Fallback: try to get roster from allStudents
      if (allStudents.value.length > 0) {
        classRoster.value = allStudents.value.filter(student => 
          student.classCode === classItem.code
        )
      }
    }
  }
}

const copyClassCode = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    // Show success message
    showSuccessMessage.value = true
    successMessage.value = `Class code "${code}" copied to clipboard!`
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }).catch((error) => {
    console.error('Error copying to clipboard:', error)
    showErrorMessage.value = true
    errorMessage.value = 'Failed to copy class code'
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
  })
}

const copyAssignmentId = (assignmentId) => {
  navigator.clipboard.writeText(assignmentId).then(() => {
    // Show success message
    showSuccessMessage.value = true
    successMessage.value = `Assignment ID "${assignmentId}" copied to clipboard!`
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }).catch((error) => {
    console.error('Error copying to clipboard:', error)
    showErrorMessage.value = true
    errorMessage.value = 'Failed to copy assignment ID'
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
  })
}

const copyStudentId = (studentId) => {
  navigator.clipboard.writeText(studentId).then(() => {
    // Show success message
    showSuccessMessage.value = true
    successMessage.value = `Student ID "${studentId}" copied to clipboard!`
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }).catch((error) => {
    console.error('Error copying to clipboard:', error)
    showErrorMessage.value = true
    errorMessage.value = 'Failed to copy student ID'
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
  })
}

// Email functionality
const showEmailModal = ref(false)
const emailRecipient = ref('')
const emailSubject = ref('')
const emailBody = ref('')
const emailType = ref('') // 'class-invitation', 'individual', 'general'

const sendEmail = (recipient) => {
  emailRecipient.value = recipient
  emailType.value = 'general'
  emailSubject.value = ''
  emailBody.value = ''
  showEmailModal.value = true
}

const sendClassInvitation = (classItem) => {
  emailRecipient.value = ''
  emailType.value = 'class-invitation'
  emailSubject.value = `Join ${classItem.name} - Music Class Invitation`
  emailBody.value = `Hello!

You're invited to join my music class "${classItem.name}" on Practice Buddy!

Class Details:
- Name: ${classItem.name}
- Instrument: ${classItem.instrument ? getInstrumentName(classItem.instrument) : 'Various'}
- Level: ${classItem.level}
- Schedule: ${classItem.schedule || 'TBD'}

To join the class:
1. Go to https://practicebuddy.club
2. Create an account or login. 
- If you're creating a new account, you can login and enter your class code on the login screen.
- If you've already logged in, you can join this class by entering the class code in your dashboard.
4. Here's the class code: ${classItem.code}

I'm excited to work with you!

Best regards,
${currentUser.value?.displayName || 'Your Music Teacher'}`
  showEmailModal.value = true
}

const sendIndividualEmail = (student) => {
  emailRecipient.value = student.email || ''
  emailType.value = 'individual'
  emailSubject.value = ''
  emailBody.value = ''
  showEmailModal.value = true
}

const sendEmailMessage = async () => {
  try {
    // For now, we'll use the browser's mailto functionality
    // In a real app, you'd send this through your backend
    const mailtoLink = `mailto:${emailRecipient.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`
    window.open(mailtoLink, '_blank')
    
    // Close modal
    showEmailModal.value = false
    
    // Show success message
    showSuccessMessage.value = true
    successMessage.value = 'Email opened in your default email client'
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('Error sending email:', error)
    showErrorMessage.value = true
    errorMessage.value = 'Failed to send email'
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
  }
}

const selectClassForAssignments = (classItem) => {
  selectedClassForAssignments.value = classItem
  // TODO: Load class roster and assignments for this class
}

const createNewAssignment = async () => {
  if (!selectedClass.value) {
    console.error('No class selected for assignment creation')
    return
  }

  try {
    isCreatingAssignment.value = true
    
    const { createAssignment } = await import('../lib/auth.js')
    const result = await createAssignment(
      selectedClass.value.code, 
      newAssignment.value,
      newAssignment.value.type || 'class',
      newAssignment.value.studentId || null,
      currentUser.value.uid
    )
    
    if (result.success) {
      // Reset form
      newAssignment.value = {
        type: 'class',
        title: '',
        description: '',
        practiceMinutes: '',
        dueDate: '',
        studentId: ''
      }
      // Refresh classes and assignments data
      await loadClasses()
    } else {
    }
  } catch (error) {
  } finally {
    isCreatingAssignment.value = false
  }
}

const deleteAssignment = async (assignmentId) => {
  // TODO: Implement assignment deletion
}

const editAssignment = (assignment) => {
  // TODO: Implement assignment editing
}

const selectClassForRoster = (classItem) => {
  selectedClassForRoster.value = classItem
  if (classItem) {
    // Load roster for specific class
    loadClassRoster(classItem.code)
  } else {
    // Show all students
    classRoster.value = allStudents.value
  }
}

const loadClassRoster = async (classCode) => {
  try {
    isLoadingRoster.value = true
    const result = await fetchClassRoster(classCode)
    if (result.success) {
      classRoster.value = result.students || []
    } else {
      console.error('Failed to load roster:', result.error)
    }
  } catch (error) {
    console.error('Error loading class roster:', error)
  } finally {
    isLoadingRoster.value = false
  }
}




const viewStudentDetails = (student) => {
  // TODO: Implement navigation to student details page
}

const createIndividualAssignment = (student) => {
  // Pre-fill the assignment form for this student
  newAssignment.value = {
    type: 'individual',
    title: '',
    description: '',
    practiceMinutes: '',
    dueDate: '',
    studentId: student.studentId || student.id
  }
  // Switch to assignments tab
  activeTab.value = 'assignments'
}

onMounted(() => {
  loadClasses()
})
</script>