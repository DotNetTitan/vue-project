<template>
    <div class="mb-6 relative">
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown.down.prevent="navigateSuggestion('down')"
        @keydown.up.prevent="navigateSuggestion('up')"
        @keydown.enter.prevent="selectSuggestionByKeyboard"
        placeholder="Search products..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
      <ul v-if="showSuggestions && suggestions.length > 0" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedSuggestionIndex = index"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-100 dark:bg-gray-700': index === selectedSuggestionIndex }"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue'
  const selectedSuggestionIndex = ref(-1)
  const props = defineProps<{
    modelValue: string
    suggestions: string[]
    showSuggestions: boolean
    selectedSuggestionIndex: number
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'input'): void
    (e: 'select-suggestion', suggestion: string): void
    (e: 'navigate-suggestion', direction: 'up' | 'down'): void
    (e: 'select-suggestion-by-keyboard'): void
  }>()
  
  const selectSuggestion = (suggestion: string) => {
    emit('select-suggestion', suggestion)
  }
  
  const navigateSuggestion = (direction: 'up' | 'down') => {
    emit('navigate-suggestion', direction)
  }
  
  const selectSuggestionByKeyboard = () => {
    emit('select-suggestion-by-keyboard')
  }
  </script>