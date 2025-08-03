<template>
  <div class="card card-purple">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
        <BookOpen class="w-5 h-5 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Class Assignments</h3>
    </div>
    
    <div v-if="isLoadingAssignments" class="text-center py-8">
      <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">Loading assignments...</p>
    </div>
    
    <div v-else-if="assignments.length === 0" class="text-center py-8">
      <BookOpen class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 class="text-lg font-semibold text-gray-800 mb-2">No Assignments Yet</h4>
      <p class="text-gray-600">Your teacher will post assignments here soon!</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="assignment in assignments" 
        :key="assignment.id"
        class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-semibold text-gray-800 text-lg">{{ assignment.title }}</h4>
              <span :class="[
                'px-2 py-1 rounded text-xs font-bold',
                assignment.type === 'class' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : assignment.type === 'individual'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-purple-100 text-purple-700 border border-purple-300'
              ]">
                {{ assignment.type === 'class' ? 'Class' : assignment.type === 'individual' ? 'Individual' : 'Standalone' }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 text-sm text-gray-500">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDueDate(assignment.dueDate) }}</span>
            </div>
            <div v-if="assignment.practiceMinutes" class="flex items-center gap-1 text-sm text-purple-600 font-semibold">
              <Clock class="w-4 h-4" />
              <span>{{ assignment.practiceMinutes }} min</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors">
              <CheckCircle class="w-4 h-4 inline mr-1" />
              Mark Complete
            </button>
            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors">
              View Details
            </button>
          </div>
          <div class="text-xs text-gray-500">
            Assigned {{ new Date(assignment.createdAt).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar, CheckCircle, Clock, BookOpen } from 'lucide-vue-next'

defineProps({
  assignments: {
    type: Array,
    default: () => []
  },
  isLoadingAssignments: {
    type: Boolean,
    default: false
  }
})

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
</script> 