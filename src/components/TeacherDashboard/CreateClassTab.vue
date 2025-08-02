<template>
  <div class="animate-fadeIn">
   
      <div class="card card-purple">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            <Plus class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Create New Class</h3>
        </div>
        
        <form @submit.prevent="$emit('createClass')" class="space-y-4">
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">Class Name</label>
            <input 
              v-model="newClass.name" 
              type="text" 
              placeholder="e.g., Beginner Piano, Advanced Guitar, Music Theory"
              required
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            />
          </div>
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">Description</label>
            <textarea 
              v-model="newClass.description" 
              placeholder="Describe what students will learn in this class..."
              rows="3"
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">Primary Instrument</label>
            <div class="relative">
              <button 
                @click="showInstrumentDropdown = !showInstrumentDropdown"
                type="button"
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] flex items-center justify-between"
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
                class="absolute z-50 w-full mt-1 bg-white border-4 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
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
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">Skill Level</label>
            <select 
              v-model="newClass.level" 
              required
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            >
              <option value="">Select skill level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="mixed">Mixed Levels</option>
            </select>
          </div>
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">Class Schedule</label>
            <input 
              v-model="newClass.schedule" 
              type="text" 
              placeholder="e.g., Mondays 4-5pm, Wednesdays 3-4pm"
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            />
          </div>
          
          <button type="submit" class="w-full btn btn-purple flex items-center justify-center gap-2" :disabled="isCreatingClass">
            <div v-if="isCreatingClass" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <Music v-else class="w-5 h-5" />
            <span v-if="!isCreatingClass">Create Music Class</span>
            <span v-else>Creating...</span>
          </button>
        </form>
      </div>
   
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { instruments, getInstrumentImage, getInstrumentName } from '../../lib/instruments'
import { Plus, Music } from 'lucide-vue-next'

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