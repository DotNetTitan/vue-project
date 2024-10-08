<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-900">
    <div class="max-w-md w-full space-y-8 bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-2xl transform transition-all hover:scale-102 hover:shadow-3xl">
      <div class="absolute top-4 left-4">
        <RouterLink to="/" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </RouterLink>
      </div>
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input v-model="username" type="username" id="username" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input v-model="password" type="password" id="password" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition duration-200" placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg" :disabled="isLoading">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!isLoading" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      <div class="text-center mt-4 space-y-2">
        <RouterLink to="/forgot-password" class="block font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Forgot your password?</RouterLink>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? 
          <RouterLink to="/register" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">Sign up</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const username = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await userStore.login(username.value, password.value)
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>
