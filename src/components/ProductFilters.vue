<template>
    <div class="md:w-1/4 mb-8 md:mb-0">
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>
      <div class="space-y-4">
        <div v-for="filter in availableFilters" :key="filter.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex justify-between items-center">
            {{ filter.label }}
            <button @click="toggleFilter(filter.id)" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              {{ filter.active ? 'Hide' : 'Show' }}
            </button>
          </h3>
          <div v-if="filter.active">
            <template v-if="filter.id === 'category'">
              <div v-for="category in categories" :key="category" class="flex items-center mb-2">
                <input
                  :id="category"
                  type="checkbox"
                  :checked="selectedCategories.includes(category)"
                  @change="toggleCategory(category)"
                  class="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                >
                <label :for="category" class="ml-2 text-gray-700 dark:text-gray-300">{{ category }}</label>
              </div>
            </template>
            <template v-else-if="filter.id === 'price'">
              <div class="mb-4">
                <label for="minPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
                <input
                  id="minPrice"
                  v-model="minPrice"
                  type="number"
                  min="0"
                  :max="maxPrice"
                  @input="updatePriceRange"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
              </div>
              <div>
                <label for="maxPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
                <input
                  id="maxPrice"
                  v-model="maxPrice"
                  type="number"
                  :min="minPrice"
                  :max="maxProductPrice"
                  @input="updatePriceRange"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
              </div>
            </template>
            <template v-else-if="filter.id === 'rating'">
              <div class="flex items-center space-x-2">
                <template v-for="i in 5" :key="i">
                  <button @click="setMinRating(i)" class="focus:outline-none">
                    <svg
                      :class="{'text-yellow-400': i <= minRating, 'text-gray-300 dark:text-gray-600': i > minRating}"
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </template>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ minRating }} stars & up</span>
              </div>
            </template>
            <template v-else-if="filter.id === 'sort'">
              <select
                v-model="sortBy"
                @change="$emit('set-sort-by', sortBy)"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }} {{ option.icon }}
                </option>
              </select>
            </template>
          </div>
        </div>
      </div>
      <div class="mt-6 space-y-4">
        <button @click="$emit('apply-filters')" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
          Apply Filters
        </button>
        <button @click="$emit('reset-filters')" class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">
          Reset Filters
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    availableFilters: Array<{ id: string; label: string; active: boolean }>
    categories: string[]
    selectedCategories: string[]
    minPrice: number
    maxPrice: number
    maxProductPrice: number
    minRating: number
    sortBy: string
    sortOptions: Array<{ value: string; label: string; icon: string }>
  }>()
  
  const emit = defineEmits<{
    (e: 'toggle-filter', filterId: string): void
    (e: 'toggle-category', category: string): void
    (e: 'update-price-range'): void
    (e: 'set-min-rating', rating: number): void
    (e: 'set-sort-by', sortBy: string): void
    (e: 'apply-filters'): void
    (e: 'reset-filters'): void
  }>()
  
  const toggleFilter = (filterId: string) => {
    emit('toggle-filter', filterId)
  }
  
  const toggleCategory = (category: string) => {
    emit('toggle-category', category)
  }
  
  const updatePriceRange = () => {
    emit('update-price-range')
  }
  
  const setMinRating = (rating: number) => {
    emit('set-min-rating', rating)
  }
  </script>