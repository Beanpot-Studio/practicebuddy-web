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
      <!-- Header -->
      <div class="card card-green">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
              <GraduationCap class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg text-gray-800 font-bold">Classes & Assignments</h3>
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
        
        <div v-else class="space-y-6">
          <!-- Class Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="classItem in classes" 
              :key="classItem.id"
              :class="[
                'card cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.1),0_18px_40px_rgba(0,0,0,0.2)]',
                selectedClass?.id === classItem.id ? 'card-blue' : 'card-green'
              ]"
              @click="selectClass(classItem)"
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
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Assignments</span>
                  <span class="text-sm font-bold">{{ getClassAssignmentsCount(classItem.id) }}</span>
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

          <!-- Selected Class Details -->
          <div v-if="selectedClass" class="card card-blue">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
                  <ClipboardList class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-xl text-gray-800 font-bold">{{ selectedClass.name }} - Class Details</h3>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="$emit('copyClassCode', selectedClass.code)"
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <Copy class="w-4 h-4" />
                  Copy Code
                </button>
                <button 
                  @click="$emit('sendEmail', selectedClass)"
                  class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
                >
                  <Mail class="w-4 h-4" />
                  Email Class
                </button>
              </div>
            </div>
            
            <!-- Class Information -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div class="lg:col-span-1">
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
                    <span class="font-mono bg-blue-100 px-3 py-1 rounded-lg text-blue-700">{{ selectedClass.code }}</span>
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
              
              <!-- Create Assignment -->
              <div class="lg:col-span-2">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Create New Assignment</h4>
                <form @submit.prevent="createNewAssignment" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Assignment Type -->
                    <div>
                      <label class="block mb-2 font-semibold text-gray-700">Assignment Type</label>
                      <div class="flex gap-4">
                        <label class="flex items-center gap-2">
                          <input 
                            type="radio" 
                            v-model="newAssignment.type" 
                            value="class"
                            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <BookOpen class="w-4 h-4" />
                            Class Assignment
                          </span>
                        </label>
                        <label class="flex items-center gap-2">
                          <input 
                            type="radio" 
                            v-model="newAssignment.type" 
                            value="individual"
                            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User class="w-4 h-4" />
                            Individual
                          </span>
                        </label>
                      </div>
                    </div>

                    <!-- Student Selection for Individual Assignments -->
                    <div v-if="newAssignment.type === 'individual'">
                      <label class="block mb-2 font-semibold text-gray-700">Select Student</label>
                      <select 
                        v-model="newAssignment.studentId"
                        class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(59,130,246,0.2)]"
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
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Assignment Title -->
                    <div>
                      <label class="block mb-2 font-semibold text-gray-700">Assignment Title</label>
                      <input 
                        v-model="newAssignment.title"
                        type="text"
                        placeholder="Enter assignment title"
                        class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(59,130,246,0.2)]"
                      />
                    </div>

                    <!-- Practice Minutes -->
                    <div>
                      <label class="block mb-2 font-semibold text-gray-700">Practice Minutes (Optional)</label>
                      <input 
                        v-model="newAssignment.practiceMinutes"
                        type="number"
                        min="0"
                        placeholder="Enter practice minutes"
                        class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(59,130,246,0.2)]"
                      />
                    </div>
                  </div>

                  <!-- Assignment Description -->
                  <div>
                    <label class="block mb-2 font-semibold text-gray-700">Description</label>
                    <textarea 
                      v-model="newAssignment.description"
                      placeholder="Describe the assignment..."
                      rows="3"
                      class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(59,130,246,0.2)]"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Due Date -->
                    <div>
                      <label class="block mb-2 font-semibold text-gray-700">Due Date</label>
                      <input 
                        v-model="newAssignment.dueDate"
                        type="date"
                        class="w-full p-3 border-2 border-gray-300 rounded-xl text-base font-medium shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-blue-400 focus:shadow-[0_2px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(59,130,246,0.2)]"
                      />
                    </div>

                    <!-- Submit Button -->
                    <div class="flex items-end">
                      <button 
                        type="submit"
                        :disabled="isCreatingAssignment"
                        class="w-full btn btn-blue flex items-center justify-center gap-2"
                      >
                        <Plus v-if="!isCreatingAssignment" class="w-5 h-5" />
                        <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {{ isCreatingAssignment ? 'Creating Assignment...' : 'Create Assignment' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <!-- Class Roster and Assignments Table -->
            <div class="mt-8">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">Class Roster & Assignments</h4>
              
              <!-- Loading Roster -->
              <div v-if="isLoadingRoster" class="text-center py-8">
                <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p class="text-gray-600 text-sm">Loading class roster...</p>
              </div>

              <!-- Roster Table -->
              <div v-else-if="classRoster.length > 0" class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-50 border-b-2 border-gray-200">
                      <th class="text-left p-4 font-semibold text-gray-700">Student</th>
                      <th class="text-left p-4 font-semibold text-gray-700">Assignments</th>
                      <th class="text-left p-4 font-semibold text-gray-700">Progress</th>
                      <th class="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="student in classRoster" 
                      :key="student.studentId"
                      class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td class="p-4">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {{ (student.studentName || student.name || 'S').charAt(0).toUpperCase() }}
                          </div>
                          <div>
                            <div class="font-semibold text-gray-800">{{ student.studentName || student.name || 'Unknown Student' }}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td class="p-4">
                        <div class="space-y-1">
                          <div 
                            v-for="assignment in getStudentAssignments(student.studentId || student.id)" 
                            :key="assignment.id"
                            class="flex items-center gap-2 text-sm"
                          >
                            <span :class="[
                              'px-2 py-1 rounded text-xs font-bold',
                              assignment.type === 'class' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            ]">
                              {{ assignment.type === 'class' ? 'Class' : 'Individual' }}
                            </span>
                            <span class="text-gray-700">{{ assignment.title }}</span>
                            <span class="text-gray-500">({{ formatDate(new Date(assignment.dueDate)) }})</span>
                          </div>
                        </div>
                      </td>
                      <td class="p-4">
                        <div class="space-y-1">
                          <div 
                            v-for="assignment in getStudentAssignments(student.studentId || student.id)" 
                            :key="assignment.id"
                            class="flex items-center gap-2"
                          >
                            <div class="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                                :style="{ width: getAssignmentProgress(student.studentId || student.id, assignment.id) + '%' }"
                              ></div>
                            </div>
                            <span class="text-xs text-gray-500">{{ getAssignmentProgress(student.studentId || student.id, assignment.id) }}%</span>
                          </div>
                        </div>
                      </td>
                      <td class="p-4">
                        <div class="flex items-center gap-2">
                          <button 
                            @click="viewStudentDetails(student)"
                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            @click="createIndividualAssignment(student)"
                            class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- No Roster -->
              <div v-else class="text-center py-8">
                <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-800 mb-2">No Students Enrolled</h4>
                <p class="text-gray-600 mb-4">Students can join this class using the class code: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ selectedClass.code }}</span></p>
              </div>
            </div>

            <!-- Existing Assignments -->
            <div v-if="classAssignments.length > 0" class="mt-8">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">Existing Assignments</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="assignment in classAssignments" 
                  :key="assignment.id"
                  class="p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h5 class="font-semibold text-gray-800 mb-1">{{ assignment.title || 'Untitled Assignment' }}</h5>
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
                      <p class="text-gray-600 text-sm mb-2">{{ assignment.description || 'No description provided' }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      Due: {{ assignment.dueDate ? formatDate(new Date(assignment.dueDate)) : 'No due date' }}
                    </div>
                    <div v-if="assignment.practiceMinutes" class="text-sm text-blue-600 font-semibold flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ assignment.practiceMinutes }} min
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between mt-3">
                    <div class="text-xs text-gray-500">
                      Created: {{ assignment.createdAt ? formatDate(new Date(assignment.createdAt)) : 'Unknown' }}
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
  Mail,
  User,
  Clock
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
  },
  classRoster: {
    type: Array,
    default: () => []
  },
  isLoadingRoster: {
    type: Boolean,
    default: false
  },
  classAssignments: {
    type: Array,
    default: () => []
  },
  newAssignment: {
    type: Object,
    required: true
  },
  isCreatingAssignment: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'loadClasses',
  'changeTab',
  'selectClass',
  'copyClassCode',
  'sendEmail',
  'createNewAssignment',
  'deleteAssignment',
  'viewStudentDetails',
  'createIndividualAssignment'
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

const getStudentInstrumentIcon = (instrumentName) => {
  const instrument = instruments.find(instr => 
    instr.name.toLowerCase().includes(instrumentName?.toLowerCase()) || 
    instrumentName?.toLowerCase().includes(instr.name.toLowerCase())
  )
  
  return instrument ? instrument.image : null
}

const getClassAssignmentsCount = (classId) => {
  return props.classAssignments.filter(assignment => 
    assignment.classId === classId
  ).length
}

const getStudentAssignments = (studentId) => {
  if (!studentId) return []
  
  // Filter assignments for the selected class context
  const filteredAssignments = props.classAssignments.filter(assignment => {
    // Show class assignments for the selected class
    if (assignment.type === 'class' && props.selectedClass) {
      return assignment.classCode === props.selectedClass.code || 
             assignment.classId === props.selectedClass.id
    }
    // Show individual assignments for this specific student
    if (assignment.type === 'individual') {
      return assignment.studentId === studentId
    }
    return false
  })
  
  return filteredAssignments
}

const getAssignmentProgress = (studentId, assignmentId) => {
  if (!studentId || !assignmentId) return 0
  // This would be calculated based on actual progress data
  // For now, return a random progress for demonstration
  return Math.floor(Math.random() * 100)
}

const selectClass = (classItem) => {
  emit('selectClass', classItem)
}

const createNewAssignment = () => {
  emit('createNewAssignment')
}

const viewStudentDetails = (student) => {
  emit('viewStudentDetails', student)
}

const createIndividualAssignment = (student) => {
  emit('createIndividualAssignment', student)
}
</script> 