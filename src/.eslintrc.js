    module.exports = {
        extends: [
        'plugin:vue/vue3-recommended' // 确保你的 ESLint 配置使用了 Vue 插件
        ],
        globals: {
        defineProps: 'readonly',      // 声明 defineProps 为只读全局变量
        defineEmits: 'readonly',      // 声明 defineEmits 为只读全局变量
        defineExpose: 'readonly',     // 声明 defineExpose 为只读全局变量
        withDefaults: 'readonly'      // 声明 withDefaults 为只读全局变量
        },
    }
    