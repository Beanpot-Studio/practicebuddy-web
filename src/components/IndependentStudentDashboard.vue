<template>
  <div class="min-h-screen bg-gradient-to-br from-musical-primary via-blue-600 to-purple-700 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_rgba(0,0,0,0.3),0_15px_30px_rgba(0,0,0,0.2)] border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-500">
          <img src="/lyre.png" alt="Practice Buddy Logo" class="w-12 h-12" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Welcome, {{ studentName }}!
        </h1>
        <p class="text-xl text-white/90 mb-2">Practice Dashboard</p>
        <p class="text-lg text-white/80">Track your musical progress and practice independently</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <div class="text-center">
            <div class="text-4xl mb-2">🎵</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ totalPracticeMinutes }}</h3>
            <p class="text-gray-600">Total Practice Minutes</p>
          </div>
        </div>
        
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <div class="text-center">
            <div class="text-4xl mb-2">🌟</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ achievements.length }}</h3>
            <p class="text-gray-600">Achievements Earned</p>
          </div>
        </div>
        
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <div class="text-center">
            <div class="text-4xl mb-2">📈</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ currentStreak }}</h3>
            <p class="text-gray-600">Day Practice Streak</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Practice Tracking -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-musical-primary flex items-center justify-center">
              <span class="text-white text-lg">⏱️</span>
            </div>
            Practice Timer
          </h2>
          
          <div class="text-center mb-6">
            <div class="text-6xl font-bold text-musical-primary mb-4">{{ formatTime(currentSessionTime) }}</div>
            <div class="flex justify-center gap-4">
              <button 
                @click="startPractice"
                :disabled="isPracticing"
                class="px-6 py-3 bg-musical-success text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isPracticing ? 'Practicing...' : 'Start Practice' }}
              </button>
              <button 
                @click="stopPractice"
                :disabled="!isPracticing"
                class="px-6 py-3 bg-musical-error text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stop Practice
              </button>
            </div>
          </div>
          
          <div class="text-center">
            <p class="text-gray-600 mb-2">Today's Goal: 30 minutes</p>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-musical-success h-3 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min((todayPracticeMinutes / 30) * 100, 100)}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-500 mt-2">{{ todayPracticeMinutes }} / 30 minutes completed</p>
          </div>
        </div>

        <!-- Achievements -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
              <span class="text-white text-lg">🏆</span>
            </div>
            Recent Achievements
          </h2>
          
          <div v-if="achievements.length > 0" class="space-y-4">
            <div 
              v-for="achievement in recentAchievements" 
              :key="achievement"
              class="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
            >
              <div class="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <span class="text-white text-lg">🌟</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">{{ achievement }}</h4>
                <p class="text-sm text-gray-600">Keep up the great work!</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">No Achievements Yet</h3>
            <p class="text-gray-600">Start practicing to earn your first achievement!</p>
          </div>
        </div>

        <!-- Practice History -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <span class="text-white text-lg">📊</span>
            </div>
            Practice History
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="session in practiceHistory" 
              :key="session.date"
              class="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <h4 class="font-semibold text-gray-800">{{ session.date }}</h4>
                <p class="text-sm text-gray-600">{{ session.duration }} minutes</p>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-musical-primary">{{ session.duration }}m</div>
                <div class="text-xs text-gray-500">{{ session.time }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="practiceHistory.length === 0" class="text-center py-8">
            <div class="text-4xl mb-4">📝</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">No Practice History</h3>
            <p class="text-gray-600">Your practice sessions will appear here</p>
          </div>
        </div>

        <!-- Join a Class -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-musical-coral flex items-center justify-center">
              <span class="text-white text-lg">👩‍🏫</span>
            </div>
            Join a Class
          </h2>
          
          <p class="text-gray-600 mb-6">Get personalized guidance from a music teacher and join a community of learners!</p>
          
          <form @submit.prevent="joinClass" class="space-y-4">
            <div>
              <label for="class-code" class="block text-sm font-semibold text-gray-700 mb-2">Class Code</label>
              <input 
                id="class-code"
                v-model="classCode"
                type="text" 
                placeholder="Enter your teacher's class code"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-musical-primary transition-colors"
              />
            </div>
            
            <button 
              type="submit"
              :disabled="!classCode.trim() || isJoiningClass"
              class="w-full py-3 bg-musical-coral text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isJoiningClass ? 'Joining...' : 'Join Class' }}
            </button>
          </form>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 class="font-semibold text-blue-800 mb-2">Benefits of Joining a Class:</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Personalized feedback from teachers</li>
              <li>• Structured learning curriculum</li>
              <li>• Progress tracking and assessments</li>
              <li>• Community with other students</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  studentName: {
    type: String,
    required: true
  }
})

// Practice tracking
const isPracticing = ref(false)
const currentSessionTime = ref(0)
const practiceInterval = ref(null)
const totalPracticeMinutes = ref(120)
const todayPracticeMinutes = ref(15)
const currentStreak = ref(3)

// Achievements
const achievements = ref([
  'First Practice Session',
  'Week Warrior',
  'Consistent Practice'
])

// Practice history
const practiceHistory = ref([
  { date: 'Today', duration: 15, time: '2:30 PM' },
  { date: 'Yesterday', duration: 25, time: '3:15 PM' },
  { date: 'Dec 15', duration: 20, time: '4:00 PM' }
])

// Class joining
const classCode = ref('')
const isJoiningClass = ref(false)

// Computed
const recentAchievements = computed(() => {
  return achievements.value.slice(-3)
})

// Methods
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startPractice = () => {
  isPracticing.value = true
  practiceInterval.value = setInterval(() => {
    currentSessionTime.value++
  }, 1000)
}

const stopPractice = () => {
  isPracticing.value = false
  if (practiceInterval.value) {
    clearInterval(practiceInterval.value)
    practiceInterval.value = null
  }
  
  // Add session to history
  if (currentSessionTime.value > 0) {
    const minutes = Math.floor(currentSessionTime.value / 60)
    if (minutes > 0) {
      practiceHistory.value.unshift({
        date: 'Today',
        duration: minutes,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      
      totalPracticeMinutes.value += minutes
      todayPracticeMinutes.value += minutes
      
      // Check for achievements
      if (totalPracticeMinutes.value >= 100 && !achievements.value.includes('Century Club')) {
        achievements.value.push('Century Club')
      }
    }
  }
  
  currentSessionTime.value = 0
}

const joinClass = async () => {
  if (!classCode.value.trim()) return
  
  isJoiningClass.value = true
  
  try {
    // Here you would call the API to join the class
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert(`Successfully joined class with code: ${classCode.value}`)
    classCode.value = ''
    
  } catch (error) {
    alert('Failed to join class. Please check the class code.')
  } finally {
    isJoiningClass.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (practiceInterval.value) {
    clearInterval(practiceInterval.value)
  }
})
</script> 