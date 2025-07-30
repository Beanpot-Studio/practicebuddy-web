<template>
  <div class="text-center mb-10 text-white flex flex-col items-center gap-4">
    <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
      👋
    </div>
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