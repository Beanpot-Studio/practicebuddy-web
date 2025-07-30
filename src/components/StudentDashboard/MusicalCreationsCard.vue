<template>
  <div class="card card-green">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
        <Mic class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Your Recordings</h3>
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
    <button @click="$emit('show-recording-modal')" class="btn btn-secondary w-full p-4 text-base font-bold mt-4">
      <Mic class="w-5 h-5" />
      Record New Clip
    </button>
  </div>
</template>

<script setup>
import { Play, Mic } from 'lucide-vue-next'

defineProps({
  recordings: {
    type: Array,
    default: () => []
  }
})

defineEmits(['show-recording-modal', 'play-recording'])

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const playRecording = (recording) => {
  emit('play-recording', recording)
}
</script> 