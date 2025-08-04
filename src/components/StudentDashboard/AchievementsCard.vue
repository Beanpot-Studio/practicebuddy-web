<template>
  <div class="card card-yellow">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
        <Trophy class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Stickers and Feedback</h3>
    </div>
    
    <!-- Empty State -->
    <div v-if="achievements.length === 0" class="text-center py-8 text-gray-500">
      <Trophy class="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p class="text-sm">No stickers yet</p>
      <p class="text-xs mt-1">Your teacher will give you stickers for great work!</p>
    </div>
    
    <!-- Achievements/Stickers List -->
    <div v-else class="flex flex-col gap-3">
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
        <div class="w-12 h-12 flex items-center justify-center bg-white rounded-full border-2 shadow-[0_2px_0_rgba(0,0,0,0.1)]" :class="achievement.earned ? 'border-yellow-600' : 'border-gray-200'">
          <component 
            :is="getAchievementIcon(achievement.icon)" 
            class="w-6 h-6" 
            :class="achievement.earned ? 'text-yellow-600' : 'text-gray-400'"
          />
        </div>
        <div class="flex-1">
          <div class="font-semibold text-base mb-1">{{ achievement.title }}</div>
          <div class="text-sm opacity-80 font-medium">{{ achievement.description }}</div>
          <div v-if="achievement.teacherName" class="text-xs opacity-60 mt-1">
            From: {{ achievement.teacherName }}
          </div>
          <div v-if="achievement.date" class="text-xs opacity-60">
            {{ formatDate(achievement.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trophy, Calendar, Zap, Music, Star } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const achievements = ref([])

// Load achievements from practice sessions
const loadAchievements = async () => {
  if (!props.userId) return
  
  try {
    const { getStudentPractices } = await import('../../lib/auth.js')
    const result = await getStudentPractices(props.userId)
    
    if (result.success) {
      const allFeedback = []
      
      // Collect all feedback from practice sessions
      result.practices.forEach(practice => {
        if (practice.feedback && Array.isArray(practice.feedback)) {
          practice.feedback.forEach(feedback => {
            allFeedback.push({
              ...feedback,
              practiceId: practice.id,
              practiceDescription: practice.description,
              practiceDate: practice.timestamp
            })
          })
        }
      })
      
      // Sort by date (most recent first)
      allFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      achievements.value = allFeedback
    }
  } catch (error) {
    console.error('Error loading achievements:', error)
  }
}

// Load achievements on mount
onMounted(() => {
  loadAchievements()
})

const getAchievementIcon = (iconName) => {
  const iconMap = {
    'calendar': Calendar,
    'zap': Zap,
    'music': Music,
    'star': Star
  }
  return iconMap[iconName] || Star
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script> 