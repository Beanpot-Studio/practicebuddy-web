<template>
  <div class="card card-blue w-full mb-8">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
        <GraduationCap class="w-5 h-5 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">My Classes & Assignments</h3>
      <div class="text-xs text-gray-500 ml-auto">
        Total: {{ assignments.length }} assignments
      </div>
    </div>
    
    <div v-if="enrolledClasses.length === 0" class="text-center py-8">
      <GraduationCap class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 class="text-lg font-semibold text-gray-800 mb-2">No Classes Yet</h4>
      <p class="text-gray-600">Join a music class to get started!</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Enrolled Classes with Assignments -->
      <div v-for="classItem in enrolledClasses" :key="classItem.id" class="border-b border-gray-200 pb-6 last:border-b-0">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 text-lg mb-1">{{ classItem.name }}</h4>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-gray-600">{{ classItem.teacherName }}</span>
              <span class="text-xs text-gray-500">•</span>
              <span class="text-sm text-gray-600">{{ classItem.instrument }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span v-if="classItem.level">Level: {{ classItem.level }}</span>
              <span v-if="classItem.schedule">Schedule: {{ classItem.schedule }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono bg-primary-100 px-3 py-1 rounded-lg text-blue-700 text-sm font-bold">
              {{ classItem.code }}
            </div>
          </div>
        </div>
        
        <!-- Class Assignments -->
        <div v-if="getClassAssignments(classItem.code).length > 0" class="ml-4">
          <h5 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen class="w-4 h-4" />
            Class Assignments ({{ getClassAssignments(classItem.code).length }})
          </h5>
          <div class="space-y-3">
            <div 
              v-for="assignment in getClassAssignments(classItem.code)" 
              :key="assignment.id"
              class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.1)]"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-gray-800">{{ assignment.title }}</span>
                    <span class="px-2 py-1 rounded text-xs font-bold bg-primary-100 text-blue-700 border border-blue-300">
                      Class
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span v-if="assignment.dueDate">
                      <Calendar class="w-3 h-3 inline mr-1" />
                      {{ formatDueDate(assignment.dueDate) }}
                    </span>
                    <span v-if="assignment.practiceMinutes">
                      <Clock class="w-3 h-3 inline mr-1" />
                      {{ assignment.practiceMinutes }} min
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="!assignment.isComplete"
                    @click="markAssignmentComplete(assignment)"
                    class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle class="w-3 h-3" />
                    Mark Complete
                  </button>
                  <span 
                    v-else
                    class="px-3 py-1 bg-green-500 text-white rounded text-sm flex items-center gap-1"
                  >
                    <CheckCircle class="w-3 h-3" />
                    Completed
                  </span>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="ml-4">
          <div class="text-center py-3">
            <BookOpen class="w-4 h-4 text-gray-400 mx-auto mb-2" />
            <p class="text-xs text-gray-500">No class assignments yet</p>
          </div>
        </div>
      </div>
      
      <!-- Individual Assignments Section -->
      <div v-if="getIndividualAssignments().length > 0" class="border-t border-gray-200 pt-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User class="w-5 h-5" />
          Individual Assignments ({{ getIndividualAssignments().length }})
        </h4>
        <div class="space-y-3">
          <div 
            v-for="assignment in getIndividualAssignments()" 
            :key="assignment.id"
            class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300 shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.1)]"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-gray-800">{{ assignment.title }}</span>
                  <span class="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-300">
                    Individual
                  </span>
                  <span v-if="assignment.className" class="text-xs text-gray-500">
                    from {{ assignment.className }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span v-if="assignment.dueDate">
                    <Calendar class="w-3 h-3 inline mr-1" />
                    {{ formatDueDate(assignment.dueDate) }}
                  </span>
                  <span v-if="assignment.practiceMinutes">
                    <Clock class="w-3 h-3 inline mr-1" />
                    {{ assignment.practiceMinutes }} min
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="!assignment.isComplete"
                  @click="markAssignmentComplete(assignment)"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <CheckCircle class="w-3 h-3" />
                  Mark Complete
                </button>
                <span 
                  v-else
                  class="px-3 py-1 bg-green-500 text-white rounded text-sm flex items-center gap-1"
                >
                  <CheckCircle class="w-3 h-3" />
                  Completed
                </span>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Standalone Assignments Section -->
      <div v-if="getStandaloneAssignments().length > 0" class="border-t border-gray-200 pt-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target class="w-5 h-5" />
          Standalone Assignments ({{ getStandaloneAssignments().length }})
        </h4>
        <div class="space-y-3">
          <div 
            v-for="assignment in getStandaloneAssignments()" 
            :key="assignment.id"
            class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300 shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.1)]"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-gray-800">{{ assignment.title }}</span>
                  <span class="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                    Standalone
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span v-if="assignment.dueDate">
                    <Calendar class="w-3 h-3 inline mr-1" />
                    {{ formatDueDate(assignment.dueDate) }}
                  </span>
                  <span v-if="assignment.practiceMinutes">
                    <Clock class="w-3 h-3 inline mr-1" />
                    {{ assignment.practiceMinutes }} min
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="!assignment.isComplete"
                  @click="markAssignmentComplete(assignment)"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <CheckCircle class="w-3 h-3" />
                  Mark Complete
                </button>
                <span 
                  v-else
                  class="px-3 py-1 bg-green-500 text-white rounded text-sm flex items-center gap-1"
                >
                  <CheckCircle class="w-3 h-3" />
                  Completed
                </span>
                <button class="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Assignment Completion Modal -->
    <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">Mark Assignment Complete</h3>
          <button @click="closeCompletionModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold text-gray-800 mb-2">{{ selectedAssignment?.title }}</h4>
          <p class="text-gray-600 text-sm mb-4">{{ selectedAssignment?.description }}</p>
        </div>
        
        <div class="mb-4">
          <label class="block mb-2 font-semibold text-gray-700">Completion Notes (Optional)</label>
          <textarea 
            v-model="completionNotes"
            placeholder="How did it go? Any challenges or achievements?"
            rows="4"
            class="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-green-400"
          ></textarea>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="closeCompletionModal"
            class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="submitAssignmentCompletion"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <CheckCircle v-else class="w-4 h-4" />
            <span v-if="!isSubmitting">Mark Complete</span>
            <span v-else>Submitting...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GraduationCap, BookOpen, Calendar, Clock, User, Target, CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  enrolledClasses: {
    type: Array,
    default: () => []
  },
  assignments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['assignment-completed'])

// Modal state
const showCompletionModal = ref(false)
const selectedAssignment = ref(null)
const completionNotes = ref('')
const isSubmitting = ref(false)

const getClassAssignments = (classCode) => {
  return props.assignments.filter(assignment => 
    (assignment.classCode === classCode || assignment.classId === classCode) && 
    assignment.type === 'class'
  )
}

const getIndividualAssignments = () => {
  return props.assignments.filter(assignment => assignment.type === 'individual')
}

const getStandaloneAssignments = () => {
  return props.assignments.filter(assignment => assignment.type === 'standalone')
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Overdue'
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${diffDays} days`
  }
}

// Assignment completion functions
const markAssignmentComplete = (assignment) => {
  selectedAssignment.value = assignment
  completionNotes.value = ''
  showCompletionModal.value = true
}

const closeCompletionModal = () => {
  showCompletionModal.value = false
  selectedAssignment.value = null
  completionNotes.value = ''
  isSubmitting.value = false
}

const submitAssignmentCompletion = async () => {
  if (!selectedAssignment.value) return
  
  isSubmitting.value = true
  
  try {
    // Emit the completion event to parent component
    await emit('assignment-completed', {
      assignmentId: selectedAssignment.value.id,
      assignment: selectedAssignment.value,
      notes: completionNotes.value.trim(),
      completedAt: new Date().toISOString()
    })
    
    // Close modal
    closeCompletionModal()
  } catch (error) {
    console.error('Error completing assignment:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 