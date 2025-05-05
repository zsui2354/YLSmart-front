<template>
  <button @click="onToggleTheme">
    切换主题（当前：{{ theme }}）
  </button>
</template>
    
    <script>
    import { useThemeStore } from '@/stores/themeStore'
    
    export default {
        name: 'ThemeToggleButton',
        data() {
        return {
            themeStore: useThemeStore()
        }
        },
        computed: {
        theme() {
            return this.themeStore.theme
        }
        },
        methods: {
        onToggleTheme() {
            console.log('点击按钮，准备切换主题')
            this.themeStore.toggleTheme()
        }
        }
    }
    </script>
    