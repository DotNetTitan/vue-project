import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: true, // Set default to true
  }),
  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false')
      document.documentElement.classList.toggle('dark', this.isDarkMode)
    },
    initDarkMode() {
      const savedMode = localStorage.getItem('darkMode')
      if (savedMode !== null) {
        this.isDarkMode = savedMode === 'true'
      } else {
        // If no saved preference, default to dark mode
        this.isDarkMode = true
      }
      document.documentElement.classList.toggle('dark', this.isDarkMode)
    },
  },
})
