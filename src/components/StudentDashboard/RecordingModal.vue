<template>
  <div v-if="showRecordingModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" @click="$emit('close-modal')">
    <div class="card card-blue max-w-lg w-11/12 max-h-[80vh] overflow-hidden m-5" @click.stop>
      <div class="flex items-center gap-3 mb-6 relative">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
          <Mic class="w-6 h-6 text-white" />
        </div>
        <h3 class="flex-1 text-xl text-gray-800 font-bold">Record Your Musical Creation</h3>
        <button @click="$emit('close-modal')" class="w-10 h-10 border-2 border-gray-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.1)]">
          <X class="w-5 h-5" />
        </button>
      </div>
      <div>
        <div class="flex flex-col gap-5">
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">
              <Music class="inline w-5 h-5 mr-1" />Creation Title
            </label>
            <input 
              v-model="newRecordingTitle" 
              placeholder="Today's awesome piano practice"
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5"
            />
          </div>
          <div class="text-center">
            <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-gray-300 shadow-[0_6px_0_rgba(0,0,0,0.1)]">
              <div class="text-5xl font-bold text-gray-800 mb-2">{{ formatTime(recordingTime) }}</div>
              <div class="text-base font-semibold">
                <span v-if="isRecording" class="text-red-500">🔴 Recording music...</span>
                <span v-else class="text-gray-500">
                  <Trophy class="inline w-4 h-4 mr-1" />Ready to create!
                </span>
              </div>
            </div>
          </div>
          <div>
            <button 
              @click="toggleRecording" 
              :class="[
                'btn w-full p-4 text-base font-bold',
                isRecording ? 'btn-warning' : 'btn-success'
              ]"
            >
              <component :is="isRecording ? Square : Mic" class="w-5 h-5" />
              {{ isRecording ? 'Stop Recording' : 'Start Creating' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mic, Square, X, Music, Trophy } from 'lucide-vue-next'

const props = defineProps({
  showRecordingModal: {
    type: Boolean,
    default: false
  },
  isRecording: {
    type: Boolean,
    default: false
  },
  recordingTime: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close-modal', 'toggle-recording', 'update:newRecordingTitle'])

const newRecordingTitle = ref('')

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toggleRecording = () => {
  emit('toggle-recording')
}
</script> 