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
            <select 
              id="class-instrument"
              v-model="newClass.instrument" 
              required
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
            >
              <option value="">Select an instrument</option>
              <option value="piano">🎹 Piano</option>
              <option value="guitar">🎸 Guitar</option>
              <option value="violin">🎻 Violin</option>
              <option value="trumpet">🎺 Trumpet</option>
              <option value="drums">🥁 Drums</option>
              <option value="saxophone">🎷 Saxophone</option>
              <option value="voice">🎤 Voice</option>
              <option value="theory">📚 Music Theory</option>
              <option value="ensemble">🎼 Ensemble</option>
              <option value="other">🎵 Other</option>
            </select>
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

defineEmits(['createClass'])
</script> 