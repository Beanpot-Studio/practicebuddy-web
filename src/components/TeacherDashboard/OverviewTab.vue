<template>
  <div class="animate-fadeIn">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-12 h-12 border-4 border-musical-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 text-lg">Loading teacher dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Dashboard</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="$emit('loadClasses')"
        class="px-6 py-3 bg-musical-primary text-white rounded-xl font-semibold hover:bg-musical-primary/90 transition-all duration-200"
      >
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card card-red">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Dashboard Overview</h3>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white">
              <div class="text-2xl font-bold">{{ totalStudents }}</div>
              <div class="text-sm opacity-90 font-semibold">Music Students</div>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white">
              <div class="text-2xl font-bold">{{ classes.length }}</div>
              <div class="text-sm opacity-90 font-semibold">Active Classes</div>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white">
              <div class="text-2xl font-bold">{{ totalAssignments }}</div>
              <div class="text-sm opacity-90 font-semibold">Total Assignments</div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Card -->
        <div class="card card-blue">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
              <Bell class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Recent Activity</h3>
          </div>
          
          <!-- Loading State -->
          <div v-if="isLoadingRecentActivity" class="text-center py-8">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Loading recent activity...</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
            <Music class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p class="text-sm">No recent practice activity</p>
            <p class="text-xs mt-1">Student practice sessions will appear here</p>
          </div>
          
          <!-- Activity List -->
          <div v-else class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              :class="[
                'p-4 rounded-2xl border-2 shadow-[0_2px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_0_rgba(0,0,0,0.15)] transition-all duration-200',
                activity.isComplete 
                  ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300' 
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
              ]"
            >
              <!-- Student Info -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {{ activity.studentName?.charAt(0) || 'S' }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-800">{{ activity.studentName }}</div>
                    <div class="text-xs text-gray-500">{{ activity.className }}</div>
                  </div>
                </div>
                <div class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</div>
              </div>
              
              <!-- Practice Details -->
              <div class="mb-3">
                <div class="flex items-center gap-2 mb-2">
                  <img 
                    v-if="activity.instrument" 
                    :src="`/instruments/${getInstrumentImage(activity.instrument)}`" 
                    :alt="getInstrumentName(activity.instrument)"
                    class="w-5 h-5 object-contain"
                  />
                  <span class="text-sm font-medium text-gray-700">{{ activity.instrumentName || getInstrumentName(activity.instrument) }}</span>
                  <span class="text-xs text-gray-500">•</span>
                  <span class="text-sm text-gray-600">{{ activity.practiceMinutes }} minutes</span>
                </div>
                <div v-if="activity.description" class="text-sm text-gray-600">
                  {{ activity.description }}
                </div>
              </div>
              
              <!-- Recording Section -->
              <div v-if="activity.recording" class="mb-3">
                <div class="flex items-center gap-3">
                  <button 
                    @click="playRecording(getRecordingUrl(activity), activity.id)"
                    class="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_2px_0_rgba(0,0,0,0.2)] bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                  >
                    <Play v-if="!isPlayingRecording(activity.id)" class="w-4 h-4" />
                    <Pause v-else class="w-4 h-4" />
                  </button>
                  
                  <!-- Waveform -->
                  <div class="flex-1">
                    <AudioWaveform 
                      :cloudinary-url="getRecordingUrl(activity)"
                      @play="onWaveformPlay"
                      @pause="onWaveformPause"
                      @error="onWaveformError"
                    />
                  </div>
                  
                  <span class="text-xs text-gray-500">{{ formatDuration(activity.recordingDuration) }}</span>
                </div>
              </div>
              
              <!-- Feedback Display Section -->
              <div v-if="activity.feedback && activity.feedback.length > 0" class="mb-3">
                <div class="space-y-2">
                  <!-- Stickers -->
                  <div v-if="getStickers(activity).length > 0" class="flex flex-wrap gap-2">
                    <div 
                      v-for="sticker in getStickers(activity)" 
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
                  <div v-if="getComments(activity).length > 0" class="space-y-2">
                    <div 
                      v-for="comment in getComments(activity)" 
                      :key="comment.id"
                      class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                    >
                      <div class="text-xs">
                        <div class="text-blue-700">{{ comment.comment }}</div>
                        <div class="text-blue-500">{{ formatDate(comment.createdAt) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Feedback Section -->
              <div class="mt-3 flex gap-2">
                <button 
                  @click="openStickerModal(activity)"
                  class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors flex items-center gap-1"
                >
                  <Trophy class="w-4 h-4" />
                  Give Sticker
                </button>
                <button 
                  @click="openCommentModal(activity)"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <MessageCircle class="w-4 h-4" />
                  Add Comment
                </button>
                <button 
                  @click="markAsComplete(activity)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                    activity.isComplete 
                      ? 'bg-green-100 text-green-700 cursor-default' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  ]"
                  :disabled="activity.isComplete"
                >
                  <CheckCircle class="w-4 h-4" />
                  {{ activity.isComplete ? 'Completed' : 'Mark Complete' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Roster Table -->
      <div class="card card-yellow">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
              <Users class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl text-gray-800 font-bold">Student Roster</h3>
          </div>
          <div class="text-sm text-gray-600">
            {{ allStudents.length }} total students
          </div>
        </div>

        <!-- Class Selection -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <h4 class="text-lg font-semibold text-gray-700">Filter by Class:</h4>
            <button 
              @click="$emit('selectClassForRoster', null)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                !selectedClassForRoster 
                  ? 'bg-yellow-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              All Classes ({{ allStudents.length }})
            </button>
            <div 
              v-for="classItem in classes" 
              :key="classItem.id"
              @click="$emit('selectClassForRoster', classItem)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200',
                selectedClassForRoster?.id === classItem.id
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ classItem.name }} ({{ classItem.studentCount }})
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoadingRoster" class="text-center py-8">
          <div class="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading roster...</p>
        </div>
        
        <!-- No Students State -->
        <div v-else-if="displayStudentEnrollments.length === 0" class="text-center py-8">
          <Music class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            {{ selectedClassForRoster ? `No Students in ${selectedClassForRoster.name}` : 'No Students Yet' }}
          </h4>
          <p class="text-gray-600 mb-4">
            {{ selectedClassForRoster 
              ? 'Students will appear here once they join this class.'
              : 'Students will appear here once they join your classes.' 
            }}
          </p>
        </div>
        
        <!-- Students Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th v-if="selectedClassForRoster" class="text-left py-3 px-4 font-semibold text-gray-700">Instrument</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Assignments</th>
                <th v-if="selectedClassForRoster" class="text-left py-3 px-4 font-semibold text-gray-700">Class Goals</th>
                <th v-else class="text-left py-3 px-4 font-semibold text-gray-700">Goals</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="enrollment in displayStudentEnrollments" 
                :key="`${enrollment.studentId}-${enrollment.classId}`"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                   
                    <div>
                      <div class="font-semibold text-gray-800">{{ enrollment.studentName || enrollment.name || 'Unknown Student' }}</div>
                    </div>
                  </div>
                </td>
                <td v-if="selectedClassForRoster" class="py-3 px-4">
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ enrollment.instrument || 'Not specified' }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    
                    <span class="text-gray-700 font-medium">{{ enrollment.className || 'Unknown Class' }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="text-gray-600">{{ formatJoinDate(enrollment.studentCreatedAt || enrollment.joinDate || enrollment.createdAt) }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-green-600">{{ getStudentAssignmentCount(enrollment.studentId, enrollment.classId) }}</div>
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getAssignmentProgress(enrollment.studentId, enrollment.classId) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <!-- Class Goals Column (only when filtering by class) -->
                <td v-if="selectedClassForRoster" class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-orange-600">{{ getClassGoalsCount(selectedClassForRoster.id) }}</div>
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getClassGoalsProgress(selectedClassForRoster.id) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <!-- Combined Goals Column (when not filtering by class) -->
                <td v-else class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-blue-600">{{ getTotalGoalsCount(enrollment.studentId, enrollment.classId) }}</div>
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: getTotalGoalsProgress(enrollment.studentId, enrollment.classId) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium border',
                    getStudentStatus(enrollment) === 'active' 
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  ]">
                    {{ getStudentStatus(enrollment) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Sticker Modal -->
  <div v-if="showStickerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800">Give Sticker to {{ selectedActivity?.studentName }}</h3>
        <button @click="closeStickerModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Trophy class="w-4 h-4" />
          Choose a sticker:
        </label>
        <div class="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
          <button 
            v-for="i in 40" 
            :key="i"
            @click="selectSticker(i)"
            :class="[
              'p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105',
              selectedSticker === i 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <img 
              :src="`/src/assets/stickers/sticker${i}.png`" 
              :alt="`Sticker ${i}`"
              class="w-8 h-8 object-contain"
            />
          </button>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Message (optional):</label>
        <textarea 
          v-model="stickerMessage"
          placeholder="Great job! Keep up the excellent work!"
          class="w-full p-3 border-2 border-gray-200 rounded-lg resize-none"
          rows="3"
        ></textarea>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="closeStickerModal"
          class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="giveStickerToActivity"
          :disabled="!selectedSticker"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Give Sticker
        </button>
      </div>
    </div>
  </div>
  
  <!-- Comment Modal -->
  <div v-if="showCommentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800">Add Comment to {{ selectedActivity?.studentName }}</h3>
        <button @click="closeCommentModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MessageCircle class="w-4 h-4" />
          Your comment:
        </label>
        <textarea 
          v-model="commentText"
          placeholder="Great practice session! I noticed your rhythm was much better today..."
          class="w-full p-3 border-2 border-gray-200 rounded-lg resize-none"
          rows="4"
        ></textarea>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="closeCommentModal"
          class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="addCommentToActivity"
          :disabled="!commentText.trim()"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Comment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { BarChart3, Bell, Users, Music, Play, Pause, Trophy, MessageCircle, CheckCircle } from 'lucide-vue-next'
import AudioWaveform from '../StudentDashboard/AudioWaveform.vue'
import { getInstrumentImage, getInstrumentName } from '../../lib/instruments.js'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  },
  classes: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  allStudents: {
    type: Array,
    default: () => []
  },
  studentAssignments: {
    type: Object,
    default: () => ({})
  },
  recentActivity: {
    type: Array,
    default: () => []
  },
  selectedClassForRoster: {
    type: Object,
    default: null
  },
  classRoster: {
    type: Array,
    default: () => []
  },
  isLoadingRoster: {
    type: Boolean,
    default: false
  },
  studentGoals: {
    type: Object,
    default: () => ({})
  },
  classGoals: {
    type: Object,
    default: () => ({})
  },
  isLoadingRecentActivity: {
    type: Boolean,
    default: false
  },
  giveSticker: {
    type: Function,
    default: () => {}
  },
  addComment: {
    type: Function,
    default: () => {}
  },
  markAsComplete: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['changeTab', 'selectStudent', 'selectClassForRoster', 'loadClasses'])

// Audio playback state
const currentPlayingAudio = ref(null)
const currentPlayingActivityId = ref(null)

// Cleanup on unmount
onUnmounted(() => {
  if (currentPlayingAudio.value) {
    currentPlayingAudio.value.pause()
    currentPlayingAudio.value = null
  }
})

// Audio playback functions
const playRecording = (recording, activityId) => {
  
  if (!recording) {
    return
  }
  
  try {
    // If we're already playing this activity, pause it
    if (currentPlayingActivityId.value === activityId && currentPlayingAudio.value) {
      currentPlayingAudio.value.pause()
      currentPlayingAudio.value = null
      currentPlayingActivityId.value = null
      return
    }
    
    // Stop any currently playing audio from other activities
    if (currentPlayingAudio.value && currentPlayingActivityId.value !== activityId) {
      currentPlayingAudio.value.pause()
      currentPlayingAudio.value = null
      currentPlayingActivityId.value = null
    }
    
    // Create new audio element and play
    const audio = new Audio(recording)
    audio.crossOrigin = 'anonymous' // Enable CORS for Cloudinary URLs
    
    audio.addEventListener('error', (error) => {
      currentPlayingAudio.value = null
      currentPlayingActivityId.value = null
    })
    
    audio.addEventListener('loadstart', () => {
    })
    
    audio.addEventListener('canplay', () => {
    })
    
    audio.addEventListener('ended', () => {
      currentPlayingAudio.value = null
      currentPlayingActivityId.value = null
    })
    
    audio.play().then(() => {
      currentPlayingAudio.value = audio
      currentPlayingActivityId.value = activityId
    }).catch((error) => {
      console.error('Failed to play audio:', error)
    })
    
  } catch (error) {
    console.error('Error in playRecording:', error)
  }
}

const isPlayingRecording = (activityId) => {
  return currentPlayingActivityId.value === activityId && currentPlayingAudio.value
}

const getRecordingUrl = (activity) => {
  
  // Handle different recording data structures
  if (activity.recording) {
    // If recording is a string (direct URL)
    if (typeof activity.recording === 'string' && activity.recording.startsWith('http')) {
      return activity.recording
    }
    // If recording is an object with url property
    if (typeof activity.recording === 'object' && activity.recording.url) {
      return activity.recording.url
    }
  } else {
  }
  return null
}

const onWaveformPlay = () => {
}

const onWaveformPause = () => {
}

const onWaveformError = (error) => {
  console.error('Waveform error:', error)
}

// Modal state
const showStickerModal = ref(false)
const showCommentModal = ref(false)
const selectedActivity = ref(null)
const selectedSticker = ref(null)
const stickerMessage = ref('')
const commentText = ref('')

// Modal functions
const openStickerModal = (activity) => {
  selectedActivity.value = activity
  selectedSticker.value = null
  stickerMessage.value = ''
  showStickerModal.value = true
}

const closeStickerModal = () => {
  showStickerModal.value = false
  selectedActivity.value = null
  selectedSticker.value = null
  stickerMessage.value = ''
}

const selectSticker = (stickerNumber) => {
  selectedSticker.value = stickerNumber
}

const giveStickerToActivity = async () => {
  if (!selectedSticker.value || !selectedActivity.value) return
  
  try {
    const result = await props.giveSticker(
      selectedActivity.value.id,
      selectedActivity.value.studentId,
      `sticker${selectedSticker.value}`,
      stickerMessage.value || 'Great job!'
    )
    
    if (result) {
      closeStickerModal()
    }
  } catch (error) {
    console.error('Error giving sticker:', error)
  }
}

const openCommentModal = (activity) => {
  selectedActivity.value = activity
  commentText.value = ''
  showCommentModal.value = true
}

const closeCommentModal = () => {
  showCommentModal.value = false
  selectedActivity.value = null
  commentText.value = ''
}

const addCommentToActivity = async () => {
  if (!commentText.value.trim() || !selectedActivity.value) return
  
  try {
    const result = await props.addComment(
      selectedActivity.value.id,
      selectedActivity.value.studentId,
      commentText.value.trim()
    )
    
    if (result) {
      closeCommentModal()
    }
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

const markAsComplete = async (activity) => {
  if (activity.isComplete) return
  
  try {
    const result = await props.markAsComplete(
      activity.id,
      activity.studentId
    )
    
    if (result) {
      // The parent component should refresh the activity list
    }
  } catch (error) {
  }
}

// Helper functions for feedback display
const getStickers = (activity) => {
  if (!activity.feedback) return []
  const stickers = activity.feedback.filter(f => f.type === 'sticker' || f.stickerType)
  return stickers
}

const getComments = (activity) => {
  if (!activity.feedback) return []
  const comments = activity.feedback.filter(f => f.type === 'comment' || f.comment)
  return comments
}

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const totalStudents = computed(() => props.allStudents.length)
const totalAssignments = computed(() => {
  const total = Object.values(props.studentAssignments).reduce((total, count) => {
    return total + (count || 0)
  }, 0)
  return total
})

// Create enrollment records - one per student per class
const displayStudentEnrollments = computed(() => {
  const enrollments = []
  
  if (props.selectedClassForRoster) {
    // Show enrollments for the selected class
    const classStudents = props.classRoster || []
    classStudents.forEach(student => {
      if (student) {
        const enrollment = {
          studentId: student.studentId || student.id,
          studentName: student.studentName || student.name,
          email: student.email,
          instrument: student.instrument,
          classId: props.selectedClassForRoster?.id,
          className: props.selectedClassForRoster?.name,
          joinDate: student.joinedAt || student.createdAt,
          classCode: props.selectedClassForRoster?.code,
          studentCreatedAt: student.joinedAt || student.createdAt,
          lastPracticeDate: student.lastPracticeAt || student.lastPracticeDate || student.lastActivity
        }
        enrollments.push(enrollment)
      }
    })
  } else {
    // Show all student enrollments across all classes
    const classes = props.classes || []
    classes.forEach(classItem => {
      if (classItem && classItem.students) {
        const classStudents = classItem.students || []
        classStudents.forEach(student => {
          if (student) {
            const enrollment = {
              studentId: student.studentId || student.id,
              studentName: student.studentName || student.name,
              email: student.email,
              instrument: student.instrument,
              classId: classItem.id,
              className: classItem.name,
              joinDate: student.joinedAt || student.createdAt,
              classCode: classItem.code,
              studentCreatedAt: student.joinedAt || student.createdAt,
              lastPracticeDate: student.lastPracticeAt || student.lastPracticeDate || student.lastActivity
            }
            enrollments.push(enrollment)
          }
        })
      }
    })
    
    // Add standalone students (not in any class)
    const enrolledStudentIds = new Set(enrollments.map(e => e.studentId))
    const allStudents = props.allStudents || []
    allStudents.forEach(student => {
      if (student && !enrolledStudentIds.has(student.studentId || student.id)) {
        const enrollment = {
          studentId: student.studentId || student.id,
          studentName: student.studentName || student.name,
          email: student.email,
          instrument: student.instrument,
          classId: null,
          className: 'Standalone',
          joinDate: student.joinedAt || student.createdAt,
          classCode: null,
          studentCreatedAt: student.joinedAt || student.createdAt,
          lastPracticeDate: student.lastPracticeAt || student.lastPracticeDate || student.lastActivity
        }
        enrollments.push(enrollment)
      }
    })
  }
  
  return enrollments
})


const formatJoinDate = (dateString) => {
  if (!dateString) {
    return 'Recent' // Better fallback than 'Unknown'
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Recent'
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting join date:', error)
    return 'Recent'
  }
}



const getStudentAssignmentCount = (studentId, classId) => {
  if (!studentId) return 0
  
  // Count assignments for this student in this class
  const key = `${studentId}-${classId || 'standalone'}`
  return props.studentAssignments[key] || 0
}

const getAssignmentProgress = (studentId, classId) => {
  if (!studentId) return 0
  // This would be calculated based on actual progress data
  // For now, return a random progress for demonstration
  return Math.floor(Math.random() * 100)
}

const getIndividualGoalsCount = (studentId) => {
  if (!studentId) return 0
  const studentGoals = props.studentGoals?.[studentId] || []
  return studentGoals.filter(goal => goal && goal.type === 'individual' && goal.status === 'active').length
}

const getIndividualGoalsProgress = (studentId) => {
  if (!studentId) return 0
  const studentGoals = props.studentGoals?.[studentId] || []
  const activeGoals = studentGoals.filter(goal => goal && goal.type === 'individual' && goal.status === 'active')
  if (activeGoals.length === 0) return 0
  
  const completedGoals = activeGoals.filter(goal => goal.progress >= goal.target)
  return Math.round((completedGoals.length / activeGoals.length) * 100)
}

const getClassGoalsCount = (classId) => {
  if (!classId) return 0
  const classGoals = props.classGoals?.[classId] || []
  return classGoals.filter(goal => goal && goal.status === 'active').length
}

const getClassGoalsProgress = (classId) => {
  if (!classId) return 0
  const classGoals = props.classGoals?.[classId] || []
  const activeGoals = classGoals.filter(goal => goal && goal.status === 'active')
  if (activeGoals.length === 0) return 0
  
  const completedGoals = activeGoals.filter(goal => goal.progress >= goal.target)
  return Math.round((completedGoals.length / activeGoals.length) * 100)
}

const getTotalGoalsCount = (studentId, classId) => {
  if (!studentId) return 0
  
  const individualCount = getIndividualGoalsCount(studentId)
  const classCount = getClassGoalsCount(classId)
  
  return individualCount + classCount
}

const getTotalGoalsProgress = (studentId, classId) => {
  if (!studentId) return 0
  
  const individualProgress = getIndividualGoalsProgress(studentId)
  const classProgress = getClassGoalsProgress(classId)
  
  // Calculate weighted average based on number of goals
  const individualCount = getIndividualGoalsCount(studentId)
  const classCount = getClassGoalsCount(classId)
  const totalCount = individualCount + classCount
  
  if (totalCount === 0) return 0
  
  const weightedProgress = (individualProgress * individualCount + classProgress * classCount) / totalCount
  return Math.round(weightedProgress)
}

const getStudentStatus = (enrollment) => {
  try {
    // Check if student has recent activity
    const lastActivity = enrollment.lastPracticeAt
    if (!lastActivity) return 'inactive'
    
    const lastActivityDate = new Date(lastActivity)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    // Student is active if they practiced within the last 2 weeks
    return lastActivityDate > twoWeeksAgo ? 'active' : 'inactive'
  } catch (error) {
    console.error('Error determining student status:', error)
    return 'inactive'
  }
}
</script> 