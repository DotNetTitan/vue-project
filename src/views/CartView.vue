<template>
  <div class="cart min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
      <div v-if="cartStore.cartItems.length > 0">
        <ul class="space-y-4">
          <li v-for="item in cartStore.cartItems" :key="item.id" class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div>
              <span class="text-gray-800 dark:text-white">{{ item.title }}</span>
              <span class="text-gray-600 dark:text-gray-400 ml-2">${{ item.price.toFixed(2) }}</span>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Rating: {{ item.rating.rate.toFixed(1) }} ({{ item.rating.count }} reviews)
              </div>
            </div>
            <div class="flex items-center">
              <button @click="decreaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">-</button>
              <span class="mx-2 text-gray-800 dark:text-white">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">+</button>
            </div>
          </li>
        </ul>
        <div class="mt-8 text-right">
          <p class="text-xl font-bold text-gray-800 dark:text-white">Total: ${{ cartStore.total.toFixed(2) }}</p>
          <button class="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Proceed to Checkout</button>
        </div>
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400">
        Your cart is empty.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
