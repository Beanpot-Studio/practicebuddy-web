<template>
  <div class="min-h-screen bg-musical-primary">
    <div class="py-20">
      <div class="container">
        <div class="flex flex-col gap-20">
          <div class="text-center">
           
            <h1 class="text-5xl font-bold text-musical-graphite mb-3 shadow-sm">Practice Buddy</h1>
            <img src="/lyre.png" alt="lyre logo" class="mx-auto mb-4" />
            <p class="text-xl text-musical-graphite font-medium">Your musical journey starts here!</p>
           
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
            <div class="flex flex-col gap-10">
              
              <div class="max-w-lg mx-auto">
                <div class="card">
                  <div class="flex mb-6 bg-gray-100 rounded-2xl p-1 border-4 border-gray-200 shadow-sm">
                    <button 
                      @click="activeTab = 'student'"
                      :class="[
                        'flex-1 py-4 px-5 border-none bg-transparent rounded-xl font-semibold text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 font-inherit',
                        activeTab === 'student' ? 'bg-gradient-to-br from-musical-primary to-blue-400 text-white shadow-md transform -translate-y-0.5 border-2 border-blue-600' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <Users class="w-4.5 h-4.5" />
                      Young Musicians
                    </button>
                    <button 
                      @click="activeTab = 'teacher'"
                      :class="[
                        'flex-1 py-4 px-5 border-none bg-transparent rounded-xl font-semibold text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 font-inherit',
                        activeTab === 'teacher' ? 'bg-gradient-to-br from-musical-primary to-blue-400 text-white shadow-md transform -translate-y-0.5 border-2 border-blue-600' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <GraduationCap class="w-4.5 h-4.5" />
                      Music Teachers
                    </button>
                  </div>

                  <div class="min-h-[28rem]">
                    <!-- Student Tab -->
                    <div v-if="activeTab === 'student'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-red-500 bg-gradient-to-br from-musical-error to-red-400 relative">
                          <Users class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2">Young Musicians</h2>
                        <p class="text-musical-graphite">Track practice time and collect awesome stickers!</p>
                      </div>
                      
                      <form @submit.prevent="loginStudent" class="space-y-6">
                        <div class="space-y-2">
                          <label for="student-name" class="block text-sm font-semibold text-musical-graphite">🎭 Your Musical Name</label>
                          <input 
                            id="student-name"
                            v-model="studentForm.name" 
                            type="text" 
                            placeholder="Enter your awesome name"
                            required
                            class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <div class="space-y-2">
                          <label for="student-code" class="block text-sm font-semibold text-musical-graphite">🔑 Secret Class Code</label>
                          <input 
                            id="student-code"
                            v-model="studentForm.classCode" 
                            type="text" 
                            placeholder="Ask your teacher for the magic code"
                            required
                            class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-full">
                          <Play class="w-4 h-4" />
                          Start Your Musical Journey!
                        </button>
                      </form>
                      
                   
                    </div>

                    <!-- Teacher Tab -->
                    <div v-if="activeTab === 'teacher'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-blue-500 bg-gradient-to-br from-musical-primary to-blue-400 relative">
                          <GraduationCap class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2">Music Teachers</h2>
                        <p class="text-musical-graphite">Guide your students and celebrate their musical journey!</p>
                      </div>
                      
                      <form @submit.prevent="loginTeacher" class="space-y-6">
                        <div class="space-y-2">
                          <label for="teacher-email" class="block text-sm font-semibold text-musical-graphite">📧 Teacher Email</label>
                          <input 
                            id="teacher-email"
                            v-model="teacherForm.email" 
                            type="email" 
                            placeholder="teacher@musicschool.edu"
                            required
                            class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <div class="space-y-2">
                          <label for="teacher-password" class="block text-sm font-semibold text-musical-graphite">🔐 Password</label>
                          <input 
                            id="teacher-password"
                            v-model="teacherForm.password" 
                            type="password" 
                            placeholder="Enter your secure password"
                            required
                            class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                          />
                        </div>
                        
                        <button type="submit" class="btn btn-secondary btn-full">
                          <BookOpen class="w-4 h-4" />
                          Access Teacher Hub
                        </button>
                      </form>
                      
                      <div class="flex justify-between items-center py-6 border-b-3 border-gray-200">
                        <a href="#" class="text-musical-primary text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:transform hover:-translate-y-0.5">🔄 Reset Password</a>
                        <a href="#" class="text-musical-primary text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:transform hover:-translate-y-0.5">➕ Join as Teacher</a>
                      </div>
                      
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center items-center">
              <div class="relative max-w-sm">
                <img 
                  src="/cello-girl-tune.jpg" 
                  alt="Young musician playing cello"
                  class="w-full h-auto rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_20px_0_rgba(0,0,0,0.2),0_30px_50px_rgba(0,0,0,0.4)]"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white py-20 border-t-4 border-musical-primary">
      <div class="container">
        <h2 class="text-center text-4xl font-bold text-musical-graphite mb-12">🎼 Build Your Musical Community</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-gradient-to-br from-musical-error to-red-400 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">🎵</div>
            <h3 class="text-2xl font-bold mb-4">Practice Made Fun</h3>
            <p class="opacity-95 leading-relaxed font-medium">Track practice minutes and watch your musical skills grow! Every session brings you closer to your goals.</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-blue-600 bg-gradient-to-br from-musical-primary to-blue-400 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">👩‍🏫</div>
            <h3 class="text-2xl font-bold mb-4">Teacher Magic</h3>
            <p class="opacity-95 leading-relaxed font-medium">Teachers listen, guide, and help you create musical masterpieces! Get personalized feedback on your progress.</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-musical-graphite shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-yellow-600 bg-gradient-to-br from-musical-secondary to-yellow-400 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">📈</div>
            <h3 class="text-2xl font-bold mb-4">Watch Yourself Grow</h3>
            <p class="opacity-95 leading-relaxed font-medium">See your musical skills develop day by day with colorful charts and exciting achievements!</p>
          </div>
          
          <div class="p-8 rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-green-600 bg-gradient-to-br from-musical-success to-green-400 transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-5xl mb-5">🌟</div>
            <h3 class="text-2xl font-bold mb-4">Sticker Collection</h3>
            <p class="opacity-95 leading-relaxed font-medium">Earn amazing stickers for every milestone - collect them all and show off your progress!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Music, Users, GraduationCap, Play, BookOpen, Clock, Mic, Star, Trophy, 
  Headphones, Award, BarChart3 
} from 'lucide-vue-next'

const emit = defineEmits(['login'])

const activeTab = ref('student')

const studentForm = ref({
  name: '',
  classCode: ''
})

const teacherForm = ref({
  email: '',
  password: ''
})

const loginStudent = () => {
  if (studentForm.value.name && studentForm.value.classCode) {
    emit('login', {
      type: 'student',
      name: studentForm.value.name,
      classCode: studentForm.value.classCode
    })
  }
}

const loginTeacher = () => {
  if (teacherForm.value.email && teacherForm.value.password) {
    emit('login', {
      type: 'teacher',
      email: teacherForm.value.email
    })
  }
}
</script>