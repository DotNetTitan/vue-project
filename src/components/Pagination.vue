<template>
    <div class="flex items-center justify-center space-x-2 mt-8">
      <button
        @click="$emit('prev-page')"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
        :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
      >
        Previous
      </button>
      
      <template v-for="(page, index) in displayedPages" :key="index">
        <button
          v-if="typeof page === 'number'"
          @click="$emit('go-to-page', page)"
          class="px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
          :class="currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 py-2 text-gray-500">{{ page }}</span>
      </template>
      
      <button
        @click="$emit('next-page')"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
        :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    currentPage: number
    totalPages: number
    displayedPages: Array<number | string>
  }>()
  
  const emit = defineEmits<{
    (e: 'prev-page'): void
    (e: 'next-page'): void
    (e: 'go-to-page', page: number): void
  }>()
  </script>