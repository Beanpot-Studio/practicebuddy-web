<template>
  <div class="animate-fadeIn">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-12 h-12 border-4 border-musical-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 text-lg">Loading teacher dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Dashboard</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        @click="$emit('loadClasses')"
        class="px-6 py-3 bg-musical-primary text-white rounded-xl font-semibold hover:bg-musical-primary/90 transition-all duration-200"
      >
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card card-red">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Dashboard Overview</h3>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white">
              <div class="text-2xl font-bold">{{ totalStudents }}</div>
              <div class="text-sm opacity-90 font-semibold">Music Students</div>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white">
              <div class="text-2xl font-bold">{{ classes.length }}</div>
              <div class="text-sm opacity-90 font-semibold">Active Classes</div>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white">
              <div class="text-2xl font-bold">{{ totalAssignments }}</div>
              <div class="text-sm opacity-90 font-semibold">Total Assignments</div>
            </div>
          </div>
        </div>

        <div class="card card-blue">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
              <Bell class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Recent Activity</h3>
          </div>
          <div class="flex flex-col gap-3">
            <div v-if="recentActivity.length === 0" class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]">
              <div class="text-sm text-gray-600 font-medium text-center">No recent activity</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Roster Table -->
      <div class="card card-yellow">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-yellow-600 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
              <Users class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl text-gray-800 font-bold">Student Roster</h3>
          </div>
          <div class="text-sm text-gray-600">
            {{ allStudents.length }} total students
          </div>
        </div>

        <!-- Class Selection -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <h4 class="text-lg font-semibold text-gray-700">Filter by Class:</h4>
            <button 
              @click="$emit('selectClassForRoster', null)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                !selectedClassForRoster 
                  ? 'bg-yellow-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              All Classes ({{ allStudents.length }})
            </button>
            <div 
              v-for="classItem in classes" 
              :key="classItem.id"
              @click="$emit('selectClassForRoster', classItem)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200',
                selectedClassForRoster?.id === classItem.id
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ classItem.name }} ({{ classItem.studentCount }})
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoadingRoster" class="text-center py-8">
          <div class="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading roster...</p>
        </div>
        
        <!-- No Students State -->
        <div v-else-if="displayStudents.length === 0" class="text-center py-8">
          <Music class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            {{ selectedClassForRoster ? `No Students in ${selectedClassForRoster.name}` : 'No Students Yet' }}
          </h4>
          <p class="text-gray-600 mb-4">
            {{ selectedClassForRoster 
              ? 'Students will appear here once they join this class.'
              : 'Students will appear here once they join your classes.' 
            }}
          </p>
        </div>
        
        <!-- Students Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Instrument</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Assignments</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="student in displayStudents" 
                :key="student.studentId"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img 
                        v-if="getStudentAvatar(student.instrument)" 
                        :src="`/instruments/${getStudentAvatar(student.instrument)}`" 
                        :alt="student.instrument"
                        class="w-6 h-6 object-contain"
                      />
                      <Music v-else class="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800">{{ student.studentName }}</div>
                      <div class="text-sm text-gray-500">{{ student.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ student.instrument || 'Not specified' }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-gray-700">{{ student.className || 'Standalone' }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-gray-600">{{ formatJoinDate(student.joinDate) }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="text-sm font-semibold text-green-600">{{ studentAssignments[student.studentId] || 0 }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BarChart3, Bell, Users, Music } from 'lucide-vue-next'

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
  allStudents: {
    type: Array,
    default: () => []
  },
  studentAssignments: {
    type: Object,
    default: () => ({})
  },
  recentActivity: {
    type: Array,
    default: () => []
  },
  selectedClassForRoster: {
    type: Object,
    default: null
  },
  classRoster: {
    type: Array,
    default: () => []
  },
  isLoadingRoster: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['changeTab', 'selectStudent', 'selectClassForRoster'])

const totalStudents = computed(() => props.allStudents.length)
const totalAssignments = computed(() => {
  const total = Object.values(props.studentAssignments).reduce((total, count) => {
    return total + (count || 0)
  }, 0)
  console.log('Total assignments calculated:', total, 'from studentAssignments:', props.studentAssignments)
  return total
})

const displayStudents = computed(() => {
  if (props.selectedClassForRoster) {
    // Show students from the selected class roster
    return props.classRoster
  } else {
    // Show all students
    return props.allStudents
  }
})

const getStudentAvatar = (instrument) => {
  const avatars = {
    piano: 'piano.png',
    guitar: 'guitar.png',
    violin: 'violin.png',
    trumpet: 'trumpet.png',
    drums: 'drums.png',
    saxophone: 'saxophone.png',
    voice: 'voice.png',
    theory: 'theory.png'
  }
  return avatars[instrument?.toLowerCase()] || null
}

const formatJoinDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatFullDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 