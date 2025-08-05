<template>
  <footer class="bg-white/95 backdrop-blur-md border-t-4 border-musical-primary mt-auto shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 py-10 pb-5">
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-musical-primary border-2 border-blue-600 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)] flex items-center justify-center">
              <img src="/lyre.png" alt="Lyre logo" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-800">Practice Buddy</h3>
          </div>
          <p class="text-gray-800 text-sm leading-relaxed">Making music practice fun and engaging for everyone!</p>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-musical-primary after:to-purple-400 after:rounded-sm">Quick Links</h4>
          <ul class="space-y-2">
            <li class="text-sm text-gray-800"><a href="#" @click="$emit('switch-mode', 'student')" class="text-gray-800 no-underline transition-colors duration-300 hover:text-blue">Student Dashboard</a></li>
            <li class="text-sm text-gray-800"><a href="#" @click="$emit('switch-mode', 'teacher')" class="text-gray-800 no-underline transition-colors duration-300 hover:text-blue">Teacher Dashboard</a></li>
            <li class="text-sm text-gray-800"><a href="#" @click="$emit('go-home')" class="text-gray-800 no-underline transition-colors duration-300 hover:text-blue">Home</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-musical-primary after:to-purple-400 after:rounded-sm">Features</h4>
          <ul class="space-y-2">
            <li class="text-sm text-gray-800 flex items-center gap-2">
              <Music class="w-4 h-4" />
              Practice Tracking
            </li>
            <li class="text-sm text-gray-800">Class Management</li>
            <li class="text-sm text-gray-800">Assignment System</li>
            <li class="text-sm text-gray-800">Progress Analytics</li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-musical-primary after:to-purple-400 after:rounded-sm">Connect</h4>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 rounded-lg bg-gradient-to-br from-musical-primary to-blue-400 border-2 border-blue-600 flex items-center justify-center text-lg no-underline shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.2)]">
              <Mail class="w-5 h-5 text-white" />
            </a>
            <a href="#" class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-purple-600 flex items-center justify-center text-lg no-underline shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.2)]">
              <Smartphone class="w-5 h-5 text-white" />
            </a>
            <a href="#" class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-lg no-underline shadow-[0_3px_0_rgba(0,0,0,0.2)] transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.2)]">
              <MessageCircle class="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
      
      <div class="border-t-2 border-gray-200 pt-5 text-center">
        <div class="mb-4 flex items-center justify-center gap-4">
          <Music class="w-6 h-6 text-blue animate-bounce" />
          <Music class="w-6 h-6 text-musical-secondary animate-pulse" />
          <Star class="w-6 h-6 text-yellow-500" />
          <Music class="w-6 h-6 text-purple-500" />
        </div>
        <p class="text-gray-800 text-xs">© {{ new Date().getFullYear() }} Practice Buddy. Made with <Heart class="w-3 h-3 text-red-500 inline" /> in Boston by <a href="https://beanpotstudio.com" class="text-blue hover:underline">Beanpot Studio</a> for music lovers everywhere!</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Music, Mail, Smartphone, MessageCircle, Star, Heart } from 'lucide-vue-next'

defineEmits(['switch-mode', 'go-home'])
</script> 