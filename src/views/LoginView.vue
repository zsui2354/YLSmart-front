<template>
  <div
    class="loginContainer"
    :style="{
      backgroundcolor: `#c9d6ff`,
      background: `linear-gradient(${direction}deg , #e1d5e2, #c9d6ff)`
    }"
  >
    <div
      id="container"
      ref="container"
      class="container"
    >
      <div class="form-container sign-up">
        <form>
          <h1
            class="wd"
            _msttexthash="11937653"
            _msthash="1"
          >
            新用户注册
          </h1>
          <input 
            type="text"
            placeholder="用户ID"
            v-model="form.username"
          >
          <input 
            type="text"
            placeholder="用户密码"
            v-model="form.password"
          >
          <input
            type="text"
            placeholder="昵称"
            _mstplaceholder="43069"
            _msthash="3"
            v-model="form.real_name"
          >
          <input
            type="email"
            placeholder="联系电话或电子邮箱"
            _mstplaceholder="58058"
            _msthash="4"
            v-model="form.phone"
          >
<!--           <select id="user-select" v-model="selectedUserId" class="selectRole">
            <option value="3">系统超级管理员</option>
            <option value="2">社区管理员</option>
            <option value="4">服务人员</option>
            <option value="1">普通用户</option>
          </select> -->
          <!-- <p>选中的角色 ID: {{ selectedUserId }}</p> -->

          <el-select
            v-model="selectedUserId"
            placeholder="请选择角色"
            size="small"
            style="width: 200px"
            class="selectRole"
          >
            <el-option label="系统超级管理员" value="3" />
            <el-option label="社区管理员" value="2" />
            <el-option label="服务人员" value="4" />
            <el-option label="普通用户" value="1" />
          </el-select>



          <!-- 
           "username": "",
      "password": "",
      "real_name": "",
      "phone": "",
      "avatar": "",
      "role_id": 1,
      "status": 1,
      "created_at": "2025-04-25 09:45:06"
          -->
          <button
            _msttexthash="6479161"
            _msthash="6"
            @click="registerAccount"
          >
            立即注册
          </button>
        </form>
      </div>
      <div class="form-container sign-in">
        <form>
          <h1
            class="wd"
            _msttexthash="5298241"
            _msthash="7"
          >
            登录
          </h1>
          <input
            v-model="username"
            type="text"
            placeholder="账户ID"
            _mstplaceholder="58058"
            _msthash="9"
          >
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            _mstplaceholder="117572"
            _msthash="10"
          >
          <a
            href="#"
            _msttexthash="22033817"
            _msthash="11"
          >忘记密码？</a>
          <button
            _msttexthash="5298241"
            _msthash="12"
            @click="loginAuth(username,password)"
          >
            登录
          </button>
        </form>
      </div>
      <div class="toggle-container">
        <div
          class="toggle"
          :style="{
            background: `linear-gradient(${direction}deg,rgb(70, 195, 199) , rgb(58, 118, 187))`
          }"
        >
          <div class="toggle-panel toggle-left">
            <h1
              _msttexthash="21702421"
              _msthash="13"
            >
              欢迎回来！
            </h1>
            <p>已经有账户？ 请在这里登录</p>
            <ul class="service-list">
              <li>每日健康数据查看</li>
              <li>护理计划更新</li>
              <li>在线预约服务</li>
            </ul>
            <button
              id="login"
              class="hidden"
              _msttexthash="5298241"
              _msthash="15"
              @click="showLogin"
            >
              登录
            </button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1
              _msttexthash="24009713"
              _msthash="16"
            >
              新用户注册？
            </h1>
            <p>加入我们老玩童社区，共同守护长辈的幸福晚年</p>
            <ul class="service-list">
              <li>健康监测</li>
              <li>专业护理团队</li>
              <li>个性化服务定制</li>
            </ul>
            <button
              id="register"
              class="hidden"
              _msttexthash="6479161"
              _msthash="18"
              @click="showRegister"
            >
              立即注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, h } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'


const direction = ref(0)
const username = ref('')
const password = ref('')
const container = ref(null)
let intervalId = null
const selectedUserId = ref('1')


// 表单数据，包括 role_id
const form = ref({
  username: '',
  password: '',
  real_name: '',
  phone: '',
  avatar: '/files/avatar.jpg',
  role_id: selectedUserId
})


const router = useRouter()

/* 登录成功 MessageBox */
    const loginSuccessful = () => {
        ElNotification({
            title: '登录成功',
            message: h('i', { style: 'color: green' }, '欢迎回来！'),
        })
    }

    const loginFailed = () => {
        ElNotification({
            title: '登录失败',
            message: h('i', { style: 'color: red' }, '账户或密码不正确'),
        })
    }

    const registerSuccessful = () => {
        ElNotification({
            title: '注册成功',
            message: h('i', { style: 'color: green' }, '欢迎加入 乐龄云智坊~'),
        })
    }

    const registerFailed = () => {
        ElNotification({
            title: '注册失败',
            message: h('i', { style: 'color: red' }, '用户ID 冲突'),
        })
    }

/* 登录和注册的样式变化 */
    const showRegister = () => {
    container.value.classList.add('active')
    }
    const showLogin = () => {
    container.value.classList.remove('active')
    }

/* 渐变轮转效果控制 */
    const startdirectionloop = () => {
    intervalId = setInterval(() => {
        direction.value = (direction.value + 1) % 360
    }, 16) // 每 16ms 更新一次，约 60fps
    }

/* 登录授权 CALL API */
    const loginAuth = (username , password) => {
    event.preventDefault()
    axios.post('http://localhost:8089/publicapi/auth', {
        username: username,
        password: password
    })
    .then(response => {
        console.log('返回 token :', response.data)
        const token = response.data.token
        localStorage.setItem('yltoken', token)
        loginSuccessful()
        router.push('/manager')
    })
    .catch(error => {
        console.error('授权验证失败 :', error)
        localStorage.setItem('yltoken', '')
        loginFailed()
    })
    }

/* 注册账户 CALL API */
const registerAccount = (event) => {
    event.preventDefault()
    // 注册逻辑可以后续完善

      axios.post('http://localhost:8089/publicapi/register',form.value)
      .then( res => {
        console.log(res.data)

        console.log(form.value.username, form.value.password)
        

        loginAuth(form.value.username, form.value.password)

        registerSuccessful()
      })
      .catch(error=>{
        console.log(error.data)
        registerFailed()
      })
    }

/* 验证token 是否有效 CALL API*/
    const tokenSend = () => {
    const token = localStorage.getItem('yltoken')
    axios.post(
        'http://localhost:8089/publicapi/verify/routerverify',
        {},
        {
        headers: {
            Authorization: `${token}`
        }
        }
    )
    .then(res => {
        console.log('验证成功：', res.data)
        if (res.data) {
        router.push('/manager') // 使用 useRouter 跳转
        }
    })
    .catch(err => {
        console.error('验证失败：', err)
    })
    }


/* 挂载生命周期 */
    onMounted(() => {
    startdirectionloop()
    tokenSend()
    
    })

/* 析构声明周期之前 释放定时器 */
    onBeforeUnmount(() => {
    clearInterval(intervalId)
    })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

/* *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}
body{
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e1d5e2, #c9d6ff);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
} */
.loginContainer{
    /* background-color: #c9d6ff;
    background: linear-gradient(to right, #e1d5e2, #c9d6ff); */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
}
.container{
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
}
.container p{
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}
.container .wd{
    color: rgb(70, 195, 199);
}
.container span{
    font-size: 12px;
}
.container a{
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
}
.container button{
    background-color: rgb(70, 169, 199);
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}
.container button.hidden{
    background-color: transparent;
    border-color: #fff;
}
.container form{
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}
.container input{
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}
.form-container{
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}
.sign-in{
    left: 0;
    width: 50%;
    z-index: 2;
}
.container.active .sign-in{
    transform: translateX(100%);
}
.sign-up{
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
}
.container.active .sign-up{
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
}
@keyframes move{
    0%, 49.99%{
        opacity: 0;
        z-index: 1;
    }
    50%, 100%{
        opacity: 1;
        z-index: 5;
    }
}
.social-icons{
    margin: 20px 0;
}
.social-icons a{
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
}
.toggle-container{
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 100px 0 0 100px;
    z-index: 1000;
}
.container.active .toggle-container{
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
}
.toggle{
    background-color: #512da8;
    height: 100%;

    /* 
    rgb(70, 195, 199)
    
    */
    background: linear-gradient(to right,rgb(70, 195, 199) , rgb(58, 118, 187));
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}
.container.active .toggle{
    transform: translateX(50%);
}
.toggle-panel{
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}
.toggle-left{
    transform: translateX(-200%);
}
.container.active .toggle-left{
    transform: translateX(0);
}
.toggle-right{
    right: 0;
    transform: translateX(0);
}
.container.active .toggle-right{
    transform: translateX(200%);
}
.service-list {
    list-style: none;
    margin: 20px 0;
    text-align: left;
}
.service-list li {
    margin: 10px 0;
    padding-left: 25px;
    position: relative;
}
.service-list li::before {
    content: "✔";
    color: #00ff00;
    position: absolute;
    left: 0;
}
.selectRole{
  margin: 10px 0;
}
</style>