<template>
  <div class="animate-fadeIn">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-12 h-12 border-4 border-musical-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 text-lg">Loading assignments...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Assignments</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="$emit('loadClasses')"
        class="px-6 py-3 bg-musical-primary text-white rounded-xl font-semibold hover:bg-musical-primary/90 transition-all duration-200"
      >
        Try Again
      </button>
    </div>

    <!-- Assignments Content -->
    <div v-else class="space-y-6">
      <!-- Class Selection for Assignments -->
      <div class="card card-purple">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
              <BookOpen class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Manage Assignments</h3>
          </div>
          <button 
            @click="$emit('loadClasses')"
            class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            Refresh Classes
          </button>
        </div>
        
        <div v-if="classes.length === 0" class="text-center py-8">
          <Music class="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
              class="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw class="w-4 h-4" />
              Refresh Classes
            </button>
            <button 
              @click="$emit('changeTab', 'create-class')"
              class="btn btn-purple flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              Create New Class
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
            <Plus class="w-6 h-6 text-white" />
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
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen class="w-4 h-4" />
                  Class Assignment (All Students)
                </span>
              </label>
              <label class="flex items-center gap-2">
                <input 
                  type="radio" 
                  v-model="newAssignment.type" 
                  value="individual"
                  class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User class="w-4 h-4" />
                  Individual Assignment
                </span>
              </label>
            </div>
          </div>

          <!-- Student Selection for Individual Assignments -->
          <div v-if="newAssignment.type === 'individual'">
            <label class="block mb-2 font-semibold text-gray-700">Select Student</label>
            <select 
              v-model="newAssignment.studentId"
              class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            >
              <option value="">Choose a student</option>
              <option 
                v-for="student in classRoster" 
                :key="student.studentId" 
                :value="student.studentId"
              >
                {{ student.studentName }} ({{ student.instrument }})
              </option>
            </select>
          </div>

          <!-- Assignment Title -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Assignment Title</label>
            <input 
              v-model="newAssignment.title"
              type="text"
              placeholder="Enter assignment title"
              class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            />
          </div>

          <!-- Assignment Description -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea 
              v-model="newAssignment.description"
              placeholder="Describe the assignment..."
              rows="3"
              class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            ></textarea>
          </div>

          <!-- Practice Minutes -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Practice Minutes (Optional)</label>
            <input 
              v-model="newAssignment.practiceMinutes"
              type="number"
              min="0"
              placeholder="Enter practice minutes"
              class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            />
          </div>

          <!-- Due Date -->
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Due Date</label>
            <input 
              v-model="newAssignment.dueDate"
              type="date"
              class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
            />
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="isCreatingAssignment"
            class="w-full btn btn-purple flex items-center justify-center gap-2"
          >
            <Plus v-if="!isCreatingAssignment" class="w-5 h-5" />
            <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isCreatingAssignment ? 'Creating Assignment...' : 'Create Assignment' }}
          </button>
        </form>
      </div>

      <!-- Existing Assignments -->
      <div v-if="selectedClassForAssignments && classAssignments.length > 0" class="card card-purple">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
            <List class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg text-gray-800 font-bold">Existing Assignments</h3>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="assignment in classAssignments" 
            :key="assignment.id"
            class="p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 mb-1">{{ assignment.title }}</h4>
                <div class="flex items-center gap-2 mb-2">
                  <span :class="[
                    'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1',
                    assignment.type === 'class' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-green-100 text-green-700 border border-green-300'
                  ]">
                    <BookOpen v-if="assignment.type === 'class'" class="w-3 h-3" />
                    <User v-else class="w-3 h-3" />
                    {{ assignment.type === 'class' ? 'Class' : 'Individual' }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm text-gray-500">
                  Due: {{ formatDate(new Date(assignment.dueDate)) }}
                </div>
                <div v-if="assignment.practiceMinutes" class="text-sm text-purple-600 font-semibold flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {{ assignment.practiceMinutes }} min
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
import { 
  BookOpen, 
  RefreshCw, 
  Music, 
  Plus, 
  List, 
  User, 
  Clock 
} from 'lucide-vue-next'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  },
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