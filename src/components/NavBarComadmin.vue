<template>
  <div class="NavBar">
    <div id="Logo">
      <img
        src="../assets/PPLOGO.png"
        alt="404"
      >
      <span>{{ title }}</span>
    </div>
    <div class="navitem">
      <el-col
        id="elnav"
        :span="30"
      >
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          style="border: none;"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu
            class="submenu"
            index="2"
          >
            <template #title>
              <el-icon><location /></el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                class="selectitem"
                index="2-2"
                @click="navigateToPage('/manager/LoginLogViewNavBarComadmin')"
              >
                登录日志
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu
            class="submenu"
            index="3"
          >
            <template #title>
              <el-icon><location /></el-icon>
              <span>机构 & 服务</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                class="selectitem"
                index="3-1"
                @click="navigateToPage('/manager/NursinghomeViewNavBarComadmin')"
              >
                机构列表
              </el-menu-item>
              <el-menu-item
                class="selectitem"
                index="3-2" 
                @click="navigateToPage('/manager/ServiceViewNavBarComadmin')"
              >
                服务列表
              </el-menu-item>
              <el-menu-item
                class="selectitem"
                index="3-3"
                @click="navigateToPage('/manager/AppointmentViewNavBarComadmin')"
              >
                预约申请
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

                
          <el-sub-menu
            class="submenu"
            index="4"
          >
            <template #title>
              <el-icon><location /></el-icon>
              <span>新闻 & 活动</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                class="selectitem"
                index="4-1"
                @click="navigateToPage('/manager/NewsViewNavBarComadmin')"
              >
                新闻列表
              </el-menu-item>
              <el-menu-item
                class="selectitem"
                index="4-2"
                @click="navigateToPage('/manager/ActivityViewNavBarComadmin')"
              >
                活动列表
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu
            class="submenu"
            index="5"
          >
            <template #title>
              <el-icon><location /></el-icon>
              <span>公告 & 议题</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                class="selectitem"
                index="5-1"
                @click="navigateToPage('/manager/AnnouncementViewNavBarComadmin')"
              >
                公告列表
              </el-menu-item>
              <el-menu-item
                class="selectitem"
                index="5-2"
                @click="navigateToPage('/manager/IssuesViewNavBarComadmin')"
              >
                议题列表
              </el-menu-item>
              <el-menu-item
                class="selectitem"
                index="5-3"
                @click="navigateToPage('/manager/CommentViewNavBarComadmin')"
              >
                评论列表
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu
            class="submenu"
            index="6"
          >
            <template #title>
              <el-icon><location /></el-icon>
              <span>健康数据</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                class="selectitem"
                index="6-1"
                @click="navigateToPage('/manager/HealthFilesViewNavBarComadmin')"
              >
                健康档案
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </div>
    <slot />
  </div>
</template>

<script>
export default{
    name: 'NavBar',
    props:{
        title:String
    },
    computed: {
        savedTheme() {
            const theme = localStorage.getItem('theme');
            return theme 
        }
    },
    methods:{
      navigateToPage(path){
        this.$router.push(path);
      }
    }
}
</script>

<style scoped>
.NavBar{
    position: absolute;
    height: 72%;
    width: 100%;
    /* border: 1px solid red; */
    border-radius: 30px;
   /*  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.35); */
    transition: all 0.3s ease;
    overflow:hidden;
    background-color: var(--component-bg);
    color: var(--text-color);
    box-shadow: var(--box-shadou_JJ);
}
.NavBar:hover{
    box-shadow: var(--box-shadou_SJ);
}
.NavBar #Logo{
    position: relative;
    border-bottom: 1px solid #3333335e;
    width: 100%;
    height: 30%;
    
    
}
.NavBar #Logo img{
    width: 80%;
}
.NavBar .navitem{
    /* border: 1px solid red; */
    height: 70%;
    overflow-y: scroll
}
.NavBar .navitem::-webkit-scrollbar {
  display: none; /* Chrome / Safari / Edge */
}

.NavBar .navitem #elnav{
   /*  border: 1px solid red; */
    border: none;
}
.NavBar .navitem #elnav .el-menu{
    background-color: var(--component-bg);
    transition: all 0.3s ease;
}
.NavBar .navitem .submenu{
    /* border: 1px solid red; */
    user-select: none;
}
.NavBar .navitem span{
    text-align: center;
}
.NavBar .navitem .selectitem{
    text-indent: 20px;
   /*  border: 1px solid #333; */
}
.el-menu-item.is-active{
    color: rgb(70, 195, 199);
}
.el-menu-item:hover{
    transition: all 0.3s ease;
    letter-spacing: 1px;
}

</style>