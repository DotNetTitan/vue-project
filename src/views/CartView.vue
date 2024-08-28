<template>
  <div class="cart min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Your Cart</h1>
      <div v-if="cartStore.cartItems.length > 0">
        <ul class="space-y-4">
          <li v-for="item in cartStore.cartItems" :key="item.id" class="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <img :src="item.image" :alt="item.title" class="w-20 h-20 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6">
            <div class="flex-grow text-center sm:text-left mb-4 sm:mb-0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ item.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400">${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="decreaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded">-</button>
              <span class="w-8 text-center text-gray-800 dark:text-white">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded">+</button>
            </div>
            <button @click="removeItem(item.id)" class="mt-4 sm:mt-0 sm:ml-4 text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        </ul>
        <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg text-gray-700 dark:text-gray-300">Subtotal</span>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <button class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
            <span>Proceed to Checkout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-xl font-semibold mb-2">Your cart is empty</p>
        <p class="mb-4">Looks like you haven't added any items to your cart yet.</p>
        <RouterLink to="/products" class="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
          Start Shopping
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const increaseQuantity = (productId: number) => {
  cartStore.updateQuantity(productId, cartStore.getItemQuantity(productId) + 1)
}

const decreaseQuantity = (productId: number) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  if (currentQuantity > 1) {
    cartStore.updateQuantity(productId, currentQuantity - 1)
  } else {
    removeItem(productId)
  }
}

const removeItem = (productId: number) => {
  cartStore.removeFromCart(productId)
}
</script>
