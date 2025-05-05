<!-- 健康档案 -->
<template>
  <div class="HealthFilesView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        新增健康记录
      </el-button>
      <el-input
        v-model="searchId"
        placeholder="请输入健康记录ID"
        style="width: 200px; margin-left: 20px"
        @input="handleSearch"
      />
    </div>
    <el-table
      v-loading="loading"
      :data="healthList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="记录ID"
        width="80"
      />
      <el-table-column
        prop="user_id"
        label="用户ID"
        width="100"
      />
      <el-table-column
        prop="date"
        label="日期"
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
      />
      <el-table-column
        prop="heart_rate"
        label="心率"
        width="100"
      />
      <el-table-column
        prop="temperature"
        label="体温"
        width="100"
      />
      <el-table-column
        prop="remark"
        label="备注说明"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作"
        width="180"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      class="Pagelayer" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="currentPage" 
      layout="prev, pager, next" 
      @current-change="handleCurrentChange" 
      @size-change="handleSizeChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item
          label="用户ID"
          prop="user_id"
        >
          <el-input
            v-model="form.user_id"
            placeholder="请输入用户ID"
          />
        </el-form-item>
        <el-form-item
          label="血压"
          prop="blood_pressure"
        >
          <el-input
            v-model="form.blood_pressure"
            placeholder="请输入血压，如120/80"
          />
        </el-form-item>
        <el-form-item
          label="心率"
          prop="heart_rate"
        >
          <el-input-number 
            v-model="form.heart_rate" 
            :min="0" 
            :max="200"
            placeholder="请输入心率"
          />
        </el-form-item>
        <el-form-item
          label="体温"
          prop="temperature"
        >
          <el-input-number 
            v-model="form.temperature" 
            :min="35" 
            :max="42" 
            :step="0.1"
            placeholder="请输入体温"
          />
        </el-form-item>
        <el-form-item
          label="备注说明"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { format } from 'date-fns'
import { ElMessage } from 'element-plus'

export default {
  name: 'HealthFilesView',
  data() {
    return {
      healthList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      dialogTitle: '新增健康记录',
      searchId: '',
      form: {
        user_id: '',
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        remark: ''
      },
      rules: {
        user_id: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { type: 'number', message: '用户ID必须为数字', transform: (value) => Number(value) }
        ],
        blood_pressure: [
          { required: true, message: '请输入血压', trigger: 'blur' },
          { pattern: /^\d{2,3}\/\d{2,3}$/, message: '血压格式不正确，应为如120/80', trigger: 'blur' }
        ],
        heart_rate: [
          { required: true, message: '请输入心率', trigger: 'blur' },
          { type: 'number', message: '心率必须为数字', transform: (value) => Number(value) }
        ],
        temperature: [
          { required: true, message: '请输入体温', trigger: 'blur' },
          { type: 'number', message: '体温必须为数字', transform: (value) => Number(value) }
        ]
      }
    }
  },
  created() {
    this.fetchHealthRecords()
  },
  methods: {
    async fetchHealthRecords() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/HealthRecird/list', {
          params: { 
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        this.healthList = response.data.list
        this.total = response.data.total
      } catch (error) {
        ElMessage.error('获取健康记录失败')
        console.error('Error fetching health records:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      if (!date) return ''
      try {
        return format(new Date(date), 'yyyy-MM-dd')
      } catch (error) {
        console.error('Error formatting date:', error)
        return date
      }
    },
    handleAdd() {
      this.dialogTitle = '新增健康记录'
      this.form = {
        user_id: '',
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑健康记录'
      this.form = { ...row }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        const formData = { ...this.form }
        if (this.dialogTitle === '新增健康记录') {
          await axios.post('http://localhost:8089/api/sysadmin/HealthRecird/Insert', formData)
          ElMessage.success('新增成功')
        } else {
          await axios.post('http://localhost:8089/api/sysadmin/HealthRecird/Update', formData)
          ElMessage.success('更新成功')
        }
        this.dialogVisible = false
        this.fetchHealthRecords()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.dialogTitle === '新增健康记录' ? '新增失败' : '更新失败')
          console.error('Error submitting form:', error)
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchHealthRecords()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchHealthRecords()
    },
    async handleSearch() {
      if (!this.searchId) {
        this.currentPage = 1
        this.fetchHealthRecords()
        return
      }
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/HealthRecird/SelectByIdEndSelection', {
          params: { id: this.searchId }
        })
        if (response.data && response.data.id) {
          this.healthList = [response.data]
          this.total = 1
        } else {
          this.healthList = []
          this.total = 0
          ElMessage.warning('未找到相关健康记录')
        }
      } catch (error) {
        this.healthList = []
        this.total = 0
        ElMessage.error('搜索健康记录失败')
      }
    }
  }
}
</script>

<style scoped>
.HealthFilesView {
  padding: 20px;
  height: 90vh;
  width: 97%;
  position: relative;
  top: 50%;
  border-radius: 30px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  margin-left: 10px;
  color: var(--text-color);
  background-color: var(--component-bg);
  box-shadow: var(--box-shadou_JJ);
}
.HealthFilesView:hover {
  box-shadow: var(--box-shadou_SJ);
}
.header {
  margin-bottom: 20px;
}
.Pagelayer {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  background-color: var(--component-bg);
}
</style>