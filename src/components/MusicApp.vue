<template>
  <div class="app">
    <!-- Pre-launch screen when STATUS=pre-launch -->
    <PreLaunchScreen v-if="isPreLaunch" @exit-pre-launch="testPreLaunch = false" />
    
    <!-- Main app when not in pre-launch mode -->
    <AuthGuard v-else @login="handleLogin">
      <template #default="{ user, userRole }">
        <Header />
        <div class="app-content">
          <main class="main-content">
            <StudentDashboard 
              v-if="userRole === 'student'" 
              :student-name="user?.displayName || user?.name" 
            />
            <TeacherDashboard v-if="userRole === 'teacher'" :teacher-email="user?.email" />
          </main>
          <Footer @switch-mode="switchMode" @go-home="handleGoHome" />
        </div>
      </template>
    </AuthGuard>
    
   
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import StudentDashboard from './StudentDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'
import AuthGuard from './AuthGuard.vue'
import PreLaunchScreen from './PreLaunchScreen.vue'

const currentMode = ref('student')

// For testing: allow toggling pre-launch mode
const testPreLaunch = ref(false)

// Check if we're in pre-launch mode
const isPreLaunch = computed(() => {
  console.log('PUBLIC_STATUS:', import.meta.env.PUBLIC_STATUS)
  return import.meta.env.PUBLIC_STATUS === 'pre-launch' || testPreLaunch.value
})

const handleLogin = (userData) => {
  // The authentication is handled by the useAuth composable
  // This function is called after successful login
  console.log('Login successful:', userData)
  currentMode.value = userData.role
}

const switchMode = (mode) => {
  currentMode.value = mode
}

const handleGoHome = () => {
  // This could be used to navigate back to home or refresh the dashboard
  // For now, we'll just keep the current functionality
}
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.app-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>