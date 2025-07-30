<template>
  <div class="animate-fadeIn">
    <div class="space-y-6">
      <!-- Class Selection for Assignments -->
      <div class="card card-purple">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
              📚
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Select Class to Manage Assignments</h3>
          </div>
          <button 
            @click="$emit('loadClasses')"
            class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            🔄 Refresh Classes
          </button>
        </div>
        
        <div v-if="classes.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">🎵</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">No Classes Found</h4>
          <p class="text-gray-600 mb-4">
            No classes were found for your account. This could mean:
          </p>
          <ul class="text-sm text-gray-600 mb-4 text-left max-w-md mx-auto">
            <li>• You haven't created any classes yet</li>
            <li>• The classes were created with a different account</li>
            <li>• There's a loading issue (try the refresh button)</li>
          </ul>
          <div class="flex gap-3 justify-center">
            <button 
              @click="$emit('loadClasses')"
              class="btn btn-secondary"
            >
              🔄 Refresh Classes
            </button>
            <button 
              @click="$emit('changeTab', 'create-class')"
              class="btn btn-purple"
            >
              ➕ Create New Class
            </button>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="classItem in classes" 
            :key="classItem.id"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-[0_2px_0_rgba(0,0,0,0.1)]',
              selectedClassForAssignments?.id === classItem.id
                ? 'bg-gradient-to-br from-purple-400 to-purple-500 border-purple-600 text-white'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-purple-400'
            ]"
            @click="$emit('selectClassForAssignments', classItem)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {{ classItem.icon }}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold">{{ classItem.name }}</h4>
                <p class="text-sm opacity-80">{{ classItem.studentCount }} students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Assignment -->
      <div v-if="selectedClassForAssignments" class="card card-purple">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            ➕
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Create New Assignment for {{ selectedClassForAssignments.name }}</h3>
        </div>
        
        <form @submit.prevent="$emit('createNewAssignment')" class="space-y-4">
          <!-- Assignment Type Selection -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Assignment Type</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  v-model="newAssignment.type" 
                  value="class"
                  class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span class="text-sm font-medium text-gray-700">📚 Class Assignment (All Students)</span>
              </label>
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  v-model="newAssignment.type" 
                  value="individual"
                  class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span class="text-sm font-medium text-gray-700">👤 Individual Assignment</span>
              </label>
            </div>
          </div>

          <!-- Student Selection for Individual Assignments -->
          <div v-if="newAssignment.type === 'individual'">
            <label class="block mb-2 font-semibold text-gray-700">Select Student</label>
            <select 
              v-model="newAssignment.studentId"
              required
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(168,85,247,0.2)] focus:transform focus:-translate-y-0.5"
            >
              <option value="">Choose a student</option>
              <option v-for="student in classRoster" :key="student.studentId" :value="student.studentId">
                {{ student.name }} ({{ student.instrument || 'No instrument' }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 font-semibold text-gray-700">Assignment Title</label>
              <input 
                v-model="newAssignment.title" 
                type="text" 
                placeholder="e.g., Practice Scales, Learn New Song"
                required
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(168,85,247,0.2)] focus:transform focus:-translate-y-0.5"
              />
            </div>
            <div>
              <label class="block mb-2 font-semibold text-gray-700">Due Date</label>
              <input 
                v-model="newAssignment.dueDate" 
                type="date" 
                required
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(168,85,247,0.2)] focus:transform focus:-translate-y-0.5"
              />
            </div>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea 
              v-model="newAssignment.description" 
              placeholder="Describe what students need to practice or learn..."
              rows="3"
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(168,85,247,0.2)] focus:transform focus:-translate-y-0.5 resize-vertical"
            ></textarea>
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Practice Minutes (Optional)</label>
            <input 
              v-model="newAssignment.practiceMinutes" 
              type="number" 
              min="1" 
              max="120"
              placeholder="30"
              class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(168,85,247,0.2)] focus:transform focus:-translate-y-0.5"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isCreatingAssignment"
            class="btn btn-purple w-full"
          >
            <div v-if="isCreatingAssignment" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span v-else>📚 Create Assignment</span>
            {{ isCreatingAssignment ? 'Creating...' : '' }}
          </button>
        </form>
      </div>

      <!-- Existing Assignments -->
      <div v-if="selectedClassForAssignments" class="card card-purple">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            📋
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Existing Assignments</h3>
        </div>
        
        <div v-if="isLoadingAssignments" class="text-center py-8">
          <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading assignments...</p>
        </div>
        
        <div v-else-if="classAssignments.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">📚</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">No Assignments Yet</h4>
          <p class="text-gray-600">Create your first assignment above!</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="assignment in classAssignments" 
            :key="assignment.id"
            class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-semibold text-gray-800 text-lg">{{ assignment.title }}</h4>
                  <span :class="[
                    'px-2 py-1 rounded-lg text-xs font-bold',
                    assignment.type === 'class' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-green-100 text-green-700 border border-green-300'
                  ]">
                    {{ assignment.type === 'class' ? '📚 Class' : '👤 Individual' }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm text-gray-500">
                  Due: {{ formatDate(new Date(assignment.dueDate)) }}
                </div>
                <div v-if="assignment.practiceMinutes" class="text-sm text-purple-600 font-semibold">
                  ⏱️ {{ assignment.practiceMinutes }} min
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500">
                Created: {{ formatDate(new Date(assignment.createdAt)) }}
              </div>
              <button 
                @click="$emit('deleteAssignment', assignment.id)"
                class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Delete
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
  selectedClassForAssignments: {
    type: Object,
    default: null
  },
  newAssignment: {
    type: Object,
    required: true
  },
  classRoster: {
    type: Array,
    default: () => []
  },
  classAssignments: {
    type: Array,
    default: () => []
  },
  isLoadingAssignments: {
    type: Boolean,
    default: false
  },
  isCreatingAssignment: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'loadClasses',
  'changeTab',
  'selectClassForAssignments',
  'createNewAssignment',
  'deleteAssignment'
])

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}
</script> 