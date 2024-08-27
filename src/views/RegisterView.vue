<template>
  <div class="register min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl transform transition-all hover:scale-102 hover:shadow-3xl">
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Join our community today</p>
      </div>
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input v-model="email" type="email" id="email" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input v-model="password" type="password" id="password" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Password">
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Confirm Password">
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            Sign up
          </button>
        </div>
      </form>
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account? 
          <RouterLink to="/login" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const userStore = useUserStore()

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match"
    return
  }
  
  errorMessage.value = ''
  userStore.register(email.value, password.value)
}
</script>
