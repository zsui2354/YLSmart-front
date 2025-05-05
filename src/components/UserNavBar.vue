<template>
  <div class="nav-bar-wrapper">
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      class="el-menu-demo"
      background-color="#f5f5f5"
      text-color="#333"
      active-text-color="#2196f3"
      @select="handleSelect"
    >
      <el-menu-item index="home">
        首页
      </el-menu-item>
      <el-sub-menu index="health">
        <template #title>
          健康
        </template>
        <el-menu-item index="health-index">
          健康指标
        </el-menu-item>
        <el-menu-item index="health-files">
          健康档案
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="service">
        <template #title>
          服务
        </template>
        <el-menu-item index="nursinghome">
          服务机构
        </el-menu-item>
        <el-menu-item index="service-list">
          服务列表
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="activity">
        <template #title>
          活动
        </template>
        <el-menu-item index="activity-list">
          活动列表
        </el-menu-item>
        <el-menu-item index="activity-registration">
          活动报名
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="comment">
        评论
      </el-menu-item>
    </el-menu>
    <div class="nav-bar-avatar" @click="showUserDialog = true" style="cursor:pointer;">
      <el-avatar :size="36" :src="avatarUrl" />
    </div>
    <el-dialog v-model="showUserDialog" title="个人信息设置" width="400px" :close-on-click-modal="false">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px" size="large">
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="userForm.real_name" maxlength="10" show-word-limit placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" maxlength="11" show-word-limit placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="userForm.avatar" placeholder="请输入头像URL或上传" />
        </el-form-item>
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="userForm.old_password" type="password" maxlength="20" show-word-limit placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="userForm.new_password" type="password" maxlength="20" show-word-limit placeholder="请输入新密码（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="display:flex;justify-content:space-between;width:100%;">
          <el-button type="danger" @click="logout">退出登录</el-button>
          <div>
            <el-button @click="showUserDialog = false" style="margin-right:12px;">取消</el-button>
            <el-button type="primary" @click="submitUserInfo" :loading="savingUser">保存</el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.name || 'home')

const avatarUrl = ref('')
const showUserDialog = ref(false)
const userForm = ref({
  password: '',
  real_name: '',
  phone: '',
  avatar: '',
  role_id: 1,
  status: 1
})
const userFormRef = ref()
const savingUser = ref(false)
const userRules = {
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: []
}

async function fetchUserInfo() {
  try {
    const res = await axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
      headers: {
        'Authorization': `${localStorage.getItem('yltoken')}`
      }
    })
    if (res.data) {
      userForm.value.real_name = res.data.real_name || ''
      userForm.value.phone = res.data.phone || ''
      userForm.value.avatar = res.data.avatar || ''
      userForm.value.role_id = res.data.role_id || 1
      userForm.value.status = res.data.status || 1
    }
  } catch (e) {
    // do nothing
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
      headers: {
        'Authorization': `${localStorage.getItem('yltoken')}`
      }
    })
    if (res.data.avatar) {
      avatarUrl.value = 'http://localhost:8089' + res.data.avatar
    }
    if (res.data) {
      userForm.value.real_name = res.data.real_name || ''
      userForm.value.phone = res.data.phone || ''
      userForm.value.avatar = res.data.avatar || ''
      userForm.value.role_id = res.data.role_id || 1
      userForm.value.status = res.data.status || 1
    }
  } catch (e) {
    avatarUrl.value = ''
  }
})

// 处理菜单选择
function handleSelect(key) {
  switch (key) {
    case 'home':
      router.push('/user/home')
      break
    case 'health-index':
      router.push('/user/healthIndex')
      break
    case 'health-files':
      router.push('/user/healthFiles')
      break
    case 'nursinghome':
      router.push('/user/serviceNursinghome')
      break
    case 'service-list':
      router.push('/user/serviceList')
      break
    case 'activity-list':
      router.push('/user/activityList')
      break
    case 'activity-registration':
      router.push('/user/activityRegistration')
      break
    case 'comment':
      router.push('/user/comment')
      break
  }
}

// 退出登录
function logout() {
  localStorage.setItem('yltoken', '')
  router.push('/')
}

const submitUserInfo = () => {
  userFormRef.value.validate(async (valid) => {
    if (!valid) return
    savingUser.value = true
    try {
      // 1. 获取用户信息
      const res = await axios.get('http://localhost:8089/api/user/user/getuserinfo', {
        headers: {
          token: `${localStorage.getItem('yltoken')}`
        }
      })
      // 2. 校验旧密码
      if (userForm.value.old_password !== res.data.password) {
        ElMessage.error('旧密码错误')
        savingUser.value = false
        return
      }
      // 3. 构造提交数据
      const postData = {
        real_name: userForm.value.real_name,
        phone: userForm.value.phone,
        avatar: userForm.value.avatar,
        role_id: userForm.value.role_id,
        status: userForm.value.status
      }
      if (userForm.value.new_password) {
        postData.password = userForm.value.new_password
      }
      await axios.post('http://localhost:8089/api/user/user/setuserinfo', postData, {
        headers: {
          token: `${localStorage.getItem('yltoken')}`
        }
      })
      ElMessage.success('保存成功')
      showUserDialog.value = false
      fetchUserInfo()
      window.dispatchEvent(new Event('user-info-updated'))
    } catch (e) {
      ElMessage.error(e.response?.data?.message || '保存失败')
    } finally {
      savingUser.value = false
    }
  })
}
</script>

<style scoped>
.nav-bar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f5f5f5;
  height: 60px;
  position: relative;
}

.el-menu-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  width: 100%;
}

.nav-bar-avatar {
  position: absolute;
  right: 32px;
  top: 12px;
  display: flex;
  align-items: center;
}

.logout-btn-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;

}

.logout-btn {
  color: #333;
  font-size: 14px;
}

.logout-menu-item {
  margin-top: auto;
  color: #f56c6c;
}

.logout-menu-item:hover {
  color: #f56c6c;
  background-color: #fef0f0;
}

.logout-menu-item .el-icon {
  margin-right: 8px;
}

.el-menu-item {
  max-width: none !important;
  width: auto !important;
  text-overflow: unset !important;
  white-space: normal !important;
  overflow: visible !important;
}

.el-dialog__body {
  padding-top: 10px;
  padding-bottom: 0;
}
.el-form-item {
  margin-bottom: 18px;
}
.dialog-footer {
  padding: 10px 0 0 0;
}
</style> 