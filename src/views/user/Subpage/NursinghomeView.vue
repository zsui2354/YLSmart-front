/* global AMap */
<template>
  <div class="nursinghome-view">
    <div class="header">
      <h2>养老机构列表</h2>
    </div>

    <el-row :gutter="20" class="nursinghome-list">
      <el-col :span="8" v-for="home in nursinghomeList" :key="home.id">
        <el-card class="nursinghome-card" shadow="hover" @click="showServices(home)">
          <div class="nursinghome-header">
            <h3>{{ home.name }}</h3>
            <el-tag :type="getLevelType(home.level)" size="small">{{ home.level }}</el-tag>
          </div>
          <div class="nursinghome-info">
            <p><el-icon><Location /></el-icon> {{ home.address }}</p>
            <p><el-icon><Phone /></el-icon> {{ home.phone }}</p>
          </div>
          <div class="nursinghome-description">
            {{ home.description }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="12"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 服务项目对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedHome?.name + ' - 服务项目'"
      width="800px"
    >
      <!-- 地图显示 -->
      <div v-if="selectedHome?.longitude && selectedHome?.latitude" class="map-wrapper">
        <div id="map" class="map-container"></div>
      </div>
      <div v-else class="no-location">
        <el-empty description="该机构未设置位置信息" />
      </div>

      <!-- 服务项目列表 -->
      <div class="service-list">
        <el-row :gutter="20">
          <el-col :span="8" v-for="service in serviceList" :key="service.id">
            <el-card class="service-card" shadow="hover">
              <h4>{{ service.name }}</h4>
              <p>{{ service.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Location, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const nursinghomeList = ref([])
const currentPage = ref(1)
const dialogVisible = ref(false)
const selectedHome = ref(null)
const serviceList = ref([])
const map = ref(null)
const marker = ref(null)
const defD = 126.642464
const defB = 45.756967

// 加载高德地图脚本
async function loadAMapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) return resolve(window.AMap)

    const script = document.createElement('script')
    script.src =
      'https://webapi.amap.com/maps?v=2.0&key=035e6df047fb1cf9feabc3c253276b44&plugin=AMap.Scale,AMap.ToolBar'
    script.onload = () => resolve(window.AMap)
    script.onerror = () => reject(new Error('AMap 加载失败'))
    document.head.appendChild(script)
  })
}

// 初始化地图
const initMap = async (longitude, latitude) => {
  try {
    await loadAMapScript()

    if (map.value) {
      map.value.destroy()
    }

    map.value = new window.AMap.Map('map', {
      zoom: 11,
      center: [longitude || defD, latitude || defB]
    })

    // 加载插件
    window.AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
      map.value.addControl(new window.AMap.Scale())
      map.value.addControl(new window.AMap.ToolBar())
    })

    // 清除旧标记
    if (marker.value) {
      marker.value.setMap(null)
    }

    // 添加新标记
    marker.value = new window.AMap.Marker({
      position: [longitude || defD, latitude || defB],
      map: map.value
    })
  } catch (err) {
    console.error('地图加载失败:', err)
    ElMessage.error('地图加载失败，请检查网络或 Key 是否正确')
  }
}

// 获取养老机构列表
const fetchNursinghomeList = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/nursinghome/query', {
      params: {
        pageNum: currentPage.value,
        pageSize: 12
      }
    })
    nursinghomeList.value = response.data.list
  } catch (error) {
    ElMessage.error('获取养老机构列表失败')
    console.error(error)
  }
}

// 获取服务项目列表
const fetchServiceList = async (homeId) => {
  try {
    const response = await axios.get(`http://localhost:8089/api/user/nursinghome/nursinghome_serviceitem?home_id=${homeId}`)
    serviceList.value = response.data
  } catch (error) {
    ElMessage.error('获取服务项目失败')
    console.error(error)
  }
}

// 显示服务项目
const showServices = async (home) => {
  selectedHome.value = home
  dialogVisible.value = true
  await fetchServiceList(home.id)
  // 初始化地图
  if (home.longitude && home.latitude) {
    nextTick(() => {
      initMap(home.longitude, home.latitude)
    })
  }
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchNursinghomeList()
}

// 获取等级标签类型
const getLevelType = (level) => {
  const levelMap = {
    '五星': 'success',
    '四星': 'warning',
    '三星': 'info',
    '九星': 'danger'
  }
  return levelMap[level] || 'info'
}

onMounted(() => {
  fetchNursinghomeList()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
.nursinghome-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.nursinghome-list {
  margin-bottom: 20px;
}

.nursinghome-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.nursinghome-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nursinghome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.nursinghome-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.nursinghome-info {
  margin-bottom: 15px;
}

.nursinghome-info p {
  margin: 5px 0;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nursinghome-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.service-list {
  margin-top: 20px;
}

.service-card {
  margin-bottom: 15px;
  height: 100%;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.service-card p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-tag) {
  font-weight: bold;
}

.map-wrapper {
  margin-bottom: 20px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.no-location {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}
</style>
