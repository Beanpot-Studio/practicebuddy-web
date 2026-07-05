<template>
  <div class="min-h-screen bg-musical-primary relative overflow-hidden">
    <div class="py-10 md:py-20 relative z-10">
      <div class="container max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mb-4 md:mb-5">
          <img src="/lyre.png" alt="Practice Buddy Lyre Logo" class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-musical-graphite text-center lg:text-left">Welcome to Practice Buddy</h1>
        </div>
        <p class="text-base md:text-xl text-musical-graphite font-medium mb-6 md:mb-10 text-center lg:text-left">Your musical journey starts here!</p>
        <div class="flex flex-col gap-10 md:gap-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-15 items-start">
            <div class="flex flex-col gap-6 md:gap-10 order-1 lg:order-none">
              <div class="w-full max-w-2xl mx-auto lg:mx-0">
                <div class="card" :class="[
                  'transition-all duration-300',
                  activeTab === 'student' ? 'border-4 border-green-500' : 'border-4 border-musical-coral'
                ]">
                  <div class="flex mb-6 bg-gray-100 rounded-2xl p-1 border-4 border-gray-200 shadow-sm">
                    <button 
                      data-testid="student-tab"
                      @click="switchToStudentTab"
                      :class="[
                        'flex-1 py-3 px-3 sm:py-4 sm:px-5 border-none rounded-xl font-semibold text-xs sm:text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-inherit',
                        activeTab === 'student' ? 'bg-musical-success text-white shadow-md transform -translate-y-0.5 border-2 border-green-600' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <Users class="hidden sm:block w-4.5 h-4.5" />
                      <span class="hidden sm:inline">Music </span>Students
                    </button>
                    <button 
                      data-testid="teacher-tab"
                      @click="switchToTeacherTab"
                      :class="[
                        'flex-1 py-3 px-3 sm:py-4 sm:px-5 border-none rounded-xl font-semibold text-xs sm:text-sm text-gray-500 cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-inherit',
                        activeTab === 'teacher' ? 'bg-musical-coral text-white shadow-md transform -translate-y-0.5' : 'hover:bg-white/80 hover:text-gray-700'
                      ]"
                    >
                      <GraduationCap class="hidden sm:block w-4.5 h-4.5" />
                      <span class="hidden sm:inline">Music </span>Teachers
                    </button>
                  </div>

                  <div class="min-h-[28rem] w-full">

                    
                    <!-- Error Message -->
                    <div v-if="hasError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {{ errorMessage }}
                    </div>
                    
                    <!-- Success Message -->
                    <div v-if="registrationSuccess" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle class="w-4 h-4" />
                      Account created successfully! You can now login with your email and password.
                    </div>
                    
                    <!-- Password Reset Success Message -->
                    <div v-if="passwordResetSuccess" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle class="w-4 h-4" />
                      Password reset email sent! Please check your inbox and follow the link to reset your password.
                    </div>
                    
                    <!-- Student Tab -->
                    <div v-if="activeTab === 'student'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-green-500 bg-musical-success relative">
                          <Users class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2"> Students</h2>
                        <p class="text-musical-graphite">Track practice time and collect rewards!</p>
                      </div>
                      
                      <!-- Student Login/Create Account Toggle -->
                      <div class="flex justify-center mb-6">
                        <div class="bg-gray-100 rounded-xl p-1 flex">
                          <button 
                            @click="toggleStudentMode" 
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                              !showStudentCreateAccount ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
                            ]"
                          >
                            <Lock class="w-4 h-4" />
                            Login
                          </button>
                          <button 
                            @click="toggleStudentMode" 
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                              showStudentCreateAccount ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
                            ]"
                          >
                            <Plus class="w-4 h-4" />
                            Create Account
                          </button>
                        </div>
                      </div>
                      
                      <!-- Student Login Form -->
                      <div v-if="!showStudentCreateAccount">
                        <form @submit.prevent="loginStudent" class="space-y-6">
                          <div class="space-y-2">
                            <label for="student-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                            <input 
                              id="student-email"
                              v-model="studentForm.email" 
                              type="email" 
                              placeholder="your.email@example.com"
                              required
                              class="w-full px-4 py-3 border-3 bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="student-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                            <input 
                              id="student-password"
                              v-model="studentForm.password" 
                              type="password" 
                              placeholder="Enter your password"
                              required
                              class="w-full px-4 py-3 border-3 bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="student-class-code" class="block text-sm font-semibold text-musical-graphite">Class Code (Optional)</label>
                            <input 
                              id="student-class-code"
                              v-model="studentForm.classCode" 
                              type="text" 
                              placeholder="Enter class code if joining a class (optional)"
                              class="w-full px-4 py-3 border-3 bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isStudentLoginLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isStudentLoginLoading }">
                            <Play v-if="!isStudentLoginLoading" class="w-4 h-4" />
                            <div v-if="isStudentLoginLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {{ hasError ? 'Fix Errors First' : isStudentLoginLoading ? 'Signing In...' : 'Make Some Music!' }}
                          </button>

                          <div class="relative my-4 text-center">
                            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                              <div class="w-full border-t border-gray-300"></div>
                            </div>
                            <div class="relative flex justify-center">
                              <span class="bg-white px-3 text-sm text-gray-500">or</span>
                            </div>
                          </div>

                          <button type="button" @click="loginStudentWithGoogle" class="btn btn-secondary btn-full bg-white text-musical-graphite border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
                            <img alt="Google" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" />
                            Continue with Google
                          </button>
                        </form>
                        
                        <div class="flex justify-center items-center py-6">
                          <button 
                            @click="toggleStudentResetPasswordForm" 
                            class="text-blue text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-primary-50 hover:transform hover:-translate-y-0.5 flex items-center gap-2"
                          >
                            <RefreshCw v-if="!showStudentResetPasswordForm" class="w-4 h-4" />
                            {{ showStudentResetPasswordForm ? 'Back to Login' : 'Reset Password' }}
                          </button>
                        </div>
                      </div>
                      
                      <!-- Student Registration Form -->
                      <div v-if="showStudentCreateAccount" class="animate-fadeIn">
                        <div class="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 w-full">
                          <h3 class="text-xl font-bold text-musical-graphite mb-4">Create Student Account</h3>
                          <p class="text-gray-600 mb-6">Join Practice Buddy and start tracking your musical progress!</p>
                          <form @submit.prevent="registerStudent" class="space-y-4">
                            <div class="space-y-2">
                              <label for="student-register-name" class="block text-sm font-semibold text-musical-graphite">Your Name</label>
                              <input 
                                id="student-register-name"
                                v-model="studentRegisterForm.displayName" 
                                type="text" 
                                placeholder="Enter your full name"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="student-register-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                              <input 
                                id="student-register-email"
                                v-model="studentRegisterForm.email" 
                                type="email" 
                                placeholder="your.email@example.com"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="student-register-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                              <input 
                                id="student-register-password"
                                v-model="studentRegisterForm.password" 
                                type="password" 
                                placeholder="Create a password (min 6 characters)"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="student-register-confirm-password" class="block text-sm font-semibold text-musical-graphite">Confirm Password</label>
                              <input 
                                id="student-register-confirm-password"
                                v-model="studentRegisterForm.confirmPassword" 
                                type="password" 
                                placeholder="Confirm your password"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="student-register-instrument" class="block text-sm font-semibold text-musical-graphite">Primary Instrument (Optional)</label>
                              <div class="relative">
                                <button 
                                  @click="showStudentInstrumentDropdown = !showStudentInstrumentDropdown"
                                  type="button"
                                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md flex items-center justify-between"
                                >
                                  <div class="flex items-center gap-3">
                                    <img 
                                      v-if="studentRegisterForm.instrument" 
                                      :src="`/instruments/${getStudentInstrumentImage()}`" 
                                      :alt="getStudentInstrumentName()"
                                      class="w-5 h-5 object-contain"
                                    />
                                    <span v-else class="text-gray-500">Select an instrument (optional)</span>
                                    <span v-if="studentRegisterForm.instrument" class="text-gray-800">{{ getStudentInstrumentName() }}</span>
                                  </div>
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                </button>
                                
                                <div 
                                  v-if="showStudentInstrumentDropdown"
                                  class="absolute z-50 w-full mt-1 bg-white border-3 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                >
                                  <div 
                                    v-for="instrument in instruments" 
                                    :key="instrument.value"
                                    @click="selectStudentInstrument(instrument.value)"
                                    class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <img 
                                      :src="`/instruments/${instrument.image}`" 
                                      :alt="instrument.name"
                                      class="w-5 h-5 object-contain"
                                    />
                                    <span class="text-gray-800">{{ instrument.name }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="space-y-2">
                              <label for="student-register-class-code" class="block text-sm font-semibold text-musical-graphite">Class Code (Optional)</label>
                              <input 
                                id="student-register-class-code"
                                v-model="studentRegisterForm.classCode" 
                                type="text" 
                                placeholder="Enter class code if joining a class (optional)"
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isStudentRegistrationLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isStudentRegistrationLoading }">
                              <Play v-if="!isStudentRegistrationLoading" class="w-4 h-4" />
                              <div v-if="isStudentRegistrationLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {{ hasError ? 'Fix Errors First' : isStudentRegistrationLoading ? 'Creating Account...' : 'Create Account!' }}
                            </button>
                          </form>
                        </div>
                      </div>
                      

                    </div>

                    <!-- Teacher Tab -->
                    <div v-if="activeTab === 'teacher'" class="animate-fadeIn">
                      <div class="text-center mb-8">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] border-4 border-red-500 bg-musical-coral relative">
                          <GraduationCap class="w-10 h-10 text-white" />
                        </div>
                        <h2 class="text-3xl font-bold text-musical-graphite mb-2">Teachers</h2>
                        <p class="text-musical-graphite">Guide your students and celebrate their musical journey!</p>
                      </div>
                      
                      <!-- Teacher Login/Create Account Toggle -->
                      <div class="flex justify-center mb-6">
                        <div class="bg-gray-100 rounded-xl p-1 flex">
                          <button 
                            @click="toggleTeacherMode" 
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                              !showTeacherCreateAccount ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
                            ]"
                          >
                            <Lock class="w-4 h-4" />
                            Login
                          </button>
                          <button 
                            @click="toggleTeacherMode" 
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                              showTeacherCreateAccount ? 'bg-white text-blue shadow-sm' : 'text-gray-600 hover:text-blue'
                            ]"
                          >
                            <Plus class="w-4 h-4" />
                            Create Account
                          </button>
                        </div>
                      </div>
                      
                      <!-- Teacher Login Form -->
                      <div v-if="!showTeacherCreateAccount">
                        <form @submit.prevent="loginTeacher" class="space-y-6">
                          <div class="space-y-2">
                            <label for="teacher-email" class="block text-sm font-semibold text-musical-graphite">
                              Teacher Email
                              <span v-if="registrationSuccess" class="text-green-600 text-xs ml-2">(Pre-filled from registration)</span>
                            </label>
                            <input 
                              id="teacher-email"
                              v-model="teacherForm.email" 
                              type="email" 
                              placeholder="teacher@musicschool.edu"
                              required
                              :class="[
                                'w-full px-4 py-3 border-3  bg-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:shadow-md',
                                registrationSuccess ? 'border-green-400 bg-green-50' : 'border-gray-300 focus:border-musical-primary'
                              ]"
                            />
                          </div>
                          
                          <div class="space-y-2">
                            <label for="teacher-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                            <input 
                              id="teacher-password"
                              v-model="teacherForm.password" 
                              type="password" 
                              placeholder="Enter your secure password"
                              required
                              class="w-full px-4 py-3 border-3  bg-gray-200 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isTeacherLoginLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isTeacherLoginLoading }">
                            <BookOpen v-if="!isTeacherLoginLoading" class="w-4 h-4" />
                            <div v-if="isTeacherLoginLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {{ hasError ? 'Fix Errors First' : isTeacherLoginLoading ? 'Validating...' : 'Access Teacher Hub' }}
                          </button>

                          <div class="relative my-4 text-center">
                            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                              <div class="w-full border-t border-gray-300"></div>
                            </div>
                            <div class="relative flex justify-center">
                              <span class="bg-white px-3 text-sm text-gray-500">or</span>
                            </div>
                          </div>

                          <button type="button" @click="loginTeacherWithGoogle" class="btn btn-secondary btn-full bg-white text-musical-graphite border-2 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
                            <img alt="Google" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" />
                            Continue with Google
                          </button>
                        </form>
                        
                        <div class="flex justify-center items-center py-6">
                          <button 
                            @click="toggleResetPasswordForm" 
                            class="text-blue text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-primary-50 hover:transform hover:-translate-y-0.5 flex items-center gap-2"
                          >
                            <RefreshCw v-if="!showResetPasswordForm" class="w-4 h-4" />
                            {{ showResetPasswordForm ? 'Back to Login' : 'Reset Password' }}
                          </button>
                        </div>
                      </div>
                      
                      <!-- Teacher Registration Form -->
                      <div v-if="showTeacherCreateAccount" class="animate-fadeIn">
                        <div class="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 w-full">
                          <h3 class="text-xl font-bold text-musical-graphite mb-4">Create Teacher Account</h3>
                          <p class="text-gray-600 mb-6">Join Practice Buddy and start guiding your students' musical journey!</p>
                          <form @submit.prevent="registerTeacher" class="space-y-4">
                            <div class="space-y-2">
                              <label for="register-display-name" class="block text-sm font-semibold text-musical-graphite">Full Name</label>
                              <input 
                                id="register-display-name"
                                v-model="registerForm.displayName" 
                                type="text" 
                                placeholder="Enter your full name"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                              <input 
                                id="register-email"
                                v-model="registerForm.email" 
                                type="email" 
                                placeholder="teacher@musicschool.edu"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-school" class="block text-sm font-semibold text-musical-graphite">School/Institution</label>
                              <input 
                                id="register-school"
                                v-model="registerForm.school" 
                                type="text" 
                                placeholder="Music School Name"
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-instrument" class="block text-sm font-semibold text-musical-graphite">Primary Instrument</label>
                              <div class="relative">
                                <button 
                                  @click="showTeacherInstrumentDropdown = !showTeacherInstrumentDropdown"
                                  type="button"
                                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md flex items-center justify-between"
                                >
                                  <div class="flex items-center gap-3">
                                    <img 
                                      v-if="registerForm.instrument" 
                                      :src="`/instruments/${getTeacherInstrumentImage()}`" 
                                      :alt="getTeacherInstrumentName()"
                                      class="w-5 h-5 object-contain"
                                    />
                                    <span v-else class="text-gray-500">Select an instrument</span>
                                    <span v-if="registerForm.instrument" class="text-gray-800">{{ getTeacherInstrumentName() }}</span>
                                  </div>
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                </button>
                                
                                <div 
                                  v-if="showTeacherInstrumentDropdown"
                                  class="absolute z-50 w-full mt-1 bg-white border-3 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                >
                                  <div 
                                    v-for="instrument in instruments" 
                                    :key="instrument.value"
                                    @click="selectTeacherInstrument(instrument.value)"
                                    class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <img 
                                      :src="`/instruments/${instrument.image}`" 
                                      :alt="instrument.name"
                                      class="w-5 h-5 object-contain"
                                    />
                                    <span class="text-gray-800">{{ instrument.name }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-experience" class="block text-sm font-semibold text-musical-graphite">Teaching Experience</label>
                              <select 
                                id="register-experience"
                                v-model="registerForm.experience" 
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              >
                                <option value="beginner">Beginner (0-2 years)</option>
                                <option value="intermediate">Intermediate (3-5 years)</option>
                                <option value="advanced">Advanced (6-10 years)</option>
                                <option value="expert">Expert (10+ years)</option>
                              </select>
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-password" class="block text-sm font-semibold text-musical-graphite">Password</label>
                              <input 
                                id="register-password"
                                v-model="registerForm.password" 
                                type="password" 
                                placeholder="Create a secure password"
                                required
                                minlength="6"
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <div class="space-y-2">
                              <label for="register-confirm-password" class="block text-sm font-semibold text-musical-graphite">Confirm Password</label>
                              <input 
                                id="register-confirm-password"
                                v-model="registerForm.confirmPassword" 
                                type="password" 
                                placeholder="Confirm your password"
                                required
                                class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                              />
                            </div>
                            
                            <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isTeacherRegistrationLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isTeacherRegistrationLoading }">
                              <GraduationCap v-if="!isTeacherRegistrationLoading" class="w-4 h-4" />
                              <div v-if="isTeacherRegistrationLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {{ hasError ? 'Fix Errors First' : isTeacherRegistrationLoading ? 'Creating Account...' : 'Create Teacher Account' }}
                            </button>
                            
                            <div class="text-xs text-gray-500 text-center mt-2">
                              By creating an account, you agree to our Terms of Service and Privacy Policy.
                            </div>
                          </form>
                        </div>
                      </div>
                      

                      
                      <!-- Password Reset Form -->
                      <div v-if="showResetPasswordForm" class="animate-fadeIn mt-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-musical-graphite mb-4">Reset Your Password</h3>
                        <p class="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                        <form @submit.prevent="resetPassword" class="space-y-4">
                          <div class="space-y-2">
                            <label for="reset-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                            <input 
                              id="reset-email"
                              v-model="resetPasswordForm.email" 
                              type="email" 
                              placeholder="teacher@musicschool.edu"
                              required
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isPasswordResetLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isPasswordResetLoading }">
                            <Mail v-if="!isPasswordResetLoading" class="w-4 h-4" />
                            <div v-if="isPasswordResetLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {{ hasError ? 'Fix Errors First' : isPasswordResetLoading ? 'Sending...' : 'Send Reset Link' }}
                          </button>
                          
                          <div class="text-xs text-gray-500 text-center mt-2">
                            Check your email for a password reset link. The link will expire in 1 hour.
                          </div>
                        </form>
                      </div>
                      
                      <!-- Student Password Reset Form -->
                      <div v-if="showStudentResetPasswordForm" class="animate-fadeIn mt-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                        <h3 class="text-xl font-bold text-musical-graphite mb-4">Reset Your Password</h3>
                        <p class="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                        <form @submit.prevent="resetStudentPassword" class="space-y-4">
                          <div class="space-y-2">
                            <label for="student-reset-email" class="block text-sm font-semibold text-musical-graphite">Email Address</label>
                            <input 
                              id="student-reset-email"
                              v-model="studentResetPasswordForm.email" 
                              type="email" 
                              placeholder="your.email@example.com"
                              required
                              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-musical-primary focus:shadow-md"
                            />
                          </div>
                          
                          <button type="submit" class="btn btn-secondary btn-full" :disabled="hasError || isStudentPasswordResetLoading" :class="{ 'opacity-50 cursor-not-allowed': hasError || isStudentPasswordResetLoading }">
                            <Mail v-if="!isStudentPasswordResetLoading" class="w-4 h-4" />
                            <div v-if="isStudentPasswordResetLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {{ hasError ? 'Fix Errors First' : isStudentPasswordResetLoading ? 'Sending...' : 'Send Reset Link' }}
                          </button>
                          
                          <div class="text-xs text-gray-500 text-center mt-2">
                            Check your email for a password reset link. The link will expire in 1 hour.
                          </div>
                        </form>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hidden lg:flex justify-center items-start order-2 lg:order-none">
              <div class="relative max-w-sm text-center">
                <div class="card-stack relative w-80 xl:w-96 h-[30rem] xl:h-[35rem]">
                  <!-- Card 1 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 0 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 1 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(0)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/cello.jpg" 
                      alt="Cello player"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Card 2 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 1 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 2 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(1)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/guitar.jpg" 
                      alt="Guitar player"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Card 3 -->
                  <div 
                    class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden cursor-pointer transition-all duration-500"
                    :class="[
                      'transform',
                      currentCardIndex === 2 ? 'z-30 scale-100 rotate-0 translate-y-0' : 
                      currentCardIndex === 0 ? 'z-20 scale-95 -rotate-6 translate-y-2' : 
                      'z-10 scale-90 -rotate-12 translate-y-4'
                    ]"
                    @click="bringToFront(2)"
                    @mouseenter="startTiltShuffle"
                    @mouseleave="stopTiltShuffle"
                  >
                    <img 
                      src="/sing.jpg" 
                      alt="Singer"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  </div>

                  <!-- Shuffle indicator -->
                  <div v-if="isTiltShuffling" class="absolute -top-2 -right-2 bg-musical-primary text-white rounded-full p-2 shadow-lg">
                    <RefreshCw class="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-musical-cream py-12 md:py-20 border-t-4 border-musical-primary">
      <div class="container max-w-7xl mx-auto px-4">
        <h2 class="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-musical-graphite mb-8 md:mb-12">Let's Make Music Together! </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <div class="p-5 md:p-8 rounded-2xl md:rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-red-600 bg-musical-coral transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-4xl md:text-5xl mb-4 md:mb-5 flex justify-center"><Music class="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Practice Made Fun</h3>
            <p class="opacity-95 leading-relaxed font-medium text-sm md:text-base">Track practice minutes and watch your musical skills grow! Every session brings you closer to your goals.</p>
          </div>
          
          <div class="p-5 md:p-8 rounded-2xl md:rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-blue-600 bg-musical-primary transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-4xl md:text-5xl mb-4 md:mb-5 flex justify-center"><Wand class="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
            
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Teacher Magic</h3>
            <p class="opacity-95 leading-relaxed font-medium text-sm md:text-base">Teachers listen, guide, and help you create musical masterpieces! Get personalized feedback on your progress.</p>
          </div>
          
          <div class="p-5 md:p-8 rounded-2xl md:rounded-3xl text-center text-musical-graphite shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-yellow-600 bg-musical-secondary transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-4xl md:text-5xl mb-4 md:mb-5 flex justify-center"><BarChart class="w-8 h-8 md:w-10 md:h-10 text-black" /></div>
            
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Watch Yourself Grow</h3>
            <p class="opacity-95 leading-relaxed font-medium text-sm md:text-base">See your musical skills develop day by day with colorful charts and exciting achievements!</p>
          </div>
          
          <div class="p-5 md:p-8 rounded-2xl md:rounded-3xl text-center text-white shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-green-600 bg-musical-success transition-all duration-300 relative hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_40px_rgba(0,0,0,0.2)]">
            <div class="text-4xl md:text-5xl mb-4 md:mb-5 flex justify-center"><Star class="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
            
            <h3 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Sticker Collection</h3>
            <p class="opacity-95 leading-relaxed font-medium text-sm md:text-base">Earn amazing stickers for every milestone - collect them all and show off your progress!</p>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
    

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Play, Music, Users, BookOpen, GraduationCap, BarChart, Star, Wand, AudioLines, Plus, RefreshCw, Mail, CheckCircle, Lock } from 'lucide-vue-next'
import Footer from './Footer.vue'
import { useAuth } from '../composables/useAuth'
import { useErrorHandler } from '../composables/useErrorHandler'
import { instruments, getInstrumentImage, getInstrumentName } from '../lib/instruments'

const emit = defineEmits(['login'])

// Authentication
const { 
  loginTeacherAccount, 
  loginStudentAccount, 
  registerTeacherAccount,
  registerStudentAccount,
  resetUserPassword,
  loginTeacherWithGoogleAccount,
  loginStudentWithGoogleAccount
} = useAuth()

const { 
  hasError, 
  errorMessage, 
  clearError, 
  handleError,
  executeWithErrorHandling 
} = useErrorHandler()

const activeTab = ref('student')
const showRegisterForm = ref(false)
const showResetPasswordForm = ref(false)
const showStudentCreateAccount = ref(false)
const showTeacherCreateAccount = ref(false)
const showStudentResetPasswordForm = ref(false)
const registrationSuccess = ref(false)
const passwordResetSuccess = ref(false)

// Individual loading states for each form
const isStudentLoginLoading = ref(false)
const isStudentRegistrationLoading = ref(false)
const isStudentPasswordResetLoading = ref(false)
const isTeacherLoginLoading = ref(false)
const isTeacherRegistrationLoading = ref(false)
const isPasswordResetLoading = ref(false)



const studentForm = ref({
  email: '',
  password: '',
  classCode: ''
})

const studentRegisterForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  instrument: '',
  classCode: ''
})

const teacherForm = ref({
  email: '',
  password: '',
  displayName: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  school: '',
  instrument: '',
  experience: 'beginner'
})

const resetPasswordForm = ref({
  email: ''
})

const studentResetPasswordForm = ref({
  email: ''
})

// Shuffling card functionality
const isTiltShuffling = ref(false)
const currentCardIndex = ref(0)
const tiltShuffleInterval = ref(null)

const startTiltShuffle = () => {
  isTiltShuffling.value = true
  tiltShuffleInterval.value = setInterval(() => {
    currentCardIndex.value = (currentCardIndex.value + 1) % 3
  }, 800)
}

const stopTiltShuffle = () => {
  isTiltShuffling.value = false
  if (tiltShuffleInterval.value) {
    clearInterval(tiltShuffleInterval.value)
    tiltShuffleInterval.value = null
  }
}

const switchToStudentTab = () => {
  if (hasError.value) {
    clearError()
  }
  activeTab.value = 'student'
  // Reset all form states when switching tabs
  showRegisterForm.value = false
  showResetPasswordForm.value = false
  showStudentCreateAccount.value = false
  showTeacherCreateAccount.value = false
  showStudentResetPasswordForm.value = false
}

const switchToTeacherTab = () => {
  if (hasError.value) {
    clearError()
  }
  activeTab.value = 'teacher'
  // Reset all form states when switching tabs
  showRegisterForm.value = false
  showResetPasswordForm.value = false
  showStudentCreateAccount.value = false
  showTeacherCreateAccount.value = false
  showStudentResetPasswordForm.value = false
}

const toggleRegisterForm = () => {
  showRegisterForm.value = !showRegisterForm.value
  showResetPasswordForm.value = false
  showStudentCreateAccount.value = false
  showTeacherCreateAccount.value = false
  showStudentResetPasswordForm.value = false
  clearError()
}

const toggleResetPasswordForm = () => {
  showResetPasswordForm.value = !showResetPasswordForm.value
  showRegisterForm.value = false
  showStudentCreateAccount.value = false
  showTeacherCreateAccount.value = false
  showStudentResetPasswordForm.value = false
  clearError()
}

const toggleStudentMode = () => {
  showStudentCreateAccount.value = !showStudentCreateAccount.value
  showRegisterForm.value = false
  showResetPasswordForm.value = false
  showTeacherCreateAccount.value = false
  showStudentResetPasswordForm.value = false
  clearError()
}

const toggleTeacherMode = () => {
  showTeacherCreateAccount.value = !showTeacherCreateAccount.value
  showRegisterForm.value = false
  showResetPasswordForm.value = false
  showStudentCreateAccount.value = false
  clearError()
}

const toggleStudentResetPasswordForm = () => {
  showStudentResetPasswordForm.value = !showStudentResetPasswordForm.value
  showRegisterForm.value = false
  showResetPasswordForm.value = false
  showStudentCreateAccount.value = false
  showTeacherCreateAccount.value = false
  clearError()
}

const loginStudent = async () => {
  await executeWithErrorHandling(async () => {
    isStudentLoginLoading.value = true
    clearError()
    
    const result = await loginStudentAccount(
      studentForm.value.email,
      studentForm.value.password,
      studentForm.value.classCode
    )
    
    if (result.success) {
      // Check if there was a class enrollment issue
      if (result.classEnrollmentError) {
        // Show success message for login but warn about class enrollment
        handleError(`Login successful! However, ${result.classEnrollmentError}`)
        return
      }
      
      // Emit login event to parent component
      emit('login', { 
        user: result.user, 
        userData: result.userData,
        role: 'student'
      })
    } else {
      handleError(result.error || 'Login failed')
    }
  }).finally(() => {
    isStudentLoginLoading.value = false
  })
}

const loginStudentWithGoogle = async () => {
  await executeWithErrorHandling(async () => {
    isStudentLoginLoading.value = true
    clearError()
    
    const result = await loginStudentWithGoogleAccount(studentForm.value.classCode)
    
    if (result.success) {
      // Check if there was a class enrollment issue
      if (result.classEnrollmentError) {
        // Show success message for login but warn about class enrollment
        handleError(`Login successful! However, ${result.classEnrollmentError}`)
        return
      }
      
      // Emit login event to parent component
      emit('login', { 
        user: result.user, 
        userData: result.userData,
        role: 'student'
      })
    } else {
      handleError(result.error || 'Google login failed')
    }
  }).finally(() => {
    isStudentLoginLoading.value = false
  })
}

const registerStudent = async () => {
  await executeWithErrorHandling(async () => {
    isStudentRegistrationLoading.value = true
    clearError()
    
    if (studentRegisterForm.value.password !== studentRegisterForm.value.confirmPassword) {
      handleError('Passwords do not match')
      return
    }
    
    // Prepare student data object
    const studentData = {
      instrument: studentRegisterForm.value.instrument,
      classCode: studentRegisterForm.value.classCode
    }
    
    const result = await registerStudentAccount(
      studentRegisterForm.value.email,
      studentRegisterForm.value.password,
      studentRegisterForm.value.displayName,
      studentData
    )
    
    if (result.success) {
      // Check if there was a class enrollment issue
      if (result.classEnrollmentError) {
        // Show success message for account creation but warn about class enrollment
        handleError(`Account created successfully! However, ${result.classEnrollmentError}`)
        return
      }
      
      registrationSuccess.value = true
      studentRegisterForm.value = {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        instrument: '',
        classCode: ''
      }
    } else {
      handleError(result.error || 'Registration failed')
    }
  }).finally(() => {
    isStudentRegistrationLoading.value = false
  })
}

const loginTeacher = async () => {
  await executeWithErrorHandling(async () => {
    isTeacherLoginLoading.value = true
    clearError()
    
    const result = await loginTeacherAccount(teacherForm.value.email, teacherForm.value.password)
    
    if (result.success) {
      // Emit login event to parent component
      emit('login', { 
        user: result.user, 
        userData: result.userData,
        role: 'teacher'
      })
    } else {
      handleError(result.error || 'Login failed')
    }
  }).finally(() => {
    isTeacherLoginLoading.value = false
  })
}

const loginTeacherWithGoogle = async () => {
  await executeWithErrorHandling(async () => {
    isTeacherLoginLoading.value = true
    clearError()
    const result = await loginTeacherWithGoogleAccount()
    if (result.success) {
      emit('login', {
        user: result.user,
        userData: result.userData,
        role: 'teacher'
      })
    } else {
      handleError(result.error || 'Google login failed')
    }
  }).finally(() => {
    isTeacherLoginLoading.value = false
  })
}

const registerTeacher = async () => {
  await executeWithErrorHandling(async () => {
    isTeacherRegistrationLoading.value = true
    clearError()
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      handleError('Passwords do not match')
      return
    }
    
    // Prepare teacher data
    const teacherData = {
      school: registerForm.value.school,
      instrument: registerForm.value.instrument,
      experience: registerForm.value.experience
    }
    
    const result = await registerTeacherAccount(
      registerForm.value.email,
      registerForm.value.password,
      registerForm.value.displayName,
      teacherData
    )
    
    if (result.success) {
      registrationSuccess.value = true
      // Pre-fill the login form with the registered email
      teacherForm.value.email = registerForm.value.email
      registerForm.value = {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        school: '',
        instrument: '',
        experience: 'beginner'
      }
      // Show success message and switch to login
      showRegisterForm.value = false
    } else {
      handleError(result.error || 'Registration failed')
    }
  }).finally(() => {
    isTeacherRegistrationLoading.value = false
  })
}

const resetPassword = async () => {
  await executeWithErrorHandling(async () => {
    isPasswordResetLoading.value = true
    clearError()
    
    const result = await resetUserPassword(resetPasswordForm.value.email)
    
    if (result.success) {
      passwordResetSuccess.value = true
      resetPasswordForm.value.email = ''
    } else {
      handleError(result.error || 'Password reset failed')
    }
  }).finally(() => {
    isPasswordResetLoading.value = false
  })
}

const resetStudentPassword = async () => {
  await executeWithErrorHandling(async () => {
    isStudentPasswordResetLoading.value = true
    clearError()
    
    const result = await resetUserPassword(studentResetPasswordForm.value.email)
    
    if (result.success) {
      passwordResetSuccess.value = true
      studentResetPasswordForm.value.email = ''
    } else {
      handleError(result.error || 'Password reset failed')
    }
  }).finally(() => {
    isStudentPasswordResetLoading.value = false
  })
}

const bringToFront = (index) => {
  currentCardIndex.value = index
}

const showStudentInstrumentDropdown = ref(false)
const showTeacherInstrumentDropdown = ref(false)

const selectStudentInstrument = (value) => {
  studentRegisterForm.value.instrument = value
  showStudentInstrumentDropdown.value = false
}

const selectTeacherInstrument = (value) => {
  registerForm.value.instrument = value
  showTeacherInstrumentDropdown.value = false
}

const getStudentInstrumentImage = () => {
  return getInstrumentImage(studentRegisterForm.value.instrument)
}

const getStudentInstrumentName = () => {
  return getInstrumentName(studentRegisterForm.value.instrument)
}

const getTeacherInstrumentImage = () => {
  return getInstrumentImage(registerForm.value.instrument)
}

const getTeacherInstrumentName = () => {
  return getInstrumentName(registerForm.value.instrument)
}
</script>