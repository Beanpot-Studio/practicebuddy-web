<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <div class="logo-icon red bounce">🎵</div>
        <h1>Practice Buddy</h1>
      </div>
      <div class="header-actions">
        <nav class="nav">
          <button 
            @click="$emit('switch-mode', 'student')"
            :class="['btn', 'btn-sm', currentMode === 'student' ? 'btn-primary' : 'btn-outline']"
          >
            <Users class="icon" />
            Student
          </button>
          <button 
            @click="$emit('switch-mode', 'teacher')"
            :class="['btn', 'btn-sm', currentMode === 'teacher' ? 'btn-secondary' : 'btn-outline']"
          >
            <GraduationCap class="icon" />
            Teacher
          </button>
        </nav>
        <button @click="$emit('logout')" class="btn btn-warning btn-sm logout-btn">
          <LogOut class="icon" />
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Music, Users, GraduationCap, LogOut } from 'lucide-vue-next'

defineProps({
  currentMode: {
    type: String,
    default: 'student'
  }
})

defineEmits(['switch-mode', 'logout'])
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 4px solid #4FC3F7;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid;
  position: relative;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 4px;
  right: 4px;
  height: 4px;
  border-radius: 2px 2px 0 0;
}

.logo-icon.red {
  background: linear-gradient(145deg, #4FC3F7, #29B6F6);
  border-color: #0288D1;
}

.logo-icon.red::before {
  background: repeating-linear-gradient(90deg, #4FC3F7 0px, #4FC3F7 6px, #29B6F6 6px, #29B6F6 8px);
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav {
  display: flex;
  gap: 12px;
}

.btn-sm {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
}

.btn-outline {
  background: transparent;
  border: 3px solid #e5e7eb;
  color: #6b7280;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
}

.btn-outline:hover {
  border-color: #d1d5db;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
}

.logout-btn {
  color: #2d3436;
  border-color: #FDCB6E;
}

.logout-btn:hover {
  background: #FFF8E8;
  border-color: #E5B55A;
}

.icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .logo h1 {
    font-size: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .nav {
    flex: 1;
    justify-content: center;
  }
}
</style>