import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<(Product & { quantity: number, discountedPrice: number })[]>([])

  const getDiscountedPrice = (product: Product) => {
    return product.price * (1 - product.discountPercentage / 100)
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({ 
        ...product, 
        quantity,
        discountedPrice: getDiscountedPrice(product)
      })
    }
  }

  const removeFromCart = (productId: number) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const removeOneFromCart = (productId: number) => {
    const existingItem = cartItems.value.find(item => item.id === productId)
    if (existingItem) {
      existingItem.quantity--
      if (existingItem.quantity === 0) {
        removeFromCart(productId)
      }
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  const getItemQuantity = (productId: number) => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const getCartItem = (productId: number) => {
    return cartItems.value.find(item => item.id === productId)
  }

  const total = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const discountedTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0)
  })

  const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalSavings = computed(() => {
    return total.value - discountedTotal.value
  })

  return { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    removeOneFromCart,
    updateQuantity, 
    getItemQuantity,
    getCartItem,
    total, 
    discountedTotal,
    totalSavings,
    itemCount 
  }
})