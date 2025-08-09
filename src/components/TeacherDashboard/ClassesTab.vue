<template>
  <div class="animate-fadeIn">
    

    <!-- Classes Display Section -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
          <GraduationCap class="w-6 h-6 text-white" />
        </div>
        <h3 class="text-xl text-gray-800 font-bold">Classes</h3>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading classes...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Classes</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="$emit('loadClasses')"
          class="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="classes.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No Classes Yet</h3>
        <p class="text-gray-600 mb-4">Create your first music class to get started!</p>
      </div>
      
      <!-- Classes Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="classItem in classes" 
          :key="classItem.id"
          class="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-1"
        >
          <!-- Class Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <img 
                v-if="classItem.instrument" 
                :src="`/instruments/${getInstrumentImage(classItem.instrument)}`" 
                :alt="getInstrumentName(classItem.instrument)"
                class="w-8 h-8 object-contain"
              />
              <div>
                <h4 class="font-bold text-gray-800 text-lg">{{ classItem.name }}</h4>
                <p class="text-sm text-gray-500">{{ getInstrumentName(classItem.instrument) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 bg-primary-100 text-blue-700 rounded-lg text-xs font-semibold">
                {{ classItem.level }}
              </span>
            </div>
          </div>
          
          <!-- Class Description -->
          <p v-if="classItem.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ classItem.description }}
          </p>
          
          <!-- Class Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-xl font-bold text-blue-600">{{ classItem.students?.length || 0 }}</div>
              <div class="text-xs text-gray-500">Students</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-xl font-bold text-green-600">{{ classItem.assignments?.length || 0 }}</div>
              <div class="text-xs text-gray-500">Assignments</div>
            </div>
          </div>
          
          <!-- Class Schedule -->
          <div v-if="classItem.schedule" class="mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock class="w-4 h-4" />
              <span class="font-medium">Schedule</span>
            </div>
            <p class="text-sm text-gray-500">{{ classItem.schedule }}</p>
          </div>
          
          <!-- Class Code -->
          <div class="mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Hash class="w-4 h-4" />
              <span class="font-medium">Class Code</span>
            </div>
            <div class="flex items-center gap-2">
              <code class="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono text-gray-700">
                {{ classItem.code }}
              </code>
              <button 
                @click="$emit('copyClassCode', classItem.code)"
                class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy class code"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="$emit('selectClass', classItem)"
              class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <Eye class="w-4 h-4" />
              <span>View Details</span>
            </button>
            <button 
              @click="$emit('sendEmail', classItem)"
              class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
              title="Send email to class"
            >
              <Mail class="w-4 h-4" />
              <span>Email Class</span>
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Create Class Section -->
    <div class="card card-purple mt-8">
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
            :value="newClass.name"
            @input="$emit('update:newClass', { ...newClass, name: $event.target.value })"
            type="text" 
            placeholder="e.g., Beginner Piano, Advanced Guitar, Music Theory"
            required
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
          />
        </div>
        
        <div>
          <label class="block mb-2 font-semibold text-gray-700 text-base">Description</label>
          <textarea 
            :value="newClass.description"
            @input="$emit('update:newClass', { ...newClass, description: $event.target.value })"
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
            :value="newClass.level"
            @change="$emit('update:newClass', { ...newClass, level: $event.target.value })"
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
            :value="newClass.schedule"
            @input="$emit('update:newClass', { ...newClass, schedule: $event.target.value })"
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
import { 
  Plus, 
  Music, 
  GraduationCap, 
  AlertCircle, 
  Clock, 
  Hash, 
  Copy, 
  Mail,
  Eye
} from 'lucide-vue-next'

const props = defineProps({
  classes: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  newClass: {
    type: Object,
    required: true
  },
  isCreatingClass: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['createClass', 'update:newClass', 'loadClasses', 'selectClass', 'copyClassCode', 'sendEmail'])

const showInstrumentDropdown = ref(false)

const selectInstrument = (value) => {
  emit('update:newClass', { ...props.newClass, instrument: value })
  showInstrumentDropdown.value = false
}

const getSelectedInstrumentImage = () => {
  return getInstrumentImage(props.newClass.instrument)
}

const getSelectedInstrumentName = () => {
  return getInstrumentName(props.newClass.instrument)
}
</script> 