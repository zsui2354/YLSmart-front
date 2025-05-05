<!-- 健康档案 -->
<template>
  <div class="HealthFilesView">
    <div class="header">
      <el-input
        v-model="searchId"
        placeholder="请输入健康记录ID"
        style="width: 200px; margin-left: 0"
        @input="handleSearch"
      />
    </div>
    <el-table
      v-loading="loading"
      :data="healthList"
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
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
      searchId: ''
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
.table-header-center {
  text-align: center !important;
}
.table-cell-center {
  text-align: center !important;
}
</style>