<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No products found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria to find what you're looking for.</p>
        <div class="mt-6">
          <button
            @click="$emit('reset-filters')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineEmits } from 'vue'
  
  const emit = defineEmits<{
    (e: 'reset-filters'): void
  }>()
  </script>