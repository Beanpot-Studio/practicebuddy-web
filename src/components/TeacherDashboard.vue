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

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-3xl p-2 mb-8 shadow-lg">
        <div class="flex space-x-2">
          <button
            @click="changeTab('overview')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'overview' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            <BarChart3 class="w-4 h-4" />
            Overview
          </button>
          <button
            @click="changeTab('create-class')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'create-class' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            <Plus class="w-4 h-4" />
            Create Class
          </button>
          <button
            @click="changeTab('classes-assignments')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'classes-assignments' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            <GraduationCap class="w-4 h-4" />
            Classes & Assignments
          </button>
          <button
            @click="changeTab('goals')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'goals' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
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
          :all-students="allStudents"
          :student-assignments="studentAssignments"
          :recent-activity="recentActivity"
          :selected-class-for-roster="selectedClassForRoster"
          :class-roster="classRoster"
          :is-loading-roster="isLoadingRoster"
          :student-goals="studentGoals"
          :class-goals="classGoals"
          :is-loading-recent-activity="isLoadingRecentActivity"
          :give-sticker="giveSticker"
          :add-comment="addComment"
          :mark-as-complete="markAsComplete"
          @load-classes="loadClasses"
          @select-class-for-roster="selectClassForRoster"
          @select-student="selectStudent"
        />
        <CreateClassTab
          v-if="activeTab === 'create-class'"
          :current-user="currentUser"
          :new-class="newClass"
          :is-creating-class="isCreatingClass"
          @class-created="onClassCreated"
          @create-class="createClass"
          @update:new-class="newClass = $event"
        />
        <ClassesAndAssignmentsTab
          v-if="activeTab === 'classes-assignments'"
          :classes="classes"
          :selected-class="selectedClass"
          :is-loading="isLoadingClasses"
          :error="classesError"
          :class-roster="classRoster"
          :is-loading-roster="isLoadingRoster"
          :class-assignments="classAssignments"
          :new-assignment="newAssignment"
          :is-creating-assignment="isCreatingAssignment"
          @load-classes="loadClasses"
          @change-tab="changeTab"
          @select-class="selectClass"
          @copy-class-code="copyClassCode"
          @send-email="sendEmail"
          @create-new-assignment="createNewAssignment"
          @delete-assignment="deleteAssignment"
          @view-student-details="viewStudentDetails"
          @create-individual-assignment="createIndividualAssignment"
        />
        <GoalsTab
          v-if="activeTab === 'goals'"
          :current-user="currentUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import OverviewTab from './TeacherDashboard/OverviewTab.vue'
import CreateClassTab from './TeacherDashboard/CreateClassTab.vue'
import ClassesAndAssignmentsTab from './TeacherDashboard/ClassesAndAssignmentsTab.vue'
import GoalsTab from './TeacherDashboard/GoalsTab.vue'
import { 
  GraduationCap, 
  BarChart3, 
  Plus, 
  BookOpen, 
  Target 
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
      console.log('Sticker given successfully')
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
      console.log('Comment added successfully')
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
      console.log('Practice marked as complete successfully')
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

// Debug: Watch for tab changes
watch(activeTab, (newTab) => {
  // console.log('Active tab changed to:', newTab)
})

const loadClasses = async () => {
  if (!currentUser.value?.uid) {
    // console.error('No current user found')
    return
  }

  try {
    isLoadingClasses.value = true
    classesError.value = null
    
    // console.log('Loading classes for teacher:', currentUser.value.uid)
    const result = await fetchTeacherClasses(currentUser.value.uid)
    
    if (result.success) {
      classes.value = result.classes || []
      // console.log('Classes loaded successfully:', classes.value)
      
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
    
    console.log('🎯 Loading practices for teacher:', currentUser.value.uid)
    
    // Use the new unified practices collection
    const { getTeacherPractices } = await import('../lib/auth.js')
    const result = await getTeacherPractices(currentUser.value.uid)
    
    console.log('📊 Teacher practices result:', result)
    
    if (result.success) {
      // Filter out completed practices or show them separately
      const activePractices = result.practices.filter(practice => !practice.isComplete)
      const completedPractices = result.practices.filter(practice => practice.isComplete)
      
      // Show active practices first, then completed ones
      recentActivity.value = [...activePractices, ...completedPractices].slice(0, 20) // Limit to 20 items
      console.log('✅ Recent activity loaded:', recentActivity.value.length, 'items')
      console.log('📝 Active practices:', activePractices.length)
      console.log('✅ Completed practices:', completedPractices.length)
      if (recentActivity.value.length > 0) {
        console.log('📝 Sample practice data:', recentActivity.value[0])
      }
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
    // This would fetch goals from Firebase
    // For now, create mock data
    const mockStudentGoals = {}
    allStudents.value.forEach(student => {
      const studentId = student.studentId || student.id
      mockStudentGoals[studentId] = [
        {
          id: `goal_${studentId}_1`,
          title: 'Practice 30 minutes daily',
          type: 'individual',
          target: 30,
          progress: Math.floor(Math.random() * 30),
          status: 'active'
        },
        {
          id: `goal_${studentId}_2`,
          title: 'Complete 5 assignments this week',
          type: 'individual',
          target: 5,
          progress: Math.floor(Math.random() * 5),
          status: 'active'
        }
      ]
    })
    studentGoals.value = mockStudentGoals
  } catch (error) {
    console.error('Error loading student goals:', error)
  }
}

const loadClassGoals = async () => {
  try {
    // This would fetch goals from Firebase
    // For now, create mock data
    const mockClassGoals = {}
    classes.value.forEach(classItem => {
      mockClassGoals[classItem.id] = [
        {
          id: `class_goal_${classItem.id}_1`,
          title: 'Class performance goal',
          type: 'class',
          target: 100,
          progress: Math.floor(Math.random() * 100),
          status: 'active'
        },
        {
          id: `class_goal_${classItem.id}_2`,
          title: 'Group practice sessions',
          type: 'class',
          target: 10,
          progress: Math.floor(Math.random() * 10),
          status: 'active'
        }
      ]
    })
    classGoals.value = mockClassGoals
  } catch (error) {
    console.error('Error loading class goals:', error)
  }
}

const loadAllAssignments = async () => {
  if (classes.value.length === 0) {
    classAssignments.value = []
    console.log('No classes found, setting classAssignments to empty array')
    return
  }

  try {
    isLoadingAssignments.value = true
    const allAssignmentsList = []

    console.log('Extracting assignments from', classes.value.length, 'classes')

    // Extract assignments from each class
    for (const classItem of classes.value) {
      try {
        console.log('Processing assignments for class:', classItem.code, classItem.name)
        console.log('Class assignments:', classItem.assignments)
        console.log('Individual assignments:', classItem.individualAssignments)
        
        // Process class-wide assignments
        if (classItem.assignments && classItem.assignments.length > 0) {
          console.log('Found', classItem.assignments.length, 'class assignments in class', classItem.name)
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
          console.log('Found', classItem.individualAssignments.length, 'individual assignments in class', classItem.name)
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
          console.log('No assignments found in class', classItem.name)
        }
      } catch (error) {
        console.error(`Error processing assignments for class ${classItem.code}:`, error)
      }
    }

    // Remove duplicates (in case an assignment is in multiple classes)
    const uniqueAssignments = allAssignmentsList.filter((assignment, index, self) =>
      index === self.findIndex(a => a.id === assignment.id)
    )

    classAssignments.value = uniqueAssignments
    console.log('Total unique assignments loaded:', classAssignments.value.length)
    console.log('All assignments:', classAssignments.value)
    
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
  // console.log('Updated student assignments count:', studentAssignments.value)
}

const createClass = async () => {
  if (!currentUser.value?.uid) {
    // console.error('No current user found')
    return
  }

  try {
    isCreatingClass.value = true
    // console.log('Creating class:', newClass.value)
    
    const result = await createTeacherClass(currentUser.value.uid, newClass.value)
    
    if (result.success) {
      // console.log('Class created successfully:', result.class)
      // Reset form
      newClass.value = {
        name: '',
        description: '',
        instrument: '',
        level: '',
        schedule: ''
      }
      // Refresh classes and switch to manage tab
      await loadClasses()
      activeTab.value = 'manage-classes'
    } else {
      // console.error('Failed to create class:', result.error)
      // You could add error handling here
    }
  } catch (error) {
    // console.error('Error creating class:', error)
  } finally {
    isCreatingClass.value = false
  }
}

const onClassCreated = () => {
  loadClasses()
  activeTab.value = 'manage-classes'
}

const changeTab = (tab) => {
  // console.log('Changing tab to:', tab)
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
  navigator.clipboard.writeText(code)
  // You could add a toast notification here
}

const sendEmail = (classItem) => {
  // Implement email functionality
  // console.log('Send email to class:', classItem)
}

const selectClassForAssignments = (classItem) => {
  selectedClassForAssignments.value = classItem
  // TODO: Load class roster and assignments for this class
  // console.log('Selected class for assignments:', classItem)
}

const createNewAssignment = async () => {
  // TODO: Implement assignment creation
  // console.log('Creating new assignment:', newAssignment.value)
}

const deleteAssignment = async (assignmentId) => {
  // TODO: Implement assignment deletion
  // console.log('Deleting assignment:', assignmentId)
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

// loadClassAssignments function removed - assignments are now extracted from class data

const selectStudent = (student) => {
  // TODO: Implement student selection
  // console.log('Selected student:', student)
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
    studentId: student.studentId
  }
}

onMounted(() => {
  loadClasses()
})
</script>