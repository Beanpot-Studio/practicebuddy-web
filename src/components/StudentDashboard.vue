<template>
  <div class="student-dashboard">
    <div class="container">
      <div class="welcome-section">
        <div class="welcome-shape red wiggle">👋</div>
        <h2>Hey {{ studentName }}! Ready to make some music? 🎵</h2>
        <p>Track your practice time and collect awesome stickers!</p>
      </div>

      <div class="grid grid-2 mb-8">
        <div class="card card-red stats-card">
          <div class="card-title">
            <div class="title-shape red">📊</div>
            <h3>Your Musical Stats</h3>
          </div>
          <div class="stats-grid">
            <div class="stat-bubble red">
              <div class="stat-number">{{ totalPracticeTime }}</div>
              <div class="stat-label">Minutes Today</div>
            </div>
            <div class="stat-bubble blue">
              <div class="stat-number">{{ currentStreak }}</div>
              <div class="stat-label">Day Streak</div>
            </div>
            <div class="stat-bubble yellow">
              <div class="stat-number">{{ stickerCount }}</div>
              <div class="stat-label">Stickers Earned</div>
            </div>
          </div>
        </div>

        <div class="card card-blue practice-card">
          <div class="card-title">
            <div class="title-shape blue">🎸</div>
            <h3>Start Practicing</h3>
          </div>
          <div class="practice-form">
            <select v-model="selectedInstrument" class="cute-select">
              <option value="">🎭 Choose your instrument</option>
              <option v-for="instrument in instruments" :key="instrument" :value="instrument">
                {{ instrument }}
              </option>
            </select>
            <div class="time-input">
              <label>⏰ Practice Time (minutes)</label>
              <input 
                type="number" 
                v-model="practiceTime" 
                min="1" 
                max="120" 
                placeholder="30"
                class="cute-input"
              />
            </div>
            <button 
              @click="startPractice" 
              :disabled="!selectedInstrument || !practiceTime"
              class="btn btn-blue btn-full"
            >
              <Play class="icon" />
              Start Practice Session!
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-2 mb-8">
        <div class="card card-green recordings-card">
          <div class="card-title">
            <div class="title-shape green">🎤</div>
            <h3>Your Musical Creations</h3>
          </div>
          <div class="recordings-list">
            <div 
              v-for="recording in recordings" 
              :key="recording.id"
              class="recording-bubble"
            >
              <div class="recording-info">
                <div class="recording-title">{{ recording.title }}</div>
                <div class="recording-date">{{ formatDate(recording.date) }}</div>
              </div>
              <div class="recording-actions">
                <button class="action-bubble blue" @click="playRecording(recording)">
                  <Play class="icon" />
                </button>
                <div class="sticker-collection">
                  <span v-for="sticker in recording.stickers" :key="sticker" class="sticker bounce">
                    {{ sticker }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="showRecordingModal = true" class="btn btn-secondary btn-full mt-4">
            <Mic class="icon" />
            Record New Creation
          </button>
        </div>

        <div class="card card-yellow achievements-card">
          <div class="card-title">
            <div class="title-shape yellow">🏆</div>
            <h3>Your Achievement Badges</h3>
          </div>
          <div class="achievements-grid">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              :class="['achievement-bubble', { 'earned': achievement.earned }]"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <div class="achievement-title">{{ achievement.title }}</div>
                <div class="achievement-desc">{{ achievement.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recording Modal -->
    <div v-if="showRecordingModal" class="modal-overlay" @click="showRecordingModal = false">
      <div class="modal-content card card-blue" @click.stop>
        <div class="modal-header">
          <div class="title-shape blue">🎤</div>
          <h3>Record Your Musical Creation</h3>
          <button @click="showRecordingModal = false" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="recording-controls">
            <div class="recording-title-input">
              <label>🎵 Creation Title</label>
              <input 
                v-model="newRecordingTitle" 
                placeholder="Today's awesome piano practice"
                class="cute-input"
              />
            </div>
            <div class="recording-timer">
              <div class="timer-bubble">
                <div class="timer-display">{{ formatTime(recordingTime) }}</div>
                <div class="recording-status">
                  <span v-if="isRecording" class="recording-indicator">🔴 Recording music...</span>
                  <span v-else class="ready-indicator">🎯 Ready to create!</span>
                </div>
              </div>
            </div>
            <div class="recording-buttons">
              <button 
                @click="toggleRecording" 
                :class="['btn', 'btn-full', isRecording ? 'btn-warning' : 'btn-success']"
              >
                <component :is="isRecording ? Square : Mic" class="icon" />
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

<style scoped>
.student-dashboard {
  min-height: 100vh;
  background: #FFF8E1;
  padding: 20px 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.welcome-shape {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2), 0 12px 30px rgba(0, 0, 0, 0.15);
  border: 4px solid;
  position: relative;
}

.welcome-shape.red {
  background: linear-gradient(145deg, #FF6B6B, #E55A5A);
  border-color: #D94545;
}

.welcome-section h2 {
  font-size: 32px;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.welcome-section p {
  font-size: 18px;
  opacity: 0.95;
  margin: 0;
  font-weight: 500;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title-shape {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
  position: relative;
}

.title-shape.red {
  background: linear-gradient(145deg, #FF6B6B, #E55A5A);
  border-color: #D94545;
}

.title-shape.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.title-shape.green {
  background: linear-gradient(145deg, #96CEB4, #7FB69A);
  border-color: #6BA085;
}

.title-shape.yellow {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
}

.card-title h3 {
  font-size: 20px;
  color: #1f2937;
  margin: 0;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-bubble {
  text-align: center;
  padding: 16px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
  color: white;
  transition: all 0.2s ease;
}

.stat-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

.stat-bubble.red {
  background: linear-gradient(145deg, #FF6B6B, #E55A5A);
  border-color: #D94545;
}

.stat-bubble.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.stat-bubble.yellow {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 600;
}

.practice-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cute-select,
.cute-input {
  padding: 14px 16px;
  border: 4px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  font-family: inherit;
  font-weight: 500;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.cute-select:focus,
.cute-input:focus {
  outline: none;
  border-color: #74B9FF;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(116, 185, 255, 0.2);
  transform: translateY(-2px);
}

.time-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.btn-full {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
}

.icon {
  width: 20px;
  height: 20px;
}

.recordings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recording-bubble {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(145deg, #f9fafb, #e5e7eb);
  border-radius: 20px;
  border: 3px solid #d1d5db;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.recording-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
}

.recording-info {
  flex: 1;
}

.recording-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
}

.recording-date {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.recording-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-bubble {
  width: 40px;
  height: 40px;
  border: 2px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  color: white;
}

.action-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

.action-bubble.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.sticker-collection {
  display: flex;
  gap: 4px;
}

.sticker {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-bubble {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  border-radius: 20px;
  border: 3px solid #d1d5db;
  opacity: 0.5;
  transition: all 0.3s;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}

.achievement-bubble.earned {
  opacity: 1;
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

.achievement-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.achievement-bubble.earned .achievement-icon {
  border-color: #D4A54A;
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  margin: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
}

.modal-header h3 {
  flex: 1;
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  font-weight: 700;
}

.close-button {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1);
}

.recording-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recording-title-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.recording-timer {
  text-align: center;
}

.timer-bubble {
  padding: 24px;
  background: linear-gradient(145deg, #f9fafb, #e5e7eb);
  border-radius: 30px;
  border: 4px solid #d1d5db;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
}

.timer-display {
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.recording-status {
  font-size: 16px;
  font-weight: 600;
}

.recording-indicator {
  color: #ef4444;
}

.ready-indicator {
  color: #6b7280;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .recording-bubble {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .recording-actions {
    width: 100%;
    justify-content: center;
  }

  .welcome-section h2 {
    font-size: 24px;
  }

  .welcome-shape {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
}
</style>