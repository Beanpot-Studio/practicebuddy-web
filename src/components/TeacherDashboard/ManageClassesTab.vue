<template>
  <div class="animate-fadeIn">
    <div class="space-y-6">
      <!-- Class Management Header -->
      <div class="card card-green">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              🎓
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Manage Your Classes</h3>
          </div>
          <button 
            @click="$emit('loadClasses')"
            class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            🔄 Refresh Classes
          </button>
        </div>
        
        <div v-if="classes.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">🎵</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">No Classes Yet</h4>
          <p class="text-gray-600 mb-4">Create your first music class to get started!</p>
          <button 
            @click="$emit('changeTab', 'create-class')"
            class="btn btn-green"
          >
            ➕ Create Your First Class
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
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-gray-300 flex items-center justify-center text-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)]">
                {{ classItem.icon }}
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
                <h5 class="text-sm text-gray-800 font-bold">📊 Class Info</h5>
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
              📋
            </div>
            <h3 class="text-xl text-gray-800 font-bold">{{ selectedClass.name }} - Class Details</h3>
          </div>
          <button 
            @click="$emit('copyClassCode', selectedClass.code)"
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            📋 Copy Class Code
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Class Information</h4>
            <div class="space-y-3">
              <div>
                <span class="font-semibold text-gray-700">Name:</span>
                <span class="ml-2 text-gray-600">{{ selectedClass.name }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Description:</span>
                <span class="ml-2 text-gray-600">{{ selectedClass.description || 'No description' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Instrument:</span>
                <span class="ml-2 text-gray-600">{{ selectedClass.instrument || 'Not specified' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Level:</span>
                <span class="ml-2 text-gray-600">{{ selectedClass.level || 'Not specified' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Schedule:</span>
                <span class="ml-2 text-gray-600">{{ selectedClass.schedule || 'Not specified' }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Class Code:</span>
                <span class="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{{ selectedClass.code }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div class="space-y-3">
              <button 
                @click="$emit('changeTab', 'class-roster')"
                class="w-full btn btn-blue"
              >
                👥 View Class Roster
              </button>
              <button 
                @click="$emit('changeTab', 'assignments')"
                class="w-full btn btn-purple"
              >
                📚 Manage Assignments
              </button>
              <button 
                @click="$emit('sendEmail', selectedClass)"
                class="w-full btn btn-green"
              >
                📧 Send Email to Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  classes: {
    type: Array,
    default: () => []
  },
  selectedClass: {
    type: Object,
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
</script> 