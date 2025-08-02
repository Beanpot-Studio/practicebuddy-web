<template>
  <div class="min-h-screen bg-gradient-to-br from-musical-primary via-blue-600 to-purple-700 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute top-20 left-10 text-4xl text-white/10 animate-bounce">
      <Music class="w-12 h-12" />
    </div>
    <div class="absolute bottom-40 left-20 text-5xl text-white/10 animate-bounce" style="animation-delay: 1s;">
      <Music class="w-16 h-16" />
    </div>
    <div class="absolute bottom-20 right-10 text-4xl text-white/10 animate-pulse" style="animation-delay: 2s;">
      <Music class="w-12 h-12" />
    </div>
    <div class="absolute top-1/2 left-1/4 text-3xl text-white/10 animate-bounce" style="animation-delay: 0.5s;">
      <Music class="w-10 h-10" />
    </div>
    <div class="absolute top-1/3 right-1/3 text-4xl text-white/10 animate-pulse" style="animation-delay: 1.5s;">
      <Music class="w-12 h-12" />
    </div>

    <div class="relative z-10 min-h-screen flex items-center justify-center p-6 pb-24">
      <div class="max-w-2xl w-full">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_rgba(0,0,0,0.3),0_15px_30px_rgba(0,0,0,0.2)] border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-500">
            <img src="/lyre.png" alt="Practice Buddy Logo" class="w-12 h-12" />
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Practice Buddy
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-2 font-medium">
            Coming Soon!
          </p>
          <p class="text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
            The revolutionary music practice app that makes learning fun, engaging, and rewarding for students and teachers alike.
          </p>
        </div>

        <!-- Features Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <Music class="w-8 h-8 text-white mb-3" />
            <h3 class="text-xl font-bold text-white mb-2">Smart Practice Tracking</h3>
            <p class="text-white/80 text-sm">Track practice sessions with intelligent insights and progress analytics.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <GraduationCap class="w-8 h-8 text-white mb-3" />
            <h3 class="text-xl font-bold text-white mb-2">Teacher Dashboard</h3>
            <p class="text-white/80 text-sm">Comprehensive tools for teachers to guide and motivate their students.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <Star class="w-8 h-8 text-white mb-3" />
            <h3 class="text-xl font-bold text-white mb-2">Achievement System</h3>
            <p class="text-white/80 text-sm">Earn stickers and rewards for practice milestones and achievements.</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <BarChart3 class="w-8 h-8 text-white mb-3" />
            <h3 class="text-xl font-bold text-white mb-2">Progress Analytics</h3>
            <p class="text-white/80 text-sm">Beautiful charts and insights to track musical growth over time.</p>
          </div>
        </div>

        <!-- Email Collection Form -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-white/30">
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Be the First to Know!</h2>
            <p class="text-gray-600 text-lg">Get early access and exclusive updates when we launch.</p>
          </div>

          <form @submit.prevent="submitEmail" class="space-y-6">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-gray-700">Email Address</label>
              <input 
                id="email"
                v-model="email"
                type="email" 
                placeholder="your.email@example.com"
                required
                class="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-lg focus:shadow-musical-primary/20"
                :class="{ 'border-red-400 bg-red-50': hasError }"
              />
            </div>

            <div class="space-y-2">
              <label for="role" class="block text-sm font-semibold text-gray-700">I am a...</label>
              <select 
                id="role"
                v-model="role"
                class="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-lg focus:shadow-musical-primary/20"
              >
                <option value="student">Music Student</option>
                <option value="teacher">Music Teacher</option>
                <option value="parent">Parent of Music Student</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="instrument" class="block text-sm font-semibold text-gray-700">Primary Instrument (Optional)</label>
              <div class="relative">
                <button 
                  @click="showInstrumentDropdown = !showInstrumentDropdown"
                  type="button"
                  class="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-lg focus:shadow-musical-primary/20 flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="instrument" 
                      :src="`/instruments/${getInstrumentImage(instrument)}`" 
                      :alt="getInstrumentName(instrument)"
                      class="w-6 h-6 object-contain"
                    />
                    <span v-else class="text-gray-500">Select an instrument (optional)</span>
                    <span v-if="instrument" class="text-gray-800">{{ getInstrumentName(instrument) }}</span>
                  </div>
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div 
                  v-if="showInstrumentDropdown"
                  class="absolute z-50 w-full mt-1 bg-white border-3 border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
                >
                  <div 
                    v-for="inst in instruments" 
                    :key="inst.value"
                    @click="selectInstrument(inst.value)"
                    class="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img 
                      :src="`/instruments/${inst.image}`" 
                      :alt="inst.name"
                      class="w-6 h-6 object-contain"
                    />
                    <span class="text-gray-800 text-lg">{{ inst.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mailing List Opt-in -->
            <div class="space-y-2">
              <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <input 
                  id="mailing-list"
                  v-model="mailingListOptIn"
                  type="checkbox"
                  class="mt-1 w-5 h-5 text-musical-primary border-gray-300 rounded focus:ring-musical-primary focus:ring-2"
                />
                <label for="mailing-list" class="text-sm text-gray-700 leading-relaxed">
                  <span class="font-semibold text-blue-800">📧 Join our mailing list</span><br>
                  <span class="text-gray-600">Receive updates about new features, practice tips, and exclusive content. You can unsubscribe at any time.</span>
                </label>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="hasError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="isSubmitted" class="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckCircle class="w-4 h-4" />
              Thanks for signing up! We'll notify you as soon as Practice Buddy launches.
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting || isSubmitted"
              class="w-full py-4 px-8 bg-gradient-to-r from-musical-primary to-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_15px_30px_rgba(0,0,0,0.15)] border-2 border-blue-600 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
              <span v-else-if="isSubmitted" class="flex items-center justify-center gap-2">
                <CheckCircle class="w-5 h-5" />
                Thank You!
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <Music class="w-5 h-5" />
                Get Early Access
              </span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-500 text-sm">
              We respect your privacy. No spam, just updates about Practice Buddy.
            </p>
          </div>
        </div>

      
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 py-4 z-20">
      <div class="container text-center">
        <p class="text-white/80 text-sm mb-2">
          © {{ new Date().getFullYear() }} Practice Buddy. Made with ❤️ by 
          <a href="https://beanpotstudio.com" target="_blank" rel="noopener noreferrer" class="text-white hover:underline font-semibold cursor-pointer transition-colors hover:text-white">Beanpot Studio</a>
        </p>
        <div class="flex justify-center items-center gap-4 text-xs">
          <a href="https://beanpotstudio.com/privacy" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-white transition-colors hover:underline">
            Privacy Policy
          </a>
          <span class="text-white/50">•</span>
          <a href="https://beanpotstudio.com/terms" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-white transition-colors hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
    
   
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { submitPreLaunchSignup, isEmailAlreadySignedUp } from '../lib/preLaunchSignups'
import { instruments, getInstrumentImage, getInstrumentName } from '../lib/instruments'
import { Music, GraduationCap, Star, BarChart3, CheckCircle, Heart } from 'lucide-vue-next'

defineEmits(['exit-pre-launch'])

const email = ref('')
const role = ref('student')
const instrument = ref('')
const mailingListOptIn = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const showInstrumentDropdown = ref(false)

const selectInstrument = (value) => {
  instrument.value = value
  showInstrumentDropdown.value = false
}

const submitEmail = async () => {
  if (!email.value.trim()) {
    hasError.value = true
    errorMessage.value = 'Please enter your email address.'
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    hasError.value = true
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  isSubmitting.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    // Check if email is already signed up
    const alreadySignedUp = await isEmailAlreadySignedUp(email.value.trim())
    if (alreadySignedUp) {
      hasError.value = true
      errorMessage.value = 'This email is already registered for early access!'
      return
    }

    // Submit to Firebase (or localStorage in demo mode)
    const result = await submitPreLaunchSignup({
      email: email.value.trim(),
      role: role.value,
      instrument: instrument.value.trim(),
      mailingListOptIn: mailingListOptIn.value
    })
    
    if (result.success) {
      isSubmitted.value = true
      
      // Reset form
      email.value = ''
      role.value = 'student'
      instrument.value = ''
      mailingListOptIn.value = false
    } else {
      throw new Error(result.message || 'Failed to submit signup')
    }
    
  } catch (error) {
    hasError.value = true
    errorMessage.value = error.message || 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style> 