<template>
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
</template>

<script setup>
defineProps({
  achievements: {
    type: Array,
    default: () => []
  }
})
</script> 