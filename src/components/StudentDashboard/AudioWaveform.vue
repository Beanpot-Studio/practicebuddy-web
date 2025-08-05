<template>
  <div class="relative overflow-hidden">
    <div class="waveform-container overflow-x-auto">
      <!-- Waveform image -->
      <img 
        v-if="waveformUrl"
        :src="waveformUrl" 
        :alt="'Audio waveform'"
        class="h-16 object-cover rounded-lg bg-gray-100 transition-opacity hover:opacity-80 min-w-full"
        @error="handleError"
        crossorigin="anonymous"
      />
      
      <!-- No waveform placeholder -->
      <div v-else class="h-16 bg-gray-200 rounded-lg flex items-center justify-center min-w-full">
        <span class="text-xs text-gray-500">
          {{ props.cloudinaryUrl ? 'Loading waveform...' : 'No waveform available' }}
        </span>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div v-if="isPlaying" class="mt-2">
      <div class="w-full bg-gray-200 rounded-full h-1">
        <div 
          class="bg-primary-500 h-1 rounded-full transition-all duration-100"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="mt-2 text-red-500 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { getWaveformUrl, createAudioPlayer } from '../../lib/cloudinary.js'

const props = defineProps({
  cloudinaryUrl: {
    type: String,
    required: false,
    default: null
  }
})

const emit = defineEmits(['play', 'pause', 'error'])

const isPlaying = ref(false)
const progress = ref(0)
const error = ref(null)
const audio = ref(null)

// Generate waveform URL
const waveformUrl = computed(() => {
  if (!props.cloudinaryUrl) {
    return null
  }
  
  return getWaveformUrl(props.cloudinaryUrl)
})

// Play audio
const playAudio = async () => {
  try {
    error.value = null
    
    if (!props.cloudinaryUrl) {
      throw new Error('No audio URL available')
    }
    
    if (!audio.value) {
      audio.value = createAudioPlayer(props.cloudinaryUrl)
      if (!audio.value) {
        throw new Error('Failed to create audio player')
      }
      
      // Set up event listeners
      audio.value.addEventListener('timeupdate', updateProgress)
      audio.value.addEventListener('ended', handleEnded)
      audio.value.addEventListener('error', handleAudioError)
    }
    
    await audio.value.play()
    isPlaying.value = true
    emit('play')
  } catch (err) {
    console.error('Error playing audio:', err)
    error.value = 'Failed to play audio'
    emit('error', err)
  }
}

// Pause audio
const pauseAudio = () => {
  if (audio.value) {
    audio.value.pause()
    isPlaying.value = false
    emit('pause')
  }
}

// Update progress bar
const updateProgress = () => {
  if (audio.value && audio.value.duration) {
    progress.value = (audio.value.currentTime / audio.value.duration) * 100
  }
}

// Handle audio ended
const handleEnded = () => {
  isPlaying.value = false
  progress.value = 0
}

// Handle audio error
const handleAudioError = (err) => {
  console.error('Audio error:', err)
  error.value = 'Audio playback error'
  isPlaying.value = false
  emit('error', err)
}

// Handle image error
const handleError = () => {
  console.error('Waveform image failed to load:', waveformUrl.value)
  error.value = 'Failed to load waveform'
}

// Cleanup on unmount
onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
    audio.value = null
  }
})
</script> 