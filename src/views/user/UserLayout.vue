<template>
  <div class="user-layout">
    <UserNavBar />
      <router-view></router-view>
  </div>
</template>

<script setup>
import UserNavBar from '@/components/UserNavBar.vue'
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


</style> 