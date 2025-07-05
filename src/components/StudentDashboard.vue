<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <div class="text-center mb-10 text-white flex flex-col items-center gap-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
          👋
        </div>
        <h2 class="text-3xl font-bold text-shadow-lg text-musical-graphite">Hey {{ studentName }}! Ready to make some music? 🎵</h2>
        <p class="text-lg opacity-95 font-medium text-musical-graphite">Track your practice time and collect awesome stickers!</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        <div class="card card-blue">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
              🎸
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Start Practicing</h3>
          </div>
          <div class="flex flex-col gap-4">
            <select v-model="selectedInstrument" class="p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5">
              <option value="">🎭 Choose your instrument</option>
              <option v-for="instrument in instruments" :key="instrument" :value="instrument">
                {{ instrument }}
              </option>
            </select>
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
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card card-green">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              🎤
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
      </div>
    </div>

    <!-- Recording Modal -->
    <div v-if="showRecordingModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" @click="showRecordingModal = false">
      <div class="card card-blue max-w-lg w-11/12 max-h-[80vh] overflow-hidden m-5" @click.stop>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            🎤
          </div>
          <h3 class="flex-1 text-xl text-gray-800 font-bold">Record Your Musical Creation</h3>
          <button @click="showRecordingModal = false" class="w-10 h-10 border-2 border-gray-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.1)]">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div>
          <div class="flex flex-col gap-5">
            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base">🎵 Creation Title</label>
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
                  <span v-else class="text-gray-500">🎯 Ready to create!</span>
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
import { ref, computed } from 'vue'
import { Play, Mic, Square, X } from 'lucide-vue-next'

const props = defineProps({
  studentName: {
    type: String,
    default: 'Student'
  }
})

const totalPracticeTime = ref(45)
const currentStreak = ref(7)
const stickerCount = ref(23)

const selectedInstrument = ref('')
const practiceTime = ref(30)

const instruments = ref([
  '🎹 Piano Player',
  '🎸 Guitar Creator',
  '🎻 Violin Virtuoso',
  '🎺 Trumpet Star',
  '🥁 Drum Designer',
  '🎷 Saxophone Sculptor',
  '🎵 Voice Artist'
])

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

const startPractice = () => {
  alert(`🎉 Starting ${practiceTime.value} minutes of ${selectedInstrument.value} practice!`)
  totalPracticeTime.value += parseInt(practiceTime.value)
}

const playRecording = (recording) => {
  alert(`🎵 Playing: ${recording.title}`)
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
</script>