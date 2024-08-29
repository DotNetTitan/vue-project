<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-white mb-6">Write a Review for Essence Mascara Lash Princess</h2>
        <form @submit.prevent="submitReview">
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Rating</label>
            <div class="flex space-x-1">
              <button 
                v-for="star in 5" 
                :key="star" 
                type="button"
                @click="rating = star"
                class="text-3xl focus:outline-none"
                :class="star <= rating ? 'text-yellow-400' : 'text-gray-500'"
              >
                ★
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label for="review" class="block text-gray-300 mb-2">Your Review</label>
            <textarea 
              id="review"
              v-model="reviewText"
              rows="4"
              class="w-full px-3 py-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button 
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
          >
            Submit Review
          </button>
          <button 
            @click="$emit('close')"
            type="button"
            class="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const rating = ref(0)
  const reviewText = ref('')
  
  const emit = defineEmits(['close', 'submit-review'])
  
  const submitReview = () => {
    if (rating.value === 0 || reviewText.value.trim() === '') {
      // Show an error message
      return
    }
  
    emit('submit-review', {
      rating: rating.value,
      comment: reviewText.value,
    })
  
    // Reset the form
    rating.value = 0
    reviewText.value = ''
  }
  </script>