<template>
  <div class="card card-orange mb-8">
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
</template>

<script setup>
import { Play, Music } from 'lucide-vue-next'
import { getInstrumentImage, getInstrumentName } from '../../lib/instruments'

defineProps({
  standalonePractices: {
    type: Array,
    default: () => []
  },
  isLoadingPractices: {
    type: Boolean,
    default: false
  }
})

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script> 