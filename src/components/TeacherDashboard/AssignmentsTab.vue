<template>
  <div class="animate-fadeIn">
   

    <!-- Assignments Display Section -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
          <BookOpen class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl text-gray-800 font-bold">Assignments</h3>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading assignments...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="allAssignments.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No Assignments Yet</h3>
        <p class="text-gray-600 mb-4">Create your first assignment to get started!</p>
      </div>
      
      <!-- Assignments List -->
      <div v-else class="space-y-4">
        <div 
          v-for="assignment in allAssignments" 
          :key="assignment.id"
          class="p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_rgba(0,0,0,0.15)] transition-all duration-200"
        >
          <!-- Assignment Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-bold text-gray-800 text-lg">{{ assignment.title || 'Untitled Assignment' }}</h4>
                <span 
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1',
                    assignment.type === 'class' 
                      ? 'bg-primary-100 text-blue-700 border border-blue-300' 
                      : 'bg-purple-100 text-purple-700 border border-purple-300'
                  ]"
                >
                  <Users v-if="assignment.type === 'class'" class="w-3 h-3" />
                  <User v-else class="w-3 h-3" />
                  {{ assignment.type === 'class' ? 'Class' : 'Individual' }}
                </span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <p class="text-gray-600 text-sm">{{ assignment.description || 'No description provided' }}</p>
                <button 
                  @click="$emit('copyAssignmentId', assignment.id)"
                  class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy assignment ID"
                >
                  <Copy class="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <!-- Three Dots Menu -->
            <div class="relative">
              <button 
                @click="toggleAssignmentMenu(assignment.id)"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Assignment options"
              >
                <MoreVertical class="w-4 h-4" />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="openMenuAssignmentId === assignment.id"
                class="absolute right-0 top-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 min-w-40"
              >
                <button 
                  @click="$emit('archiveAssignment', assignment); closeAssignmentMenu()"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                >
                  <Archive class="w-4 h-4" />
                  Archive Assignment
                </button>
                <button 
                  @click="$emit('deleteAssignment', assignment.id); closeAssignmentMenu()"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete Assignment
                </button>
              </div>
            </div>
          </div>
          
          <!-- Assignment Details -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap class="w-4 h-4" />
              <span>{{ getClassName(assignment.classCode) }}</span>
            </div>
            <div v-if="assignment.type === 'individual'" class="flex items-center gap-2 text-sm text-gray-600">
              <User class="w-4 h-4" />
              <span>{{ getStudentName(assignment.studentId) }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <Clock class="w-4 h-4" />
              <span>{{ assignment.practiceMinutes }} minutes</span>
            </div>
          </div>
          
          <!-- Due Date -->
          <div v-if="assignment.dueDate" class="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar class="w-4 h-4" />
            <span>Due: {{ formatDate(new Date(assignment.dueDate)) }}</span>
          </div>
          
          <!-- Created Date -->
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500">
              Created: {{ assignment.createdAt ? formatDate(new Date(assignment.createdAt)) : 'Unknown' }}
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="editAssignment(assignment)"
                class="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

     <!-- Create Assignment Section -->
     <div class="card card-green mt-8">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
          <Plus class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-lg text-gray-800 font-bold">Create New Assignment</h3>
      </div>
      
      <form @submit.prevent="$emit('createNewAssignment')" class="space-y-4">
        <!-- Assignment Type -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700  text-base">Assignment Type</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                :value="'class'"
                v-model="newAssignment.type"
                class="w-4 h-4 text-green-600"
              />
              <span class="text-gray-700">Class Assignment</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                :value="'individual'"
                v-model="newAssignment.type"
                class="w-4 h-4 text-green-600"
              />
              <span class="text-gray-700">Individual Assignment</span>
            </label>
          </div>
        </div>
        
        <!-- Class Selection (for both types) -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Select Class</label>
          <select 
            v-model="newAssignment.classCode"
            @change="onClassChange"
            required
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)]"
          >
            <option value="">Choose a class</option>
            <option 
              v-for="classItem in classes" 
              :key="classItem.id" 
              :value="classItem.code"
            >
              {{ classItem.name }}
            </option>
          </select>
        </div>
        
        <!-- Student Selection (for individual assignments) -->
        <div v-if="newAssignment.type === 'individual'">
          <label class="block mb-2 font-semibold text-gray-700 text-base">Select Student</label>
          <div v-if="!newAssignment.classCode" class="text-sm text-gray-500 italic">
            Please select a class first to see available students
          </div>
          <div v-else-if="selectedClassStudents.length === 0" class="text-sm text-gray-500 italic">
            No students found in this class
          </div>
          <select 
            v-else
            v-model="newAssignment.studentId"
            required
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)]"
          >
            <option value="">Choose a student</option>
            <option 
              v-for="student in selectedClassStudents" 
              :key="student.studentId || student.id" 
              :value="student.studentId || student.id"
            >
              {{ student.studentName || student.name }}
            </option>
          </select>
        </div>
        
        <!-- Assignment Title -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Assignment Title</label>
          <input 
            v-model="newAssignment.title"
            type="text" 
            placeholder="e.g., Practice C Major Scale, Learn New Song"
            required
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)]"
          />
        </div>
        
        <!-- Assignment Description -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Description</label>
          <textarea 
            v-model="newAssignment.description"
            placeholder="Describe what students should practice..."
            rows="3"
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)] resize-none"
          ></textarea>
        </div>
        
        <!-- Practice Minutes -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Practice Minutes</label>
          <input 
            v-model="newAssignment.practiceMinutes"
            type="number" 
            min="1"
            placeholder="e.g., 30"
            required
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)]"
          />
        </div>
        
        <!-- Due Date -->
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Due Date (Optional)</label>
          <input 
            v-model="newAssignment.dueDate"
            type="date" 
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(34,197,94,0.2)]"
          />
        </div>
        
        <button type="submit" class="w-full bg-purple-500 text-white btn flex items-center justify-center gap-2" :disabled="isCreatingAssignment">
          <div v-if="isCreatingAssignment" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <BookOpen v-else class="w-5 h-5" />
          <span v-if="!isCreatingAssignment">Create Assignment</span>
          <span v-else>Creating...</span>
        </button>
      </form>
    </div>

    <!-- Archived Assignments Section -->
    <div v-if="archivedAssignments.length > 0" class="card card-gray mt-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-gray-600 bg-gradient-to-br from-gray-400 to-gray-500 relative">
          <Archive class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl text-gray-800 font-bold">Archived Assignments ({{ archivedAssignments.length }})</h3>
      </div>
      
      <!-- Archived Assignments Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Assignment</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Archived Date</th>
              <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="assignment in archivedAssignments" 
              :key="assignment.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <!-- Assignment Name -->
              <td class="py-4 px-4">
                <div>
                  <div class="font-semibold text-gray-800">{{ assignment.title || 'Untitled Assignment' }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ assignment.description || 'No description' }}</div>
                </div>
              </td>
              
              <!-- Type -->
              <td class="py-4 px-4">
                <span 
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit',
                    assignment.type === 'class' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  ]"
                >
                  <Users v-if="assignment.type === 'class'" class="w-3 h-3" />
                  <User v-else class="w-3 h-3" />
                  {{ assignment.type === 'class' ? 'Class' : 'Individual' }}
                </span>
              </td>
              
              <!-- Class -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-1 text-gray-600">
                  <GraduationCap class="w-4 h-4" />
                  <span>{{ getClassName(assignment.classCode) }}</span>
                </div>
              </td>
              
              <!-- Duration -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-1 text-green-600 font-semibold">
                  <Clock class="w-4 h-4" />
                  <span>{{ assignment.practiceMinutes }} min</span>
                </div>
              </td>
              
              <!-- Archived Date -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-1 text-gray-600">
                  <Calendar class="w-4 h-4" />
                  <span>{{ formatDate(new Date(assignment.archivedAt)) }}</span>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="$emit('restoreAssignment', assignment)"
                    class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors flex items-center gap-1"
                    title="Restore assignment"
                  >
                    <RotateCcw class="w-4 h-4" />
                    <span>Restore</span>
                  </button>
                  <button 
                    @click="$emit('deleteAssignment', assignment.id)"
                    class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center gap-1"
                    title="Delete permanently"
                  >
                    <Trash2 class="w-4 h-4" />
                    <span>Delete</span>
                  </button>
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
import { computed, ref } from 'vue'
import { 
  Plus, 
  BookOpen, 
  Users, 
  User, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Trash2,
  Copy,
  MoreVertical,
  Archive,
  RotateCcw
} from 'lucide-vue-next'

const props = defineProps({
  classes: {
    type: Array,
    default: () => []
  },
  classAssignments: {
    type: Array,
    default: () => []
  },
  archivedAssignments: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  newAssignment: {
    type: Object,
    required: true
  },
  isCreatingAssignment: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['createNewAssignment', 'update:newAssignment', 'deleteAssignment', 'editAssignment', 'copyAssignmentId', 'archiveAssignment', 'restoreAssignment'])

// Menu state
const openMenuAssignmentId = ref(null)

// Computed properties
const allAssignments = computed(() => {
  return props.classAssignments
})

const selectedClassStudents = computed(() => {
  if (!props.newAssignment.classCode) return []
  
  const selectedClass = props.classes.find(c => c.code === props.newAssignment.classCode)
  console.log('Selected class:', selectedClass)
  console.log('Students in class:', selectedClass?.students)
  return selectedClass?.students || []
})

// Helper functions
const onClassChange = () => {
  // Reset student selection when class changes
  emit('update:newAssignment', { ...props.newAssignment, studentId: '' })
}

const getClassName = (classCode) => {
  const classItem = props.classes.find(c => c.code === classCode)
  return classItem?.name || 'Unknown Class'
}

const getStudentName = (studentId) => {
  if (!studentId) return 'Unknown Student'
  
  // Search through all classes for the student
  for (const classItem of props.classes) {
    const student = classItem.students?.find(s => 
      s.studentId === studentId || s.id === studentId
    )
    if (student) {
      return student.studentName || student.name || 'Unknown Student'
    }
  }
  return 'Unknown Student'
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const editAssignment = (assignment) => {
  emit('editAssignment', assignment)
}

const toggleAssignmentMenu = (assignmentId) => {
  openMenuAssignmentId.value = openMenuAssignmentId.value === assignmentId ? null : assignmentId
}

const closeAssignmentMenu = () => {
  openMenuAssignmentId.value = null
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    closeAssignmentMenu()
  }
}

// Add event listener for clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}
</script> 