<template>
    <div class="mb-6 relative search-container" ref="searchContainerRef">
      <div class="relative">
        <input
          :value="searchQuery"
          @input="handleInput"
          @keydown.down.prevent="navigateSuggestion('down')"
          @keydown.up.prevent="navigateSuggestion('up')"
          @keydown.enter.prevent="selectSuggestionByKeyboard"
          type="text"
          placeholder="Search products..."
          class="w-full bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md pl-10 pr-4 py-2 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
        >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <transition name="fade">
        <ul v-if="suggestions.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
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
  import { ref, watch } from 'vue'
  import { debounce } from 'lodash-es'

  const props = defineProps<{
    searchQuery: string
    suggestions: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void
    (e: 'apply-filters'): void
  }>()

  const selectedSuggestionIndex = ref(-1)
  const searchContainerRef = ref<HTMLElement | null>(null)

  const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    emit('update:searchQuery', value)
    selectedSuggestionIndex.value = -1
    debouncedApplyFilters()
  }

  const selectSuggestion = (suggestion: string) => {
    emit('update:searchQuery', suggestion)
    debouncedApplyFilters()
  }

  const navigateSuggestion = (direction: 'up' | 'down') => {
    if (direction === 'down') {
      selectedSuggestionIndex.value = (selectedSuggestionIndex.value + 1) % props.suggestions.length
    } else {
      selectedSuggestionIndex.value = (selectedSuggestionIndex.value - 1 + props.suggestions.length) % props.suggestions.length
    }
  }

  const selectSuggestionByKeyboard = () => {
    if (selectedSuggestionIndex.value !== -1) {
      selectSuggestion(props.suggestions[selectedSuggestionIndex.value])
    } else {
      debouncedApplyFilters()
    }
  }

  const debouncedApplyFilters = debounce(() => emit('apply-filters'), 300)

  watch(() => props.suggestions, () => {
    selectedSuggestionIndex.value = -1
  })
  </script>

  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>