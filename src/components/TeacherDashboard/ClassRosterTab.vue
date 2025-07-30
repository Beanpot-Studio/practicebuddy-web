<template>
  <div class="animate-fadeIn">
    <div class="space-y-6">
      <!-- Class Selection -->
      <div class="card card-blue">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            👥
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Select Class to View Roster</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="classItem in classes" 
            :key="classItem.id"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-[0_2px_0_rgba(0,0,0,0.1)]',
              selectedClassForRoster?.id === classItem.id
                ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-blue-400'
            ]"
            @click="$emit('selectClassForRoster', classItem)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {{ classItem.icon }}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold">{{ classItem.name }}</h4>
                <p class="text-sm opacity-80">{{ classItem.studentCount }} students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Roster -->
      <div v-if="selectedClassForRoster" class="card card-green">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              📋
            </div>
            <h3 class="text-xl text-gray-800 font-bold">{{ selectedClassForRoster.name }} - Class Roster</h3>
          </div>
          <div class="text-sm text-gray-600">
            Class Code: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ selectedClassForRoster.code }}</span>
          </div>
        </div>
        
        <div v-if="isLoadingRoster" class="text-center py-8">
          <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading roster...</p>
        </div>
        
        <div v-else-if="classRoster.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">👥</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">No Students Yet</h4>
          <p class="text-gray-600">Students will appear here when they join using the class code.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="student in classRoster" 
            :key="student.studentId"
            class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center text-xl">
                {{ getStudentAvatar(student.name) }}
              </div>
              <div class="flex-1">
                <h4 class="text-sm text-gray-800 font-bold">{{ student.name }}</h4>
                <p class="text-xs text-gray-500">{{ student.instrument || 'No instrument specified' }}</p>
              </div>
            </div>
            
            <div class="flex justify-between text-xs text-gray-600">
              <span>Joined: {{ formatDate(new Date(student.joinedAt)) }}</span>
              <span>Practice: {{ student.practiceMinutes || 0 }}min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  classes: {
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
  }
})

const emit = defineEmits(['selectClassForRoster'])

const getStudentAvatar = (name) => {
  const avatars = {
    piano: '🎹',
    guitar: '🎸',
    violin: '🎻',
    trumpet: '🎺',
    drums: '🥁',
    saxophone: '🎷',
    voice: '🎤',
    theory: '📚'
  }
  return avatars[name?.toLowerCase()] || '🎵'
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script> 