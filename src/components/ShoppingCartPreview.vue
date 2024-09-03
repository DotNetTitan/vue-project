<template>
    <div v-if="isCartOpen" class="fixed bottom-0 right-0 m-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 transform transition-all duration-300 hover:scale-105">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Shopping Cart</h2>
          <button @click="toggleCart" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul v-if="cartStore.cartItems.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
          <li v-for="item in cartStore.cartItems" :key="item.id" 
              :class="{'bg-indigo-100 dark:bg-indigo-900': item.id === lastAddedProductId}"
              class="flex justify-between items-center p-2 rounded transition-colors duration-500">
            <span class="text-gray-700 dark:text-gray-300">{{ item.title }} (x{{ item.quantity }})</span>
            <span class="text-gray-600 dark:text-gray-400">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-600 dark:text-gray-400 text-center">Your cart is empty</p>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-800 dark:text-white">Total:</span>
            <span class="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <button :disabled="cartStore.cartItems.length === 0" :class="{'opacity-50 cursor-not-allowed': cartStore.cartItems.length === 0}" class="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105">
            Checkout
          </button>
        </div>
      </div>
    </div>
    <button v-else @click="toggleCart" class="fixed bottom-0 right-0 m-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </button>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useCartStore } from '@/stores/cart'
  
  const props = defineProps<{
    isCartOpen: boolean
    lastAddedProductId: number | null
  }>()
  
  const emit = defineEmits<{
    (e: 'update:isCartOpen', value: boolean): void
  }>()
  
  const cartStore = useCartStore()
  
  const toggleCart = () => {
    emit('update:isCartOpen', !props.isCartOpen)
  }
  
  watch(() => props.lastAddedProductId, (newId) => {
    if (newId !== null) {
      setTimeout(() => {
        emit('update:isCartOpen', true)
      }, 0)
    }
  })
  </script>
  
  <style scoped>
  /* Add a smooth transition for the highlight effect */
  .bg-green-100, .dark .bg-green-800 {
    transition: background-color 0.5s ease;
  }
  </style>