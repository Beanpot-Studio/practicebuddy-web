<template>
  <div class="min-h-screen bg-gradient-to-r from-musical-primary to-musical-primary/90 relative overflow-hidden text-gray-800 font-sans">
    <!-- Logo Hero Section -->
    <section class="w-full bg-gradient-to-r from-musical-primary to-musical-primary/90 py-12">
      <div class="container">
        <div class="flex justify-center">
          <div class="w-28 h-28 rounded-full bg-musical-primary shadow-[0_6px_0_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center border-4 border-white">
            <img src="/lyre.png" alt="Practice Buddy Lyre Logo" class="w-20 h-20 object-contain" />
          </div>
        </div>
      </div>
    </section>

    <!-- Hero Section -->
    <section class="w-full bg-musical-coral py-20">
      <div class="container">
        <div class="text-center">
          <h1 class="text-5xl mb-5 font-bold text-musical-graphite">Practice Made Fun (Again)</h1>
          <p class="text-xl text-musical-graphite font-medium mb-8 max-w-xl mx-auto">
            The beloved Practice Buddy app is returning soon — reimagined for the web, rebuilt for kids, and better than ever for music teachers.
          </p>
          <form
            v-if="!success"
            class="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-2"
            @submit.prevent="submitEmail"
          >
            <input
              v-model="email"
              @input="clearMessages"
              type="email"
              placeholder="Your Email Address"
              class="flex-1 px-4 py-3 rounded-xl border-3 border-gray-300 shadow-sm text-base focus:outline-none focus:border-musical-primary focus:shadow-md"
              required
            />
            <button type="submit" class="btn btn-secondary btn-full">
              Join the Waitlist
            </button>
          </form>
          <p v-if="success" class="text-green-600 text-center">Thank you for joining!</p>
          <p v-if="error && !success" class="text-red-600 text-center">{{ error }}</p>
          <p class="text-sm text-gray-500 mt-3">No spam, just early access + exclusive perks.</p>
        </div>
      </div>
    </section>

    <!-- Shuffling Cards Section (Kids Playing Instruments) -->
    <section class="w-full bg-musical-purple py-16">
      <div class="container flex justify-center items-start">
        <div class="relative max-w-sm text-center">
          <div class="card-stack relative w-80 h-[28rem]">
            <!-- Card 1 -->
            <div class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden transform z-30 scale-100 rotate-0 translate-y-0">
              <img 
                src="/cello.jpg" 
                alt="Cello player"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
            <!-- Card 2 -->
            <div class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden transform z-20 scale-95 -rotate-6 translate-y-2">
              <img 
                src="/guitar.jpg" 
                alt="Guitar player"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
            <!-- Card 3 -->
            <div class="card-item absolute w-full h-full rounded-3xl shadow-[0_12px_0_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden transform z-10 scale-90 -rotate-12 translate-y-4">
              <img 
                src="/sing.jpg" 
                alt="Singer"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (Cards) -->
    <section class="w-full bg-white py-16">
      <div class="container">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="flex flex-col items-center bg-musical-primary rounded-3xl shadow-lg p-8 text-center border-4 border-blue-600">
            <div class="mb-4 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center mb-2">
                <img src="/home_icons/1.svg" alt="Record Practice Icon" class="w-12 h-12" />
              </div>
            </div>
            <h3 class="text-2xl font-semibold mb-2 text-white">Record Your Practice</h3>
            <p class="text-lg text-white/90">Easily log your daily music practice with fun, simple tools designed for kids.</p>
          </div>
          <!-- Card 2 -->
          <div class="flex flex-col items-center bg-musical-success rounded-3xl shadow-lg p-8 text-center border-4 border-green-600">
            <div class="mb-4 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-green-600 border-4 border-white shadow-lg flex items-center justify-center mb-2">
                <img src="/home_icons/2.svg" alt="Get Feedback Icon" class="w-12 h-12" />
              </div>
            </div>
            <h3 class="text-2xl font-semibold mb-2 text-musical-graphite">Get Feedback from Teachers</h3>
            <p class="text-lg text-musical-graphite/80">Share your progress and receive encouraging feedback from your music teacher.</p>
          </div>
          <!-- Card 3 -->
          <div class="flex flex-col items-center bg-musical-coral rounded-3xl shadow-lg p-8 text-center border-4 border-red-600">
            <div class="mb-4 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-red-600 border-4 border-white shadow-lg flex items-center justify-center mb-2">
                <img src="/home_icons/3.svg" alt="Earn Stickers Icon" class="w-12 h-12" />
              </div>
            </div>
            <h3 class="text-2xl font-semibold mb-2 text-musical-graphite">Earn Stickers & Streaks</h3>
            <p class="text-lg text-musical-graphite/80">Stay motivated by collecting digital stickers and building your practice streaks!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What's New Section -->
    <section class="w-full bg-musical-coral py-16">
      <div class="container">
        <div class="bg-indigo-50 py-16 rounded-3xl shadow-lg mb-12">
          <h2 class="text-center text-4xl font-bold text-musical-graphite mb-10">What’s New in Practice Buddy</h2>
          <ul class="max-w-3xl mx-auto list-disc list-inside text-lg space-y-3 text-musical-graphite">
            <li>🎯 100% web-based – no installs required</li>
            <li>🎧 Smart pitch feedback using audio-only</li>
            <li>🧩 Customizable teacher dashboards & assignments</li>
            <li>📊 Practice streaks and motivational rewards</li>
            <li>🔒 Designed with student privacy in mind</li>
          </ul>
        </div>
      </div>
    </section>

   
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const email = ref("");
const success = ref(false);
const error = ref("");

async function submitEmail() {
  if (!email.value) {
    error.value = "Please enter a valid email.";
    return;
  }
  try {
    await addDoc(collection(db, "emails"), {
      email: email.value,
      createdAt: serverTimestamp(),
    });
    success.value = true;
    email.value = "";
  } catch (err) {
    error.value = "There was a problem. Please try again.";
  }
}

function clearMessages() {
  error.value = "";
  success.value = false;
}
</script>




