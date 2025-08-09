<template>
  <div class="animate-fadeIn">
    <!-- Roster Header -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-orange-600 bg-gradient-to-br from-orange-400 to-orange-500 relative">
          <Users class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl text-gray-800 font-bold">Student Roster</h3>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading student roster...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Roster</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="$emit('loadClasses')"
          class="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="allStudents.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No Students Yet</h3>
        <p class="text-gray-600 mb-4">Students will appear here once they join your classes!</p>
      </div>
      
      <!-- Student Roster Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Student Name</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Classes</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Join Date</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Assignments</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Goals</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="student in displayStudents" 
              :key="student.studentId || student.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <!-- Student Name -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {{ getInitials(student.studentName || student.name) }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-800">{{ student.studentName || student.name }}</div>
                  </div>
                </div>
              </td>
              <!-- Classes -->
              <td class="py-4 px-6">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="className in getStudentClasses(student.studentId || student.id)" 
                    :key="className"
                    class="px-2 py-1 bg-primary-100 text-blue-700 rounded-lg text-xs font-semibold"
                  >
                    {{ className }}
                  </span>
                </div>
              </td>
              
              <!-- Join Date -->
              <td class="py-4 px-6 text-sm text-gray-600">
                {{ formatJoinDate(student.joinedAt) }}
              </td>
              
                            <!-- Assignments -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <div class="text-center">
                    <div class="text-lg font-bold text-green-600">{{ getStudentAssignmentCount(student.studentId || student.id) }}</div>
                    <div class="text-xs text-gray-500">Total</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-blue-600">{{ getStudentAssignmentProgress(student.studentId || student.id) }}%</div>
                    <div class="text-xs text-gray-500">Progress</div>
                  </div>
                </div>
              </td>
              
              <!-- Goals -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <div class="text-center">
                    <div class="text-lg font-bold text-purple-600">{{ getStudentGoalsCount(student.studentId || student.id) }}</div>
                    <div class="text-xs text-gray-500">Active</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-orange-600">{{ getStudentGoalsProgress(student.studentId || student.id) }}%</div>
                    <div class="text-xs text-gray-500">Progress</div>
                  </div>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="py-4 px-6">
                <div class="flex flex-col gap-2">
                  <!-- Primary Actions Row -->
                  <div class="flex items-center gap-2">
                    <button 
                      @click="$emit('viewStudentDetails', student)"
                      class="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors flex items-center gap-2"
                      title="View student details"
                    >
                      <User class="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button 
                      @click="$emit('createIndividualAssignment', student)"
                      class="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                      title="Create individual assignment"
                    >
                      <BookOpen class="w-4 h-4" />
                      <span>Assignment</span>
                    </button>
                  </div>
                  <!-- Secondary Actions Row -->
                  <div class="flex items-center gap-2">
                    <button 
                      @click="$emit('sendEmail', student)"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center gap-2"
                      title="Send email to student"
                    >
                      <Mail class="w-4 h-4" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Users, 
  AlertCircle, 
  Mail,
  Copy,
  User,
  BookOpen
} from 'lucide-vue-next'

const props = defineProps({
  classes: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  classAssignments: {
    type: Array,
    default: () => []
  },
  studentGoals: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['loadClasses', 'viewStudentDetails', 'createIndividualAssignment', 'sendEmail', 'copyStudentId'])

// Computed properties
const allStudents = computed(() => {
  const students = new Map()
  
  props.classes.forEach(classItem => {
    if (classItem.students) {
      classItem.students.forEach(student => {
        const studentId = student.studentId || student.id
        if (!students.has(studentId)) {
          students.set(studentId, {
            ...student,
            classes: []
          })
        }
        students.get(studentId).classes.push(classItem.name)
      })
    }
  })
  
  return Array.from(students.values())
})

const displayStudents = computed(() => {
  return allStudents.value.sort((a, b) => {
    const nameA = (a.studentName || a.name || '').toLowerCase()
    const nameB = (b.studentName || b.name || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })
})

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStudentClasses = (studentId) => {
  const student = allStudents.value.find(s => (s.studentId || s.id) === studentId)
  return student?.classes || []
}

const formatJoinDate = (date) => {
  if (!date) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

const getStudentAssignmentCount = (studentId) => {
  let totalAssignments = 0
  
  // Count class assignments for classes this student is in
  props.classes.forEach(classItem => {
    if (classItem.students && classItem.students.some(s => (s.studentId || s.id) === studentId)) {
      // Count class-wide assignments
      if (classItem.assignments && Array.isArray(classItem.assignments)) {
        totalAssignments += classItem.assignments.length
      }
      
      // Count individual assignments for this student
      if (classItem.individualAssignments && classItem.individualAssignments[studentId]) {
        totalAssignments += classItem.individualAssignments[studentId].length
      }
    }
  })
  
  return totalAssignments
}

const getStudentAssignmentProgress = (studentId) => {
  let totalAssignments = 0
  let completedAssignments = 0
  
  // Count assignments and completion for classes this student is in
  props.classes.forEach(classItem => {
    if (classItem.students && classItem.students.some(s => (s.studentId || s.id) === studentId)) {
      // Count class-wide assignments
      if (classItem.assignments && Array.isArray(classItem.assignments)) {
        totalAssignments += classItem.assignments.length
        completedAssignments += classItem.assignments.filter(assignment => assignment.isComplete).length
      }
      
      // Count individual assignments for this student
      if (classItem.individualAssignments && classItem.individualAssignments[studentId]) {
        const individualAssignments = classItem.individualAssignments[studentId]
        totalAssignments += individualAssignments.length
        completedAssignments += individualAssignments.filter(assignment => assignment.isComplete).length
      }
    }
  })
  
  if (totalAssignments === 0) return 0
  return Math.round((completedAssignments / totalAssignments) * 100)
}

const getStudentGoalsCount = (studentId) => {
  if (!props.studentGoals || !props.studentGoals[studentId]) return 0
  
  const studentGoals = props.studentGoals[studentId]
  if (!Array.isArray(studentGoals)) return 0
  
  // Count only active goals (not completed or cancelled)
  return studentGoals.filter(goal => goal.status !== 'completed' && goal.status !== 'cancelled').length
}

const getStudentGoalsProgress = (studentId) => {
  if (!props.studentGoals || !props.studentGoals[studentId]) return 0
  
  const studentGoals = props.studentGoals[studentId]
  if (!Array.isArray(studentGoals)) return 0
  
  const activeGoals = studentGoals.filter(goal => goal.status !== 'completed' && goal.status !== 'cancelled')
  if (activeGoals.length === 0) return 0
  
  // Calculate average progress across all active goals using the same logic as elsewhere in the app
  const totalProgress = activeGoals.reduce((sum, goal) => {
    const completedSessions = goal.completedSessions || 0
    const targetPracticeSessions = goal.targetPracticeSessions || 1
    const percentage = Math.round((completedSessions / targetPracticeSessions) * 100)
    return sum + percentage
  }, 0)
  
  return Math.round(totalProgress / activeGoals.length)
}
</script> 