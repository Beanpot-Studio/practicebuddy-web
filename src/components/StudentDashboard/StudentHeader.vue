<template>
  <div class="text-center mb-10 text-white flex flex-col items-center gap-4">
    <h2 class="text-3xl font-bold text-shadow-lg text-musical-graphite">Hey {{ studentName }}! Ready to make some music?</h2>
    <p class="text-lg opacity-95 font-medium text-musical-graphite">Track your practice time and collect stickers!</p>
  </div>
</template>

<script setup>
defineProps({
  studentName: {
    type: String,
    default: 'Student'
  }
})
</script> 