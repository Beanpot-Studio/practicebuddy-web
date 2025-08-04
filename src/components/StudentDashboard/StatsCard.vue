<template>
  <div class="mb-8">
    <div class="card card-red">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
          <BarChart3 class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-lg text-gray-800 font-bold">Your Musical Stats</h3>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
          <div class="text-2xl font-bold mb-1">{{ totalPracticeMinutes }}</div>
          <div class="text-xs opacity-90 font-semibold">Total Minutes</div>
        </div>
        <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
          <div class="text-2xl font-bold mb-1">{{ currentStreak }}</div>
          <div class="text-xs opacity-90 font-semibold">Day Streak</div>
        </div>
        <div class="text-center p-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.2)]">
          <div class="text-2xl font-bold mb-1">{{ stickerCount }}</div>
          <div class="text-xs opacity-90 font-semibold">Stickers</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BarChart3 } from 'lucide-vue-next'

defineProps({
  totalPracticeMinutes: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  stickerCount: {
    type: Number,
    default: 0
  }
})
</script> 