<template>
  <div class="appointment-view">
    <div class="header">
      <h2>服务列表</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜索服务名称"
        class="search-input"
        clearable
        @clear="handleSearch"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-row :gutter="20" class="service-list">
      <el-col :span="8" v-for="service in serviceList" :key="service.id">
        <el-card class="service-card" shadow="hover">
          <div class="service-header">
            <h3>{{ service.name }}</h3>
            <el-tag type="success" size="small">¥{{ service.price }}</el-tag>
          </div>
          <div class="service-description">
            {{ service.description }}
          </div>
          <div class="service-footer">
            <el-button type="primary" size="small" @click="handleAppointment(service)">
              立即预约
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="12"
        :total="null"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预约服务"
      width="500px"
    >
      <el-form :model="appointmentForm" label-width="100px">
        <el-form-item label="服务名称">
          <span>{{ selectedService?.name }}</span>
        </el-form-item>
        <el-form-item label="预约时间" required>
          <el-date-picker
            v-model="appointmentForm.appointment_time"
            type="datetime"
            placeholder="选择预约时间"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="appointmentForm.note"
            type="textarea"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAppointment" :loading="submitting">
            确认预约
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const serviceList = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const searchQuery = ref('')
const dialogVisible = ref(false)
const submitting = ref(false)
const selectedService = ref(null)
const appointmentForm = ref({
  user_id: 8, // 这里应该从用户信息中获取
  service_id: null,
  appointment_time: '',
  status: 0,
  note: ''
})

// 获取服务列表
const fetchServiceList = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/service/querypage', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        name: searchQuery.value
      }
    })
    serviceList.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取服务列表失败')
    console.error(error)
  }
}

// 处理预约
const handleAppointment = (service) => {
  selectedService.value = service
  appointmentForm.value.service_id = service.id
  dialogVisible.value = true
}

// 提交预约
const submitAppointment = async () => {
  if (!appointmentForm.value.appointment_time) {
    ElMessage.warning('请选择预约时间')
    return
  }

  submitting.value = true
  try {
    // 格式化日期时间
    const formattedTime = new Date(appointmentForm.value.appointment_time).toISOString().replace('T', ' ').slice(0, 19)
    
    const requestData = {
      user_id: 8,
      service_id: appointmentForm.value.service_id,
      appointment_time: formattedTime,
      status: 0,
      note: appointmentForm.value.note
    }

    await axios.post('http://localhost:8089/api/user/service/submitAppointment', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    ElMessage.success('预约成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('预约失败:', error.response?.data || error.message)
    ElMessage.error(error.response?.data?.message || '预约失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchServiceList()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchServiceList()
}

onMounted(() => {
  fetchServiceList()
})
</script>

<style scoped>
.appointment-view {
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

.search-input {
  width: 300px;
}

.service-list {
  margin-bottom: 20px;
}

.service-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.service-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.service-description {
  color: #606266;
  margin-bottom: 15px;
  min-height: 40px;
}

.service-footer {
  display: flex;
  justify-content: flex-end;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-tag) {
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
