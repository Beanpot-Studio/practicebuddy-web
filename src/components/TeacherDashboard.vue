<template>
  <div class="min-h-screen bg-musical-primary py-5">
    <div class="container">
      <div class="text-center mb-10 text-white flex flex-col items-center gap-3">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_0_rgba(0,0,0,0.2),0_12px_30px_rgba(0,0,0,0.15)] border-4 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
          👩‍🏫
        </div>
        <h2 class="text-3xl font-bold text-musical-graphite">Teacher Hub</h2>
        <p class="text-lg opacity-95 font-medium text-musical-graphite">Help your students develop amazing musical skills!</p>
        <p class="text-sm opacity-80 italic text-musical-graphite">Teaching with: {{ teacherEmail }}</p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex justify-center mb-8">
        <div class="bg-gray-100 rounded-xl p-1 flex shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 border-gray-200">
          <button 
            @click="activeTab = 'overview'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'overview' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            📊 Overview
          </button>
          <button 
            @click="activeTab = 'create-class'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'create-class' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            ➕ Create Class
          </button>
          <button 
            @click="activeTab = 'manage-classes'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'manage-classes' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            🎓 Manage Classes
          </button>
          <button 
            @click="activeTab = 'class-roster'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'class-roster' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            👥 Class Roster
          </button>
          <button 
            @click="activeTab = 'assignments'"
            :class="[
              'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'assignments' ? 'bg-white text-musical-primary shadow-sm' : 'text-gray-600 hover:text-musical-primary'
            ]"
          >
            📚 Assignments
          </button>

        </div>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="animate-fadeIn">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="card card-red">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 relative">
                📊
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Class Stats</h3>
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white">
                <div class="text-2xl font-bold">{{ totalStudents }}</div>
                <div class="text-sm opacity-90 font-semibold">Music Students</div>
              </div>
              <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white">
                <div class="text-2xl font-bold">{{ classes.length }}</div>
                <div class="text-sm opacity-90 font-semibold">Active Classes</div>
              </div>
              <div class="flex justify-between items-center p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white">
                <div class="text-2xl font-bold">{{ totalAssignments }}</div>
                <div class="text-sm opacity-90 font-semibold">Total Assignments</div>
              </div>
            </div>
          </div>

          <div class="card card-blue">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
                🔔
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Recent Activity</h3>
            </div>
            <div class="flex flex-col gap-3">
              <div v-if="recentActivity.length === 0" class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]">
                <div class="text-sm text-gray-600 font-medium text-center">No recent activity</div>
              </div>
              <div 
                v-for="activity in recentActivity.slice(0, 3)" 
                :key="activity.id"
                class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
              >
                <div class="text-sm text-gray-800 font-semibold mb-1">{{ activity.message }}</div>
                <div class="text-xs text-gray-500 font-medium">{{ activity.time }}</div>
              </div>
            </div>
          </div>

          <div class="card card-green">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
                ⚡
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Quick Tools</h3>
            </div>
            <div class="flex flex-col gap-3">
              <button class="btn btn-primary" @click="activeTab = 'create-class'">
                <Plus class="w-5 h-5" />
                Create New Class
              </button>
              <button class="btn btn-secondary" @click="activeTab = 'assignments'">
                <BookOpen class="w-5 h-5" />
                Manage Assignments
              </button>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <h3 class="text-white text-2xl mb-6 text-center font-bold text-shadow-lg">🎼 Your Enrolled Students</h3>
          <div v-if="allStudents.length === 0" class="text-center">
            <div class="card card-yellow">
              <div class="text-center py-8">
                <div class="text-6xl mb-4">🎵</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No Students Enrolled Yet</h3>
                <p class="text-gray-600 mb-4">Students will appear here once they join your classes using the class codes.</p>
                <button class="btn btn-primary" @click="activeTab = 'create-class'">
                  Create Your First Class
                </button>
              </div>
            </div>
          </div>
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="student in allStudents" 
              :key="student.studentId"
              class="card card-yellow cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.1),0_18px_40px_rgba(0,0,0,0.2)]"
              @click="selectStudent(student)"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-gray-300 flex items-center justify-center text-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)]">
                  {{ getStudentAvatar(student.instrument) }}
                </div>
                <div class="flex-1">
                  <h4 class="text-base text-gray-800 font-bold mb-1">{{ student.name }}</h4>
                  <p class="text-sm text-gray-500 font-semibold">{{ student.instrument || 'Music Student' }}</p>
                </div>
                <div>
                  <span class="px-3 py-1.5 rounded-2xl text-xs font-bold uppercase border-2 shadow-[0_2px_0_rgba(0,0,0,0.1)] bg-gradient-to-br from-green-400 to-green-500 text-white border-green-600">
                    Active
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between mb-4 gap-2">
                <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-red-600 bg-gradient-to-br from-red-400 to-red-500 text-white flex-1">
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Joined</span>
                  <span class="text-sm font-bold">{{ formatJoinDate(student.joinedAt) }}</span>
                </div>
                <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white flex-1">
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Practice</span>
                  <span class="text-sm font-bold">{{ student.practiceMinutes || 0 }}min</span>
                </div>
                <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white flex-1">
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Assignments</span>
                  <span class="text-sm font-bold">{{ student.assignments?.length || 0 }}</span>
                </div>
              </div>

              <div class="border-t-3 border-gray-200 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h5 class="text-sm text-gray-800 font-bold">📊 Student Info</h5>
                </div>
                <div class="text-center py-2 text-gray-600 text-sm">
                  <div class="mb-1">
                    <span class="font-semibold">Joined:</span> {{ formatJoinDate(student.joinedAt) }}
                  </div>
                  <div>
                    <span class="font-semibold">Status:</span> 
                    <span class="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Class Tab -->
      <div v-if="activeTab === 'create-class'" class="animate-fadeIn">
        <div class="max-w-2xl mx-auto">
          <div class="card card-blue">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
                ➕
              </div>
              <h3 class="text-xl text-gray-800 font-bold">Create New Music Class</h3>
            </div>
            
            <form @submit.prevent="createClass" class="space-y-6">
              <div class="space-y-2">
                <label for="class-name" class="block text-sm font-semibold text-gray-700">Class Name</label>
                <input 
                  id="class-name"
                  v-model="newClass.name" 
                  type="text" 
                  placeholder="e.g., Beginner Piano, Advanced Guitar, Music Theory"
                  required
                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
              
              <div class="space-y-2">
                <label for="class-description" class="block text-sm font-semibold text-gray-700">Description</label>
                <textarea 
                  id="class-description"
                  v-model="newClass.description" 
                  placeholder="Describe what students will learn in this class..."
                  rows="3"
                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md resize-vertical"
                ></textarea>
              </div>
              
              <div class="space-y-2">
                <label for="class-instrument" class="block text-sm font-semibold text-gray-700">Primary Instrument</label>
                <select 
                  id="class-instrument"
                  v-model="newClass.instrument" 
                  required
                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
                >
                  <option value="">Select an instrument</option>
                  <option value="piano">🎹 Piano</option>
                  <option value="guitar">🎸 Guitar</option>
                  <option value="violin">🎻 Violin</option>
                  <option value="trumpet">🎺 Trumpet</option>
                  <option value="drums">🥁 Drums</option>
                  <option value="saxophone">🎷 Saxophone</option>
                  <option value="voice">🎤 Voice</option>
                  <option value="theory">📚 Music Theory</option>
                  <option value="ensemble">🎼 Ensemble</option>
                  <option value="other">🎵 Other</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label for="class-level" class="block text-sm font-semibold text-gray-700">Skill Level</label>
                <select 
                  id="class-level"
                  v-model="newClass.level" 
                  required
                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
                >
                  <option value="">Select skill level</option>
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🌿 Intermediate</option>
                  <option value="advanced">🌳 Advanced</option>
                  <option value="mixed">🌈 Mixed Levels</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label for="class-schedule" class="block text-sm font-semibold text-gray-700">Class Schedule</label>
                <input 
                  id="class-schedule"
                  v-model="newClass.schedule" 
                  type="text" 
                  placeholder="e.g., Mondays 4-5pm, Wednesdays 3-4pm"
                  class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
              
              <button type="submit" class="btn btn-primary w-full" :disabled="isCreatingClass">
                <div v-if="isCreatingClass" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span v-else>🎵 Create Music Class</span>
                {{ isCreatingClass ? 'Creating...' : '' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Manage Classes Tab -->
      <div v-if="activeTab === 'manage-classes'" class="animate-fadeIn">
        <div class="space-y-6">
          <!-- Class List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="classItem in classes" 
              :key="classItem.id"
              class="card card-yellow cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-[0_12px_0_rgba(0,0,0,0.1),0_18px_40px_rgba(0,0,0,0.2)]"
              @click="selectClass(classItem)"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-gray-300 flex items-center justify-center text-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)]">
                  {{ classItem.icon }}
                </div>
                <div class="flex-1">
                  <h4 class="text-base text-gray-800 font-bold mb-1">{{ classItem.name }}</h4>
                  <p class="text-sm text-gray-500 font-semibold">{{ classItem.instrument }}</p>
                </div>
                <div>
                  <span :class="[
                    'px-3 py-1.5 rounded-2xl text-xs font-bold uppercase border-2 shadow-[0_2px_0_rgba(0,0,0,0.1)]',
                    classItem.status === 'active' 
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white border-green-600' 
                      : 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 border-yellow-600'
                  ]">
                    {{ classItem.status }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between mb-4 gap-2">
                <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 text-white flex-1">
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Students</span>
                  <span class="text-sm font-bold">{{ classItem.studentCount }}</span>
                </div>
                <div class="text-center p-2 rounded-xl shadow-[0_2px_0_rgba(0,0,0,0.1)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 text-white flex-1 relative group">
                  <span class="block text-xs opacity-90 font-semibold mb-0.5">Code</span>
                  <span class="text-sm font-bold">{{ classItem.code }}</span>
                  <button 
                    @click.stop="copyClassCode(classItem.code)"
                    class="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-green-600 text-xs font-bold shadow-md hover:bg-green-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    :title="`Copy ${classItem.code}`"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div class="border-t-3 border-gray-200 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h5 class="text-sm text-gray-800 font-bold">📚 Class Details</h5>
                </div>
                <div class="space-y-2">
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">Level:</span> {{ classItem.level }}
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">Schedule:</span> {{ classItem.schedule || 'TBD' }}
                  </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                  <button 
                    @click.stop="copyClassCode(classItem.code)"
                    class="flex-1 btn btn-secondary text-xs py-2"
                  >
                    📋 Copy Code
                  </button>
                  <button 
                    @click.stop="composeEmail(classItem)"
                    class="flex-1 btn btn-primary text-xs py-2"
                  >
                    📧 Email Students
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Student Management Section -->
          <div v-if="selectedClass" class="mt-8">
            <div class="card card-blue">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
                  👥
                </div>
                <h3 class="text-xl text-gray-800 font-bold">{{ selectedClass.name }} - Students</h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="student in selectedClass.students" 
                  :key="student.id"
                  class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center text-xl">
                      {{ student.avatar }}
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm text-gray-800 font-bold">{{ student.name }}</h4>
                      <p class="text-xs text-gray-500">{{ student.instrument }}</p>
                    </div>
                  </div>
                  
                  <div class="flex justify-between text-xs text-gray-600">
                    <span>Practice: {{ student.weeklyMinutes }}min</span>
                    <span>Streak: {{ student.streak }} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Class Roster Tab -->
      <div v-if="activeTab === 'class-roster'" class="animate-fadeIn">
        <div class="space-y-6">
          <!-- Class Selection -->
          <div class="card card-blue">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
                👥
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Select Class to View Roster</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="classItem in classes" 
                :key="classItem.id"
                :class="[
                  'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-[0_2px_0_rgba(0,0,0,0.1)]',
                  selectedClassForRoster?.id === classItem.id
                    ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-blue-400'
                ]"
                @click="selectClassForRoster(classItem)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    {{ classItem.icon }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ classItem.name }}</h4>
                    <p class="text-sm opacity-80">{{ classItem.studentCount }} students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Class Roster -->
          <div v-if="selectedClassForRoster" class="card card-green">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
                  📋
                </div>
                <h3 class="text-xl text-gray-800 font-bold">{{ selectedClassForRoster.name }} - Class Roster</h3>
              </div>
              <div class="text-sm text-gray-600">
                Class Code: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ selectedClassForRoster.code }}</span>
              </div>
            </div>
            
            <div v-if="isLoadingRoster" class="text-center py-8">
              <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-600">Loading roster...</p>
            </div>
            
            <div v-else-if="classRoster.length === 0" class="text-center py-8">
              <div class="text-4xl mb-4">👥</div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No Students Yet</h4>
              <p class="text-gray-600">Students will appear here when they join using the class code.</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="student in classRoster" 
                :key="student.studentId"
                class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center text-xl">
                    {{ getStudentAvatar(student.name) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm text-gray-800 font-bold">{{ student.name }}</h4>
                    <p class="text-xs text-gray-500">{{ student.instrument || 'No instrument specified' }}</p>
                  </div>
                </div>
                
                <div class="flex justify-between text-xs text-gray-600">
                  <span>Joined: {{ formatDate(new Date(student.joinedAt)) }}</span>
                  <span>Practice: {{ student.practiceMinutes || 0 }}min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignments Tab -->
      <div v-if="activeTab === 'assignments'" class="animate-fadeIn">
        <div class="space-y-6">
          <!-- Class Selection for Assignments -->
          <div class="card card-purple">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
                  📚
                </div>
                <h3 class="text-lg text-gray-800 font-bold">Select Class to Manage Assignments</h3>
              </div>
              <button 
                @click="loadClasses"
                class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                🔄 Refresh Classes
              </button>
            </div>
            
            <div v-if="classes.length === 0" class="text-center py-8">
              <div class="text-4xl mb-4">🎵</div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No Classes Found</h4>
              <p class="text-gray-600 mb-4">
                No classes were found for your account. This could mean:
              </p>
              <ul class="text-sm text-gray-600 mb-4 text-left max-w-md mx-auto">
                <li>• You haven't created any classes yet</li>
                <li>• The classes were created with a different account</li>
                <li>• There's a loading issue (try the refresh button)</li>
              </ul>
              <div class="flex gap-3 justify-center">
                <button 
                  @click="loadClasses"
                  class="btn btn-secondary"
                >
                  🔄 Refresh Classes
                </button>
                <button 
                  @click="activeTab = 'create-class'"
                  class="btn btn-purple"
                >
                  ➕ Create New Class
                </button>
              </div>
              <div v-if="currentUser" class="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                <strong>Debug Info:</strong><br>
                User ID: {{ currentUser.uid }}<br>
                Role: {{ currentUser.role }}<br>
                Email: {{ currentUser.email }}
              </div>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="classItem in classes" 
                :key="classItem.id"
                :class="[
                  'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-[0_2px_0_rgba(0,0,0,0.1)]',
                  selectedClassForAssignments?.id === classItem.id
                    ? 'bg-gradient-to-br from-purple-400 to-purple-500 border-purple-600 text-white'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-purple-400'
                ]"
                @click="selectClassForAssignments(classItem)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    {{ classItem.icon }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ classItem.name }}</h4>
                    <p class="text-sm opacity-80">{{ classItem.studentCount }} students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Create Assignment -->
          <div v-if="selectedClassForAssignments" class="card card-purple">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
                ➕
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Create New Assignment for {{ selectedClassForAssignments.name }}</h3>
            </div>
            
            <form @submit.prevent="createNewAssignment" class="space-y-4">
              <!-- Assignment Type Selection -->
              <div>
                <label class="block mb-2 font-semibold text-gray-700">Assignment Type</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input 
                      type="radio" 
                      v-model="newAssignment.type" 
                      value="class"
                      class="w-4 h-4 text-purple-600"
                    />
                    <span>📚 Class Assignment (for all students)</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input 
                      type="radio" 
                      v-model="newAssignment.type" 
                      value="individual"
                      class="w-4 h-4 text-purple-600"
                    />
                    <span>👤 Individual Assignment</span>
                  </label>
                </div>
              </div>
              
              <!-- Student Selection for Individual Assignments -->
              <div v-if="newAssignment.type === 'individual'">
                <label class="block mb-2 font-semibold text-gray-700">Select Student</label>
                <select 
                  v-model="newAssignment.studentId"
                  required
                  class="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  <option value="">Choose a student</option>
                  <option v-for="student in classRoster" :key="student.studentId" :value="student.studentId">
                    {{ student.name }}
                  </option>
                </select>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block mb-2 font-semibold text-gray-700">Assignment Title</label>
                  <input 
                    v-model="newAssignment.title"
                    type="text" 
                    placeholder="Practice Scales"
                    required
                    class="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label class="block mb-2 font-semibold text-gray-700">Due Date</label>
                  <input 
                    v-model="newAssignment.dueDate"
                    type="date" 
                    required
                    class="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block mb-2 font-semibold text-gray-700">Description</label>
                <textarea 
                  v-model="newAssignment.description"
                  placeholder="Describe what students should practice..."
                  rows="3"
                  required
                  class="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 resize-vertical"
                ></textarea>
              </div>
              
              <div>
                <label class="block mb-2 font-semibold text-gray-700">Practice Minutes (Optional)</label>
                <input 
                  v-model="newAssignment.practiceMinutes"
                  type="number" 
                  min="0"
                  placeholder="30"
                  class="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <button 
                type="submit"
                :disabled="isCreatingAssignment"
                class="btn btn-purple w-full"
              >
                {{ isCreatingAssignment ? 'Creating...' : 'Create Assignment' }}
              </button>
            </form>
          </div>

          <!-- No Class Selected Message -->
          <div v-else-if="classes.length > 0" class="card card-purple">
            <div class="text-center py-8">
              <div class="text-4xl mb-4">📚</div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Select a Class</h4>
              <p class="text-gray-600">Choose a class from above to create and manage assignments for your students.</p>
            </div>
          </div>

          <!-- Existing Assignments -->
          <div v-if="selectedClassForAssignments" class="card card-purple">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500 relative">
                📋
              </div>
              <h3 class="text-lg text-gray-800 font-bold">Existing Assignments</h3>
            </div>
            
            <div v-if="isLoadingAssignments" class="text-center py-8">
              <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-600">Loading assignments...</p>
            </div>
            
            <div v-else-if="classAssignments.length === 0" class="text-center py-8">
              <div class="text-4xl mb-4">📚</div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No Assignments Yet</h4>
              <p class="text-gray-600">Create your first assignment above!</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="assignment in classAssignments" 
                :key="assignment.id"
                class="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-gray-800 text-lg">{{ assignment.title }}</h4>
                      <span :class="[
                        'px-2 py-1 rounded-lg text-xs font-bold',
                        assignment.type === 'class' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-green-100 text-green-700 border border-green-300'
                      ]">
                        {{ assignment.type === 'class' ? '📚 Class' : '👤 Individual' }}
                      </span>
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ assignment.description }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm text-gray-500">
                      Due: {{ formatDate(new Date(assignment.dueDate)) }}
                    </div>
                    <div v-if="assignment.practiceMinutes" class="text-sm text-purple-600 font-semibold">
                      ⏱️ {{ assignment.practiceMinutes }} min
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500">
                    Created: {{ formatDate(new Date(assignment.createdAt)) }}
                  </div>
                  <button 
                    @click="deleteAssignment(assignment.id)"
                    class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    <!-- Sticker Modal -->
    <div v-if="showStickerModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" @click="showStickerModal = false">
      <div class="card card-green max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto m-5" @click.stop>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-green-600 bg-gradient-to-br from-green-400 to-green-500 relative">
            🌟
          </div>
          <h3 class="flex-1 text-xl text-gray-800 font-bold">Give Stickers</h3>
          <button @click="showStickerModal = false" class="w-10 h-10 border-2 border-gray-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.1)]">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div>
          <div class="flex flex-col gap-5">
            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base">🎭 Select Student</label>
              <select v-model="selectedStudent" class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(150,206,180,0.2)] focus:transform focus:-translate-y-0.5">
                <option value="">Choose a music student</option>
                <option v-for="student in students" :key="student.id" :value="student">
                  {{ student.name }}
                </option>
              </select>
            </div>
            
            <div v-if="selectedStudent">
              <label class="block mb-2 font-semibold text-gray-700 text-base">🎵 Select Creation</label>
              <select v-model="selectedRecording" class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(150,206,180,0.2)] focus:transform focus:-translate-y-0.5">
                <option value="">Choose a musical creation</option>
                <option v-for="recording in selectedStudent.recordings" :key="recording.id" :value="recording">
                  {{ recording.title }} - {{ formatDate(recording.date) }}
                </option>
              </select>
            </div>

            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base">🌟 Choose Awesome Stickers</label>
              <div class="grid grid-cols-6 sm:grid-cols-8 gap-2">
                <div 
                  v-for="sticker in availableStickers" 
                  :key="sticker"
                  :class="[
                    'w-12 h-12 sm:w-10 sm:h-10 border-3 border-gray-200 rounded-full flex items-center justify-center text-2xl sm:text-xl cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] bg-gradient-to-br from-gray-50 to-gray-100 hover:border-green-400 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)]',
                    selectedStickers.includes(sticker) 
                      ? 'border-green-400 bg-gradient-to-br from-green-400 to-green-500 transform -translate-y-0.5 shadow-[0_6px_0_rgba(0,0,0,0.2)]' 
                      : ''
                  ]"
                  @click="toggleSticker(sticker)"
                >
                  {{ sticker }}
                </div>
              </div>
            </div>

            <div>
              <label class="block mb-2 font-semibold text-gray-700 text-base">💬 Encouraging Message</label>
              <textarea 
                v-model="teacherMessage"
                placeholder="Amazing job developing your musical skills! Keep up the fantastic work! 🎵"
                rows="3"
                class="w-full p-3.5 px-4 border-4 border-gray-200 rounded-2xl text-base font-medium shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_4px_0_rgba(0,0,0,0.1),0_0_0_4px_rgba(150,206,180,0.2)] focus:transform focus:-translate-y-0.5 resize-vertical min-h-20"
              ></textarea>
            </div>

            <button 
              @click="giveStickers"
              :disabled="!selectedStudent || !selectedRecording || selectedStickers.length === 0"
              class="btn btn-success w-full p-4 text-base font-bold"
            >
              <Heart class="w-5 h-5" />
              Give {{ selectedStickers.length }} Awesome Sticker{{ selectedStickers.length !== 1 ? 's' : '' }}!
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Email Composition Modal -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" @click="showEmailModal = false">
      <div class="card card-blue max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto m-5" @click.stop>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] border-2 border-blue-600 bg-gradient-to-br from-blue-400 to-blue-500 relative">
            📧
          </div>
          <h3 class="flex-1 text-xl text-gray-800 font-bold">Email Students - {{ selectedClassForEmail?.name }}</h3>
          <button @click="showEmailModal = false" class="w-10 h-10 border-2 border-gray-200 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-gray-200 hover:transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.1)]">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">📧 To</label>
            <div class="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div class="text-sm text-gray-600">
                <strong>Class Code:</strong> {{ selectedClassForEmail?.code }}
              </div>
              <div class="text-sm text-gray-600 mt-1">
                <strong>Students:</strong> {{ selectedClassForEmail?.studentCount || 0 }} enrolled
              </div>
            </div>
          </div>
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">📝 Subject</label>
            <input 
              v-model="emailData.subject"
              type="text" 
              placeholder="e.g., Welcome to Music Class!"
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md"
            />
          </div>
          
          <div>
            <label class="block mb-2 font-semibold text-gray-700 text-base">💬 Message</label>
            <textarea 
              v-model="emailData.message"
              placeholder="Dear students, welcome to our music class! Here's your class code to get started..."
              rows="8"
              class="w-full px-4 py-3 border-3 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-md resize-vertical"
            ></textarea>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
            <h4 class="font-semibold text-blue-800 mb-2">📋 Quick Actions</h4>
            <div class="flex flex-wrap gap-2">
              <button 
                @click="copyClassCode(selectedClassForEmail?.code)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                📋 Copy Class Code
              </button>
              <button 
                @click="insertClassCode"
                class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                🎵 Insert Class Code
              </button>
              <button 
                @click="insertWelcomeMessage"
                class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                👋 Insert Welcome Message
              </button>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="sendEmail"
              :disabled="!emailData.subject || !emailData.message"
              class="flex-1 btn btn-primary"
            >
              📤 Send Email
            </button>
            <button 
              @click="showEmailModal = false"
              class="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Users, Star, Play, X, Heart, Plus, BookOpen } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const teacherEmail = computed(() => currentUser.value?.email || 'teacher@school.edu')

// Authentication
const { createTeacherClass, fetchTeacherClasses, fetchClassRoster, createClassAssignment, fetchClassAssignments, deleteClassAssignment, currentUser } = useAuth()

const activeTab = ref('overview')


const totalStudents = computed(() => allStudents.value.length)
const totalAssignments = computed(() => {
  return allStudents.value.reduce((total, student) => {
    return total + (student.assignments?.length || 0)
  }, 0)
})
const recentActivity = ref([])
const showAllStudents = ref(false)
const showStickerModal = ref(false)
const showEmailModal = ref(false)
const isCreatingClass = ref(false)
const selectedClass = ref(null)
const selectedClassForEmail = ref(null)
const selectedClassForRoster = ref(null)
const selectedClassForAssignments = ref(null)
const classRoster = ref([])
const classAssignments = ref([])
const isLoadingRoster = ref(false)
const isLoadingAssignments = ref(false)
const isCreatingAssignment = ref(false)

const emailData = ref({
  subject: '',
  message: ''
})

const newClass = ref({
  name: '',
  description: '',
  instrument: '',
  level: '',
  schedule: ''
})

const newAssignment = ref({
  type: 'class',
  studentId: '',
  title: '',
  description: '',
  dueDate: '',
  practiceMinutes: ''
})

const classes = ref([])

const allStudents = ref([])

const selectedStudent = ref(null)
const selectedRecording = ref(null)
const selectedStickers = ref([])
const teacherMessage = ref('')

const availableStickers = ref([
  '⭐', '🌟', '✨', '💫', '🎵', '🎶', '🎸', '🎹', '🎻', '🎺', '🥁', '🎷',
  '👍', '👏', '💯', '🔥', '💪', '🏆', '🎯', '💖', '🌈', '🎊', '🎉', '🎼'
])

const getStudentAvatar = (instrument) => {
  const avatars = {
    piano: '🎹',
    guitar: '🎸',
    violin: '🎻',
    trumpet: '🎺',
    drums: '🥁',
    saxophone: '🎷',
    voice: '🎤',
    theory: '📚'
  }
  return avatars[instrument?.toLowerCase()] || '🎵'
}

const formatJoinDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatDueDate = (dateString) => {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Overdue'
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${diffDays} days`
  }
}



const selectStudent = (student) => {
  console.log('Selected music student:', student.name)
}

const playRecording = (recording) => {
  alert(`🎵 Playing musical creation: ${recording.title}`)
}

const reviewRecording = (student, recording) => {
  selectedStudent.value = student
  selectedRecording.value = recording
  showStickerModal.value = true
}

const toggleSticker = (sticker) => {
  const index = selectedStickers.value.indexOf(sticker)
  if (index > -1) {
    selectedStickers.value.splice(index, 1)
  } else {
    selectedStickers.value.push(sticker)
  }
}

const giveStickers = () => {
  if (selectedStudent.value && selectedRecording.value && selectedStickers.value.length > 0) {
    const recording = selectedRecording.value
    recording.stickers = [...selectedStickers.value]
    recording.reviewed = true
    recording.feedback = teacherMessage.value

    selectedStudent.value = null
    selectedRecording.value = null
    selectedStickers.value = []
    teacherMessage.value = ''
    showStickerModal.value = false

    stickersGiven.value += selectedStickers.value.length
    pendingReviews.value = Math.max(0, pendingReviews.value - 1)

    alert('🎉 Awesome stickers given successfully! The student will be so happy!')
  }
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const createClass = async () => {
  if (!newClass.value.name || !newClass.value.instrument || !newClass.value.level) {
    alert('Please fill in all required fields.')
    return
  }
  
  if (!currentUser.value) {
    alert('You must be logged in to create a class.')
    return
  }
  
  isCreatingClass.value = true
  
  try {
    const classData = {
      name: newClass.value.name,
      description: newClass.value.description,
      instrument: newClass.value.instrument,
      level: newClass.value.level,
      schedule: newClass.value.schedule
    }
    
    const result = await createTeacherClass(currentUser.value.uid, classData)
    
    if (result.success) {
      // Add the new class to the local state
      const newClassWithIcon = {
        ...result.class,
        icon: getInstrumentIcon(result.class.instrument)
      }
      classes.value.push(newClassWithIcon)
      
      // Reset form
      newClass.value = {
        name: '',
        description: '',
        instrument: '',
        level: '',
        schedule: ''
      }
      
      // Switch to manage classes tab
      activeTab.value = 'manage-classes'
      
      alert(`🎉 Class "${result.class.name}" created successfully! Class code: ${result.class.code}`)
    } else {
      alert(`Error creating class: ${result.error}`)
    }
  } catch (error) {
    alert('Error creating class. Please try again.')
  } finally {
    isCreatingClass.value = false
  }
}

const selectClass = (classItem) => {
  selectedClass.value = classItem
}

const copyClassCode = async (code) => {
  try {
    console.log('Copying class code:', code)
    console.log('Type of code:', typeof code)
    await navigator.clipboard.writeText(code)
    alert(`✅ Class code "${code}" copied to clipboard!`)
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = code
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert(`✅ Class code "${code}" copied to clipboard!`)
  }
}

const composeEmail = (classItem) => {
  selectedClassForEmail.value = classItem
  emailData.value = {
    subject: `Welcome to ${classItem.name}!`,
    message: `Dear students,

Welcome to ${classItem.name}! I'm excited to have you join our musical journey.

🎵 Your Class Code: ${classItem.code}

To get started:
1. Go to Practice Buddy
2. Click "Students" 
3. Enter your name and the class code above
4. Start practicing and tracking your progress!

${classItem.schedule ? `📅 Class Schedule: ${classItem.schedule}` : ''}

I can't wait to see your musical progress!

Best regards,
${currentUser.value?.displayName || 'Your Music Teacher'}`
  }
  showEmailModal.value = true
}

const insertClassCode = () => {
  if (selectedClassForEmail.value?.code) {
    emailData.value.message += `\n\n🎵 Class Code: ${selectedClassForEmail.value.code}`
  }
}

const insertWelcomeMessage = () => {
  const welcomeMessage = `Dear students,

Welcome to ${selectedClassForEmail.value?.name || 'our music class'}! I'm excited to have you join our musical journey.

Here's what you can expect:
• Track your practice time
• Record your musical creations
• Earn stickers and achievements
• See your progress over time

Let's make beautiful music together! 🎵

Best regards,
${currentUser.value?.displayName || 'Your Music Teacher'}`
  
  emailData.value.message = welcomeMessage
}

const sendEmail = () => {
  if (!emailData.value.subject || !emailData.value.message) {
    alert('Please fill in both subject and message.')
    return
  }
  
  // Create Gmail compose URL
  const subject = encodeURIComponent(emailData.value.subject)
  const body = encodeURIComponent(emailData.value.message)
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`
  
  // Open Gmail compose window
  window.open(gmailUrl, '_blank', 'width=800,height=600')
  
  // Close modal
  showEmailModal.value = false
  selectedClassForEmail.value = null
  emailData.value = { subject: '', message: '' }
  
  alert('📧 Gmail compose window opened! The message is ready to send to your students.')
}

const getInstrumentIcon = (instrument) => {
  const icons = {
    piano: '🎹',
    guitar: '🎸',
    violin: '🎻',
    trumpet: '🎺',
    drums: '🥁',
    saxophone: '🎷',
    voice: '🎤',
    theory: '📚',
    ensemble: '🎼',
    other: '🎵'
  }
  return icons[instrument] || '🎵'
}

const loadClasses = async () => {
  console.log('Loading classes for user:', currentUser.value?.uid)
  
  if (!currentUser.value) {
    console.log('No current user, skipping class load')
    return
  }
  
  try {
    const result = await fetchTeacherClasses(currentUser.value.uid)
    console.log('Fetch teacher classes result:', result)
    
    if (result.success) {
      // Add icons to each class
      classes.value = result.classes.map(classItem => ({
        ...classItem,
        icon: getInstrumentIcon(classItem.instrument)
      }))
      console.log('Loaded classes:', classes.value)
      console.log('Class codes available:', classes.value.map(c => ({ id: c.id, code: c.code, name: c.name })))
      
      // Load all students from all classes
      await loadAllStudents()
    } else {
      console.error('Error loading classes:', result.error)
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const loadAllStudents = async () => {
  if (!classes.value.length) {
    allStudents.value = []
    return
  }
  
  const allStudentsList = []
  
  for (const classItem of classes.value) {
    try {
      const result = await fetchClassRoster(classItem.id)
      if (result.success && result.students) {
        allStudentsList.push(...result.students)
      }
    } catch (error) {
      console.error(`Error loading students for class ${classItem.id}:`, error)
    }
  }
  
  allStudents.value = allStudentsList
  console.log('Loaded all students:', allStudents.value)
}

// Class roster functions
const selectClassForRoster = async (classItem) => {
  selectedClassForRoster.value = classItem
  await loadClassRoster(classItem.id)
}

const loadClassRoster = async (classCode) => {
  if (!classCode) return
  
  isLoadingRoster.value = true
  try {
    const result = await fetchClassRoster(classCode)
    if (result.success) {
      classRoster.value = result.students
    } else {
      console.error('Error loading roster:', result.error)
      classRoster.value = []
    }
  } catch (error) {
    console.error('Error loading roster:', error)
    classRoster.value = []
  } finally {
    isLoadingRoster.value = false
  }
}

// Assignment functions
const selectClassForAssignments = async (classItem) => {
  console.log('selectClassForAssignments called with classItem:', classItem)
  selectedClassForAssignments.value = classItem
  await loadClassAssignments(classItem.id)
  await loadClassRoster(classItem.id) // Load roster for individual assignment student selection
}

const loadClassAssignments = async (classCode) => {
  if (!classCode) return
  
  isLoadingAssignments.value = true
  try {
    const result = await fetchClassAssignments(classCode)
    if (result.success) {
      classAssignments.value = result.assignments
      console.log('Loaded assignments:', result.assignments)
      console.log('Class assignments:', result.classAssignments)
      console.log('Individual assignments:', result.individualAssignments)
    } else {
      console.error('Error loading assignments:', result.error)
      classAssignments.value = []
    }
  } catch (error) {
    console.error('Error loading assignments:', error)
    classAssignments.value = []
  } finally {
    isLoadingAssignments.value = false
  }
}

const createNewAssignment = async () => {
  if (!selectedClassForAssignments.value?.id) {
    alert('Please select a class first.')
    return
  }
  
  if (!newAssignment.value.title || !newAssignment.value.description || !newAssignment.value.dueDate) {
    alert('Please fill in all required fields.')
    return
  }
  
  if (newAssignment.value.type === 'individual' && !newAssignment.value.studentId) {
    alert('Please select a student for individual assignments.')
    return
  }
  
  isCreatingAssignment.value = true
  
  try {
    const assignmentData = {
      title: newAssignment.value.title,
      description: newAssignment.value.description,
      dueDate: newAssignment.value.dueDate,
      practiceMinutes: newAssignment.value.practiceMinutes ? parseInt(newAssignment.value.practiceMinutes) : 0
    }
    
    const result = await createClassAssignment(
      selectedClassForAssignments.value.id, 
      assignmentData, 
      newAssignment.value.type, 
      newAssignment.value.studentId || null
    )
    
    if (result.success) {
      // Add the new assignment to the local state
      classAssignments.value.push(result.assignment)
      
      const assignmentType = result.assignment.type === 'class' ? 'Class' : 'Individual'
      alert(`✅ ${assignmentType} assignment "${result.assignment.title}" created successfully!`)
      
      // Reset form
      newAssignment.value = {
        type: 'class',
        studentId: '',
        title: '',
        description: '',
        dueDate: '',
        practiceMinutes: ''
      }
    } else {
      if (result.error === 'Class not found') {
        alert('❌ Error: Class not found. Please make sure you have created a class first and try again.')
      } else {
        alert(`Error creating assignment: ${result.error}`)
      }
    }
  } catch (error) {
    console.error('Assignment creation error:', error)
    alert('Error creating assignment. Please try again.')
  } finally {
    isCreatingAssignment.value = false
  }
}

const deleteAssignment = async (assignmentId) => {
  if (!selectedClassForAssignments.value?.id) {
    alert('Please select a class first.')
    return
  }
  
  if (!assignmentId) {
    alert('Please select an assignment to delete.')
    return
  }
  
  // Confirm deletion
  if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
    return
  }
  
  try {
    const result = await deleteClassAssignment(selectedClassForAssignments.value.id, assignmentId)
    
    if (result.success) {
      // Remove the assignment from the local state
      const assignmentIndex = classAssignments.value.findIndex(assignment => assignment.id === assignmentId)
      if (assignmentIndex !== -1) {
        classAssignments.value.splice(assignmentIndex, 1)
      }
      
      alert('✅ Assignment deleted successfully!')
    } else {
      alert(`Error deleting assignment: ${result.error}`)
    }
  } catch (error) {
    console.error('Assignment deletion error:', error)
    alert('Error deleting assignment. Please try again.')
  }
}





// Load classes when component mounts
onMounted(async () => {
  await loadClasses()
})

// Watch for current user changes and reload classes
watch(currentUser, (newUser) => {
  console.log('Current user changed:', newUser)
  if (newUser && newUser.role === 'teacher') {
    console.log('Loading classes for teacher:', newUser.uid)
    loadClasses()
  }
}, { immediate: true })
</script>