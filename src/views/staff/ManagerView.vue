<template>
  <div class="AvaNavContainer">
    <div class="NavLeft">
      <NavContainer
        id="NavContainer"
        title="导航"
      >
        <NavBar v-if="currentRole == 3" />
        <NavBarStaff v-if="currentRole == 4" />
        <NavBarComadmin v-if="currentRole == 2" />
        <NavBar />
        <MiniInfo
          get-user-info-a-p-i="http://localhost:8089/api/sysadmin/user/getUser"
        />
      </NavContainer>
    
      <!-- 控制全局主题按钮 -->
      <SliderButton />
    </div>
    <div class="main-content">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manager/UserManager' }">UserManager</el-breadcrumb-item>
      </el-breadcrumb> -->

      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
/* import { useThemeStore } from '@/stores/themeStore'     */             /* pinia */
import SliderButton from '@/components/widgets/SliderButton.vue'    /* 自定义控件 */
import NavContainer from '@/components/NavContainer.vue'            /* 自定义组件 容器 */
import NavBar from '@/components/NavBar.vue'                        /* 自定义组件 导行条 */
import MiniInfo from '@/components/MiniInfo.vue'                    /* 自定义组件 迷你信息栏 */





export default{
    components:{
        NavContainer,
        NavBar,
        MiniInfo,
        SliderButton
    },
    data(){
      return{
        /* activeIndex : route.path */ // 当前激活的菜单项
      }
    }

}
</script>

<style scoped>
.main-content .slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.main-content .slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

body{
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: all 0.3s ease, color 0.3s ease;
}
.AvaNavContainer{
  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
}
.AvaNavContainer .NavLeft{
    /* border: 1px solid red; */
    /* background-color: rgba(0, 128, 0, 0.452); */
    width: 260px;
    min-width: 260px;
    height: 100vh;
}
.AvaNavContainer .main-content{
    /* background-color: rgba(255, 0, 0, 0.39); */
    height: 100vh;
    position: relative;
    width: 95%;
    right: 0;
}
</style>