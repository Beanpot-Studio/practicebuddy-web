<template>
  <div class="card card-purple">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
        <BookOpen class="w-5 h-5 text-white" />
      </div>
      <h3 class="text-lg text-gray-800 font-bold">Join a Music Class</h3>
    </div>
    
    <div class="text-center py-8">
      <GraduationCap class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h4 class="text-lg font-semibold text-gray-800 mb-2">Ready to Learn with a Teacher?</h4>
      <p class="text-gray-600 mb-6">Join a music class to get assignments, feedback, and guidance from your teacher!</p>
      
      <div class="max-w-md mx-auto">
        <div class="mb-4">
          <label class="block mb-2 font-semibold text-gray-700 text-base flex items-center gap-2">
            <Edit class="w-4 h-4" />
            Class Code
          </label>
          <input 
            v-model="classCodeToJoin" 
            placeholder="Enter your class code (e.g., MUSIC101)"
            class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-purple-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(147,51,234,0.2)] focus:transform focus:-translate-y-0.5"
          />
        </div>
        
        <button 
          @click="joinClass" 
          :disabled="!classCodeToJoin || isJoiningClass"
          :class="[
            'btn w-full p-4 text-base font-bold flex items-center gap-2 bg-musical-purple',
            !classCodeToJoin || isJoiningClass ? 'opacity-50 cursor-not-allowed' : 'btn-purple'
          ]"
        >
          <div v-if="isJoiningClass" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <Target v-else class="w-5 h-5" />
          <span v-if="!isJoiningClass">Join Class</span>
          <span v-else>Joining...</span>
        </button>
        
        <div v-if="joinClassError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {{ joinClassError }}
        </div>
        
        <div v-if="joinClassSuccess" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle class="w-4 h-4" />
          Successfully joined the class! Your teacher will see you soon.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BookOpen, GraduationCap, Edit, Target, CheckCircle } from 'lucide-vue-next'

const emit = defineEmits(['join-class'])

const classCodeToJoin = ref('')
const isJoiningClass = ref(false)
const joinClassError = ref('')
const joinClassSuccess = ref('')

const joinClass = async () => {
  if (!classCodeToJoin.value?.trim()) {
    joinClassError.value = 'Please enter a class code'
    return
  }
  
  isJoiningClass.value = true
  joinClassError.value = ''
  joinClassSuccess.value = ''
  
  try {
    // Use a callback so the parent can report actual success/failure
    emit('join-class', classCodeToJoin.value.trim(), (result) => {
      if (result && result.success) {
        joinClassSuccess.value = 'Successfully joined the class!'
        joinClassError.value = ''
        classCodeToJoin.value = ''
      } else {
        joinClassSuccess.value = ''
        joinClassError.value = result?.error || 'Failed to join class. Please check your class code.'
      }
    })
  } catch (error) {
    console.error('Error joining class:', error)
    joinClassError.value = 'An error occurred while joining the class. Please try again.'
  } finally {
    isJoiningClass.value = false
  }
}
</script> 