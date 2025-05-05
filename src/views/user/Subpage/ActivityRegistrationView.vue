<template>
  <div class="activity-registration-view">
    <el-card>
      <h2 class="title">我的活动报名</h2>
      <div class="registration-list">
        <el-row :gutter="24">
          <el-col :span="12" v-for="item in userEnrollList" :key="item.id">
            <el-card class="activity-card" shadow="hover">
              <div class="activity-title">
                <span>{{ activityTitleMap[item.activity_id] || '加载中...' }}</span>
              </div>
              <div class="activity-content">
                报名时间：{{ item.enrolled_at }}
              </div>
              <div class="activity-action">
                <el-button type="danger" size="small" @click="handleQuit(item.id)">退出活动</el-button>
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
import axios from 'axios'

const enrollList = ref([])
const userEnrollList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentUserId = ref(null)
const activityTitleMap = ref({})

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

const fetchActivityTitles = async (activityIds) => {
  const map = {}
  await Promise.all(activityIds.map(async (id) => {
    try {
      const res = await axios.get(`http://localhost:8089/api/user/news/getActivityinfo?id=${id}`)
      map[id] = res.data.title
    } catch {
      map[id] = '未知活动'
    }
  }))
  activityTitleMap.value = map
}

const fetchEnrollList = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/news/activity_enrollquerypage', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    enrollList.value = response.data.list
    // 只显示当前用户的报名
    userEnrollList.value = enrollList.value.filter(item => item.user_id === currentUserId.value)
    total.value = userEnrollList.value.length

    // 获取所有报名的活动id
    const activityIds = [...new Set(userEnrollList.value.map(item => item.activity_id))]
    if (activityIds.length) {
      await fetchActivityTitles(activityIds)
    }
  } catch (error) {
    ElMessage.error('获取报名列表失败')
  }
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchEnrollList()
}

const handleQuit = async (enrollId) => {
  try {
    await axios.post(`http://localhost:8089/api/user/news/activity_enrollDeleteById?id=${enrollId}`)
    ElMessage.success('已退出活动')
    fetchEnrollList()
  } catch (error) {
    ElMessage.error('退出失败')
  }
}

onMounted(async () => {
  await getCurrentUserInfo()
  fetchEnrollList()
})
</script>

<style scoped>
.activity-registration-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #409EFF;
}
.registration-list {
  margin-bottom: 24px;
}
.activity-card {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: box-shadow 0.2s;
  position: relative;
}
.activity-title {
  font-size: 18px;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 8px;
}
.activity-content {
  color: #606266;
  font-size: 15px;
  margin-bottom: 12px;
  min-height: 32px;
}
.activity-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
