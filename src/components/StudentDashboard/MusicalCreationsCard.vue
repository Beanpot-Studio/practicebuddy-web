<template>
  <div class="card card-green">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
        <Sparkle class="w-6 h-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-lg text-gray-800 font-bold">Your Practice Sessions</h3>
        <p class="text-sm text-gray-600">
          {{ isLoading ? 'Loading...' : `${practiceSessions.length} session${practiceSessions.length !== 1 ? 's' : ''}` }}
        </p>
      </div>
    </div>
    
    <div class="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8 text-gray-500">
        <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm">Loading practice sessions...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="practiceSessions.length === 0" class="text-center py-8 text-gray-500">
        <Music class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="text-sm">No practice sessions yet</p>
        <p class="text-xs mt-1">Start practicing to see your sessions here!</p>
      </div>
      
      <div 
        v-for="session in practiceSessions" 
        :key="session.id"
        class="flex flex-col gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] mb-4"
      >
        <!-- Session Header -->
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <img 
                v-if="session.instrument" 
                :src="`/instruments/${getInstrumentImage(session.instrument)}`" 
                :alt="getInstrumentName(session.instrument)"
                class="w-6 h-6 object-contain"
              />
              <div class="font-semibold text-gray-800 text-base">
                {{ session.description }}
              </div>
            </div>
            <div class="text-sm text-gray-500 font-medium">
              {{ formatDate(session.createdAt) }} • {{ session.practiceMinutes }} minutes
            </div>
         
          </div>
          <div class="flex items-center gap-2">
            <div class="text-xs bg-primary-100 text-blue-700 px-2 py-1 rounded-full">
              {{ session.practiceMinutes }}m
            </div>
          </div>
        </div>
        
        <!-- Recording Section -->
        <div v-if="getRecordingUrl(session)" class="mt-3">
          <div class="flex items-center gap-3">
            <!-- Traditional Play Button -->
            <button 
              class="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.2)] bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]" 
              @click="playRecording(getRecordingUrl(session), session.id)"
            >
              <Play class="w-5 h-5" />
            </button>
            
            <!-- Waveform -->
            <div class="flex-1">
              <AudioWaveform 
                :cloudinary-url="getRecordingUrl(session)"
              />
            </div>
          </div>
          
         
        </div>
        
        <!-- No Recording Message -->
        <div v-else class="mt-3 text-center py-3 text-gray-400 text-sm">
          <Mic class="w-4 h-4 mx-auto mb-1" />
          <p>No recording for this session</p>
        </div>
        
        <!-- Teacher Feedback Section (only shown when complete) -->
        <div v-if="session.isComplete && session.feedback && session.feedback.length > 0" class="mt-3">
          <div class="border-t border-gray-200 pt-3">
            <div class="text-xs font-medium text-gray-600 mb-2">Teacher Feedback:</div>
            <div class="flex flex-wrap gap-3">
              <!-- Stickers -->
              <div v-if="getStickers(session).length > 0" class="flex flex-wrap gap-2">
                <div 
                  v-for="sticker in getStickers(session)" 
                  :key="sticker.id"
                  class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"
                >
                  <img 
                    :src="`/src/assets/stickers/${sticker.stickerType}.png`" 
                    :alt="sticker.stickerType"
                    class="w-6 h-6 object-contain"
                  />
                  <div class="text-xs">
                    <div v-if="sticker.message" class="text-yellow-600">{{ sticker.message }}</div>
                    <div class="text-yellow-500">{{ formatDate(sticker.createdAt) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Comments -->
              <div v-if="getComments(session).length > 0" class="flex flex-wrap gap-2">
                <div 
                  v-for="comment in getComments(session)" 
                  :key="comment.id"
                  class="bg-primary-50 border border-blue-200 rounded-lg px-3 py-2"
                >
                  <div class="text-xs">
                    <div class="text-blue-700">{{ comment.comment }}</div>
                    <div class="text-blue-500">{{ formatDate(comment.createdAt) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Completion Status -->
        <div v-if="session.isComplete" class="mt-3 flex items-center gap-2 text-xs text-green-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Practice reviewed by teacher</span>
        </div>
      </div>
    </div>
    
   
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Play, Music, Mic, Clock, Sparkle } from 'lucide-vue-next'
import AudioWaveform from './AudioWaveform.vue'
import { getStandalonePractices } from '../../lib/auth.js'
import { getInstrumentImage, getInstrumentName } from '../../lib/instruments.js'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const practiceSessions = ref([])
const isLoading = ref(false)
const currentPlayingAudio = ref(null)
const currentPlayingSessionId = ref(null)

// Remove the computed property - use direct playbackProgress for better sync

// Load practice sessions
const loadPracticeSessions = async () => {
  if (!props.userId) return
  
  isLoading.value = true
  try {
    const { getStudentPractices } = await import('../../lib/auth.js')
    const result = await getStudentPractices(props.userId)
    if (result.success) {
      practiceSessions.value = result.practices
    }
  } catch (error) {
    console.error('Error loading practice sessions:', error)
  } finally {
    isLoading.value = false
  }
}

// Load sessions on mount
onMounted(() => {
  loadPracticeSessions()
})

// Cleanup on unmount
onUnmounted(() => {
  if (currentPlayingAudio.value) {
    currentPlayingAudio.value.pause()
    currentPlayingAudio.value = null
  }
  // The playbackTimer.value = null is no longer needed as we rely on timeupdate event
})

const emit = defineEmits(['play-recording'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const playRecording = (recording, sessionId) => {
  
  if (!recording) {
    return
  }
  
  try {
    // If we're already playing this session, pause it
    if (currentPlayingSessionId.value === sessionId && currentPlayingAudio.value) {
      currentPlayingAudio.value.pause()
      currentPlayingAudio.value = null
      currentPlayingSessionId.value = null
      return
    }
    
    // Stop any currently playing audio from other sessions
    if (currentPlayingAudio.value && currentPlayingSessionId.value !== sessionId) {
      currentPlayingAudio.value.pause()
      currentPlayingAudio.value = null
      currentPlayingSessionId.value = null
    }
    
    // Create new audio element and play
    const audio = new Audio(recording)
    audio.crossOrigin = 'anonymous' // Enable CORS for Cloudinary URLs
    audio.preload = 'auto'
    audio.setAttribute('playsinline', 'true')
    
    audio.addEventListener('error', (error) => {
      currentPlayingAudio.value = null
      currentPlayingSessionId.value = null
    })
    

    
    audio.addEventListener('ended', () => {
      currentPlayingAudio.value = null
      currentPlayingSessionId.value = null
    })
    
    audio.play().then(() => {
      currentPlayingAudio.value = audio
      currentPlayingSessionId.value = sessionId
      
      // Remove the separate timer - rely on timeupdate event for accurate progress
      // The timeupdate event will handle progress updates automatically
      
    }).catch((error) => {
      console.error('Autoplay prevented or playback failed:', error)
    })
    
  } catch (error) {
    console.error('Playback error:', error)
  }
}


const loadMoreSessions = () => {
  // TODO: Implement pagination for practice sessions
  // For now, just reload all sessions
  loadPracticeSessions()
}

const getRecordingUrl = (session) => {
  // Handle different recording data structures
  if (session.recording) {
    // If recording is a string (direct URL)
    if (typeof session.recording === 'string' && session.recording.startsWith('http')) {
      return session.recording
    }
    // If recording is an object with url property
    if (typeof session.recording === 'object' && session.recording.url) {
      return session.recording.url
    }
  }
  return null
}

const getRecordingDuration = (session) => {
  if (session.recording) {
    // If recording is an object with duration property
    if (typeof session.recording === 'object' && session.recording.duration) {
      return session.recording.duration
    }
  }
  return 0
}

const getRecordingFormat = (session) => {
  if (session.recording) {
    // If recording is an object with format property
    if (typeof session.recording === 'object' && session.recording.format) {
      return session.recording.format
    }
  }
  return 'mp3'
}

// Helper functions for feedback display
const getStickers = (session) => {
  if (!session.feedback) return []
  return session.feedback.filter(f => f.type === 'sticker' || f.stickerType)
}

const getComments = (session) => {
  if (!session.feedback) return []
  return session.feedback.filter(f => f.type === 'comment' || f.comment)
}

// Expose methods for parent component
defineExpose({
  loadPracticeSessions
})
</script> 