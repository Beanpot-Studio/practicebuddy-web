<template>
  <div class="card card-blue">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
        <Music class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Start Practicing</h3>
    </div>
    <div class="flex flex-col gap-4">
      <!-- Instrument Selection -->
      <div class="relative">
        <label class="block mb-2 font-semibold text-gray-700 text-base">
          <Music class="inline w-5 h-5 mr-1" />Choose your instrument
        </label>
        <div class="relative">
          <button 
            @click="showInstrumentDropdown = !showInstrumentDropdown"
            type="button"
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <img 
                v-if="selectedInstrument" 
                :src="`/instruments/${getSelectedInstrumentImage()}`" 
                :alt="getSelectedInstrumentName()"
                class="w-6 h-6 object-contain"
              />
              <span v-else class="text-gray-500">Choose your instrument</span>
              <span v-if="selectedInstrument" class="text-gray-800">{{ getSelectedInstrumentName() }}</span>
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
                class="w-6 h-6 object-contain"
              />
              <span class="text-gray-800">{{ instrument.name.replace(/^[^\s]*\s/, '') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Selection (if enrolled in classes) -->
      <div v-if="enrolledClasses && enrolledClasses.length > 0" class="relative">
        <label class="block mb-2 font-semibold text-gray-700 text-base">
          <BookOpen class="inline w-5 h-5 mr-1" />Practice for Class (Optional)
        </label>
        <div class="relative">
          <button 
            @click="showClassDropdown = !showClassDropdown"
            type="button"
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span v-if="selectedClass" class="text-gray-800">{{ selectedClass.name || selectedClass.code }}</span>
              <span v-else class="text-gray-500">Standalone practice (not for a class)</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div 
            v-if="showClassDropdown"
            class="absolute z-50 w-full mt-1 bg-white border-4 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
          >
            <div 
              @click="selectClass(null)"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
            >
              <div class="w-6 h-6 flex items-center justify-center">
                <Music class="w-4 h-4 text-gray-500" />
              </div>
              <span class="text-gray-800">Standalone practice</span>
            </div>
            <div 
              v-for="classItem in enrolledClasses" 
              :key="classItem.code"
              @click="selectClass(classItem)"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div class="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full">
                <BookOpen class="w-4 h-4 text-purple-600" />
              </div>
              <div class="flex-1">
                <div class="text-gray-800 font-medium">{{ classItem.name || classItem.code }}</div>
                <div class="text-xs text-gray-500">{{ classItem.teacherName || 'Music Class' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Practice Time -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">⏰ Practice Time (minutes)</label>
        <input 
          type="number" 
          :value="practiceTime"
          @input="updatePracticeTime"
          min="1" 
          max="120" 
          placeholder="30"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(116,185,255,0.2)] focus:transform focus:-translate-y-0.5"
        />
      </div>

      <!-- Start Practice Button -->
      <button 
        @click="startPractice" 
        :disabled="!selectedInstrument || !practiceTime"
        class="btn btn-blue w-full p-4 text-base font-bold"
      >
        <Play class="w-5 h-5" />
        {{ selectedClass ? `Start Practice for ${selectedClass.name || selectedClass.code}` : 'Start Practice Session!' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Play, Music, BookOpen } from 'lucide-vue-next'
import { instruments, getInstrumentImage, getInstrumentName } from '../../lib/instruments'

const props = defineProps({
  selectedInstrument: {
    type: String,
    default: ''
  },
  practiceTime: {
    type: Number,
    default: 30
  },
  practiceDescription: {
    type: String,
    default: ''
  },
  selectedClass: {
    type: Object,
    default: null
  },
  enrolledClasses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:selectedInstrument', 
  'update:practiceTime', 
  'update:practiceDescription',
  'update:selectedClass',
  'start-practice'
])

const showInstrumentDropdown = ref(false)
const showClassDropdown = ref(false)

const selectInstrument = (value) => {
  emit('update:selectedInstrument', value)
  showInstrumentDropdown.value = false
}

const selectClass = (classItem) => {
  emit('update:selectedClass', classItem)
  showClassDropdown.value = false
}

const updatePracticeTime = (event) => {
  const value = parseInt(event.target.value) || 0
  emit('update:practiceTime', value)
}

const updatePracticeDescription = (event) => {
  emit('update:practiceDescription', event.target.value)
}

const getSelectedInstrumentName = () => {
  return getInstrumentName(props.selectedInstrument)
}

const getSelectedInstrumentImage = () => {
  return getInstrumentImage(props.selectedInstrument)
}

const startPractice = () => {
  const selectedInstrumentObj = instruments.find(instr => instr.value === props.selectedInstrument)
  const instrumentName = selectedInstrumentObj ? selectedInstrumentObj.name : props.selectedInstrument
  
  const practiceData = {
    instrument: props.selectedInstrument,
    instrumentName: instrumentName,
    practiceTime: props.practiceTime,
    description: props.practiceDescription,
    classCode: props.selectedClass?.code || null,
    className: props.selectedClass?.name || null
  }
  
  emit('start-practice', practiceData)
}
</script> 