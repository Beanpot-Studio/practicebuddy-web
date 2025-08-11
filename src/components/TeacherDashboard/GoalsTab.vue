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
              <div class="mt-2">
                <span 
                  v-if="goal.type === 'individual' && goal.studentName"
                  class="inline-block px-3 py-1 bg-primary-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-medium"
                >
                  👤 Student: {{ goal.studentName }}
                </span>
                <span 
                  v-else-if="goal.type === 'class' && goal.className"
                  class="inline-block px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium"
                >
                  👥 Class: {{ goal.className }}
                </span>
              </div>
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
                class="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-blue-700"
              >
                Class Goal
              </span>
              <!-- Three Dots Menu -->
              <div class="relative">
                <button 
                  @click="toggleGoalMenu(goal.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Goal options"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>
                <div 
                  v-if="openMenuGoalId === goal.id"
                  class="absolute right-0 top-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 min-w-40"
                >
                  <button 
                    @click="archiveGoal(goal); closeGoalMenu()"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                  >
                    <Archive class="w-4 h-4" />
                    Archive Goal
                  </button>
                  <button 
                    @click="deleteGoal(goal); closeGoalMenu()"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete Goal
                  </button>
                </div>
              </div>
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
            <div v-if="goal.minutesPerSession">
              <span class="text-gray-500">Minutes per Session:</span>
              <p class="font-medium text-gray-800">{{ goal.minutesPerSession }} min</p>
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
                <div class="mt-2">
                  <span 
                    v-if="goal.type === 'individual' && goal.studentName"
                    class="inline-block px-2 py-1 bg-primary-50 border border-blue-200 rounded text-xs text-blue-700 font-medium"
                  >
                    👤 Student: {{ goal.studentName }}
                  </span>
                  <span 
                    v-else-if="goal.type === 'class' && goal.className"
                    class="inline-block px-2 py-1 bg-green-50 border border-green-200 rounded text-xs text-green-700 font-medium"
                  >
                    👥 Class: {{ goal.className }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Completed
                </span>
                <span 
                  v-if="goal.type === 'class'"
                  class="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-blue-700"
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

    <!-- Archived Goals Section -->
    <div v-if="archivedGoals.length > 0" class="card card-gray mt-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-gray-600 bg-gradient-to-br from-gray-400 to-gray-500 relative">
          <Archive class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl text-gray-800 font-bold">Archived Goals ({{ archivedGoals.length }})</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Goal</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Min/Session</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Archived Date</th>
              <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="goal in archivedGoals" 
              :key="goal.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4">
                <div>
                  <div class="font-semibold text-gray-800">{{ goal.title }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ goal.description }}</div>
                </div>
              </td>
              <td class="py-4 px-4">
                <span 
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit',
                    goal.type === 'class' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  ]"
                >
                  <Users v-if="goal.type === 'class'" class="w-3 h-3" />
                  <User v-else class="w-3 h-3" />
                  {{ goal.type === 'class' ? 'Class' : 'Individual' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="text-gray-700">
                  <span v-if="goal.type === 'class'">{{ goal.className || goal.classCode }}</span>
                  <span v-else>{{ goal.studentName || goal.studentId }}</span>
                </div>
              </td>
              <td class="py-4 px-4">{{ goal.minutesPerSession || '-' }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-1 text-gray-600">
                  <Calendar class="w-4 h-4" />
                  <span>{{ formatDate(goal.archivedAt) }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="restoreGoal(goal)"
                    class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors flex items-center gap-1"
                    title="Restore goal"
                  >
                    <RotateCcw class="w-4 h-4" />
                    <span>Restore</span>
                  </button>
                  <button 
                    @click="deleteGoal(goal)"
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
import { ref, onMounted } from 'vue'
import { Target, CheckCircle, MoreVertical, Archive, Trash2, RotateCcw, Users, User, Calendar } from 'lucide-vue-next'
import CreatePracticeGoal from './CreatePracticeGoal.vue'

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
const archivedGoals = ref([])
const openMenuGoalId = ref(null)

const onGoalCreated = () => {
  // Refresh goals list
  loadGoals()
}

const loadGoals = async () => {
  isLoadingGoals.value = true
  try {
    const { getTeacherPracticeGoals } = await import('../../lib/auth.js')
    const result = await getTeacherPracticeGoals(props.currentUser.uid)
    
    
    if (result.success) {
      // Separate active and completed goals
      const goals = result.goals || []
      activeGoals.value = goals.filter(goal => goal.status !== 'completed' && goal.status !== 'cancelled' && !goal.archived)
      completedGoals.value = goals.filter(goal => goal.status === 'completed' && !goal.archived)
      archivedGoals.value = goals.filter(goal => goal.archived || goal.status === 'archived')
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

const archiveGoal = async (goal) => {
  try {
    if (!confirm(`Are you sure you want to archive the goal "${goal.title}"? This will hide it from active goals but preserve all data.`)) {
      return
    }
    const { archivePracticeGoal } = await import('../../lib/auth.js')
    const scope = goal.type === 'class' ? 'class' : 'student'
    const ownerId = scope === 'class' ? goal.classCode : goal.studentId
    const result = await archivePracticeGoal(goal.id, scope, ownerId, props.currentUser.uid)
    if (result.success) {
      await loadGoals()
    }
  } catch (e) {
    console.error('Failed to archive goal', e)
  }
}

const restoreGoal = async (goal) => {
  try {
    if (!confirm(`Are you sure you want to restore the goal "${goal.title}" to active goals?`)) {
      return
    }
    const { restorePracticeGoal } = await import('../../lib/auth.js')
    const scope = goal.type === 'class' ? 'class' : 'student'
    const ownerId = scope === 'class' ? goal.classCode : goal.studentId
    const result = await restorePracticeGoal(goal.id, scope, ownerId, props.currentUser.uid)
    if (result.success) {
      await loadGoals()
    }
  } catch (e) {
    console.error('Failed to restore goal', e)
  }
}

const deleteGoal = async (goal) => {
  try {
    if (!confirm(`Are you sure you want to permanently delete the goal "${goal.title}"? This action cannot be undone.`)) {
      return
    }
    const { deletePracticeGoal } = await import('../../lib/auth.js')
    const scope = goal.type === 'class' ? 'class' : 'student'
    const ownerId = scope === 'class' ? goal.classCode : goal.studentId
    const result = await deletePracticeGoal(goal.id, scope, ownerId, props.currentUser.uid)
    if (result.success) {
      await loadGoals()
    }
  } catch (e) {
    console.error('Failed to delete goal', e)
  }
}

onMounted(() => {
  loadGoals()
})

const toggleGoalMenu = (goalId) => {
  openMenuGoalId.value = openMenuGoalId.value === goalId ? null : goalId
}

const closeGoalMenu = () => {
  openMenuGoalId.value = null
}
</script> 