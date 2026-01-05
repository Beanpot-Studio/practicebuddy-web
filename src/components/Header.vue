<!-- src/components/Header.vue -->
<template>
  <header class="bg-white/40 backdrop-blur-md border-b-4 border-musical-primary/80 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
    <div class="flex justify-between items-center py-4 px-4 md:py-8 md:px-8 max-w-7xl mx-auto">
      <a href="/" class="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity duration-300">
        <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-musical-primary border-2 border-blue-600 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)] flex items-center justify-center">
          <img src="/lyre.png" alt="Lyre logo" class="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">Practice Buddy</h1>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-4">
        <nav class="flex gap-6">
          <a href="/about" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">About</a>
          <a href="/features" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Features</a>
          <a href="/contact" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Contact</a>
          <a href="/pricing" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Pricing</a>
        </nav>

        <!-- Desktop Authenticated UI -->
        <div v-if="isAuthenticated" class="flex items-center gap-3">
          <a href="/" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Dashboard</a>
          
          <button 
            @click="handleLogout" 
            :disabled="localIsLoading" 
            class="btn bg-musical-purple btn-sm text-gray-200 border-yellow-600 hover:text-gray-800 hover:bg-yellow-50 hover:border-yellow-500"
          >
            <LogOut class="w-4 h-4" />
            {{ localIsLoading ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
        
        <!-- Desktop Logged-out UI -->
        <div v-else class="flex items-center gap-3">
          <a href="/" class="btn btn-sm bg-musical-purple text-gray-200 border-yellow-600 hover:text-gray-800 hover:bg-yellow-50 hover:border-yellow-500">Login</a>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        @click="toggleMobileMenu"
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6 text-gray-700" />
        <X v-else class="w-6 h-6 text-gray-700" />
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-black/50 z-[90] md:hidden"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Panel -->
    <Transition name="slide">
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background-color: white; z-index: 9999; overflow-y: auto;"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <span class="text-lg font-bold text-gray-800">Menu</span>
          <button 
            @click="closeMobileMenu"
            class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X class="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav class="p-6 space-y-4 bg-white">
          <a 
            href="/about" 
            class="block text-gray-800 no-underline font-bold text-xl px-4 py-4 rounded-xl bg-gray-50 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200"
            @click="closeMobileMenu"
          >
            About
          </a>
          <a 
            href="/features" 
            class="block text-gray-800 no-underline font-bold text-xl px-4 py-4 rounded-xl bg-gray-50 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200"
            @click="closeMobileMenu"
          >
            Features
          </a>
          <a 
            href="/contact" 
            class="block text-gray-800 no-underline font-bold text-xl px-4 py-4 rounded-xl bg-gray-50 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200"
            @click="closeMobileMenu"
          >
            Contact
          </a>
          <a 
            href="/pricing" 
            class="block text-gray-800 no-underline font-bold text-xl px-4 py-4 rounded-xl bg-gray-50 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200"
            @click="closeMobileMenu"
          >
            Pricing
          </a>
        </nav>

        <div class="border-t border-gray-200 p-4 space-y-3 bg-white">
          <!-- Mobile Authenticated UI -->
          <template v-if="isAuthenticated">
            <a 
              href="/" 
              class="block text-center text-gray-800 no-underline font-semibold text-base px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              @click="closeMobileMenu"
            >
              Dashboard
            </a>
            
            <button 
              @click="handleMobileLogout" 
              :disabled="localIsLoading" 
              class="w-full btn bg-musical-purple text-gray-200 border-yellow-600 hover:text-gray-800 hover:bg-yellow-50 hover:border-yellow-500"
            >
              <LogOut class="w-4 h-4" />
              {{ localIsLoading ? 'Logging out...' : 'Logout' }}
            </button>
          </template>
          
          <!-- Mobile Logged-out UI -->
          <template v-else>
            <a 
              href="/" 
              class="block text-center btn bg-musical-purple text-gray-200 border-yellow-600 hover:text-gray-800 hover:bg-yellow-50 hover:border-yellow-500"
              @click="closeMobileMenu"
            >
              Login
            </a>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { LogOut, Menu, X } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const { logoutUser, isAuthenticated, displayName, userRole } = useAuth()
const localIsLoading = ref(false)
const isMobileMenuOpen = ref(false)

const roleBadgeClass = computed(() => {
  return userRole.value === 'teacher'
    ? 'bg-musical-coral text-white'
    : 'bg-musical-success text-white'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleLogout = async () => {
  if (localIsLoading.value) return
  try {
    localIsLoading.value = true
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Logout timeout')), 10000)
    })
    const result = await Promise.race([logoutUser(), timeoutPromise])
    if (result.success) {
      window.location.href = '/'
    }
  } catch (error) {
    // no-op: errors are handled in composable
  } finally {
    localIsLoading.value = false
  }
}

const handleMobileLogout = async () => {
  closeMobileMenu()
  await handleLogout()
}

// Close menu on escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for menu panel */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
