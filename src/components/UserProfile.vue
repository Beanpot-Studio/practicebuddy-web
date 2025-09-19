<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
    <div class="bg-white rounded-2xl p-6 w-full max-w-xl mx-4 shadow-2xl border-2 border-gray-200 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Edit Profile</h3>
        <div class="flex items-center gap-2">
          
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="saveSuccess" class="mb-4 p-3 rounded-xl border-2 border-green-300 bg-green-50 text-green-700">
        ✅ Profile saved successfully
      </div>
      <div v-if="saveError" class="mb-4 p-3 rounded-xl border-2 border-red-300 bg-red-50 text-red-700">
        {{ saveError }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold text-gray-800">Display Name</label>
          <input v-model="form.displayName" type="text" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" required />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-800">Email</label>
          <input :value="currentUser?.email || ''" type="email" class="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600" disabled />
        </div>

        <div v-if="role === 'teacher'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-gray-800">School/Institution</label>
            <input v-model="form.school" type="text" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-gray-800">Primary Instrument</label>
            <div class="relative">
              <button 
                type="button"
                @click="showInstrumentDropdown = !showInstrumentDropdown"
                class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img 
                    v-if="form.instrument" 
                    :src="`/instruments/${getInstrumentImage(form.instrument)}`" 
                    :alt="getInstrumentName(form.instrument)"
                    class="w-5 h-5 object-contain"
                  />
                  <span v-if="form.instrument" class="text-gray-800">{{ getInstrumentName(form.instrument) }}</span>
                  <span v-else class="text-gray-500">Select an instrument</span>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                v-if="showInstrumentDropdown"
                class="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <div 
                  v-for="instrument in instruments" 
                  :key="instrument.value"
                  @click="selectInstrument(instrument.value)"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img :src="`/instruments/${instrument.image}`" :alt="instrument.name" class="w-5 h-5 object-contain" />
                  <span class="text-gray-800">{{ instrument.name }}</span>
                </div>
              </div>
            </div>
          </div>
         
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-gray-800">Primary Instrument</label>
            <div class="relative">
              <button 
                type="button"
                @click="showInstrumentDropdown = !showInstrumentDropdown"
                class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img 
                    v-if="form.instrument" 
                    :src="`/instruments/${getInstrumentImage(form.instrument)}`" 
                    :alt="getInstrumentName(form.instrument)"
                    class="w-5 h-5 object-contain"
                  />
                  <span v-if="form.instrument" class="text-gray-800">{{ getInstrumentName(form.instrument) }}</span>
                  <span v-else class="text-gray-500">Select an instrument</span>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                v-if="showInstrumentDropdown"
                class="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <div 
                  v-for="instrument in instruments" 
                  :key="instrument.value"
                  @click="selectInstrument(instrument.value)"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img :src="`/instruments/${instrument.image}`" :alt="instrument.name" class="w-5 h-5 object-contain" />
                  <span class="text-gray-800">{{ instrument.name }}</span>
                </div>
              </div>
            </div>
          </div>
         
        </div>

        <div class="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
          <button type="submit" :disabled="saving" class="bg-musical-primary flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
            {{ saving ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile as updateAuthProfile } from 'firebase/auth'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../composables/useAuth'
import { instruments, getInstrumentImage, getInstrumentName } from '../lib/instruments'

const props = defineProps({})

const { currentUser } = useAuth()
const role = computed(() => currentUser.value?.role || 'student')

const form = ref({
  displayName: '',
  instrument: '',
  school: '',
})

const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const showInstrumentDropdown = ref(false)
const instrumentIndex = computed(() => instruments.findIndex(i => i.value === form.value.instrument))
const displayInstrumentIndex = computed(() => instrumentIndex.value >= 0 ? instrumentIndex.value : 'N/A')

onMounted(() => {
  const u = currentUser.value || {}
  form.value.displayName = u.displayName || u.name || ''
  form.value.instrument = u.instrument || ''
  form.value.school = u.school || ''
})

const saveProfile = async () => {
  try {
    saveSuccess.value = false
    saveError.value = ''
    saving.value = true
    const uid = currentUser.value?.uid
    if (!uid) throw new Error('Not authenticated')

    // Update Firestore user document
    const userRef = doc(db, 'users', uid)
    const payload = {
      displayName: form.value.displayName,
      instrument: form.value.instrument,
      instrumentIndex: instrumentIndex.value,
      updatedAt: new Date().toISOString()
    }
    if (role.value === 'teacher') {
      payload.school = form.value.school
    }

    // Ensure doc exists; if not, avoid failing hard
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      // Create minimal doc if missing
      await updateDoc(userRef, payload).catch(async () => {
        // Fallback: set via merge when doc absent
        const { setDoc } = await import('firebase/firestore')
        await setDoc(userRef, { role: role.value, email: currentUser.value?.email || '', ...payload }, { merge: true })
      })
    } else {
      await updateDoc(userRef, payload)
    }

    // Update Firebase Auth profile displayName if changed
    if (auth.currentUser && form.value.displayName && auth.currentUser.displayName !== form.value.displayName) {
      await updateAuthProfile(auth.currentUser, { displayName: form.value.displayName })
    }

    // Update local reactive user so UI reflects changes immediately
    try {
      const updated = { 
        ...currentUser.value, 
        displayName: form.value.displayName, 
        instrument: form.value.instrument 
      }
      if (role.value === 'teacher') {
        updated.school = form.value.school
        updated.experience = form.value.experience
      }
      currentUser.value = updated
    } catch {}

    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  } catch (e) {
    saveError.value = e?.message || 'Failed to save profile'
  } finally {
    saving.value = false
  }
}

const selectInstrument = (value) => {
  form.value.instrument = value
  showInstrumentDropdown.value = false
}
</script>


