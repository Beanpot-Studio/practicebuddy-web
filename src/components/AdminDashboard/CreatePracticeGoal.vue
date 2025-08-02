<template>
  <div class="card card-purple">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
        <Target class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Create Practice Goal</h3>
    </div>

    <form @submit.prevent="createGoal" class="space-y-4">
      <!-- Goal Type Selection -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Goal Type</label>
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="goalType = 'individual'"
            type="button"
            :class="[
              'p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2',
              goalType === 'individual' 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
            ]"
          >
            <Target class="w-4 h-4" />
            Individual Student
          </button>
          <button 
            @click="goalType = 'class'"
            type="button"
            :class="[
              'p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2',
              goalType === 'class' 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
            ]"
          >
            <Users class="w-4 h-4" />
            Entire Class
          </button>
        </div>
      </div>

      <!-- Student Selection (for individual goals) -->
      <div v-if="goalType === 'individual'">
        <label class="block mb-2 font-semibold text-gray-700 text-base">Select Student</label>
        <select 
          v-model="selectedStudentId"
          :disabled="isLoadingStudents"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] disabled:opacity-50"
        >
          <option value="">
            {{ isLoadingStudents ? 'Loading students...' : 'Choose a student' }}
          </option>
          <option v-for="student in availableStudents" :key="student.studentId" :value="student.studentId">
            {{ student.studentName }} ({{ student.instrument || 'No instrument' }})
          </option>
        </select>
        <p v-if="isLoadingStudents" class="text-sm text-gray-500 mt-2">Loading your students...</p>
        <p v-else-if="availableStudents.length === 0" class="text-sm text-gray-500 mt-2">No students found. Create a class first!</p>
      </div>

      <!-- Class Selection (for class goals) -->
      <div v-if="goalType === 'class'">
        <label class="block mb-2 font-semibold text-gray-700 text-base">Select Class</label>
        <select 
          v-model="selectedClassCode"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
        >
          <option value="">Choose a class</option>
          <option v-for="classItem in availableClasses" :key="classItem.code" :value="classItem.code">
            {{ classItem.name }} ({{ classItem.students?.length || 0 }} students)
          </option>
        </select>
      </div>

      <!-- Goal Title -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Goal Title</label>
        <input 
          v-model="goalTitle"
          type="text"
          placeholder="e.g., Weekly Practice Challenge"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
        />
      </div>

      <!-- Goal Description -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Description</label>
        <textarea 
          v-model="goalDescription"
          rows="3"
          placeholder="Describe what students need to accomplish..."
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] resize-none"
        ></textarea>
      </div>

      <!-- Target Practice Sessions -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Target Practice Sessions</label>
        <input 
          v-model="targetSessions"
          type="number"
          min="1"
          max="100"
          placeholder="5"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
        />
      </div>

      <!-- Reward -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Reward</label>
        <input 
          v-model="reward"
          type="text"
          placeholder="e.g., Extra sticker, Special badge, Free time"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
        />
      </div>

      <!-- Due Date (Optional) -->
      <div>
        <label class="block mb-2 font-semibold text-gray-700 text-base">Due Date (Optional)</label>
        <input 
          v-model="dueDate"
          type="date"
          class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)]"
        />
      </div>

      <!-- Create Button -->
      <button 
        type="submit"
        :disabled="!isFormValid || isCreating"
        class="btn btn-purple w-full p-4 text-base font-bold"
      >
        <Target v-if="!isCreating" class="w-5 h-5" />
        <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {{ isCreating ? 'Creating Goal...' : 'Create Practice Goal' }}
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
      <div class="flex items-center gap-2">
        <CheckCircle class="w-5 h-5 text-green-600" />
        <span class="text-green-800 font-medium">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Target, CheckCircle, Users } from 'lucide-vue-next'
import { createPracticeGoal, getTeacherClasses, getClassRoster } from '../../lib/auth'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['goal-created'])

// Form data
const goalType = ref('individual')
const selectedStudentId = ref('')
const selectedClassCode = ref('')
const goalTitle = ref('')
const goalDescription = ref('')
const targetSessions = ref(5)
const reward = ref('')
const dueDate = ref('')

// UI state
const isCreating = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')

// Available data
const availableStudents = ref([])
const availableClasses = ref([])
const isLoadingStudents = ref(false)

const isFormValid = computed(() => {
  if (goalType.value === 'individual') {
    return selectedStudentId.value && goalTitle.value && targetSessions.value > 0 && reward.value
  } else {
    return selectedClassCode.value && goalTitle.value && targetSessions.value > 0 && reward.value
  }
})

const loadAvailableStudents = async () => {
  try {
    isLoadingStudents.value = true
    console.log('Loading students for teacher:', props.currentUser.uid)
    
    // Get all classes for this teacher
    const classesResult = await getTeacherClasses(props.currentUser.uid)
    console.log('Classes result:', classesResult)
    
    if (!classesResult.success) {
      console.error('Failed to load teacher classes:', classesResult.error)
      return
    }
    
    const allStudents = []
    
    // For each class, get the roster
    for (const classItem of classesResult.classes) {
      console.log('Loading roster for class:', classItem.code)
      try {
        const rosterResult = await getClassRoster(classItem.code)
        console.log('Roster result for class', classItem.code, ':', rosterResult)
        
        if (rosterResult.success && rosterResult.students) {
          console.log('Raw students data from class', classItem.code, ':', rosterResult.students)
          
          // Add class info to each student
          const studentsWithClass = rosterResult.students.map(student => {
            console.log('Processing student:', student)
            const mappedStudent = {
              studentId: student.studentId || student.uid || student.id,
              studentName: student.studentName || student.displayName || student.name || 'Unknown Student',
              instrument: student.instrument || 'No instrument',
              classCode: classItem.code,
              className: classItem.name
            }
            console.log('Mapped student:', mappedStudent)
            return mappedStudent
          })
          allStudents.push(...studentsWithClass)
          console.log('Added students from class', classItem.code, ':', studentsWithClass)
        }
      } catch (error) {
        console.error(`Error loading roster for class ${classItem.code}:`, error)
      }
    }
    
    // Remove duplicates (in case a student is in multiple classes)
    const uniqueStudents = allStudents.filter((student, index, self) => 
      index === self.findIndex(s => s.studentId === student.studentId)
    )
    
    availableStudents.value = uniqueStudents
    console.log('Final unique students:', uniqueStudents)
    
  } catch (error) {
    console.error('Error loading students:', error)
  } finally {
    isLoadingStudents.value = false
  }
}

const loadAvailableClasses = async () => {
  try {
    const result = await getTeacherClasses(props.currentUser.uid)
    if (result.success) {
      availableClasses.value = result.classes
    } else {
      console.error('Failed to load classes:', result.error)
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const createGoal = async () => {
  if (!isFormValid.value) return

  isCreating.value = true
  showSuccess.value = false

  try {
    const goalData = {
      title: goalTitle.value,
      description: goalDescription.value,
      targetPracticeSessions: parseInt(targetSessions.value),
      reward: reward.value,
      type: goalType.value,
      studentId: goalType.value === 'individual' ? selectedStudentId.value : null,
      classCode: goalType.value === 'class' ? selectedClassCode.value : null,
      createdBy: props.currentUser.uid,
      dueDate: dueDate.value || null
    }

    const result = await createPracticeGoal(goalData)

    if (result.success) {
      successMessage.value = `Practice goal "${goalTitle.value}" created successfully!`
      showSuccess.value = true
      
      // Reset form
      goalType.value = 'individual'
      selectedStudentId.value = ''
      selectedClassCode.value = ''
      goalTitle.value = ''
      goalDescription.value = ''
      targetSessions.value = 5
      reward.value = ''
      dueDate.value = ''
      
      // Emit event
      emit('goal-created', result.goalId)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } else {
      console.error('Failed to create goal:', result.error)
      alert('Failed to create practice goal. Please try again.')
    }
  } catch (error) {
    console.error('Error creating goal:', error)
    alert('An error occurred while creating the practice goal.')
  } finally {
    isCreating.value = false
  }
}

onMounted(async () => {
  await loadAvailableStudents()
  await loadAvailableClasses()
})
</script> 