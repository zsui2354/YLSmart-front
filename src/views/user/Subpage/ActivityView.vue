<template>
  <div class="activity-view">
    <el-card>
      <div class="activity-list">
        <el-row :gutter="24">
          <el-col :span="12" v-for="item in activityList" :key="item.id">
            <el-card class="activity-card" shadow="hover">
              <div class="activity-title">
                <el-icon style="color:#409EFF"><Calendar /></el-icon>
                <span>{{ item.title }}</span>
              </div>
              <div class="activity-content">{{ item.content }}</div>
              <div class="activity-info">
                <div>
                  <el-icon><Location /></el-icon>
                  <span>{{ item.place }}</span>
                </div>
                <div>
                  <el-icon><Clock /></el-icon>
                  <span>{{ formatTime(item.start_time) }} ~ {{ formatTime(item.end_time) }}</span>
                </div>
                <div>
                  <el-icon><UserFilled /></el-icon>
                  <span>限{{ item.max_participants }}人</span>
                </div>
              </div>
              <div class="activity-action">
                <el-button type="primary" size="small" @click="enrollActivity(item.id)">
                  参加
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, Location, Clock, UserFilled } from '@element-plus/icons-vue'
import axios from 'axios'

const activityList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentUserId = ref(null)

const fetchActivities = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/news/Activityquerypage', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    activityList.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取活动列表失败')
  }
}

const getCurrentUserInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
      headers: {
        'Authorization': `${localStorage.getItem('yltoken')}`
      }
    })
    currentUserId.value = response.data.id
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

const enrollActivity = async (activityId) => {
  if (!currentUserId.value) {
    await getCurrentUserInfo()
    if (!currentUserId.value) {
      ElMessage.error('请先登录')
      return
    }
  }
  try {
    await axios.post('http://localhost:8089/api/user/news/activity_enrollInsert', {
      user_id: currentUserId.value,
      activity_id: activityId
    })
    ElMessage.success('报名成功！')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '报名失败')
  }
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchActivities()
}

const formatTime = (str) => {
  // 只显示月日和时间
  const d = new Date(str.replace(/-/g, '/'))
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  await getCurrentUserInfo()
  fetchActivities()
})
</script>

<style scoped>
.activity-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.activity-list {
  margin-bottom: 24px;
}
.activity-card {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: box-shadow 0.2s;
  position: relative;
}
.activity-title {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.activity-content {
  color: #606266;
  font-size: 15px;
  margin-bottom: 12px;
  min-height: 40px;
}
.activity-info {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  color: #909399;
  font-size: 14px;
  align-items: center;
}
.activity-info > div {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.activity-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
