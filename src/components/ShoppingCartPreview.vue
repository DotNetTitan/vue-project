<template>
    <div
      class="fixed inset-y-0 right-0 max-w-full flex z-50"
      :class="{ 'pointer-events-none': !isCartOpen }"
    >
      <transition
        enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="isCartOpen" class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-scroll">
            <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Shopping cart</h2>
                <div class="ml-3 h-7 flex items-center">
                  <button
                    @click="$emit('toggle-cart')"
                    class="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Close panel</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
  
              <div class="mt-8">
                <div class="flow-root">
                  <ul role="list" class="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                    <li v-for="item in cartItems" :key="item.id" class="py-6 flex">
                      <div class="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                        <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-center object-cover">
                      </div>
  
                      <div class="ml-4 flex-1 flex flex-col">
                        <div>
                          <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                            <h3>
                              <a href="#">{{ item.title }}</a>
                            </h3>
                            <p class="ml-4">${{ (item.price * item.quantity).toFixed(2) }}</p>
                          </div>
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ item.brand }}</p>
                        </div>
                        <div class="flex-1 flex items-end justify-between text-sm">
                          <p class="text-gray-500 dark:text-gray-400">Qty {{ item.quantity }}</p>
  
                          <div class="flex">
                            <button @click="removeItem(item.id)" type="button" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Remove</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
  
            <div class="border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6">
              <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Subtotal</p>
                <p>${{ total.toFixed(2) }}</p>
              </div>
              <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
              <div class="mt-6">
                <a
                  @click="$emit('checkout')"
                  href="#"
                  class="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Checkout
                </a>
              </div>
              <div class="mt-6 flex justify-center text-sm text-center text-gray-500 dark:text-gray-400">
                <p>
                  or
                  <button
                    @click="$emit('toggle-cart')"
                    type="button"
                    class="text-indigo-600 font-medium hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import type { Product } from '@/types/product'

  defineProps<{
    isCartOpen: boolean
    cartItems: Array<Product & { quantity: number }>
    total: number
    lastAddedProductId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'toggle-cart'): void
    (e: 'checkout'): void
  }>()

  const removeItem = (productId: number) => {
    // Implement the logic to remove an item from the cart
    // This could involve emitting an event to the parent component
    // or calling a method from a store if you're using one
    console.log('Remove item:', productId)
  }
  </script>