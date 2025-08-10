<template>
  <div class="mb-8">
    <!-- Horizontal Stats UI -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card card-blue">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-musical-primary-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            <Clock class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Total Practices</h3>
        </div>
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalPracticeMinutes }}</div>
        <p class="text-gray-600 text-sm">Minutes practiced</p>
      </div>

      <div class="card card-green">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
            <BookOpen class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Assignments</h3>
        </div>
        <div class="text-3xl font-bold text-green-600 mb-1">{{ assignmentsCompleted }}</div>
        <p class="text-gray-600 text-sm mb-2">Completed</p>
        <div class="text-sm text-gray-700">Pending: <span class="font-semibold">{{ assignmentsPending }}</span></div>
        <div class="text-xs text-gray-500 mt-1">
          <span>Next due: </span>
          <span class="font-medium">{{ nextDueDisplay }}</span>
        </div>
      </div>

      <div class="card card-yellow">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
            <Star class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Stickers Earned</h3>
        </div>
        <div class="text-3xl font-bold text-yellow-600 mb-2">{{ stickerCount }}</div>
        <p class="text-gray-600 text-sm">From your teacher</p>
      </div>

      <div class="card card-purple">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            <Target class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Practice Goal</h3>
        </div>
        <div v-if="currentGoal" class="mb-2">
          <div class="text-lg font-bold text-purple-600 mb-1">{{ currentGoal.title }}</div>
          
          <!-- Progress Bar -->
          <div class="mb-2">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-semibold text-gray-700">Progress</span>
              <span class="text-xs font-bold text-purple-600">{{ progressPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                class="bg-gradient-to-r from-purple-400 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Progress Details -->
          <div class="space-y-0.5">
            <div class="text-xs text-gray-600">
              {{ currentGoal.completedSessions || 0 }} out of {{ currentGoal.targetPracticeSessions }} practices required
            </div>
            <div class="text-xs font-semibold text-purple-600">
              {{ remainingPractices }} practices to go
            </div>
          </div>
        </div>
        <div v-else class="mb-2">
          <div class="text-lg font-bold text-purple-600 mb-2">No active goal</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, BookOpen, Star, Target } from 'lucide-vue-next'

const props = defineProps({
  totalPracticeMinutes: {
    type: Number,
    default: 0
  },
  assignmentsCompleted: {
    type: Number,
    default: 0
  },
  assignmentsPending: {
    type: Number,
    default: 0
  },
  nextAssignmentDueDate: {
    type: String,
    default: null
  },
  stickerCount: {
    type: Number,
    default: 0
  },
  currentGoal: {
    type: Object,
    default: null
  }
})

// Computed properties for goal progress
const progressPercentage = computed(() => {
  if (!props.currentGoal || !props.currentGoal.targetPracticeSessions) return 0
  const completedSessions = props.currentGoal.completedSessions || 0
  const target = props.currentGoal.targetPracticeSessions
  const percentage = Math.round((completedSessions / target) * 100)
  return percentage
})

const remainingPractices = computed(() => {
  if (!props.currentGoal || !props.currentGoal.targetPracticeSessions) return 0
  const completedSessions = props.currentGoal.completedSessions || 0
  const target = props.currentGoal.targetPracticeSessions
  return Math.max(0, target - completedSessions)
})

const nextDueDisplay = computed(() => {
  if (!props.nextAssignmentDueDate) return '—'
  const d = new Date(props.nextAssignmentDueDate)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
})
</script> 