import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const fetchProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products')
    const data = await response.json()
    products.value = data.map((product: Product) => ({
      ...product,
      images: [product.image, product.image, product.image,product.image, product.image, product.image,product.image, product.image, product.image] // Add dummy images for testing
    }))
  }

  const getProductById = (id: number) => {
    return products.value.find(product => product.id === id)
  }

  return { products, fetchProducts, getProductById }
})
