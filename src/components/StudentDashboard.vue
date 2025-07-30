<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <div class="text-center mb-10 text-white flex flex-col items-center gap-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
          👋
        </div>
        <h2 class="text-3xl font-bold text-shadow-lg text-musical-graphite">Hey {{ studentName }}! Ready to make some music?</h2>
        <p class="text-lg opacity-95 font-medium text-musical-graphite">Track your practice time and collect stickers!</p>
      </div>

      <!-- Stats Card - Full Width -->
      <div class="mb-8">
        <div class="card card-red">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
              📊
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Your Musical Stats</h3>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
              <div class="text-2xl font-bold mb-1">{{ totalPracticeTime }}</div>
              <div class="text-xs opacity-90 font-semibold">Minutes Today</div>
            </div>
            <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
              <div class="text-2xl font-bold mb-1">{{ currentStreak }}</div>
              <div class="text-xs opacity-90 font-semibold">Day Streak</div>
            </div>
            <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
              <div class="text-2xl font-bold mb-1">{{ stickerCount }}</div>
              <div class="text-xs opacity-90 font-semibold">Stickers Earned</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Cards - Half Width Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Start Practicing Card -->
        <div class="card card-blue">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
              <Music class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Start Practicing</h3>
          </div>
          <div class="flex flex-col gap-4">
            <div class="relative">
              <label class="block mb-2 font-semibold text-gray-700 text-base"><Music class="inline w-5 h-5 mr-1" />Choose your instrument</label>
              <div class="relative">
                <button 
                  @click="showInstrumentDropdown = !showInstrumentDropdown"
                  type="button"
                  class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5 flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="selectedInstrument" 
                      :src="`/instruments/${getSelectedInstrumentImage()}`" 
                      :alt="getSelectedInstrumentName()"
                      class="w-6 h-6 object-contain"
                    />
                    <span v-else class="text-gray-500">Choose your instrument</span>
                    <span v-if="selectedInstrument" class="text-gray-800">{{ getSelectedInstrumentName() }}</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div 
                  v-if="showInstrumentDropdown"
                  class="absolute z-50 w-full mt-1 bg-white border-4 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
                >
                  <div 
                    v-for="instrument in instruments" 
                    :key="instrument.value"
                    @click="selectInstrument(instrument.value)"
                    class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img 
                      :src="`/instruments/${instrument.image}`" 
                      :alt="instrument.name"
                      class="w-6 h-6 object-contain"
                    />
                    <span class="text-gray-800">{{ instrument.name.replace(/^[^\s]*\s/, '') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base">⏰ Practice Time (minutes)</label>
              <input 
                type="number" 
                v-model="practiceTime" 
                min="1" 
                max="120" 
                placeholder="30"
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5"
              />
            </div>
            <button 
              @click="startPractice" 
              :disabled="!selectedInstrument || !practiceTime"
              class="btn btn-blue w-full p-4 text-base font-bold"
            >
              <Play class="w-5 h-5" />
              Start Practice Session!
            </button>
          </div>
        </div>

        <!-- Your Musical Creations Card -->
        <div class="card card-green">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              <Mic class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Your Musical Creations</h3>
          </div>
          <div class="flex flex-col gap-3">
            <div 
              v-for="recording in recordings" 
              :key="recording.id"
              class="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]"
            >
              <div class="flex-1">
                <div class="font-semibold text-gray-800 text-base">{{ recording.title }}</div>
                <div class="text-sm text-gray-500 font-medium">{{ formatDate(recording.date) }}</div>
              </div>
              <div class="flex items-center gap-3">
                <button class="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.2)] bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]" @click="playRecording(recording)">
                  <Play class="w-5 h-5" />
                </button>
                <div class="flex gap-1">
                  <span v-for="sticker in recording.stickers" :key="sticker" class="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    {{ sticker }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="showRecordingModal = true" class="btn btn-secondary w-full p-4 text-base font-bold mt-4">
            <Mic class="w-5 h-5" />
            Record New Creation
          </button>
        </div>
      
      </div>

       
    

      <!-- Class Enrollment/Assignments Section - Half Width -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Class Enrollment Section -->
        <div v-if="!currentUser?.classCode" class="card card-purple">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Join a Music Class</h3>
          </div>
          
          <div class="text-center py-8">
            <div class="text-4xl mb-4">🎓</div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">Ready to Learn with a Teacher?</h4>
            <p class="text-gray-600 mb-6">Join a music class to get assignments, feedback, and guidance from your teacher!</p>
            
            <div class="max-w-md mx-auto">
              <div class="mb-4">
                <label class="block mb-2 font-semibold text-gray-700 text-base">📝 Class Code</label>
                <input 
                  v-model="classCodeToJoin" 
                  placeholder="Enter your class code (e.g., MUSIC101)"
                  class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] focus:transform focus:-translate-y-0.5"
                />
              </div>
              
              <button 
                @click="joinClass" 
                :disabled="!classCodeToJoin || isJoiningClass"
                :class="[
                  'btn w-full p-4 text-base font-bold',
                  !classCodeToJoin || isJoiningClass ? 'opacity-50 cursor-not-allowed' : 'btn-purple'
                ]"
              >
                <div v-if="isJoiningClass" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span v-else>🎯 Join Class</span>
              </button>
              
              <div v-if="joinClassError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {{ joinClassError }}
              </div>
              
              <div v-if="joinClassSuccess" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                ✅ Successfully joined the class! Your teacher will see you soon.
              </div>
            </div>
          </div>
        </div>

        <!-- Class Assignments Section -->
        <div v-if="currentUser?.classCode" class="card card-purple">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Class Assignments</h3>
          </div>
          
          <div v-if="isLoadingAssignments" class="text-center py-8">
            <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Loading assignments...</p>
          </div>
          
          <div v-else-if="assignments.length === 0" class="text-center py-8">
            <div class="text-4xl mb-4">📚</div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">No Assignments Yet</h4>
            <p class="text-gray-600">Your teacher will post assignments here soon!</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="assignment in assignments" 
              :key="assignment.id"
              class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800 text-lg mb-1">{{ assignment.title }}</h4>
                  <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDueDate(assignment.dueDate) }}</span>
                  </div>
                  <div v-if="assignment.practiceMinutes" class="flex items-center gap-1 text-sm text-purple-600 font-semibold">
                    <span>⏱️ {{ assignment.practiceMinutes }} min</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button class="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors">
                    <CheckCircle class="w-4 h-4 inline mr-1" />
                    Mark Complete
                  </button>
                  <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors">
                    View Details
                  </button>
                </div>
                <div class="text-xs text-gray-500">
                  Assigned {{ new Date(assignment.createdAt).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!--Achievements Card-->
        <div class="card card-yellow">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
              🏆
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Your Achievement Badges</h3>
          </div>
          <div class="flex flex-col gap-3">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              :class="[
                'flex items-center gap-3 p-4 rounded-2xl border-3 transition-all duration-300 shadow-[0_4px_0_rgba(0,0,0,0.1)]',
                achievement.earned 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-600 text-white transform -translate-y-0.5 shadow-[0_6px_0_rgba(0,0,0,0.2)]' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 opacity-50'
              ]"
            >
              <div class="w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-full border-2 shadow-[0_2px_0_rgba(0,0,0,0.1)]" :class="achievement.earned ? 'border-yellow-600' : 'border-gray-200'">
                {{ achievement.icon }}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-base mb-1">{{ achievement.title }}</div>
                <div class="text-sm opacity-80 font-medium">{{ achievement.description }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Standalone Practice Sessions Section (for users not in a class) -->
        <div v-if="!currentUser?.classCode" class="card card-orange mb-8">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-orange-600 bg-gradient-to-br from-orange-400 to-orange-500 relative">
              <Music class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Your Practice Sessions</h3>
          </div>
          
          <div v-if="isLoadingPractices" class="text-center py-8">
            <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Loading practice sessions...</p>
          </div>
          
          <div v-else-if="standalonePractices.length === 0" class="text-center py-8">
            <div class="text-4xl mb-4">🎵</div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">No Practice Sessions Yet</h4>
            <p class="text-gray-600">Start practicing to see your sessions here!</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="practice in standalonePractices" 
              :key="practice.id"
              class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <img 
                      v-if="practice.instrument" 
                      :src="`/instruments/${getInstrumentImage(practice.instrument)}`" 
                      :alt="getInstrumentName(practice.instrument)"
                      class="w-6 h-6 object-contain"
                    />
                    <h4 class="font-semibold text-gray-800 text-lg">{{ getInstrumentName(practice.instrument) }} Practice</h4>
                  </div>
                  <p v-if="practice.description" class="text-gray-600 text-sm mb-2">{{ practice.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1 text-sm text-orange-600 font-semibold">
                    <span>⏱️ {{ practice.practiceMinutes }} min</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                  {{ formatDate(new Date(practice.createdAt)) }}
                </div>
                <div class="flex items-center gap-2">
                  <button class="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors">
                    <Play class="w-3 h-3 inline mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>

    
      
      </div>

    <!-- Recording Modal -->
    <div v-if="showRecordingModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" @click="showRecordingModal = false">
      <div class="card card-blue max-w-lg w-11/12 max-h-[80vh] overflow-hidden m-5" @click.stop>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            <Mic class="w-6 h-6 text-white" />
          </div>
          <h3 class="flex-1 text-xl text-gray-800 font-bold">Record Your Musical Creation</h3>
          <button @click="showRecordingModal = false" class="w-10 h-10 border-2 border-gray-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.1)]">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div>
          <div class="flex flex-col gap-5">
            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base"><Music class="inline w-5 h-5 mr-1" />Creation Title</label>
              <input 
                v-model="newRecordingTitle" 
                placeholder="Today's awesome piano practice"
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5"
              />
            </div>
            <div class="text-center">
              <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-gray-300 shadow-[0_6px_0_rgba(0,0,0,0.1)]">
                <div class="text-5xl font-bold text-gray-800 mb-2">{{ formatTime(recordingTime) }}</div>
                <div class="text-base font-semibold">
                  <span v-if="isRecording" class="text-red-500">🔴 Recording music...</span>
                  <span v-else class="text-gray-500"><Trophy class="inline w-4 h-4 mr-1" />Ready to create!</span>
                </div>
              </div>
            </div>
            <div>
              <button 
                @click="toggleRecording" 
                :class="[
                  'btn w-full p-4 text-base font-bold',
                  isRecording ? 'btn-warning' : 'btn-success'
                ]"
              >
                <component :is="isRecording ? Square : Mic" class="w-5 h-5" />
                {{ isRecording ? 'Stop Recording' : 'Start Creating' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Play, Mic, Square, X, BookOpen, Calendar, CheckCircle, Music, Trophy, Star } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { instruments, getInstrumentImage, getInstrumentName } from '../lib/instruments'

const props = defineProps({
  studentName: {
    type: String,
    default: 'Student'
  }
})

const { 
  currentUser, 
  fetchClassAssignments, 
  fetchStudentStandaloneAssignments, 
  joinClassAsStudent, 
  updateStudentLoginActivity, 
  updateStudentPracticeActivity,
  createStandalonePractice,
  fetchStandalonePractices,
  getUserPracticeStats
} = useAuth()

const totalPracticeTime = ref(45)
const currentStreak = ref(7)
const stickerCount = ref(23)

const selectedInstrument = ref('')
const practiceTime = ref(30)
const showInstrumentDropdown = ref(false)

// Standalone practice sessions
const standalonePractices = ref([])
const isLoadingPractices = ref(false)
const userPracticeStats = ref(null)

// Helper functions for custom dropdown
const selectInstrument = (value) => {
  selectedInstrument.value = value
  showInstrumentDropdown.value = false
}

const getSelectedInstrumentName = () => {
  return getInstrumentName(selectedInstrument.value)
}

const getSelectedInstrumentImage = () => {
  return getInstrumentImage(selectedInstrument.value)
}

const recordings = ref([
  {
    id: 1,
    title: 'Piano Practice - Scales',
    date: new Date(2024, 0, 15),
    stickers: ['⭐', '🎵', '👍']
  },
  {
    id: 2,
    title: 'Guitar Creation - Chords',
    date: new Date(2024, 0, 14),
    stickers: ['🎸', '💫']
  },
  {
    id: 3,
    title: 'Violin Performance',
    date: new Date(2024, 0, 13),
    stickers: ['🎻', '🌟', '🎯']
  }
])

const achievements = ref([
  {
    id: 1,
    title: 'First Week Star',
    description: 'Practice 7 days in a row',
    icon: '🗓️',
    earned: true
  },
  {
    id: 2,
    title: 'Speed Musician',
    description: 'Practice 60 minutes in one day',
    icon: '⚡',
    earned: true
  },
  {
    id: 3,
    title: 'Multi-Instrumentalist',
    description: 'Practice with 3 different instruments',
    icon: '🎭',
    earned: false
  },
  {
    id: 4,
    title: 'Recording Master',
    description: 'Create 10 musical recordings',
    icon: '🌟',
    earned: false
  }
])

const showRecordingModal = ref(false)
const newRecordingTitle = ref('')
const isRecording = ref(false)
const recordingTime = ref(0)

// Class enrollment
const classCodeToJoin = ref('')
const isJoiningClass = ref(false)
const joinClassError = ref('')
const joinClassSuccess = ref('')

// Class assignments
const assignments = ref([])
const isLoadingAssignments = ref(false)

const startPractice = async () => {
  const selectedInstrumentObj = instruments.find(instr => instr.value === selectedInstrument.value)
  const instrumentName = selectedInstrumentObj ? selectedInstrumentObj.name : selectedInstrument.value
  
  alert(`Starting ${practiceTime.value} minutes of ${instrumentName} practice!`)
  totalPracticeTime.value += parseInt(practiceTime.value)
  
  // Track practice activity based on whether student is enrolled in a class
  if (currentUser.value?.classCode) {
    // Track in class if enrolled
    try {
      await updateStudentPracticeActivity(
        currentUser.value.classCode,
        currentUser.value.uid,
        parseInt(practiceTime.value)
      )
      console.log('Practice activity tracked in class successfully')
    } catch (error) {
      console.error('Error tracking practice activity in class:', error)
    }
  } else {
    // Track standalone practice if not enrolled in a class
    try {
      const practiceData = {
        instrument: selectedInstrument.value,
        practiceMinutes: parseInt(practiceTime.value),
        description: `${instrumentName} practice session`
      }
      
      const result = await createStandalonePractice(
        currentUser.value.uid,
        practiceData
      )
      
      if (result.success) {
        console.log('Standalone practice session created successfully')
        // Refresh practice sessions
        await loadStandalonePractices()
        await loadUserPracticeStats()
      } else {
        console.error('Error creating standalone practice session:', result.error)
      }
    } catch (error) {
      console.error('Error tracking standalone practice activity:', error)
    }
  }
}

const loadStandalonePractices = async () => {
  if (!currentUser.value?.uid) return
  
  isLoadingPractices.value = true
  try {
    const result = await fetchStandalonePractices(currentUser.value.uid)
    if (result.success) {
      standalonePractices.value = result.practices
    } else {
      console.error('Failed to load standalone practices:', result.error)
    }
  } catch (error) {
    console.error('Error loading standalone practices:', error)
  } finally {
    isLoadingPractices.value = false
  }
}

const loadUserPracticeStats = async () => {
  if (!currentUser.value?.uid) return
  
  try {
    const result = await getUserPracticeStats(currentUser.value.uid)
    if (result.success) {
      userPracticeStats.value = result.practiceStats
      // Update the display values
      totalPracticeTime.value = result.practiceStats.totalPracticeMinutes || 0
      currentStreak.value = Math.floor(result.practiceStats.totalPracticeMinutes / 30) || 0 // Simple streak calculation
    } else {
      console.error('Failed to load user practice stats:', result.error)
    }
  } catch (error) {
    console.error('Error loading user practice stats:', error)
  }
}

const trackLoginActivity = async () => {
  if (currentUser.value?.classCode && currentUser.value?.uid) {
    try {
      await updateStudentLoginActivity(currentUser.value.classCode, currentUser.value.uid)
      console.log('Login activity tracked successfully')
    } catch (error) {
      console.error('Error tracking login activity:', error)
    }
  }
}

const playRecording = (recording) => {
  alert(`Playing: ${recording.title}`)
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    const timer = setInterval(() => {
      recordingTime.value++
      if (!isRecording.value) {
        clearInterval(timer)
      }
    }, 1000)
  } else {
    if (newRecordingTitle.value) {
      recordings.value.unshift({
        id: Date.now(),
        title: newRecordingTitle.value,
        date: new Date(),
        stickers: []
      })
      newRecordingTitle.value = ''
      recordingTime.value = 0
      showRecordingModal.value = false
    }
  }
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const joinClass = async () => {
  if (!classCodeToJoin.value?.trim()) {
    joinClassError.value = 'Please enter a class code'
    return
  }
  
  isJoiningClass.value = true
  joinClassError.value = ''
  joinClassSuccess.value = ''
  
  try {
    const result = await joinClassAsStudent(
      classCodeToJoin.value.trim(),
      currentUser.value.uid,
      currentUser.value.displayName,
      currentUser.value.instrument || ''
    )
    
    if (result && result.success) {
      joinClassSuccess.value = 'Successfully joined the class!'
      classCodeToJoin.value = ''
      
      // Reload the page to update the user data and show assignments
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      joinClassError.value = result.error || 'Failed to join class. Please check your class code.'
    }
  } catch (error) {
    console.error('Error joining class:', error)
    joinClassError.value = 'An error occurred while joining the class. Please try again.'
  } finally {
    isJoiningClass.value = false
  }
}

const loadAssignments = async () => {
  if (!currentUser.value?.uid) return
  
  isLoadingAssignments.value = true
  try {
    let allAssignments = []
    
    // Load class assignments if student is enrolled in a class
    if (currentUser.value?.classCode) {
      const classResult = await fetchClassAssignments(currentUser.value.classCode, currentUser.value.uid)
      if (classResult.success) {
        allAssignments.push(...classResult.assignments)
      }
    }
    
    // Load standalone assignments for this student
    const standaloneResult = await fetchStudentStandaloneAssignments(currentUser.value.uid)
    if (standaloneResult.success) {
      allAssignments.push(...standaloneResult.assignments)
    }
    
    assignments.value = allAssignments
  } catch (error) {
    console.error('Failed to load assignments:', error)
  } finally {
    isLoadingAssignments.value = false
  }
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Overdue'
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${diffDays} days`
  }
}

onMounted(async () => {
  await loadAssignments()
  await trackLoginActivity()
  await loadUserPracticeStats() // Load practice stats on mount
  await loadStandalonePractices() // Load standalone practices on mount
})
</script>