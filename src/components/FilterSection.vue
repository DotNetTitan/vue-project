<template>
    <div class="md:w-1/4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Filters</h2>
        <div class="space-y-6">
          <!-- Filter toggles -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="filter in availableFilters"
              :key="filter.id"
              @click="toggleFilter(filter.id)"
              :class="{'bg-indigo-600 text-white': filter.active, 'bg-gray-200 text-gray-700': !filter.active}"
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
            >
              {{ filter.label }}
            </button>
          </div>
  
          <!-- Category filter -->
          <div v-if="availableFilters.find(f => f.id === 'category')?.active">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Categories</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                @click="toggleCategory(category)"
                :class="{'bg-indigo-600 text-white': selectedCategories.includes(category), 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': !selectedCategories.includes(category)}"
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
              >
                {{ category }}
              </button>
            </div>
          </div>
  
          <!-- Price range filter -->
          <div v-if="availableFilters.find(f => f.id === 'price')?.active">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Price Range</h3>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">${{ minPrice }}</span>
              <input
                type="range"
                id="priceRange"
                v-model="maxPrice"
                :min="0"
                :max="maxProductPrice"
                :step="1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                @input="updatePriceRange"
              >
              <span class="text-sm text-gray-600 dark:text-gray-400">${{ maxPrice }}</span>
            </div>
          </div>
  
          <!-- Rating filter -->
          <div v-if="availableFilters.find(f => f.id === 'rating')?.active">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Minimum Rating</h3>
            <div class="flex items-center">
              <div class="flex items-center space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="setMinRating(star)"
                  class="focus:outline-none"
                >
                  <svg
                    :class="{'text-yellow-400': star <= minRating, 'text-gray-300 dark:text-gray-600': star > minRating}"
                    class="w-8 h-8 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 ml-3">
                {{ minRating === 0 ? 'Any rating' : `${minRating}+ stars` }}
              </p>
            </div>
          </div>
  
          <!-- Sort filter -->
          <div v-if="availableFilters.find(f => f.id === 'sort')?.active">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Sort By</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                @click="updateSortBy(option.value)"
                :class="{'bg-indigo-600 text-white': sortBy === option.value, 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': sortBy !== option.value}"
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-indigo-500 hover:text-white flex items-center"
              >
                <span class="mr-1">{{ option.icon }}</span>
                {{ option.label }}
              </button>
            </div>
          </div>
  
          <div class="flex space-x-2 mt-4">
            <button @click="applyFilters" class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105">
              Apply Filters
            </button>
            <button @click="resetFilters" class="flex-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const props = defineProps<{
    categories: string[]
    maxProductPrice: number
    selectedCategories: string[]
    minRating: number // Add this prop
  }>()
  
  const emit = defineEmits<{
    (e: 'update:selectedCategories', value: string[]): void
    (e: 'update:minPrice', value: number): void
    (e: 'update:maxPrice', value: number): void
    (e: 'update:minRating', value: number): void
    (e: 'update:sortBy', value: string): void
    (e: 'applyFilters'): void
    (e: 'resetFilters'): void
  }>()
  
  const selectedCategories = ref(props.selectedCategories)
  const minPrice = ref(0)
  const maxPrice = ref(props.maxProductPrice)
  const minRating = ref(props.minRating)
  const sortBy = ref('default')
  
  const availableFilters = ref([
    { id: 'category', label: 'Category', active: true },
    { id: 'price', label: 'Price Range', active: true },
    { id: 'rating', label: 'Minimum Rating', active: true },
    { id: 'sort', label: 'Sort By', active: true }
  ])
  
  const sortOptions = ref([
    { value: 'default', label: 'Default', icon: '⇅' },
    { value: 'priceLowToHigh', label: 'Price: Low to High', icon: '↑' },
    { value: 'priceHighToLow', label: 'Price: High to Low', icon: '↓' },
    { value: 'rating', label: 'Rating', icon: '⭐' }
  ])
  
  const toggleFilter = (filterId: string) => {
    const filter = availableFilters.value.find(f => f.id === filterId)
    if (filter) {
      filter.active = !filter.active
    }
  }
  
  const toggleCategory = (category: string) => {
    const index = selectedCategories.value.indexOf(category)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(category)
    }
    emit('update:selectedCategories', selectedCategories.value)
  }
  
  const updatePriceRange = () => {
    emit('update:minPrice', minPrice.value)
    emit('update:maxPrice', maxPrice.value)
  }
  
  const setMinRating = (rating: number) => {
    minRating.value = minRating.value === rating ? 0 : rating
    emit('update:minRating', minRating.value)
  }
  
  const updateSortBy = (value: string) => {
    sortBy.value = value
    emit('update:sortBy', value)
  }
  
  const applyFilters = () => {
    emit('applyFilters')
  }
  
  const resetFilters = () => {
    selectedCategories.value = []
    minPrice.value = 0
    maxPrice.value = props.maxProductPrice
    minRating.value = 0
    sortBy.value = 'default'
    availableFilters.value.forEach(filter => filter.active = true)
    emit('update:selectedCategories', selectedCategories.value)
    emit('update:minPrice', minPrice.value)
    emit('update:maxPrice', maxPrice.value)
    emit('update:minRating', minRating.value)
    emit('update:sortBy', sortBy.value)
    emit('resetFilters')
  }
  </script>