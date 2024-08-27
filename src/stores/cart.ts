import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<(Product & { quantity: number })[]>([])

  const addToCart = (product: Product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  const getItemQuantity = (productId: number) => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const cartItems = computed(() => items.value)

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  return { items, addToCart, removeFromCart, updateQuantity, getItemQuantity, cartItems, total, itemCount }
})