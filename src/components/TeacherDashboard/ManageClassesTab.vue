<template>
  <div class="animate-fadeIn">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-12 h-12 border-4 border-musical-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 text-lg">Loading classes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <GraduationCap class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Classes</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="$emit('loadClasses')"
        class="px-6 py-3 bg-musical-primary text-white rounded-xl font-semibold hover:bg-musical-primary/90 transition-all duration-200"
      >
        Try Again
      </button>
    </div>

    <!-- Classes Content -->
    <div v-else class="space-y-6">
      <!-- Class Management Header -->
      <div class="card card-green">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              <GraduationCap class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Manage Your Classes</h3>
          </div>
          <button 
            @click="$emit('loadClasses')"
            class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            Refresh Classes
          </button>
        </div>
        
        <div v-if="classes.length === 0" class="text-center py-8">
          <Music class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">No Classes Yet</h4>
          <p class="text-gray-600 mb-4">Create your first music class to get started!</p>
          <button 
            @click="$emit('changeTab', 'create-class')"
            class="btn btn-green flex items-center gap-2 mx-auto"
          >
            <Plus class="w-5 h-5" />
            Create Your First Class
          </button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="classItem in classes" 
            :key="classItem.id"
            class="card card-green cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.1),0_18px_40px_rgba(0,0,0,0.2)]"
            @click="$emit('selectClass', classItem)"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-gray-300 flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.1)] overflow-hidden">
                <img 
                  v-if="getClassIcon(classItem)"
                  :src="`/instruments/${getClassIcon(classItem)}`"
                  :alt="classItem.instrument || 'Music Class'"
                  class="w-8 h-8 object-contain"
                />
                <Music v-else class="w-6 h-6 text-gray-500" />
              </div>
              <div class="flex-1">
                <h4 class="text-base text-gray-800 font-bold mb-1">{{ classItem.name }}</h4>
                <p class="text-sm text-gray-500 font-semibold">{{ classItem.instrument || 'Music Class' }}</p>
              </div>
            </div>
            
            <div class="flex justify-between mb-4 gap-2">
              <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white flex-1">
                <span class="block text-xs opacity-90 font-semibold mb-0.5">Students</span>
                <span class="text-sm font-bold">{{ classItem.studentCount || 0 }}</span>
              </div>
              <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 text-white flex-1">
                <span class="block text-xs opacity-90 font-semibold mb-0.5">Code</span>
                <span class="text-sm font-bold">{{ classItem.code }}</span>
              </div>
            </div>

            <div class="border-t-3 border-gray-200 pt-4">
              <div class="flex justify-between items-center mb-3">
                <h5 class="text-sm text-gray-800 font-bold flex items-center gap-2">
                  <BarChart3 class="w-4 h-4" />
                  Class Info
                </h5>
              </div>
              <div class="text-center py-2 text-gray-600 text-sm">
                <div class="mb-1">
                  <span class="font-semibold">Level:</span> {{ classItem.level || 'Not specified' }}
                </div>
                <div class="mb-1">
                  <span class="font-semibold">Schedule:</span> {{ classItem.schedule || 'Not specified' }}
                </div>
                <div class="mb-1">
                  <span class="font-semibold">Created:</span> {{ formatDate(new Date(classItem.createdAt)) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Details Modal -->
      <div v-if="selectedClass" class="card card-blue">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
              <ClipboardList class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl text-gray-800 font-bold">{{ selectedClass.name }} - Class Details</h3>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Class Information</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-700">Class Name:</span>
                <span class="text-gray-800">{{ selectedClass.name }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-700">Instrument:</span>
                <span class="text-gray-800">{{ selectedClass.instrument || 'Not specified' }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-700">Class Code:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono bg-blue-100 px-3 py-1 rounded-lg text-blue-700">{{ selectedClass.code }}</span>
                  <button 
                    @click="$emit('copyClassCode', selectedClass.code)"
                    class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-700">Students:</span>
                <span class="text-gray-800">{{ selectedClass.studentCount || 0 }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-700">Created:</span>
                <span class="text-gray-800">{{ formatDate(new Date(selectedClass.createdAt)) }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div class="space-y-3">
              <button 
                @click="$emit('changeTab', 'class-roster')"
                class="w-full btn btn-blue flex items-center gap-2"
              >
                <Users class="w-5 h-5" />
                View Class Roster
              </button>
              <button 
                @click="$emit('changeTab', 'assignments')"
                class="w-full btn btn-purple flex items-center gap-2"
              >
                <BookOpen class="w-5 h-5" />
                Manage Assignments
              </button>
              <button 
                @click="$emit('sendEmail', selectedClass)"
                class="w-full btn btn-green flex items-center gap-2"
              >
                <Mail class="w-5 h-5" />
                Send Email to Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { instruments, getInstrumentImage, getInstrumentName } from '../../lib/instruments'
import { 
  GraduationCap, 
  RefreshCw, 
  Music, 
  Plus, 
  BarChart3, 
  ClipboardList, 
  Copy, 
  Users, 
  BookOpen, 
  Mail 
} from 'lucide-vue-next'

const props = defineProps({
  classes: {
    type: Array,
    default: () => []
  },
  selectedClass: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  'loadClasses',
  'changeTab',
  'selectClass',
  'copyClassCode',
  'sendEmail'
])

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const getClassIcon = (classItem) => {
  // If class has an icon, use it
  if (classItem.icon) {
    return classItem.icon
  }
  
  // Get the instrument name and find the matching instrument image
  const instrumentName = classItem.instrument?.toLowerCase() || ''
  
  // Find the instrument in our instruments array
  const instrument = instruments.find(instr => 
    instr.name.toLowerCase().includes(instrumentName) || 
    instrumentName.includes(instr.name.toLowerCase())
  )
  
  if (instrument) {
    return instrument.image
  }
  
  // If no match found, return the default music icon
  const defaultInstrument = instruments.find(instr => instr.value === 'music')
  return defaultInstrument ? defaultInstrument.image : null
}
</script> 