<template>
  <div class="app">
    <Header @logout="handleLogout" />
    <div v-if="!isLoggedIn" class="app-content">
      <HomePage @login="handleLogin" />
    </div>
    <div v-else class="app-content">
      <main class="main-content">
        <StudentDashboard v-if="currentMode === 'student'" :student-name="currentUser.name" />
        <TeacherDashboard v-if="currentMode === 'teacher'" :teacher-email="currentUser.email" />
      </main>
      <Footer @switch-mode="switchMode" @go-home="handleGoHome" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomePage from './HomePage.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import StudentDashboard from './StudentDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'

const isLoggedIn = ref(false)
const currentMode = ref('student')
const currentUser = ref({})

const handleLogin = (loginData) => {
  currentMode.value = loginData.type
  currentUser.value = loginData
  isLoggedIn.value = true
}

const handleLogout = () => {
  isLoggedIn.value = false
  currentMode.value = 'student'
  currentUser.value = {}
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