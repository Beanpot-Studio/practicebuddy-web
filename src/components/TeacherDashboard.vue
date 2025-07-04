<template>
  <div class="teacher-dashboard">
    <div class="container">
      <div class="header-section">
        <div class="teacher-shape blue wiggle">👩‍🏫</div>
        <h2>Teacher Hub</h2>
        <p>Help your students develop amazing musical skills!</p>
        <p class="teacher-email">Teaching with: {{ teacherEmail }}</p>
      </div>

      <div class="grid grid-3 mb-8">
        <div class="card card-red summary-card">
          <div class="card-title">
            <div class="title-shape red">📊</div>
            <h3>Class Stats</h3>
          </div>
          <div class="summary-stats">
            <div class="summary-bubble red">
              <div class="summary-number">{{ totalStudents }}</div>
              <div class="summary-label">Music Students</div>
            </div>
            <div class="summary-bubble blue">
              <div class="summary-number">{{ pendingReviews }}</div>
              <div class="summary-label">Pending Reviews</div>
            </div>
            <div class="summary-bubble yellow">
              <div class="summary-number">{{ stickersGiven }}</div>
              <div class="summary-label">Stickers Given</div>
            </div>
          </div>
        </div>

        <div class="card card-blue recent-activity">
          <div class="card-title">
            <div class="title-shape blue">🔔</div>
            <h3>Recent Activity</h3>
          </div>
          <div class="activity-list">
            <div class="activity-bubble">
              <div class="activity-text">🎹 Alex created a piano recording</div>
              <div class="activity-time">5 min ago</div>
            </div>
            <div class="activity-bubble">
              <div class="activity-text">🎸 Sarah completed 45 min practice</div>
              <div class="activity-time">1 hour ago</div>
            </div>
            <div class="activity-bubble">
              <div class="activity-text">🏆 Marcus earned a new badge</div>
              <div class="activity-time">2 hours ago</div>
            </div>
          </div>
        </div>

        <div class="card card-green quick-actions">
          <div class="card-title">
            <div class="title-shape green">⚡</div>
            <h3>Quick Tools</h3>
          </div>
          <div class="actions-grid">
            <button class="btn btn-primary" @click="showAllStudents = !showAllStudents">
              <Users class="icon" />
              {{ showAllStudents ? 'Hide' : 'View' }} All Students
            </button>
            <button class="btn btn-secondary" @click="showStickerModal = true">
              <Star class="icon" />
              Give Stickers
            </button>
          </div>
        </div>
      </div>

      <div class="students-section">
        <h3>🎼 Your Music Students</h3>
        <div class="students-grid">
          <div 
            v-for="student in students" 
            :key="student.id"
            class="student-card card card-yellow"
            @click="selectStudent(student)"
          >
            <div class="student-header">
              <div class="student-avatar-shape">{{ student.avatar }}</div>
              <div class="student-info">
                <h4>{{ student.name }}</h4>
                <p>{{ student.instrument }}</p>
              </div>
              <div class="student-status">
                <span :class="['status-bubble', student.status]">{{ student.status }}</span>
              </div>
            </div>
            
            <div class="student-stats">
              <div class="stat-mini red">
                <span class="stat-label">This Week</span>
                <span class="stat-value">{{ student.weeklyMinutes }}min</span>
              </div>
              <div class="stat-mini blue">
                <span class="stat-label">Streak</span>
                <span class="stat-value">{{ student.streak }} days</span>
              </div>
              <div class="stat-mini green">
                <span class="stat-label">Creations</span>
                <span class="stat-value">{{ student.recordings.length }}</span>
              </div>
            </div>

            <div class="student-recordings">
              <div class="recordings-header">
                <h5>🎵 Recent Creations</h5>
                <span class="pending-bubble" v-if="getPendingCount(student) > 0">
                  {{ getPendingCount(student) }} pending
                </span>
              </div>
              <div class="recordings-list-mini">
                <div 
                  v-for="recording in student.recordings.slice(0, 3)" 
                  :key="recording.id"
                  :class="['recording-mini-bubble', { 'needs-review': !recording.reviewed }]"
                >
                  <div class="recording-info-mini">
                    <div class="recording-title-mini">{{ recording.title }}</div>
                    <div class="recording-date-mini">{{ formatDate(recording.date) }}</div>
                  </div>
                  <div class="recording-actions-mini">
                    <button class="action-mini-bubble blue" @click.stop="playRecording(recording)">
                      <Play class="icon-mini" />
                    </button>
                    <button 
                      v-if="!recording.reviewed"
                      class="action-mini-bubble yellow"
                      @click.stop="reviewRecording(student, recording)"
                    >
                      <Star class="icon-mini" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticker Modal -->
    <div v-if="showStickerModal" class="modal-overlay" @click="showStickerModal = false">
      <div class="modal-content card card-green" @click.stop>
        <div class="modal-header">
          <div class="title-shape green">🌟</div>
          <h3>Give Stickers</h3>
          <button @click="showStickerModal = false" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="sticker-form">
            <div class="student-select">
              <label>🎭 Select Student</label>
              <select v-model="selectedStudent" class="cute-select">
                <option value="">Choose a music student</option>
                <option v-for="student in students" :key="student.id" :value="student">
                  {{ student.name }}
                </option>
              </select>
            </div>
            
            <div class="recording-select" v-if="selectedStudent">
              <label>🎵 Select Creation</label>
              <select v-model="selectedRecording" class="cute-select">
                <option value="">Choose a musical creation</option>
                <option v-for="recording in selectedStudent.recordings" :key="recording.id" :value="recording">
                  {{ recording.title }} - {{ formatDate(recording.date) }}
                </option>
              </select>
            </div>

            <div class="stickers-collection">
              <label>🌟 Choose Awesome Stickers</label>
              <div class="stickers-grid">
                <div 
                  v-for="sticker in availableStickers" 
                  :key="sticker"
                  :class="['sticker-bubble', { 'selected': selectedStickers.includes(sticker) }]"
                  @click="toggleSticker(sticker)"
                >
                  {{ sticker }}
                </div>
              </div>
            </div>

            <div class="feedback-input">
              <label>💬 Encouraging Message</label>
              <textarea 
                v-model="teacherMessage"
                placeholder="Amazing job developing your musical skills! Keep up the fantastic work! 🎵"
                rows="3"
                class="cute-textarea"
              ></textarea>
            </div>

            <button 
              @click="giveStickers"
              :disabled="!selectedStudent || !selectedRecording || selectedStickers.length === 0"
              class="btn btn-success btn-full"
            >
              <Heart class="icon" />
              Give {{ selectedStickers.length }} Awesome Sticker{{ selectedStickers.length !== 1 ? 's' : '' }}!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Users, Star, Play, X, Heart } from 'lucide-vue-next'

const props = defineProps({
  teacherEmail: {
    type: String,
    default: 'teacher@school.edu'
  }
})

const totalStudents = ref(8)
const pendingReviews = ref(5)
const stickersGiven = ref(127)
const showAllStudents = ref(false)
const showStickerModal = ref(false)

const students = ref([
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '🎹',
    instrument: 'Piano Player',
    status: 'active',
    weeklyMinutes: 180,
    streak: 7,
    recordings: [
      {
        id: 1,
        title: 'Scales Practice',
        date: new Date(2024, 0, 15),
        reviewed: false,
        stickers: []
      },
      {
        id: 2,
        title: 'Beethoven Performance',
        date: new Date(2024, 0, 14),
        reviewed: true,
        stickers: ['⭐', '🎵', '👍']
      }
    ]
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: '🎸',
    instrument: 'Guitar Creator',
    status: 'active',
    weeklyMinutes: 220,
    streak: 12,
    recordings: [
      {
        id: 3,
        title: 'Chord Practice Session',
        date: new Date(2024, 0, 15),
        reviewed: false,
        stickers: []
      },
      {
        id: 4,
        title: 'Fingerpicking Performance',
        date: new Date(2024, 0, 13),
        reviewed: true,
        stickers: ['🎸', '💫', '🔥']
      }
    ]
  },
  {
    id: 3,
    name: 'Marcus Williams',
    avatar: '🎻',
    instrument: 'Violin Virtuoso',
    status: 'needs-attention',
    weeklyMinutes: 95,
    streak: 3,
    recordings: [
      {
        id: 5,
        title: 'Bow Technique Practice',
        date: new Date(2024, 0, 12),
        reviewed: false,
        stickers: []
      }
    ]
  },
  {
    id: 4,
    name: 'Emma Davis',
    avatar: '🎺',
    instrument: 'Trumpet Star',
    status: 'active',
    weeklyMinutes: 165,
    streak: 5,
    recordings: [
      {
        id: 6,
        title: 'Scale Exercises',
        date: new Date(2024, 0, 14),
        reviewed: true,
        stickers: ['🎺', '⭐']
      }
    ]
  }
])

const selectedStudent = ref(null)
const selectedRecording = ref(null)
const selectedStickers = ref([])
const teacherMessage = ref('')

const availableStickers = ref([
  '⭐', '🌟', '✨', '💫', '🎵', '🎶', '🎸', '🎹', '🎻', '🎺', '🥁', '🎷',
  '👍', '👏', '💯', '🔥', '💪', '🏆', '🎯', '💖', '🌈', '🎊', '🎉', '🎼'
])

const getPendingCount = (student) => {
  return student.recordings.filter(r => !r.reviewed).length
}

const selectStudent = (student) => {
  console.log('Selected music student:', student.name)
}

const playRecording = (recording) => {
  alert(`🎵 Playing musical creation: ${recording.title}`)
}

const reviewRecording = (student, recording) => {
  selectedStudent.value = student
  selectedRecording.value = recording
  showStickerModal.value = true
}

const toggleSticker = (sticker) => {
  const index = selectedStickers.value.indexOf(sticker)
  if (index > -1) {
    selectedStickers.value.splice(index, 1)
  } else {
    selectedStickers.value.push(sticker)
  }
}

const giveStickers = () => {
  if (selectedStudent.value && selectedRecording.value && selectedStickers.value.length > 0) {
    const recording = selectedRecording.value
    recording.stickers = [...selectedStickers.value]
    recording.reviewed = true
    recording.feedback = teacherMessage.value

    selectedStudent.value = null
    selectedRecording.value = null
    selectedStickers.value = []
    teacherMessage.value = ''
    showStickerModal.value = false

    stickersGiven.value += selectedStickers.value.length
    pendingReviews.value = Math.max(0, pendingReviews.value - 1)

    alert('🎉 Awesome stickers given successfully! The student will be so happy!')
  }
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.teacher-dashboard {
  min-height: 100vh;
  background: #FFF8E1;
  padding: 20px 0;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.teacher-shape {
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

.teacher-shape.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.header-section h2 {
  font-size: 32px;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.header-section p {
  font-size: 18px;
  opacity: 0.95;
  margin: 0;
  font-weight: 500;
}

.teacher-email {
  font-size: 14px;
  opacity: 0.8;
  font-style: italic;
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

.card-title h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0;
  font-weight: 700;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-bubble {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
  color: white;
}

.summary-bubble.red {
  background: linear-gradient(145deg, #FF6B6B, #E55A5A);
  border-color: #D94545;
}

.summary-bubble.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.summary-bubble.yellow {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
}

.summary-number {
  font-size: 24px;
  font-weight: 700;
}

.summary-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-bubble {
  padding: 12px;
  background: linear-gradient(145deg, #f9fafb, #e5e7eb);
  border-radius: 16px;
  border: 2px solid #d1d5db;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.activity-text {
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
  font-weight: 600;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.students-section {
  margin-top: 40px;
}

.students-section h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.student-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.student-avatar-shape {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  border: 3px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}

.student-info {
  flex: 1;
}

.student-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 700;
}

.student-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.status-bubble {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.status-bubble.active {
  background: linear-gradient(145deg, #96CEB4, #7FB69A);
  color: white;
  border-color: #6BA085;
}

.status-bubble.needs-attention {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  color: #2d3436;
  border-color: #D4A54A;
}

.student-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
}

.stat-mini {
  text-align: center;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  border: 2px solid;
  color: white;
  flex: 1;
}

.stat-mini.red {
  background: linear-gradient(145deg, #FF6B6B, #E55A5A);
  border-color: #D94545;
}

.stat-mini.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.stat-mini.green {
  background: linear-gradient(145deg, #96CEB4, #7FB69A);
  border-color: #6BA085;
}

.stat-label {
  display: block;
  font-size: 10px;
  opacity: 0.9;
  margin-bottom: 2px;
  font-weight: 600;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
}

.student-recordings {
  border-top: 3px solid #e5e7eb;
  padding-top: 16px;
}

.recordings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recordings-header h5 {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
  font-weight: 700;
}

.pending-bubble {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  color: #2d3436;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid #D4A54A;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.recordings-list-mini {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recording-mini-bubble {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: linear-gradient(145deg, #f9fafb, #e5e7eb);
  border-radius: 12px;
  border: 2px solid #d1d5db;
  transition: all 0.2s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.recording-mini-bubble.needs-review {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
  color: #2d3436;
}

.recording-info-mini {
  flex: 1;
}

.recording-title-mini {
  font-size: 13px;
  font-weight: 600;
}

.recording-date-mini {
  font-size: 11px;
  opacity: 0.8;
  font-weight: 500;
}

.recording-actions-mini {
  display: flex;
  gap: 4px;
}

.action-mini-bubble {
  width: 24px;
  height: 24px;
  border: 2px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  color: white;
}

.action-mini-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
}

.action-mini-bubble.blue {
  background: linear-gradient(145deg, #74B9FF, #5A9FE5);
  border-color: #4A8FD5;
}

.action-mini-bubble.yellow {
  background: linear-gradient(145deg, #FDCB6E, #E5B55A);
  border-color: #D4A54A;
}

.icon-mini {
  width: 12px;
  height: 12px;
}

.icon {
  width: 20px;
  height: 20px;
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
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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

.sticker-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.student-select label,
.recording-select label,
.stickers-collection label,
.feedback-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.cute-select,
.cute-textarea {
  width: 100%;
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
.cute-textarea:focus {
  outline: none;
  border-color: #96CEB4;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(150, 206, 180, 0.2);
  transform: translateY(-2px);
}

.cute-textarea {
  resize: vertical;
  min-height: 80px;
}

.stickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 8px;
}

.sticker-bubble {
  width: 50px;
  height: 50px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #f9fafb, #e5e7eb);
}

.sticker-bubble:hover {
  border-color: #96CEB4;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
}

.sticker-bubble.selected {
  border-color: #96CEB4;
  background: linear-gradient(145deg, #96CEB4, #7FB69A);
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

.btn-full {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
  }

  .student-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-mini {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }

  .stickers-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .sticker-bubble {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .header-section h2 {
    font-size: 24px;
  }

  .teacher-shape {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
}
</style>