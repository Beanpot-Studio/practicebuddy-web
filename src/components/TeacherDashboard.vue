<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <div class="text-center mb-10 text-white flex flex-col items-center gap-3">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
          👩‍🏫
        </div>
        <h2 class="text-3xl font-bold text-musical-graphite">Teacher Hub</h2>
        <p class="text-lg opacity-95 font-medium text-musical-graphite">Help your students develop amazing musical skills!</p>
        <p class="text-sm opacity-80 italic text-musical-graphite">Teaching with: {{ teacherEmail }}</p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex justify-center mb-8">
        <div class="bg-gray-100 rounded-xl p-1 flex shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 border-gray-200">
          <button 
            @click="activeTab = 'overview'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'overview' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            📊 Overview
          </button>
          <button 
            @click="activeTab = 'create-class'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'create-class' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            ➕ Create Class
          </button>
          <button 
            @click="activeTab = 'manage-classes'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'manage-classes' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            🎓 Manage Classes
          </button>
          <button 
            @click="activeTab = 'assignments'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'assignments' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            📚 Assignments
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <OverviewTab 
        v-if="activeTab === 'overview'"
        :all-students="allStudents"
        :classes="classes"
        :student-assignments="studentAssignments"
        :recent-activity="recentActivity"
        :selected-class-for-roster="selectedClassForRoster"
        :class-roster="classRoster"
        :is-loading-roster="isLoadingRoster"
        @change-tab="activeTab = $event"
        @select-student="selectStudent"
        @select-class-for-roster="selectClassForRoster"
      />

      <CreateClassTab 
        v-if="activeTab === 'create-class'"
        :new-class="newClass"
        :is-creating-class="isCreatingClass"
        @create-class="createNewClass"
      />

      <ManageClassesTab 
        v-if="activeTab === 'manage-classes'"
        :classes="classes"
        :selected-class="selectedClass"
        @load-classes="loadClasses"
        @change-tab="activeTab = $event"
        @select-class="selectedClass = $event"
        @copy-class-code="copyClassCode"
        @send-email="sendEmail"
      />

      <AssignmentsTab 
        v-if="activeTab === 'assignments'"
        :classes="classes"
        :selected-class-for-assignments="selectedClassForAssignments"
        :new-assignment="newAssignment"
        :class-roster="classRoster"
        :class-assignments="classAssignments"
        :is-loading-assignments="isLoadingAssignments"
        :is-creating-assignment="isCreatingAssignment"
        @load-classes="loadClasses"
        @change-tab="activeTab = $event"
        @select-class-for-assignments="selectClassForAssignments"
        @create-new-assignment="createNewAssignment"
        @delete-assignment="deleteAssignment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import OverviewTab from './TeacherDashboard/OverviewTab.vue'
import CreateClassTab from './TeacherDashboard/CreateClassTab.vue'
import ManageClassesTab from './TeacherDashboard/ManageClassesTab.vue'
import AssignmentsTab from './TeacherDashboard/AssignmentsTab.vue'

const teacherEmail = computed(() => currentUser.value?.email || 'teacher@school.edu')

// Authentication
const { 
  createTeacherClass, 
  fetchTeacherClasses, 
  fetchClassRoster, 
  createClassAssignment, 
  fetchClassAssignments, 
  deleteClassAssignment, 
  currentUser 
} = useAuth()

const activeTab = ref('overview')

// Reactive data
const classes = ref([])
const allStudents = ref([])
const studentAssignments = ref({})
const recentActivity = ref([])
const selectedClass = ref(null)
const selectedClassForRoster = ref(null)
const selectedClassForAssignments = ref(null)
const classRoster = ref([])
const classAssignments = ref([])
const isLoadingRoster = ref(false)
const isLoadingAssignments = ref(false)
const isCreatingClass = ref(false)
const isCreatingAssignment = ref(false)

const newClass = ref({
  name: '',
  description: '',
  instrument: '',
  level: '',
  schedule: ''
})

const newAssignment = ref({
  type: 'class',
  studentId: '',
  title: '',
  description: '',
  dueDate: '',
  practiceMinutes: ''
})

// Methods
const loadClasses = async () => {
  try {
    if (!currentUser.value?.uid) {
      console.log('No current user, skipping class load')
      return
    }
    const result = await fetchTeacherClasses(currentUser.value.uid)
    if (result.success) {
      classes.value = result.classes
      await loadAllStudents()
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const loadAllStudents = async () => {
  const allStudentsList = []
  for (const classItem of classes.value) {
    try {
      const result = await fetchClassRoster(classItem.id)
      if (result.success) {
        const studentsWithClass = result.students.map(student => ({
          ...student,
          classCode: classItem.id,
          className: classItem.name
        }))
        allStudentsList.push(...studentsWithClass)
      }
    } catch (error) {
      console.error(`Error loading students for class ${classItem.id}:`, error)
    }
  }
  allStudents.value = allStudentsList
  await loadStudentAssignments()
}

const loadStudentAssignments = async () => {
  const assignments = {}
  for (const student of allStudents.value) {
    if (student.classCode) {
      try {
        const result = await fetchClassAssignments(student.classCode, student.studentId)
        if (result.success) {
          assignments[student.studentId] = result.assignments.length
        } else {
          assignments[student.studentId] = 0
        }
      } catch (error) {
        console.error(`Error loading assignments for student ${student.studentId}:`, error)
        assignments[student.studentId] = 0
      }
    } else {
      assignments[student.studentId] = 0
    }
  }
  studentAssignments.value = assignments
  console.log('Loaded student assignments:', assignments)
}

const selectClassForRoster = async (classItem) => {
  selectedClassForRoster.value = classItem
  isLoadingRoster.value = true
  try {
    const result = await fetchClassRoster(classItem.id)
    if (result.success) {
      classRoster.value = result.students
    }
  } catch (error) {
    console.error('Error loading class roster:', error)
  } finally {
    isLoadingRoster.value = false
  }
}

const selectClassForAssignments = async (classItem) => {
  selectedClassForAssignments.value = classItem
  isLoadingAssignments.value = true
  try {
    const result = await fetchClassAssignments(classItem.id)
    if (result.success) {
      classAssignments.value = result.assignments
    }
    // Also load roster for individual assignment creation
    const rosterResult = await fetchClassRoster(classItem.id)
    if (rosterResult.success) {
      classRoster.value = rosterResult.students
    }
  } catch (error) {
    console.error('Error loading class assignments:', error)
  } finally {
    isLoadingAssignments.value = false
  }
}

const createNewClass = async () => {
  if (!newClass.value.name || !newClass.value.instrument || !newClass.value.level) {
    alert('Please fill in all required fields.')
    return
  }

  if (!currentUser.value?.uid) {
    alert('Please log in to create a class.')
    return
  }

  isCreatingClass.value = true
  try {
    const result = await createTeacherClass(currentUser.value.uid, newClass.value)
    if (result.success) {
      alert(`✅ Class "${result.class.name}" created successfully!`)
      // Reset form
      newClass.value = {
        name: '',
        description: '',
        instrument: '',
        level: '',
        schedule: ''
      }
      // Reload classes
      await loadClasses()
      activeTab.value = 'overview'
    } else {
      alert(`Error creating class: ${result.error}`)
    }
  } catch (error) {
    console.error('Class creation error:', error)
    alert('Error creating class. Please try again.')
  } finally {
    isCreatingClass.value = false
  }
}

const createNewAssignment = async () => {
  if (!selectedClassForAssignments.value?.id) {
    alert('Please select a class first.')
    return
  }

  if (!newAssignment.value.title || !newAssignment.value.dueDate) {
    alert('Please fill in all required fields.')
    return
  }

  if (newAssignment.value.type === 'individual' && !newAssignment.value.studentId) {
    alert('Please select a student for individual assignment.')
    return
  }

  isCreatingAssignment.value = true
  try {
    const assignmentData = {
      title: newAssignment.value.title,
      description: newAssignment.value.description,
      dueDate: newAssignment.value.dueDate,
      practiceMinutes: newAssignment.value.practiceMinutes ? parseInt(newAssignment.value.practiceMinutes) : null
    }

    const result = await createClassAssignment(
      selectedClassForAssignments.value.id, 
      assignmentData, 
      newAssignment.value.type, 
      newAssignment.value.studentId || null,
      currentUser.value?.uid
    )

    if (result.success) {
      classAssignments.value.push(result.assignment)
      await loadStudentAssignments()
      
      const assignmentType = result.assignment.type === 'class' ? 'Class' : 'Individual'
      alert(`✅ ${assignmentType} assignment "${result.assignment.title}" created successfully!`)
      
      // Reset form
      newAssignment.value = {
        type: 'class',
        studentId: '',
        title: '',
        description: '',
        dueDate: '',
        practiceMinutes: ''
      }
    } else {
      if (result.error === 'Class not found') {
        alert('❌ Error: Class not found. Please make sure you have created a class first and try again.')
      } else {
        alert(`Error creating assignment: ${result.error}`)
      }
    }
  } catch (error) {
    console.error('Assignment creation error:', error)
    alert('Error creating assignment. Please try again.')
  } finally {
    isCreatingAssignment.value = false
  }
}

const deleteAssignment = async (assignmentId) => {
  if (!selectedClassForAssignments.value?.id) {
    alert('Please select a class first.')
    return
  }

  if (!assignmentId) {
    alert('Please select an assignment to delete.')
    return
  }

  if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
    return
  }

  try {
    const result = await deleteClassAssignment(selectedClassForAssignments.value.id, assignmentId)
    
    if (result.success) {
      const assignmentIndex = classAssignments.value.findIndex(assignment => assignment.id === assignmentId)
      if (assignmentIndex !== -1) {
        classAssignments.value.splice(assignmentIndex, 1)
      }
      await loadStudentAssignments()
      alert('✅ Assignment deleted successfully!')
    } else {
      alert(`Error deleting assignment: ${result.error}`)
    }
  } catch (error) {
    console.error('Assignment deletion error:', error)
    alert('Error deleting assignment. Please try again.')
  }
}

const selectStudent = (student) => {
  console.log('Selected student:', student)
  // Handle student selection if needed
}

const copyClassCode = (classCode) => {
  navigator.clipboard.writeText(classCode).then(() => {
    alert('✅ Class code copied to clipboard!')
  }).catch(() => {
    alert('❌ Failed to copy class code. Please copy manually: ' + classCode)
  })
}

const sendEmail = (classItem) => {
  alert('Email functionality not implemented yet.')
}

// Load classes when component mounts
onMounted(async () => {
  await loadClasses()
})

// Watch for current user changes and reload classes
watch(currentUser, (newUser) => {
  console.log('Current user changed:', newUser)
  if (newUser && newUser.role === 'teacher') {
    console.log('Loading classes for teacher:', newUser.uid)
    loadClasses()
  }
}, { immediate: true })
</script>