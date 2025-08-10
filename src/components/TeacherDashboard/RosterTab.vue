<template>
  <div class="animate-fadeIn">
    <!-- Roster Header -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-orange-600 bg-gradient-to-br from-orange-400 to-orange-500 relative">
            <Users class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl text-gray-800 font-bold">Student Roster</h3>
        </div>
        
        <!-- Class Filter and Sort Controls -->
        <div class="flex items-center gap-3">
          <!-- Class Filter -->
          <div class="flex items-center gap-2">
            <select 
              v-model="selectedClassFilter"
              @change="updateFilteredStudents"
              class="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <option value="">All Classes</option>
              <option 
                v-for="classItem in classes" 
                :key="classItem.id" 
                :value="classItem.id"
              >
                {{ classItem.name }}
              </option>
            </select>
          </div>
          
          <!-- Sort Options -->
          <div class="flex items-center gap-2">
            <select 
              v-model="sortBy"
              @change="updateFilteredStudents"
              class="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <option value="name">Name</option>
              <option value="class">Class</option>
              <option value="joinDate">Join Date</option>
              <option value="assignments">Assignments</option>
              <option value="goals">Goals</option>
            </select>
            <button 
              @click="toggleSortOrder"
              class="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 shadow-sm"
              :title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
            >
              <ArrowUpDown class="w-4 h-4" />
            </button>
          </div>
        </div>
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
      <div v-else-if="filteredStudents.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ selectedClassFilter ? 'No Students in Selected Class' : 'No Students Yet' }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ selectedClassFilter ? 'Try selecting a different class or view all students.' : 'Students will appear here once they join your classes!' }}
        </p>
      </div>
      
      <!-- Student Roster Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200 bg-gray-50">
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Student Name</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Classes</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Join Date</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Completed Practices</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Assignments</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Goals</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="student in filteredStudents" 
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
              
              <!-- All Classes -->
              <td class="py-4 px-6">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="classInfo in getStudentClassDetails(student.studentId || student.id)" 
                    :key="classInfo.id"
                    class="px-2 py-1 bg-primary-100 text-gray-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                    :title="`${classInfo.name} - ${getInstrumentName(classInfo.instrument)} (${classInfo.level})`"
                  >
                    <img 
                      v-if="classInfo.instrument" 
                      :src="`/instruments/${getInstrumentImage(classInfo.instrument)}`" 
                      :alt="getInstrumentName(classInfo.instrument)"
                      class="w-3 h-3 object-contain"
                    />
                    {{ classInfo.name }}
                  </span>
                </div>
              </td>
              
              <!-- Join Date -->
              <td class="py-4 px-6 text-sm text-gray-600">
                {{ formatJoinDate(student.joinedAt) }}
              </td>
              
              <!-- Completed Practices -->
              <td class="py-4 px-6">
                <div class="text-center">
                  <div class="text-lg font-bold text-indigo-600">{{ getStudentCompletedPractices(student.studentId || student.id) }}</div>
                  <div class="text-xs text-gray-500">Total</div>
                </div>
              </td>
              
              <!-- Assignments -->
              <td class="py-4 px-6">
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">
                    {{ getStudentCompletedAssignments(student.studentId || student.id) }}/{{ getStudentAssignmentCount(student.studentId || student.id) }}
                  </div>
                  <div class="text-xs text-gray-500">Completed/Total</div>
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
import { computed, ref, watch } from 'vue'
import { 
  Users, 
  AlertCircle, 
  Mail,
  Copy,
  User,
  BookOpen,
  ArrowUpDown
} from 'lucide-vue-next'
import { getInstrumentImage, getInstrumentName } from '../../lib/instruments'

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

// Reactive state for filtering and sorting
const selectedClassFilter = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')

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
            classes: [],
            primaryClass: null
          })
        }
        const studentData = students.get(studentId)
        studentData.classes.push(classItem.name)
        
        // Set primary class (first class they joined, or most recent if multiple)
        if (!studentData.primaryClass || studentData.joinedAt < student.joinedAt) {
          studentData.primaryClass = classItem
        }
      })
    }
  })
  
  return Array.from(students.values())
})

const filteredStudents = computed(() => {
  let students = [...allStudents.value]
  
  // Apply class filter
  if (selectedClassFilter.value) {
    students = students.filter(student => 
      student.classes.some(className => 
        props.classes.find(c => c.id === selectedClassFilter.value)?.name === className
      )
    )
  }
  
  // Apply sorting
  students.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'name':
        const nameA = (a.studentName || a.name || '').toLowerCase()
        const nameB = (b.studentName || b.name || '').toLowerCase()
        comparison = nameA.localeCompare(nameB)
        break
      case 'class':
        const classA = (a.primaryClass?.name || '').toLowerCase()
        const classB = (b.primaryClass?.name || '').toLowerCase()
        comparison = classA.localeCompare(classB)
        break
      case 'joinDate':
        const dateA = new Date(a.joinedAt || 0)
        const dateB = new Date(b.joinedAt || 0)
        comparison = dateA - dateB
        break
      case 'assignments':
        const assignA = getStudentAssignmentCount(a.studentId || a.id)
        const assignB = getStudentAssignmentCount(b.studentId || b.id)
        comparison = assignA - assignB
        break
      case 'goals':
        const goalsA = getStudentGoalsCount(a.studentId || a.id)
        const goalsB = getStudentGoalsCount(b.studentId || b.id)
        comparison = goalsA - goalsB
        break
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return students
})

// Stats computed properties
const totalAssignments = computed(() => {
  let total = 0
  props.classes.forEach(classItem => {
    if (classItem.assignments) total += classItem.assignments.length
    if (classItem.individualAssignments) {
      Object.values(classItem.individualAssignments).forEach(assignments => {
        total += assignments.length
      })
    }
  })
  return total
})

const totalGoals = computed(() => {
  if (!props.studentGoals) return 0
  return Object.values(props.studentGoals).reduce((total, studentGoals) => {
    if (Array.isArray(studentGoals)) {
      return total + studentGoals.filter(goal => goal.status !== 'completed' && goal.status !== 'cancelled').length
    }
    return total
  }, 0)
})

// Methods
const updateFilteredStudents = () => {
  // This will trigger the computed property to recalculate
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStudentClasses = (studentId) => {
  const student = allStudents.value.find(s => (s.studentId || s.id) === studentId)
  return student?.classes || []
}

const getStudentClassDetails = (studentId) => {
  const student = allStudents.value.find(s => (s.studentId || s.id) === studentId)
  if (!student) return []
  
  return props.classes.filter(classItem => 
    classItem.students && classItem.students.some(s => (s.studentId || s.id) === studentId)
  )
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

const getStudentCompletedPractices = (studentId) => {
  let totalPractices = 0
  
  // Count completed practices from goals
  if (props.studentGoals && props.studentGoals[studentId]) {
    const studentGoals = props.studentGoals[studentId]
    if (Array.isArray(studentGoals)) {
      totalPractices += studentGoals.reduce((sum, goal) => {
        return sum + (goal.completedSessions || 0)
      }, 0)
    }
  }
  
  // Count completed practices from assignments (if available)
  props.classes.forEach(classItem => {
    if (classItem.students && classItem.students.some(s => (s.studentId || s.id) === studentId)) {
      // Count completed class assignments
      if (classItem.assignments && Array.isArray(classItem.assignments)) {
        totalPractices += classItem.assignments.filter(assignment => assignment.isComplete).length
      }
      
      // Count completed individual assignments for this student
      if (classItem.individualAssignments && classItem.individualAssignments[studentId]) {
        const individualAssignments = classItem.individualAssignments[studentId]
        totalPractices += individualAssignments.filter(assignment => assignment.isComplete).length
      }
    }
  })
  
  return totalPractices
}

const getStudentCompletedAssignments = (studentId) => {
  let completedAssignments = 0
  
  // Count completed assignments for classes this student is in
  props.classes.forEach(classItem => {
    if (classItem.students && classItem.students.some(s => (s.studentId || s.id) === studentId)) {
      // Count completed class-wide assignments
      if (classItem.assignments && Array.isArray(classItem.assignments)) {
        completedAssignments += classItem.assignments.filter(assignment => assignment.isComplete).length
      }
      
      // Count completed individual assignments for this student
      if (classItem.individualAssignments && classItem.individualAssignments[studentId]) {
        const individualAssignments = classItem.individualAssignments[studentId]
        completedAssignments += individualAssignments.filter(assignment => assignment.isComplete).length
      }
    }
  })
  
  return completedAssignments
}
</script> 