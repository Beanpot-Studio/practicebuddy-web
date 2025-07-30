<template>
  <div class="card card-blue mb-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
          <Music class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">Practice Session</h2>
          <p class="text-gray-600">{{ practiceData.instrumentName }}</p>
          <p v-if="practiceData.className" class="text-sm text-purple-600 font-medium">
            {{ practiceData.className }}
          </p>
        </div>
      </div>
      
      <!-- Timer Display -->
      <div class="text-center">
        <div class="text-4xl font-bold text-gray-800 mb-1 font-mono">
          {{ formatTime(timeRemaining) }}
        </div>
        <div class="text-gray-500 text-sm">
          {{ isPaused ? 'Paused' : 'Time Remaining' }}
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-sm text-gray-500 mt-2">
        <span>{{ formatTime(totalTime * 60 - timeRemaining) }} completed</span>
        <span>{{ formatTime(timeRemaining) }} remaining</span>
      </div>
    </div>

    <!-- Practice Info -->
    <div v-if="practiceData.description" class="mb-6 p-4 bg-gray-50 rounded-xl">
      <h4 class="font-semibold text-gray-700 mb-2">What you're practicing:</h4>
      <p class="text-gray-600">{{ practiceData.description }}</p>
    </div>

    <!-- Control Buttons -->
    <div class="flex gap-3 mb-4">
      <button 
        @click="togglePause"
        class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        :class="isPaused 
          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      >
        <Play v-if="isPaused" class="w-5 h-5" />
        <Pause v-else class="w-5 h-5" />
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button 
        @click="endSession"
        class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 shadow-lg"
      >
        <Square class="w-5 h-5" />
        End Session
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button 
        @click="addTime(5)"
        class="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
      >
        +5 min
      </button>
      <button 
        @click="addTime(10)"
        class="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
      >
        +10 min
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Music, Play, Pause, Square } from 'lucide-vue-next'

const props = defineProps({
  practiceData: {
    type: Object,
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['session-complete', 'session-cancelled'])

const timeRemaining = ref(props.totalTime * 60) // Convert to seconds
const isPaused = ref(false)
const timer = ref(null)

const progressPercentage = computed(() => {
  const totalSeconds = props.totalTime * 60
  const completedSeconds = totalSeconds - timeRemaining.value
  return Math.max(0, Math.min(100, (completedSeconds / totalSeconds) * 100))
})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer.value = setInterval(() => {
    if (!isPaused.value && timeRemaining.value > 0) {
      timeRemaining.value--
      
      // Check if session is complete
      if (timeRemaining.value === 0) {
        clearInterval(timer.value)
        emit('session-complete', {
          ...props.practiceData,
          actualDuration: props.totalTime,
          completed: true
        })
      }
    }
  }, 1000)
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const addTime = (minutes) => {
  timeRemaining.value += minutes * 60
}

const endSession = () => {
  clearInterval(timer.value)
  const actualDuration = props.totalTime - (timeRemaining.value / 60)
  emit('session-cancelled', {
    ...props.practiceData,
    actualDuration: Math.max(0, actualDuration),
    completed: false
  })
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script> 