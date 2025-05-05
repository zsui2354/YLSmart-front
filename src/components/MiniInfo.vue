<template>
  <div class="MiniInfo">
    <div id="Ava">
      <div id="AvaImg">
        <img
          :src="imglink"
          alt="404"
        >
      </div>
      <div id="Avainfo">
        <p>用户ID : <span>{{ UserId }}</span></p>
        <p>昵称 : <span>{{ Usernickname }}</span></p>
      </div>
    </div>
    <div id="message">
      <img
        src="../assets/communication_14952206.png"
        alt="404"
      >  <!-- 讨论 -->
      <img
        src="../assets/notification_763494.png"
        alt="404"
      >     <!-- 公告 -->
      <img
        src="../assets/background_6538456.png"
        alt="404"
      >      <!-- 个人信息 -->
    </div>
    <div id="loginOut">
      <div
        id="logoutBtn"
        @click="loginOut"
      >
        用户登出
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'

    let imglink = ref('http://localhost:8089/files/avatar.jpg')
    let UserId = ref(0)
    let Usernickname = ref('****')

    const router = useRouter()

    // 从父组件传入的 props
    const props = defineProps({
        GetUserInfoAPI:String
    })

    /* 清除 本地token */
    const loginOut = () => {
    localStorage.setItem('yltoken', '')
    router.push('/')
    }

    /* 发送验证 token  */
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
    ).then(res => {
        console.log('验证：', res.data)
        if (!res.data) {
        router.push('/login')
        }
    }).catch(err => {
        console.error('验证失败：', err)
    })
    }

/* 获取当前用户信息 */
    const getUserInfoAPI = ()=>{
        
        console.log('接口'+ props.GetUserInfoAPI)
        console.log(localStorage.getItem('yltoken'));
        axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
            headers: {
                'Authorization': `${localStorage.getItem('yltoken')}`
            }
        })
        .then(res => {
            console.log("获取当前用户信息 :",res.data);
            imglink.value = 'http://localhost:8089' + res.data.avatar;  /* 用户头像 */
            UserId.value = res.data.username;         /* 用户 ID */
            Usernickname.value = res.data.real_name;  /* 用户昵称 */
        })
        .catch(err => {
            console.error("获取用户信息失败：", err);
        });
    }

    // const ws = new WebSocket('ws://localhost:8089/ws');

    /* 挂载页面后执行的方法 */
    onMounted(() => {
        tokenSend()
        getUserInfoAPI()
    })
</script>

<style scoped>
.MiniInfo{
    position: absolute;
    bottom: 0;
    width: 100%;
    /* border: 1px solid red; */
    height: 25%;
    border-radius: 30px;
    transition: all 0.3s ease;
    background-color: var(--component-bg);
    color: var(--text-color);
    box-shadow: var(--box-shadou_JJ);
    
}
.MiniInfo:hover{
    box-shadow: var(--box-shadou_SJ);
}
.MiniInfo #Ava{
    /* border: 1px solid red; */
    height: 40%;
    display: flex;
}
.MiniInfo #Ava #AvaImg{
/*     border: 1px solid red; */
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.MiniInfo #Ava #AvaImg img{
/*     border: 1px solid red; */
    width: 55px;
    height: 55px;
    margin:0 15px;
    border-radius: 100%;
}
.MiniInfo #Ava #Avainfo{
/*     border: 1px solid red; */
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.MiniInfo #Ava #Avainfo p{
    /* border: 1px solid red; */
    font-weight: 900;
    font-size: 15px;
    text-align: start;
    width: 100%;
    margin: 5px 0px;
}
.MiniInfo #Ava #Avainfo p span{
    font-weight: 600;
    font-size: 13px;
}
.MiniInfo #message{
    /* border: 1px solid red; */
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.MiniInfo #message img{
    flex-direction: column;
    /* border: 1px solid red; */
    width: 35px;
    height: 35px;
    margin: 0 15px;
    cursor: pointer;
    padding:5px;
    border-radius: 30%;
    background-color: var(--iconBg);
    transition: all 0.3s ease;
    
}
.MiniInfo #message img:hover{
    color: #ffffff;
    background-color: rgb(70, 195, 199);
}
.MiniInfo #loginOut{
    /* border: 1px solid red; */
    height: 29%;
    color: rgb(250, 145, 169);
    font-weight: 900;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
}
.MiniInfo #loginOut:hover{
    letter-spacing: 3px;
}
</style>