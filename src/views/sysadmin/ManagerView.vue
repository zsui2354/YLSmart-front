<template>
  <div
    v-if="currentRole != 1"
    class="AvaNavContainer"
  >
    <div class="NavLeft">
      <NavContainer
        id="NavContainer"
        title="导航"
      >
        <NavBar v-if="currentRole == 3" />
        <NavBarStaff v-if="currentRole == 4" />
        <NavBarComadmin v-if="currentRole == 2" />
		
		
        <MiniInfo
          get-user-info-a-p-i="http://localhost:8089/api/sysadmin/user/getUser"
        />
      </NavContainer>
      
      <!-- 控制全局主题按钮 -->
      <SliderButton />
    </div>
    <div class="main-content">
      <!-- <el-breadcrumb separator="/" class="breadcrumb-center">
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
  <div v-if="currentRole == 1">
    {{ redirectToUserHome() }}
  </div>
</template>

<script>
import SliderButton from '@/components/widgets/SliderButton.vue'
import NavContainer from '@/components/NavContainer.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarStaff from '@/components/NavBarStaff.vue'
import NavBarComadmin from '@/components/NavBarComadmin.vue'
import MiniInfo from '@/components/MiniInfo.vue'
import axios from 'axios'

export default {
  components: {
    NavContainer,
    NavBar,
    MiniInfo,
	NavBarComadmin,
	NavBarStaff,
    SliderButton
  },
  data() {
    return {
      currentRole: null
    }
  },
  mounted() {
    this.getUserInfoAPI()
  },
  watch: {
    currentRole(newRole) {
      if (newRole === 1) {
        this.$router.push('/user/home')
      }
    }
  },
  methods: {
    getUserInfoAPI() {
      console.log('接口' + this.GetUserInfoAPI)
      console.log(localStorage.getItem('yltoken'))
      axios.get(`http://localhost:8089/api/sysadmin/user/getUser`, {
        headers: {
          'Authorization': `${localStorage.getItem('yltoken')}`
        }
      })
      .then(res => {
        console.log("获取当前用户信息 :", res.data)
        this.currentRole = res.data.role_id // 假设后端返回字段为 role
      })
      .catch(err => {
        console.error("获取用户信息失败：", err)
      })
    },
    redirectToUserHome() {
      this.$router.push('/user/home')
    }
  }
}
</script>

<style scoped>
.main-content .slide-fade-enter-active, .main-content .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.main-content .slide-fade-enter, .main-content .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease, color 0.3s ease;
}

.AvaNavContainer {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
}

.AvaNavContainer .NavLeft {
  width: 260px;
  min-width: 260px;
  height: 100vh;
}

.AvaNavContainer .main-content {
  height: 100vh;
  position: relative;
  width: 95%;
  right: 0;
}

.breadcrumb-center {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>