<template>
  <div class="login min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl transform transition-all hover:scale-102 hover:shadow-3xl">
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input v-model="email" type="email" id="email" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input v-model="password" type="password" id="password" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Sign in
          </button>
        </div>
      </form>
      <div class="text-center mt-4 space-y-2">
        <RouterLink to="/forgot-password" class="block font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Forgot your password?</RouterLink>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? 
          <RouterLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Sign up</RouterLink>
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
const userStore = useUserStore()

const handleLogin = () => {
  userStore.login(email.value, password.value)
}
</script>
