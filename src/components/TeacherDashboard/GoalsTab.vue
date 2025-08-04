<template>
  <div class="space-y-6">
    

    <!-- Create Practice Goal Component -->
    <CreatePracticeGoal 
      :current-user="currentUser"
      @goal-created="onGoalCreated"
    />

    <!-- Existing Goals List -->
    <div class="card card-purple">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            <Target class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Active Goals</h3>
        </div>
        <button 
          @click="showCompletedGoals = !showCompletedGoals"
          class="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {{ showCompletedGoals ? 'Hide' : 'Show' }} Completed Goals
        </button>
      </div>

      <div v-if="isLoadingGoals" class="text-center py-8">
        <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading goals...</p>
      </div>

      <div v-else-if="activeGoals.length === 0" class="text-center py-8">
        <Target class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 mb-2">No active goals yet</p>
        <p class="text-sm text-gray-500">Create your first practice goal above!</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="goal in activeGoals" 
          :key="goal.id"
          class="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all duration-200"
        >
          <!-- Goal Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 mb-1">{{ goal.title }}</h4>
              <p class="text-sm text-gray-600">{{ goal.description }}</p>
              <!-- Student/Class Name -->
              <p class="text-md text-gray-500 mt-1">
                <span v-if="goal.type === 'individual' && goal.studentName">
                  Student: {{ goal.studentName }}
                </span>
                <span v-else-if="goal.type === 'class' && goal.className">
                  Class: {{ goal.className }}
                </span>
              </p>
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
        </div>
      </div>

      <!-- Completed Goals Section -->
      <div v-if="showCompletedGoals" class="mt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
            <CheckCircle class="w-5 h-5 text-white" />
          </div>
          <h4 class="text-md text-gray-800 font-bold">Completed Goals</h4>
        </div>

        <div v-if="completedGoals.length === 0" class="text-center py-6">
          <CheckCircle class="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600">No completed goals yet</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="goal in completedGoals" 
            :key="goal.id"
            class="p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
          >
            <!-- Goal Header -->
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h5 class="font-semibold text-gray-800 text-sm">{{ goal.title }}</h5>
                <p class="text-xs text-gray-600">{{ goal.description }}</p>
                <!-- Student/Class Name -->
                <p class="text-xs text-gray-400 mt-1">
                  <span v-if="goal.type === 'individual' && goal.studentName">
                    Student: {{ goal.studentName }}
                  </span>
                  <span v-else-if="goal.type === 'class' && goal.className">
                    Class: {{ goal.className }}
                  </span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Completed
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
            <div class="mb-2">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>Final Progress</span>
                <span>{{ goal.completedSessions }} / {{ goal.targetPracticeSessions }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  class="h-1.5 rounded-full bg-green-500"
                  :style="{ width: `${goal.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Goal Details -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-gray-500">Reward:</span>
                <p class="font-medium text-gray-800">{{ goal.reward }}</p>
              </div>
              <div v-if="goal.completedAt">
                <span class="text-gray-500">Completed:</span>
                <p class="font-medium text-gray-800">{{ formatDate(goal.completedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Target, CheckCircle } from 'lucide-vue-next'
import CreatePracticeGoal from '../AdminDashboard/CreatePracticeGoal.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['goal-created'])

const activeGoals = ref([])
const completedGoals = ref([])
const isLoadingGoals = ref(false)
const showCompletedGoals = ref(false)

const onGoalCreated = () => {
  // Refresh goals list
  loadGoals()
}

const loadGoals = async () => {
  isLoadingGoals.value = true
  try {
    console.log('Loading goals for teacher:', props.currentUser.uid)
    const { getTeacherPracticeGoals } = await import('../../lib/auth.js')
    const result = await getTeacherPracticeGoals(props.currentUser.uid)
    
    console.log('Goals result:', result)
    
    if (result.success) {
      console.log('All goals found:', result.goals)
      // Separate active and completed goals
      activeGoals.value = result.goals.filter(goal => 
        goal.status !== 'completed' && goal.status !== 'cancelled'
      )
      completedGoals.value = result.goals.filter(goal => 
        goal.status === 'completed'
      )
      console.log('Active goals:', activeGoals.value)
      console.log('Completed goals:', completedGoals.value)
    } else {
      console.error('Failed to load goals:', result.error)
      activeGoals.value = []
      completedGoals.value = []
    }
  } catch (error) {
    console.error('Error loading goals:', error)
    activeGoals.value = []
    completedGoals.value = []
  } finally {
    isLoadingGoals.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  loadGoals()
})
</script> 