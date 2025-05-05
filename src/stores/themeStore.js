// src/stores/themeStore.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    toggleTheme() {
      console.log('切换主题')
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      document.documentElement.setAttribute('data-theme', this.theme)
      document.documentElement.classList.toggle('dark',this.theme === 'dark')
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme')
      this.theme = savedTheme || 'light'
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})

