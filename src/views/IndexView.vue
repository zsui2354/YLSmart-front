<template>
  <div class="app-wrapper">
    <div class="app-container">
      <!-- 悬浮侧边栏 -->
      <div 
        class="floating-sidebar"
        :class="{ 'collapsed': !isSidebarOpen }"
        @mouseenter="expandMenu"
        @mouseleave="collapseMenu"
      >
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item
            index="/index"
            :class="{'is-active': isActive('/index')}"
          >
            <el-icon><PieChart /></el-icon>
            <span class="menu-text">数据分析</span>
          </el-menu-item>
          <el-sub-menu
            index="2"
            class="item"
          >
            <template #title>
              <el-icon><DocumentCopy /></el-icon>
              <span class="menu-text">信息管理</span>
            </template>
            <el-menu-item
              index="/index/Fw"
              @click="setActive('/index/Fw')"
            >
              服务&预约
            </el-menu-item>
            <el-menu-item
              index="/index/Tz"
              @click="setActive('/index/Tz')"
            >
              通知&公告
            </el-menu-item>
            <el-menu-item
              index="/index/Xw"
              @click="setActive('/index/Xw')"
            >
              新闻
            </el-menu-item>
            <el-menu-item
              index="/index/Rz"
              @click="setActive('/index/Rz')"
            >
              日志
            </el-menu-item>
            <el-menu-item
              index="/index/Gyhd"
              @click="setActive('/index/Gyhd')"
            >
              公益活动
            </el-menu-item>
            <el-menu-item
              index="/index/Jkda"
              @click="setActive('/index/Jkda')"
            >
              健康档案
            </el-menu-item>
            <el-menu-item
              index="/index/Ylyxx"
              @click="setActive('/index/Ylyxx')"
            >
              养老机构信息
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu
            index="3"
            class="item"
          >
            <template #title>
              <el-icon><User /></el-icon>
              <span class="menu-text">用户管理</span>
            </template>
            <el-menu-item
              index="/index/Yhqx"
              @click="setActive('/index/Yhqx')"
            >
              用户权限
            </el-menu-item>
            <el-menu-item
              index="/index/Yhxx"
              @click="setActive('/index/Yhxx')"
            >
              用户信息
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
	User,
	DocumentCopy,
	PieChart,
	} from '@element-plus/icons-vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// 初始化 route 对象
const route = useRoute();





// 当前激活的菜单项
const activeIndex = ref(route.path);

// 监听路由变化以更新激活状态
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath;
  }
);

// 判断某个路径是否是当前激活的路径
const isActive = (path) => {
  return activeIndex.value === path;
};

// 设置当前激活的路径
const setActive = (path) => {
  activeIndex.value = path;
};

const isSidebarOpen = ref(false);

const expandMenu = () => {
  isSidebarOpen.value = true;
};

const collapseMenu = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.el-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
}

.floating-sidebar {
  position: fixed;
  left: 0;
  top: 60px; /* 头部高度为 60px，侧边栏从头部下方开始 */
  height: calc(100vh - 60px); /* 侧边栏高度占剩余页面高度 */
  width: 200px;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: width 0.3s ease, transform 0.3s ease;
  transform: translateX(0);
  overflow: hidden;
}

.floating-sidebar.collapsed {
  width: 64px;
}

.el-menu {
  height: 100%;
  border-right: none;
  width: 200px;
}

.menu-text {
  margin-left: 8px;
  transition: opacity 0.2s ease;
}

.floating-sidebar.collapsed .menu-text,
.floating-sidebar.collapsed .el-sub-menu__title span:not(.menu-text),
.floating-sidebar.collapsed .el-menu-item span {
  opacity: 0;
  width: 0;
  display: inline-block;
  overflow: hidden;
}
.floating-sidebar.collapsed .item .el-menu-item{
  display: none;
}

.el-menu-item, .el-sub-menu__title {
  white-space: nowrap;
}

.main-content {
  flex: 1;
  width: 100%;
  padding-left: 64px; /* 为折叠的侧边栏留出空间 */
  box-sizing: border-box;
  transition: padding-left 0.3s ease;
}

.floating-sidebar:not(.collapsed) ~ .main-content {
  padding-left: 200px;
}

.el-menu-item.is-active {
  color: #409eff;
  background-color: #ecf5ff;
}
</style>