<template>
  <div class="health-files-view">
    <el-card class="health-records">
      <div class="header center-header">
        <el-button type="primary" @click="showAddDialog">添加档案</el-button>
      </div>
      <el-table
        :data="healthRecords"
        style="width: 100%"
        :row-class-name="getRowClassName"
      >
        <el-table-column
          prop="date"
          label="记录日期"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.date) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="blood_pressure"
          label="血压"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              :type="getBloodPressureType(row.blood_pressure)"
              size="small"
            >
              {{ row.blood_pressure }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="heart_rate"
          label="心率"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              :type="getHeartRateType(row.heart_rate)"
              size="small"
            >
              {{ row.heart_rate }} 次/分
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="temperature"
          label="体温"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              :type="getTemperatureType(row.temperature)"
              size="small"
            >
              {{ row.temperature }} °C
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.remark"
              placement="top"
              :show-after="500"
            >
              <span class="remark-text">{{ row.remark }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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
    <!-- 添加健康档案对话框 -->
    <el-dialog v-model="dialogVisible" title="添加健康档案" width="500px">
      <el-form ref="formRef" :model="healthForm" :rules="rules" label-width="100px">
        <el-form-item label="血压" prop="blood_pressure">
          <el-input v-model="healthForm.blood_pressure" placeholder="例如：120/80">
            <template #append>mmHg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="心率" prop="heart_rate">
          <el-input-number v-model="healthForm.heart_rate" :min="40" :max="200" :step="1">
            <template #append>次/分</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="体温" prop="temperature">
          <el-input-number v-model="healthForm.temperature" :min="35" :max="42" :step="0.1" :precision="1">
            <template #append>°C</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="healthForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHealthRecord" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const healthRecords = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const currentUserId = ref(null)

const healthForm = ref({
  blood_pressure: '',
  heart_rate: 70,
  temperature: 36.5,
  remark: ''
})

const rules = {
  blood_pressure: [
    { required: true, message: '请输入血压', trigger: 'blur' },
    { pattern: /^\d{2,3}\/\d{2,3}$/, message: '血压格式不正确，例如：120/80', trigger: 'blur' }
  ],
  heart_rate: [{ required: true, message: '请输入心率', trigger: 'blur' }],
  temperature: [{ required: true, message: '请输入体温', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
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

const showAddDialog = () => {
  healthForm.value = {
    blood_pressure: '',
    heart_rate: 70,
    temperature: 36.5,
    remark: ''
  }
  dialogVisible.value = true
}

const submitHealthRecord = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true
    await axios.post('http://localhost:8089/api/sysadmin/HealthRecird/Insert', {
      ...healthForm.value,
      user_id: currentUserId.value
    })
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchHealthRecords()
  } catch (error) {
    ElMessage.error('添加失败')
  } finally {
    submitting.value = false
  }
}

const fetchHealthRecords = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/healthrecord/healthrecordqueryByPage', {
      params: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      }
    })
    const allRecords = response.data.list || []
    healthRecords.value = allRecords.filter(item => item.user_id === currentUserId.value)
    total.value = healthRecords.value.length
  } catch (error) {
    ElMessage.error('获取健康记录失败')
    console.error(error)
  }
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchHealthRecords()
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBloodPressureType = (pressure) => {
  const [systolic, diastolic] = pressure.split('/').map(Number)
  if (systolic >= 140 || diastolic >= 90) return 'danger'
  if (systolic >= 130 || diastolic >= 85) return 'warning'
  return 'success'
}

const getHeartRateType = (rate) => {
  if (rate >= 100 || rate <= 60) return 'danger'
  if (rate >= 90 || rate <= 70) return 'warning'
  return 'success'
}

const getTemperatureType = (temp) => {
  if (temp >= 37.3) return 'danger'
  if (temp >= 37.0) return 'warning'
  return 'success'
}

const getRowClassName = ({ row }) => {
  const temp = parseFloat(row.temperature)
  if (temp >= 37.3) return 'warning-row'
  return ''
}

onMounted(async () => {
  await getCurrentUserInfo()
  fetchHealthRecords()
})
</script>

<style scoped>
.health-files-view {
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.center-header {
  justify-content: center;
}

.health-records {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.remark-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.warning-row) {
  background-color: #fff2f0;
}

:deep(.el-tag) {
  font-weight: bold;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: bold;
  color: #303133;
}

:deep(.el-table td) {
  padding: 12px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
