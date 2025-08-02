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
            @click="changeTab('manage-classes')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'manage-classes' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            <GraduationCap class="w-4 h-4" />
            Manage Classes
          </button>
          <button
            @click="changeTab('assignments')"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'assignments' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            <BookOpen class="w-4 h-4" />
            Assignments
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
        />
        <ManageClassesTab
          v-if="activeTab === 'manage-classes'"
          :classes="classes"
          :selected-class="selectedClass"
          :is-loading="isLoadingClasses"
          :error="classesError"
          @load-classes="loadClasses"
          @change-tab="changeTab"
          @select-class="selectClass"
          @copy-class-code="copyClassCode"
          @send-email="sendEmail"
        />
        <AssignmentsTab
          v-if="activeTab === 'assignments'"
          :current-user="currentUser"
          :classes="classes"
          :is-loading="isLoadingClasses"
          :error="classesError"
          :selected-class-for-assignments="selectedClassForAssignments"
          :new-assignment="newAssignment"
          :class-roster="classRoster"
          :class-assignments="classAssignments"
          :is-loading-assignments="isLoadingAssignments"
          :is-creating-assignment="isCreatingAssignment"
          @load-classes="loadClasses"
          @change-tab="changeTab"
          @select-class-for-assignments="selectClassForAssignments"
          @create-new-assignment="createNewAssignment"
          @delete-assignment="deleteAssignment"
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
import ManageClassesTab from './TeacherDashboard/ManageClassesTab.vue'
import AssignmentsTab from './TeacherDashboard/AssignmentsTab.vue'
import GoalsTab from './TeacherDashboard/GoalsTab.vue'
import { 
  GraduationCap, 
  BarChart3, 
  Plus, 
  BookOpen, 
  Target 
} from 'lucide-vue-next'

const { currentUser, fetchTeacherClasses, createTeacherClass, fetchClassRoster, fetchClassAssignments } = useAuth()

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
  console.log('Active tab changed to:', newTab)
})

const loadClasses = async () => {
  if (!currentUser.value?.uid) {
    console.error('No current user found')
    return
  }

  try {
    isLoadingClasses.value = true
    classesError.value = null
    
    console.log('Loading classes for teacher:', currentUser.value.uid)
    const result = await fetchTeacherClasses(currentUser.value.uid)
    
    if (result.success) {
      classes.value = result.classes || []
      console.log('Classes loaded successfully:', classes.value)
      
      // Load all students from all classes
      await loadAllStudents()
      
      // Load assignments for all classes
      await loadAllAssignments()
    } else {
      console.error('Failed to load classes:', result.error)
      classesError.value = result.error || 'Failed to load classes'
    }
  } catch (error) {
    console.error('Error loading classes:', error)
    classesError.value = error.message || 'Error loading classes'
  } finally {
    isLoadingClasses.value = false
  }
}

const loadAllStudents = async () => {
  if (classes.value.length === 0) {
    allStudents.value = []
    console.log('No classes found, setting allStudents to empty array')
    return
  }

  try {
    isLoadingRoster.value = true
    const allStudentsList = []

    console.log('Loading students from', classes.value.length, 'classes')

    // Load students from each class
    for (const classItem of classes.value) {
      try {
        console.log('Loading roster for class:', classItem.code, classItem.name)
        const rosterResult = await fetchClassRoster(classItem.code)
        if (rosterResult.success && rosterResult.students) {
          console.log('Found', rosterResult.students.length, 'students in class', classItem.name)
          // Add class info to each student
          const studentsWithClass = rosterResult.students.map(student => ({
            ...student,
            className: classItem.name,
            classCode: classItem.code
          }))
          allStudentsList.push(...studentsWithClass)
        } else {
          console.log('No students found in class', classItem.name, 'or error:', rosterResult.error)
        }
      } catch (error) {
        console.error(`Error loading roster for class ${classItem.code}:`, error)
      }
    }

    // Remove duplicates (in case a student is in multiple classes)
    const uniqueStudents = allStudentsList.filter((student, index, self) =>
      index === self.findIndex(s => s.studentId === student.studentId)
    )

    allStudents.value = uniqueStudents
    console.log('Total unique students loaded:', allStudents.value.length)
    console.log('All students:', allStudents.value)
    
    // Update student assignments count if assignments are already loaded
    if (classAssignments.value.length > 0) {
      updateStudentAssignmentsCount()
    }
  } catch (error) {
    console.error('Error loading all students:', error)
  } finally {
    isLoadingRoster.value = false
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

    console.log('Loading assignments from', classes.value.length, 'classes')

    // Load assignments from each class
    for (const classItem of classes.value) {
      try {
        console.log('Loading assignments for class:', classItem.code, classItem.name)
        const assignmentsResult = await fetchClassAssignments(classItem.code)
        if (assignmentsResult.success && assignmentsResult.assignments) {
          console.log('Found', assignmentsResult.assignments.length, 'assignments in class', classItem.name)
          // Add class info to each assignment
          const assignmentsWithClass = assignmentsResult.assignments.map(assignment => ({
            ...assignment,
            className: classItem.name,
            classCode: classItem.code
          }))
          allAssignmentsList.push(...assignmentsWithClass)
        } else {
          console.log('No assignments found in class', classItem.name, 'or error:', assignmentsResult.error)
        }
      } catch (error) {
        console.error(`Error loading assignments for class ${classItem.code}:`, error)
      }
    }

    // Remove duplicates (in case an assignment is in multiple classes)
    const uniqueAssignments = allAssignmentsList.filter((assignment, index, self) =>
      index === self.findIndex(a => a.assignmentId === assignment.assignmentId)
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
    if (assignment.studentId) {
      // Individual assignment
      if (!studentAssignmentCounts[assignment.studentId]) {
        studentAssignmentCounts[assignment.studentId] = 0
      }
      studentAssignmentCounts[assignment.studentId]++
    } else {
      // Class assignment - count for all students in that class
      const classStudents = allStudents.value.filter(student => 
        student.classCode === assignment.classCode
      )
      classStudents.forEach(student => {
        if (!studentAssignmentCounts[student.studentId]) {
          studentAssignmentCounts[student.studentId] = 0
        }
        studentAssignmentCounts[student.studentId]++
      })
    }
  })
  
  studentAssignments.value = studentAssignmentCounts
  console.log('Updated student assignments count:', studentAssignments.value)
}

const createClass = async () => {
  if (!currentUser.value?.uid) {
    console.error('No current user found')
    return
  }

  try {
    isCreatingClass.value = true
    console.log('Creating class:', newClass.value)
    
    const result = await createTeacherClass(currentUser.value.uid, newClass.value)
    
    if (result.success) {
      console.log('Class created successfully:', result.class)
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
      console.error('Failed to create class:', result.error)
      // You could add error handling here
    }
  } catch (error) {
    console.error('Error creating class:', error)
  } finally {
    isCreatingClass.value = false
  }
}

const onClassCreated = () => {
  loadClasses()
  activeTab.value = 'manage-classes'
}

const changeTab = (tab) => {
  console.log('Changing tab to:', tab)
  activeTab.value = tab
}

const selectClass = (classItem) => {
  selectedClass.value = classItem
}

const copyClassCode = (code) => {
  navigator.clipboard.writeText(code)
  // You could add a toast notification here
}

const sendEmail = (classItem) => {
  // Implement email functionality
  console.log('Send email to class:', classItem)
}

const selectClassForAssignments = (classItem) => {
  selectedClassForAssignments.value = classItem
  // TODO: Load class roster and assignments for this class
  console.log('Selected class for assignments:', classItem)
}

const createNewAssignment = async () => {
  // TODO: Implement assignment creation
  console.log('Creating new assignment:', newAssignment.value)
}

const deleteAssignment = async (assignmentId) => {
  // TODO: Implement assignment deletion
  console.log('Deleting assignment:', assignmentId)
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
    }
  } catch (error) {
    console.error('Error loading class roster:', error)
  } finally {
    isLoadingRoster.value = false
  }
}

const selectStudent = (student) => {
  // TODO: Implement student selection
  console.log('Selected student:', student)
}

onMounted(() => {
  console.log('TeacherDashboard mounted, currentUser:', currentUser.value)
  loadClasses()
})
</script>