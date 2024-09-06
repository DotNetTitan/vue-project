<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
      <div v-if="userStore.user" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center space-x-6 mb-4">
          <img :src="userStore.user.image" alt="Profile picture" class="w-24 h-24 rounded-full">
          <div>
            <h2 class="text-2xl font-bold">{{ userStore.user.firstName }} {{ userStore.user.lastName }}</h2>
            <p class="text-gray-600 dark:text-gray-400">@{{ userStore.user.username }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-2">Personal Information</h3>
            <p><strong>Email:</strong> {{ userStore.user.email }}</p>
            <p><strong>Gender:</strong> {{ userStore.user.gender }}</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Account Information</h3>
            <p><strong>User ID:</strong> {{ userStore.user.id }}</p>
            <!-- Add more user information as needed -->
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <p class="text-xl">Please log in to view your profile.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useUserStore } from '@/stores/user'
  
  const userStore = useUserStore()
  </script>