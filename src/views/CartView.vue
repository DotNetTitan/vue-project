<template>
  <div class="cart min-h-screen p-4 sm:p-8 bg-gray-900 text-white">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Your Cart</h1>
      <div v-if="cartStore.cartItems.length > 0">
        <ul class="space-y-4">
          <li v-for="item in cartStore.cartItems" :key="item.id" class="bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img :src="item.thumbnail" :alt="item.title" class="w-20 h-20 object-cover rounded-md">
                <div>
                  <h3 class="text-xl font-semibold">{{ item.title }}</h3>
                  <div class="flex items-baseline space-x-2 mt-1">
                    <span class="text-lg font-semibold text-green-400">${{ item.discountedPrice.toFixed(2) }}</span>
                    <span class="text-sm text-gray-500 line-through">${{ item.price.toFixed(2) }}</span>
                    <span class="text-sm text-green-400">
                      {{ ((item.price - item.discountedPrice) / item.price * 100).toFixed(0) }}% off
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="decreaseQuantity(item.id)" class="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300">-</button>
                <span class="text-xl font-semibold px-2">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)" class="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300">+</button>
                <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-300 transition duration-300 ml-4">
                  Remove
                </button>
              </div>
            </div>
            <div class="mt-4 text-right">
              <p class="text-sm text-gray-400">Total: ${{ (item.price * item.quantity).toFixed(2) }}</p>
              <p class="text-sm text-green-400">
                Savings: ${{ ((item.price - item.discountedPrice) * item.quantity).toFixed(2) }}
              </p>
              <p class="text-sm text-white">Discounted Total: ${{ (item.discountedPrice * item.quantity).toFixed(2) }}</p>
            </div>
          </li>
        </ul>
        <div class="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xl">Subtotal</span>
            <span class="text-xl font-semibold">${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-xl">Discounted Subtotal</span>
            <span class="text-xl font-semibold text-white">${{ cartStore.discountedSubtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center mb-6 text-green-400 font-semibold">
            <span class="text-xl">Total Savings</span>
            <span class="text-xl">${{ cartStore.totalSavings.toFixed(2) }}</span>
          </div>
          <button class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
            <span class="text-lg font-semibold">Proceed to Checkout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 bg-gray-800 p-8 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

<style scoped>
.text-green-400 {
  color: #4ade80;
}
.text-gray-500 {
  color: #6b7280;
}
.bg-gray-700 {
  background-color: #374151;
}
.bg-gray-800 {
  background-color: #1f2937;
}
.bg-gray-900 {
  background-color: #111827;
}
</style>
