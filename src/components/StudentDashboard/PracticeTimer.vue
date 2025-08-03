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

    <!-- Recording Section -->
    <div class="mb-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
      <div class="flex items-center gap-3 mb-3">
        <Mic class="w-5 h-5 text-green-600" />
        <h4 class="font-semibold text-gray-700">Record Your Practice</h4>
        <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Max 1 minute</span>
      </div>
      
      <!-- Recording Status -->
      <div class="text-center mb-4">
        <div class="text-2xl font-bold text-gray-800 mb-2">{{ formatTime(recordingTime) }}</div>
        <div class="text-sm font-medium">
          <span v-if="isRecording && recordingTime >= 55" class="text-orange-600">⚠️ Almost at 1 minute limit</span>
          <span v-else-if="isRecording" class="text-red-500">🔴 Recording...</span>
          <span v-else-if="hasRecording" class="text-green-600">✅ Recording saved!</span>
          <span v-else class="text-gray-500">Ready to record (max 1 minute)</span>
        </div>
      </div>
      
      <!-- Recording Progress Bar -->
      <div v-if="isRecording" class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
            :style="{ width: `${(recordingTime / 60) * 100}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>0:00</span>
          <span>1:00</span>
        </div>
      </div>
      
      <!-- Recording Controls -->
      <div class="flex gap-3">
        <button 
          @click="toggleRecording" 
          :disabled="isRecording && recordingTime >= 60"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2',
            isRecording && recordingTime >= 60
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
          ]"
        >
          <component :is="isRecording ? Square : Mic" class="w-5 h-5" />
          {{ isRecording && recordingTime >= 60 ? 'Time Limit Reached' : (isRecording ? 'Stop Recording' : 'Start Recording') }}
        </button>
        
        <button 
          v-if="hasRecording"
          @click="playRecording"
          class="py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
        >
          <Play class="w-5 h-5" />
          {{ isPlayingRecording ? 'Pause' : 'Play' }}
        </button>
      </div>
      
      <!-- Recording Info -->
      <div v-if="hasRecording" class="mt-3 text-xs text-gray-600">
        <div>Recording duration: {{ formatTime(recordingTime) }}</div>
        <div>Status: {{ recordingStatus }}</div>
      </div>
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
import { Music, Play, Pause, Square, Mic } from 'lucide-vue-next'
import { uploadAudioToCloudinary } from '../../lib/cloudinary.js'

const props = defineProps({
  practiceData: {
    type: Object,
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['session-complete', 'session-cancelled'])

const timeRemaining = ref(props.totalTime * 60) // Convert to seconds
const isPaused = ref(false)
const timer = ref(null)

// Recording state
const isRecording = ref(false)
const recordingTime = ref(0)
const recordingTimer = ref(null)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const hasRecording = ref(false)
const recordingStatus = ref('')
const recordingUrl = ref(null)
const isPlayingRecording = ref(false)
const recordingAudio = ref(null)

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
          completed: true,
          recording: recordingUrl.value,
          recordingDuration: recordingTime.value
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
    completed: false,
    recording: recordingUrl.value,
    recordingDuration: recordingTime.value
  })
}

// Recording functions
const startRecording = async () => {
  try {
    recordingStatus.value = 'Starting recording...'
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    })
    
    recordedChunks.value = []
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data)
      }
    }
    
    mediaRecorder.value.onstop = async () => {
      recordingStatus.value = 'Processing recording...'
      const audioBlob = new Blob(recordedChunks.value, { type: 'audio/webm' })
      
      try {
        // Upload to Cloudinary
        const uploadResult = await uploadAudioToCloudinary(audioBlob, props.userId)
        recordingUrl.value = uploadResult.url
        hasRecording.value = true
        recordingStatus.value = 'Recording uploaded successfully!'
        console.log('Recording uploaded to Cloudinary:', uploadResult)
      } catch (error) {
        console.error('Failed to upload recording:', error)
        recordingStatus.value = 'Failed to upload recording'
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop())
    }
    
    mediaRecorder.value.start()
    isRecording.value = true
    recordingTime.value = 0
    recordingStatus.value = 'Recording...'
    
    // Start recording timer
    recordingTimer.value = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= 60) { // Max 60 seconds
        stopRecording()
      }
    }, 1000)
    
  } catch (error) {
    console.error('Failed to start recording:', error)
    recordingStatus.value = 'Failed to start recording'
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
  }
}

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const playRecording = async () => {
  console.log('playRecording called, recordingUrl:', recordingUrl.value)
  console.log('isPlayingRecording:', isPlayingRecording.value)
  
  if (!recordingUrl.value) {
    console.log('No recording URL available')
    return
  }
  
  try {
    if (isPlayingRecording.value) {
      // Pause recording
      console.log('Pausing recording')
      if (recordingAudio.value) {
        recordingAudio.value.pause()
        isPlayingRecording.value = false
      }
    } else {
      // Play or restart recording
      console.log('Playing recording')
      if (recordingAudio.value) {
        // If audio exists, restart from beginning
        recordingAudio.value.currentTime = 0
        await recordingAudio.value.play()
      } else {
        // Create new audio element
        console.log('Creating new audio element with URL:', recordingUrl.value)
        recordingAudio.value = new Audio(recordingUrl.value)
        
        recordingAudio.value.addEventListener('ended', () => {
          console.log('Audio playback ended')
          isPlayingRecording.value = false
        })
        
        recordingAudio.value.addEventListener('error', (error) => {
          console.error('Error playing recording:', error)
          isPlayingRecording.value = false
        })
        
        recordingAudio.value.addEventListener('loadstart', () => {
          console.log('Audio loading started')
        })
        
        recordingAudio.value.addEventListener('canplay', () => {
          console.log('Audio can play')
        })
        
        await recordingAudio.value.play()
      }
      isPlayingRecording.value = true
      console.log('Audio playback started successfully')
    }
  } catch (error) {
    console.error('Error in playRecording:', error)
    isPlayingRecording.value = false
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }
  if (mediaRecorder.value && isRecording.value) {
    stopRecording()
  }
  if (recordingAudio.value) {
    recordingAudio.value.pause()
    recordingAudio.value.src = ''
    recordingAudio.value = null
  }
})
</script> 