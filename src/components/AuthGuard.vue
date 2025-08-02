<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gradient-to-r from-musical-primary to-musical-primary/90">
      <div class="text-center">
        <Music class="w-16 h-16 text-white mx-auto mb-4" />
        <p class="text-white text-lg font-semibold">Loading Practice Buddy...</p>
      </div>
    </div>
    
    <!-- Not authenticated -->
    <div v-else-if="!isAuthenticated" class="min-h-screen bg-gradient-to-r from-musical-primary to-musical-primary/90">
      <HomePage @login="handleLogin" />
    </div>
    
    <!-- Authenticated - show protected content -->
    <div v-else>
      <slot :user="currentUser" :userRole="userRole" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Music } from 'lucide-vue-next'
import HomePage from './HomePage.vue'
import { useAuth } from '../composables/useAuth'

const { currentUser, isAuthenticated, isLoading, userRole } = useAuth()

const emit = defineEmits(['login'])

const handleLogin = (userData) => {
  emit('login', userData)
}
</script> 