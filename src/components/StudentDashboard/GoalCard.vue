<template>
  <div class="card card-purple">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
        <Target class="w-6 h-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-lg text-gray-800 font-bold">Your Practice Goals</h3>
        <p class="text-sm text-gray-600">
          {{ isLoading ? 'Loading goals...' : activeGoals.length > 0 ? `${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''}` : 'No active goals' }}
        </p>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8 text-gray-500">
      <div class="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm">Loading your goals...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="activeGoals.length === 0" class="text-center py-8 text-gray-500">
      <Target class="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p class="text-sm">No active practice goals</p>
      <p class="text-xs mt-1">Your teacher will set goals for you!</p>
    </div>
    
    <!-- Goals List -->
    <div v-else class="space-y-4">
      <div 
        v-for="goal in activeGoals" 
        :key="goal.id"
        class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]"
      >
        <!-- Goal Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 text-base">{{ goal.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ goal.description }}</p>
          </div>
          <div class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            {{ goal.type === 'individual' ? 'Personal' : 'Class' }}
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm font-bold text-purple-600">{{ Math.round(goal.progress || 0) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, goal.progress || 0)}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Progress Details -->
        <div class="flex justify-between items-center text-sm">
          <div class="text-gray-600">
            <span class="font-semibold text-purple-600">{{ goal.completedSessions || 0 }}</span> 
            out of 
            <span class="font-semibold text-purple-600">{{ goal.targetPracticeSessions }}</span> 
            practices
          </div>
          <div class="text-gray-500">
            {{ getGoalStatusText(goal) }}
          </div>
        </div>
        
        <!-- Goal Type Badge -->
        <div v-if="goal.className" class="mt-2">
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {{ goal.className }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Target } from 'lucide-vue-next'

const props = defineProps({
  studentId: {
    type: String,
    required: true
  }
})

const activeGoals = ref([])
const isLoading = ref(false)

const loadGoals = async () => {
  if (!props.studentId) return
  
  isLoading.value = true
  try {
    const { getStudentPracticeGoals } = await import('../../lib/auth.js')
    const result = await getStudentPracticeGoals(props.studentId)
    
    if (result.success) {
      // Filter for active goals only
      activeGoals.value = result.goals.filter(goal => 
        goal.status === 'active' || goal.status === undefined
      )
    }
  } catch (error) {
    console.error('Error loading practice goals:', error)
  } finally {
    isLoading.value = false
  }
}

const getGoalStatusText = (goal) => {
  const completed = goal.completedSessions || 0
  const target = goal.targetPracticeSessions
  const remaining = target - completed
  
  if (remaining <= 0) {
    return 'Goal completed! 🎉'
  } else if (remaining === 1) {
    return '1 practice to go!'
  } else {
    return `${remaining} practices to go`
  }
}

onMounted(() => {
  loadGoals()
})

// Expose method for parent component to refresh goals
defineExpose({
  loadGoals
})
</script> 