<template>
  <header class="bg-white/40 backdrop-blur-md border-b-4 border-musical-primary/80 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
    <div class="flex justify-between items-center py-8 px-8 max-w-7xl mx-auto">
      <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
        <div class="w-10 h-10 rounded-xl bg-musical-primary border-2 border-blue-600 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)] flex items-center justify-center">
          <img src="/lyre.png" alt="Lyre logo" class="w-6 h-6" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Practice Buddy</h1>
      </a>
      <div class="flex items-center gap-4">
        <nav class="flex gap-6">
          <a href="/about" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">About</a>
          <a href="/features" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Features</a>
          <a href="/contact" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Contact</a>
          <a href="/pricing" class="text-gray-800 no-underline font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:text-blue hover:transform hover:-translate-y-0.5">Pricing</a>
        </nav>

        <!-- Authenticated UI -->
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
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const { logoutUser, isAuthenticated, displayName, userRole } = useAuth()
const localIsLoading = ref(false)

const roleBadgeClass = computed(() => {
  return userRole.value === 'teacher'
    ? 'bg-musical-coral text-white'
    : 'bg-musical-success text-white'
})

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
</script>