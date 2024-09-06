import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Login error response:', errorData)
        throw new Error(errorData.message || 'Login failed')
      }
      const data = await response.json()
      user.value = data
      isAuthenticated.value = true
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000))
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Authentication failed')
        }
        const data = await response.json()
        user.value = { ...data, token }
        isAuthenticated.value = true
      } catch (error) {
        console.error('Authentication error:', error)
        logout()
      }
    }
  }

  return { user, isAuthenticated, login, logout, checkAuth }
})
