<template>
    <div class="relative w-full">
      <input
        v-model="searchQuery"
        @input="handleInput"
        @keydown.down.prevent="navigateSuggestion('down')"
        @keydown.up.prevent="navigateSuggestion('up')"
        @keydown.enter.prevent="selectSuggestionByKeyboard"
        @blur="clearSuggestions"
        type="text"
        placeholder="Search products..."
        class="w-full bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md pl-10 pr-4 py-2 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
      >
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      <transition name="fade">
        <ul v-if="showSuggestions && suggestions.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          <li v-for="(suggestion, index) in suggestions" 
              :key="suggestion" 
              @click="selectSuggestion(suggestion)"
              :class="{'bg-indigo-100 dark:bg-indigo-700': index === selectedSuggestionIndex}"
              class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            {{ suggestion }}
          </li>
        </ul>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProductStore } from '@/stores/products'
  import { debounce } from 'lodash-es'
  
  const router = useRouter()
  const productStore = useProductStore()
  
  const searchQuery = ref('')
  const selectedSuggestionIndex = ref(-1)
  const showSuggestions = ref(false)
  
  const suggestions = computed(() => {
    if (!searchQuery.value) return []
    const query = searchQuery.value.toLowerCase()
    return productStore.products
      .filter(product => product.title.toLowerCase().includes(query))
      .map(product => product.title)
      .slice(0, 5)
  })
  
  const handleInput = debounce(() => {
    selectedSuggestionIndex.value = -1
    showSuggestions.value = true
  }, 300)
  
  const navigateSuggestion = (direction: 'up' | 'down') => {
    if (direction === 'down') {
      selectedSuggestionIndex.value = (selectedSuggestionIndex.value + 1) % suggestions.value.length
    } else {
      selectedSuggestionIndex.value = (selectedSuggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
    }
  }
  
  const selectSuggestionByKeyboard = () => {
    if (selectedSuggestionIndex.value !== -1) {
      selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
    } else {
      searchProducts()
    }
  }
  
  const selectSuggestion = (suggestion: string) => {
    searchQuery.value = suggestion
    searchProducts()
  }
  
  const searchProducts = () => {
    router.push({ name: 'products', query: { search: searchQuery.value } })
    clearSuggestions()
  }
  
  const clearSuggestions = () => {
    selectedSuggestionIndex.value = -1
    showSuggestions.value = false
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>