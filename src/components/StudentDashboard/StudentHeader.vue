<template>
  <div class="text-center mb-10 text-white flex flex-col items-center gap-4">
    <div class="flex items-center gap-3">
      <img 
        v-if="instrument"
        :src="`/instruments/${instrumentImage}`" 
        :alt="instrumentName"
        class="w-10 h-10 rounded-full bg-white p-1 border-2 border-gray-200 shadow-sm object-contain"
      />
      <h2 class="text-3xl font-bold text-shadow-lg text-musical-graphite">
        Hello,
        <button 
          type="button" 
          class="underline decoration-dotted underline-offset-4 hover:text-musical-secondary"
          @click="$emit('edit-profile')"
        >
          {{ studentName }}
        </button>
        ! Ready to make some music?
      </h2>
    </div>
    <p class="text-lg opacity-95 font-medium text-musical-graphite">
      Track your practice time, get feedback, reach your goals, and collect stickers!
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