<template>
  <div class="min-h-screen bg-musical-primary relative overflow-hidden">
    <div class="py-20 relative z-10">
      <div class="container">
        <h1 class="text-5xl mb-5 font-bold text-musical-graphite">Welcome to Practice Buddy</h1>
        <p class="text-xl text-musical-graphite font-medium mb-10">Your musical journey starts here!</p>
        <div class="flex flex-col gap-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
            <div class="flex flex-col gap-10">
              <div class="max-w-lg mx-auto lg:mx-0">
                <div class="card" :class="[
                  'transition-all duration-300',
                  activeTab === 'student' ? 'border-4 border-green-500' : 'border-4 border-musical-coral'
                ]">
                  <div class="flex mb-6 bg-gray-100 rounded-2xl p-1 border-4 border-gray-200 shadow-sm">
                    <button 
                      data-testid="student-tab"
                      @click="switchToStudentTab"
                      :class="[
                        'flex-1 py-4 px-5 border-none rounded-xl font-semibold text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 font-inherit',
                        activeTab === 'student' ? 'bg-musical-success text-white shadow-md transform -translate-y-0.5 border-2 border-green-600' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <Users class="w-4.5 h-4.5" />
                      Music Students
                    </button>
                    <button 
                      data-testid="teacher-tab"
                      @click="switchToTeacherTab"
                      :class="[
                        'flex-1 py-4 px-5 border-none rounded-xl font-semibold text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 font-inherit',
                        activeTab === 'teacher' ? 'bg-musical-coral text-white shadow-md transform -translate-y-0.5' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <GraduationCap class="w-4.5 h-4.5" />
                      Music Teachers
                    </button>
                  </div>

                  <div class="min-h-[28rem]">
                    <!-- Demo Mode Indicator -->
                    <div v-if="isDemoMode" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                      🎭 <strong>Demo Mode:</strong> Use demo@example.com / demo123 for teachers or any name with class code DEMO123 for students.
                    </div>
                    
                    <!-- Error Message -->
                    <div v-if="hasError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {{ errorMessage }}
                    </div>
                    
                    <!-- Success Message -->
                    <div v-if="registrationSuccess" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                      ✅ Thanks for registering! Please login with your email and password.
                    </div>
                    
                    <!-- Student Tab -->
                    <div v-if="activeTab === 'student'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-green-500 bg-musical-success relative">
                          <Users class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2"> Students</h2>
                        <p class="text-musical-graphite">Track practice time and collect rewards!</p>
                      </div>
                      
                      <form @submit.prevent="loginStudent" class="space-y-6">
                        <div class="space-y-2">
                          <label for="student-name" class="block text-sm font-semibold text-musical-graphite">Your Name</label>
                          <input 
                            id="student-name"
                            v-model="studentForm.name" 
                            type="text" 
                            placeholder="Enter your name"
                            required
                            class="w-full px-4 py-3 border-3 bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <div class="space-y-2">
                          <label for="student-code" class="block text-sm font-semibold text-musical-graphite">Secret Class Code</label>
                          <input 
                            id="student-code"
                            v-model="studentForm.classCode" 
                            type="text" 
                            placeholder="Ask your teacher for the magic code"
                            required
                            class="w-full px-4 py-3 border-3 bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError" :class="{ 'opacity-50 cursor-not-allowed': hasError }">
                          <Play class="w-4 h-4" />
                          {{ hasError ? 'Fix Errors First' : 'Make Some Music!' }}
                        </button>
                      </form>
                      
                   
                    </div>

                    <!-- Teacher Tab -->
                    <div v-if="activeTab === 'teacher'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-red-500 bg-musical-coral relative">
                          <GraduationCap class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2">Teachers</h2>
                        <p class="text-musical-graphite">Guide your students and celebrate their musical journey!</p>
                      </div>
                      
                      <form @submit.prevent="loginTeacher" class="space-y-6">
                        <div class="space-y-2">
                          <label for="teacher-email" class="block text-sm font-semibold text-musical-graphite">
                            Teacher Email
                            <span v-if="registrationSuccess" class="text-green-600 text-xs ml-2">(Pre-filled from registration)</span>
                          </label>
                          <input 
                            id="teacher-email"
                            v-model="teacherForm.email" 
                            type="email" 
                            placeholder="teacher@musicschool.edu"
                            required
                            :class="[
                              'w-full px-4 py-3 border-3  bg-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:shadow-md',
                              registrationSuccess ? 'border-green-400 bg-green-50' : 'border-gray-300 focus:border-musical-primary'
                            ]"
                          />
                        </div>
                        
                        <div class="space-y-2">
                          <label for="teacher-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                          <input 
                            id="teacher-password"
                            v-model="teacherForm.password" 
                            type="password" 
                            placeholder="Enter your secure password"
                            required
                            class="w-full px-4 py-3 border-3  bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError" :class="{ 'opacity-50 cursor-not-allowed': hasError }">
                          <BookOpen class="w-4 h-4" />
                          {{ hasError ? 'Fix Errors First' : 'Access Teacher Hub' }}
                        </button>
                      </form>
                      
                      <div class="flex justify-between items-center py-6 border-b-3 border-gray-200">
                        <a href="#" class="text-musical-primary text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:transform hover:-translate-y-0.5">🔄 Reset Password</a>
                        <button 
                          @click="toggleRegisterForm" 
                          class="text-musical-primary text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:transform hover:-translate-y-0.5"
                        >
                          {{ showRegisterForm ? 'Back to Login' : '➕ Join as Teacher' }}
                        </button>
                      </div>
                      
                      <!-- Teacher Registration Form -->
                      <div v-if="showRegisterForm" class="animate-fadeIn mt-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-musical-graphite mb-4">Create Teacher Account</h3>
                        <form @submit.prevent="registerTeacher" class="space-y-4">
                          <div class="space-y-2">
                            <label for="register-display-name" class="block text-sm font-semibold text-musical-graphite">Full Name</label>
                            <input 
                              id="register-display-name"
                              v-model="registerForm.displayName" 
                              type="text" 
                              placeholder="Enter your full name"
                              required
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                            <input 
                              id="register-email"
                              v-model="registerForm.email" 
                              type="email" 
                              placeholder="teacher@musicschool.edu"
                              required
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-school" class="block text-sm font-semibold text-musical-graphite">School/Institution</label>
                            <input 
                              id="register-school"
                              v-model="registerForm.school" 
                              type="text" 
                              placeholder="Music School Name"
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-instrument" class="block text-sm font-semibold text-musical-graphite">Primary Instrument</label>
                            <input 
                              id="register-instrument"
                              v-model="registerForm.instrument" 
                              type="text" 
                              placeholder="e.g., Piano, Guitar, Violin"
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-experience" class="block text-sm font-semibold text-musical-graphite">Teaching Experience</label>
                            <select 
                              id="register-experience"
                              v-model="registerForm.experience" 
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            >
                              <option value="beginner">Beginner (0-2 years)</option>
                              <option value="intermediate">Intermediate (3-5 years)</option>
                              <option value="advanced">Advanced (6-10 years)</option>
                              <option value="expert">Expert (10+ years)</option>
                            </select>
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                            <input 
                              id="register-password"
                              v-model="registerForm.password" 
                              type="password" 
                              placeholder="Create a secure password"
                              required
                              minlength="6"
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="register-confirm-password" class="block text-sm font-semibold text-musical-graphite">Confirm Password</label>
                            <input 
                              id="register-confirm-password"
                              v-model="registerForm.confirmPassword" 
                              type="password" 
                              placeholder="Confirm your password"
                              required
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError" :class="{ 'opacity-50 cursor-not-allowed': hasError }">
                            <GraduationCap class="w-4 h-4" />
                            {{ hasError ? 'Fix Errors First' : 'Create Teacher Account' }}
                          </button>
                          
                          <div class="text-xs text-gray-500 text-center mt-2">
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                          </div>
                        </form>
                      </div>
                      
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center items-start">
              <div class="relative max-w-sm text-center">
                <div class="card-stack relative w-80 h-[28rem]">
                  <!-- Card 1 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 0 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 1 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(0)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/cello.jpg" 
                      alt="Cello player"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Card 2 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 1 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 2 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(1)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/guitar.jpg" 
                      alt="Guitar player"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Card 3 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 2 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 0 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(2)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/sing.jpg" 
                      alt="Singer"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Shuffle indicator -->
                  <div v-if="isTiltShuffling" class="absolute -top-2 -right-2 bg-musical-primary text-white rounded-full p-2 shadow-lg">
                    <div class="w-4 h-4 text-white">🔄</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-musical-cream py-20 border-t-4 border-musical-primary">
      <div class="container">
        <h2 class="text-center text-4xl font-bold text-musical-graphite mb-12">🎼 Let's Make Music Together! </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-musical-coral transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">🎵</div>
            <h3 class="text-2xl font-bold mb-4">Practice Made Fun</h3>
            <p class="opacity-95 leading-relaxed font-medium">Track practice minutes and watch your musical skills grow! Every session brings you closer to your goals.</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-blue-600 bg-musical-primary transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">👩‍🏫</div>
            <h3 class="text-2xl font-bold mb-4">Teacher Magic</h3>
            <p class="opacity-95 leading-relaxed font-medium">Teachers listen, guide, and help you create musical masterpieces! Get personalized feedback on your progress.</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-musical-graphite shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-yellow-600 bg-musical-secondary transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">📈</div>
            <h3 class="text-2xl font-bold mb-4">Watch Yourself Grow</h3>
            <p class="opacity-95 leading-relaxed font-medium">See your musical skills develop day by day with colorful charts and exciting achievements!</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-green-600 bg-musical-success transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">🌟</div>
            <h3 class="text-2xl font-bold mb-4">Sticker Collection</h3>
            <p class="opacity-95 leading-relaxed font-medium">Earn amazing stickers for every milestone - collect them all and show off your progress!</p>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
    

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  Music, Users, GraduationCap, Play, BookOpen, Clock, Mic, Star, Trophy, 
  Headphones, Award, BarChart3 
} from 'lucide-vue-next'
import Footer from './Footer.vue'
import { useAuth } from '../composables/useAuth'
import { useErrorHandler } from '../composables/useErrorHandler'

const emit = defineEmits(['login'])

// Authentication
const { 
  loginTeacherAccount, 
  loginStudentAccount, 
  registerTeacherAccount
} = useAuth()

// Error handling
const { 
  hasError, 
  errorMessage, 
  clearError, 
  handleError,
  executeWithErrorHandling 
} = useErrorHandler()

const activeTab = ref('student')
const showRegisterForm = ref(false)
const registrationSuccess = ref(false)

// Watch for unexpected tab changes
watch(activeTab, (newTab, oldTab) => {
  console.log('activeTab changed from', oldTab, 'to', newTab)
})

const studentForm = ref({
  name: '',
  classCode: ''
})

const teacherForm = ref({
  email: '',
  password: '',
  displayName: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  school: '',
  instrument: '',
  experience: 'beginner'
})

// Shuffling card functionality
const isTiltShuffling = ref(false)
const currentCardIndex = ref(0)
const tiltShuffleInterval = ref(null)

const startTiltShuffle = () => {
  isTiltShuffling.value = true
  tiltShuffleInterval.value = setInterval(() => {
    currentCardIndex.value = (currentCardIndex.value + 1) % 3
  }, 800)
}

const stopTiltShuffle = () => {
  isTiltShuffling.value = false
  if (tiltShuffleInterval.value) {
    clearInterval(tiltShuffleInterval.value)
    tiltShuffleInterval.value = null
  }
}

const switchToStudentTab = () => {
  console.log('switchToStudentTab called, hasError:', hasError.value, 'activeTab:', activeTab.value)
  // Don't switch if already on student tab
  if (activeTab.value === 'student') return
  
  // Don't switch if there are any errors (Firebase, validation, or other)
  if (hasError.value) {
    console.log('Blocking tab switch due to error')
    const error = new Error('Please resolve form errors before switching tabs.')
    error.code = 'tab-switch'
    handleError(error, 'tab-switch')
    return
  }
  
  // Switch to student tab
  console.log('Switching to student tab')
  activeTab.value = 'student'
  // Don't clear errors when switching tabs - let user see them
  registrationSuccess.value = false
}

const switchToTeacherTab = () => {
  console.log('switchToTeacherTab called, hasError:', hasError.value, 'activeTab:', activeTab.value)
  // Don't switch if already on teacher tab
  if (activeTab.value === 'teacher') return
  
  // Don't switch if there are any errors (Firebase, validation, or other)
  if (hasError.value) {
    console.log('Blocking tab switch due to error')
    const error = new Error('Please resolve form errors before switching tabs.')
    error.code = 'tab-switch'
    handleError(error, 'tab-switch')
    return
  }
  
  // Switch to teacher tab
  console.log('Switching to teacher tab')
  activeTab.value = 'teacher'
  // Don't clear errors when switching tabs - let user see them
  registrationSuccess.value = false
}

const toggleRegisterForm = () => {
  // Don't toggle if there are any errors (Firebase, validation, or other)
  if (hasError.value) {
    const error = new Error('Please resolve form errors before switching forms.')
    error.code = 'form-switch'
    handleError(error, 'form-switch')
    return
  }
  
  // Toggle registration form
  showRegisterForm.value = !showRegisterForm.value
  // Don't clear errors when toggling forms - let user see them
  registrationSuccess.value = false
}

const loginStudent = async () => {
  // Check for existing errors first
  if (hasError.value) {
    return
  }
  
  // Validate required fields
  if (!studentForm.value.name?.trim() || !studentForm.value.classCode?.trim()) {
    handleError(new Error('Please fill in all required fields.'), 'form-validation')
    return
  }
  
  const result = await executeWithErrorHandling(
    () => loginStudentAccount(studentForm.value.name.trim(), studentForm.value.classCode.trim()),
    'student-login',
    { autoClearTime: 0 } // Don't auto-clear auth errors
  )
  
  if (result && result.success) {
    emit('login', result.user)
  }
  // Error is already handled by executeWithErrorHandling if result.success is false
}

const loginTeacher = async () => {
  console.log('loginTeacher called, hasError:', hasError.value, 'activeTab:', activeTab.value)
  // Check for existing errors first
  if (hasError.value) {
    console.log('Returning early due to existing error')
    return
  }
  
  // Validate required fields
  if (!teacherForm.value.email?.trim() || !teacherForm.value.password) {
    console.log('Validation error - missing fields')
    handleError(new Error('Please fill in all required fields.'), 'form-validation')
    return
  }
  
  console.log('Calling executeWithErrorHandling for teacher login')
  const result = await executeWithErrorHandling(
    () => loginTeacherAccount(teacherForm.value.email.trim(), teacherForm.value.password),
    'teacher-login',
    { autoClearTime: 0 } // Don't auto-clear auth errors
  )
  
  console.log('Teacher login result:', result)
  if (result && result.success) {
    emit('login', result.user)
  } else {
    console.log('Teacher login failed, error should be displayed')
  }
  // Error is already handled by executeWithErrorHandling if result.success is false
}

const registerTeacher = async () => {
  // Check for existing errors first
  if (hasError.value) {
    return
  }
  
  // Clear any previous errors
  clearError()
  
  // Validation
  const validationErrors = {}
  
  if (!registerForm.value.displayName?.trim()) {
    validationErrors.displayName = 'Please enter your full name'
  }
  
  if (!registerForm.value.email?.trim()) {
    validationErrors.email = 'Please enter your email address'
  }
  
  if (!registerForm.value.password) {
    validationErrors.password = 'Please enter a password'
  } else if (registerForm.value.password.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters long'
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    validationErrors.confirmPassword = 'Passwords do not match'
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (registerForm.value.email && !emailRegex.test(registerForm.value.email)) {
    validationErrors.email = 'Please enter a valid email address'
  }
  
  // If there are validation errors, handle them and return early
  if (Object.keys(validationErrors).length > 0) {
    handleError(new Error('Validation failed'), 'form-validation', { validationErrors })
    return
  }
  
  const teacherData = {
    school: registerForm.value.school?.trim() || '',
    instrument: registerForm.value.instrument?.trim() || '',
    experience: registerForm.value.experience || 'beginner'
  }
  
  const result = await executeWithErrorHandling(
    () => registerTeacherAccount(
      registerForm.value.email.trim(), 
      registerForm.value.password, 
      registerForm.value.displayName.trim(), 
      teacherData
    ),
    'teacher-registration',
    { autoClearTime: 0 } // Don't auto-clear auth errors
  )
  
  if (result && result.success) {
    // Show success message
    registrationSuccess.value = true
    clearError()
    
    // Clear form
    registerForm.value = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      school: '',
      instrument: '',
      experience: 'beginner'
    }
    
    // Hide registration form and show success message briefly
    showRegisterForm.value = false
    
    // Ensure we stay on the teacher tab
    activeTab.value = 'teacher'
    
    // Pre-fill the login form with the registered email
    teacherForm.value.email = result.user.email
    
    // Show login prompt instead of auto-login
    setTimeout(() => {
      registrationSuccess.value = false
      // Don't auto-login - let user login manually
    }, 3000)
  }
  // Error is already handled by executeWithErrorHandling if result.success is false
}

const bringToFront = (index) => {
  currentCardIndex.value = index
}

// Check if we're in demo mode
const isDemoMode = !import.meta.env.PUBLIC_FIREBASE_API_KEY || import.meta.env.PUBLIC_FIREBASE_API_KEY === 'demo-api-key'
</script>