<!-- src/components/StudentDashboard/StudentHeader.vue -->
<template>
  <div class="text-center mb-6 md:mb-10 text-white flex flex-col items-center gap-3 md:gap-4">
    <div class="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
      <img 
        v-if="instrument"
        :src="`/instruments/${instrumentImage}`" 
        :alt="instrumentName"
        class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white p-1 border-2 border-gray-200 shadow-sm object-contain flex-shrink-0"
      />
      <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-shadow-lg text-musical-graphite">
        Hello,
        <button 
          type="button" 
          class="underline decoration-dotted underline-offset-4 hover:text-musical-secondary"
          @click="$emit('edit-profile')"
        >
          {{ studentName }}
        </button>
        <span class="hidden sm:inline">! Ready to make some music?</span>
        <span class="sm:hidden">!</span>
      </h2>
    </div>
    <p class="text-sm md:text-lg opacity-95 font-medium text-musical-graphite px-2">
      <span class="hidden sm:inline">Track your practice time, get feedback, reach your goals, and collect stickers!</span>
      <span class="sm:hidden">Track practice, get feedback, and collect stickers!</span>
    </p>
  </div>
  
</template>

<script setup>
import { computed } from 'vue'
import { getInstrumentImage, getInstrumentName } from '../../lib/instruments'

const props = defineProps({
  studentName: {
    type: String,
    default: 'Music student'
  },
  instrument: {
    type: String,
    default: ''
  }
})

const instrumentImage = computed(() => getInstrumentImage(props.instrument))
const instrumentName = computed(() => getInstrumentName(props.instrument))
</script>
