<template>
  <div class="card card-purple">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
        <Target class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Practice Goals</h3>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">Loading your goals...</p>
    </div>

    <div v-else-if="goals.length === 0" class="text-center py-8">
      <Target class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 mb-2">No practice goals yet</p>
      <p class="text-sm text-gray-500">Your teacher will create goals for you to work towards!</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="goal in goals" 
        :key="goal.id"
        class="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all duration-200"
      >
        <!-- Goal Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 mb-1">{{ goal.title }}</h4>
            <p class="text-sm text-gray-600">{{ goal.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                goal.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-purple-100 text-purple-700'
              ]"
            >
              {{ goal.status === 'completed' ? 'Completed' : 'Active' }}
            </span>
            <span 
              v-if="goal.type === 'class'"
              class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
            >
              Class Goal
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{{ goal.completedSessions }} / {{ goal.targetPracticeSessions }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500"
              :class="goal.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'"
              :style="{ width: `${goal.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Goal Details -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Reward:</span>
            <p class="font-medium text-gray-800">{{ goal.reward }}</p>
          </div>
          <div v-if="goal.dueDate">
            <span class="text-gray-500">Due:</span>
            <p class="font-medium text-gray-800">{{ formatDate(goal.dueDate) }}</p>
          </div>
        </div>

        <!-- Completion Message -->
        <div v-if="goal.status === 'completed'" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-2">
            <Trophy class="w-4 h-4 text-green-600" />
            <span class="text-green-800 font-medium">Congratulations! You've earned your reward!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Target, Trophy } from 'lucide-vue-next'
import { getStudentPracticeGoals } from '../../lib/auth'

const props = defineProps({
  studentId: {
    type: String,
    required: true
  }
})

const goals = ref([])
const isLoading = ref(true)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const loadGoals = async () => {
  try {
    isLoading.value = true
    const result = await getStudentPracticeGoals(props.studentId)
    
    if (result.success) {
      goals.value = result.goals
    } else {
      console.error('Failed to load practice goals:', result.error)
    }
  } catch (error) {
    console.error('Error loading practice goals:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadGoals()
})
</script> 