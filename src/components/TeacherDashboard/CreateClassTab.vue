<template>
  <div class="animate-fadeIn">
    <div class="max-w-2xl mx-auto">
      <div class="card card-blue">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            ➕
          </div>
          <h3 class="text-xl text-gray-800 font-bold">Create New Music Class</h3>
        </div>
        
        <form @submit.prevent="$emit('createClass')" class="space-y-6">
          <div class="space-y-2">
            <label for="class-name" class="block text-sm font-semibold text-gray-700">Class Name</label>
            <input 
              id="class-name"
              v-model="newClass.name" 
              type="text" 
              placeholder="e.g., Beginner Piano, Advanced Guitar, Music Theory"
              required
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
            />
          </div>
          
          <div class="space-y-2">
            <label for="class-description" class="block text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              id="class-description"
              v-model="newClass.description" 
              placeholder="Describe what students will learn in this class..."
              rows="3"
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md resize-vertical"
            ></textarea>
          </div>
          
          <div class="space-y-2">
            <label for="class-instrument" class="block text-sm font-semibold text-gray-700">Primary Instrument</label>
            <div class="relative">
              <button 
                @click="showInstrumentDropdown = !showInstrumentDropdown"
                type="button"
                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img 
                    v-if="newClass.instrument" 
                    :src="`/instruments/${getSelectedInstrumentImage()}`" 
                    :alt="getSelectedInstrumentName()"
                    class="w-5 h-5 object-contain"
                  />
                  <span v-else class="text-gray-500">Select an instrument</span>
                  <span v-if="newClass.instrument" class="text-gray-800">{{ getSelectedInstrumentName() }}</span>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div 
                v-if="showInstrumentDropdown"
                class="absolute z-50 w-full mt-1 bg-white border-3 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <div 
                  v-for="instrument in instruments" 
                  :key="instrument.value"
                  @click="selectInstrument(instrument.value)"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img 
                    :src="`/instruments/${instrument.image}`" 
                    :alt="instrument.name"
                    class="w-5 h-5 object-contain"
                  />
                  <span class="text-gray-800">{{ instrument.name.replace(/^[^\s]*\s/, '') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="class-level" class="block text-sm font-semibold text-gray-700">Skill Level</label>
            <select 
              id="class-level"
              v-model="newClass.level" 
              required
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
            >
              <option value="">Select skill level</option>
              <option value="beginner">🌱 Beginner</option>
              <option value="intermediate">🌿 Intermediate</option>
              <option value="advanced">🌳 Advanced</option>
              <option value="mixed">🌈 Mixed Levels</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="class-schedule" class="block text-sm font-semibold text-gray-700">Class Schedule</label>
            <input 
              id="class-schedule"
              v-model="newClass.schedule" 
              type="text" 
              placeholder="e.g., Mondays 4-5pm, Wednesdays 3-4pm"
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
            />
          </div>
          
          <button type="submit" class="btn btn-primary w-full" :disabled="isCreatingClass">
            <div v-if="isCreatingClass" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span v-else>🎵 Create Music Class</span>
            {{ isCreatingClass ? 'Creating...' : '' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { instruments, getInstrumentImage, getInstrumentName } from '../../lib/instruments'

const props = defineProps({
  newClass: {
    type: Object,
    required: true
  },
  isCreatingClass: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['createClass'])

const showInstrumentDropdown = ref(false)

const selectInstrument = (value) => {
  newClass.instrument = value
  showInstrumentDropdown.value = false
}

const getSelectedInstrumentImage = () => {
  return getInstrumentImage(newClass.instrument)
}

const getSelectedInstrumentName = () => {
  return getInstrumentName(newClass.instrument)
}
</script> 