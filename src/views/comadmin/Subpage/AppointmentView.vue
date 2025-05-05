<!-- 服务列表管理 -->
<template>
  <div class="ServiceView">
    <el-table
      v-loading="loading"
      :data="serviceList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="name"
        label="服务名称"
        width="150"
      />
      <el-table-column
        prop="description"
        label="服务介绍"
      />
      <el-table-column
        prop="price"
        label="价格"
        width="120"
      >
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>
      <el-table-column
        prop="home_id"
        label="所属机构"
        width="120"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click="handleViewHome(row.home_id)"
          >
            {{ homeNames[row.home_id] || '加载中...' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleViewAppointments(row)"
          >
            查看预约
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next"
      class="Pagelayer"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 预约记录弹窗 -->
    <el-dialog
      v-model="appointmentDialogVisible"
      width="800px"
    >
      <template #header>
        <div style="display: flex; align-items: center; gap: 10px;">
          <el-input
            v-model="searchUserId"
            placeholder="请输入用户ID"
            style="width: 200px"
            @change="handleSearch"
          />
          <el-select 
            v-model="searchStatus" 
            placeholder="选择状态"
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option
              label="待处理"
              :value="0"
            />
            <el-option
              label="已确认"
              :value="1"
            />
            <el-option
              label="已完成"
              :value="2"
            />
            <el-option
              label="已取消"
              :value="3"
            />
          </el-select>
        </div>
      </template>

      <el-table
        :data="appointmentRecords"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="预约ID"
          width="100"
        />
        <el-table-column
          prop="user_id"
          label="用户ID"
          width="100"
        />
        <el-table-column
          prop="appointment_time"
          label="预约时间"
          width="180"
        >
          <template #default="scope">
            {{ formatDateTime(scope.row.appointment_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'AppointmentView',
  data() {
    return {
      serviceList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      homeNames: {},
      appointmentDialogVisible: false,
      appointmentRecords: [],
      searchUserId: '',
      searchStatus: '',
      currentServiceId: null
    }
  },
  created() {
    this.fetchServices()
  },
  methods: {
    async fetchServices() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/service/servicequeryBypage', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        console.log('获取到的数据:', response.data)
        this.serviceList = response.data.list || []
        this.total = response.data.total
        
        // 获取所有需要查询的机构ID
        const homeIds = [...new Set(this.serviceList.map(service => service.home_id).filter(Boolean))]
        console.log('需要查询的机构ID:', homeIds)
        
        // 批量获取机构信息
        const homePromises = homeIds.map(id => 
          axios.get(`http://localhost:8089/api/staff/nursinghome/SelectById?id=${id}`)
            .then(response => {
              if (response.data) {
                this.homeNames[id] = response.data.name
                console.log(`机构 ${id} 的名称:`, response.data.name)
              }
            })
            .catch(error => {
              console.error(`获取机构 ${id} 信息失败:`, error)
              this.homeNames[id] = '未知机构'
            })
        )
        
        await Promise.all(homePromises)
        console.log('所有机构名称:', this.homeNames)
        this.$forceUpdate()
      } catch (error) {
        console.error('获取服务列表失败:', error)
        ElMessage.error('获取服务列表失败')
      } finally {
        this.loading = false
      }
    },
    async handleViewAppointments(row) {
      this.currentServiceId = row.id
      this.appointmentDialogVisible = true
      await this.handleSearch()
    },
    async handleSearch() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/service/AppointmentRecord', {
          params: {
            userId: this.searchUserId || 0,
            ServicesStatus: this.searchStatus === '' ? -1 : this.searchStatus
          }
        })
        // 过滤出当前服务的预约记录
        this.appointmentRecords = response.data.filter(record => record.service_id === this.currentServiceId)
      } catch (error) {
        console.error('获取预约记录失败:', error)
        ElMessage.error('获取预约记录失败')
      }
    },
    async handleViewHome(homeId) {
      if (!homeId) {
        ElMessage.warning('机构ID不存在')
        return
      }
      try {
        const response = await axios.get('http://localhost:8089/api/staff/nursinghome/SelectById', {
          params: {
            id: homeId
          }
        })
        if (response.data) {
          ElMessage.info(`机构名称: ${response.data.name}\n地址: ${response.data.address}\n电话: ${response.data.phone}`)
        }
      } catch (error) {
        console.error('获取机构详情失败:', error)
        ElMessage.error('获取机构详情失败')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchServices()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchServices()
    },
    formatDateTime(datetime) {
      if (!datetime) return ''
      const date = new Date(datetime)
      return date.toLocaleString()
    },
    getStatusType(status) {
      const types = {
        0: 'info',
        1: 'warning',
        2: 'success',
        3: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        0: '待处理',
        1: '已确认',
        2: '已完成',
        3: '已取消'
      }
      return texts[status] || '未知'
    }
  }
}
</script>

<style scoped>
.ServiceView {
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

.ServiceView:hover {
  box-shadow: var(--box-shadou_SJ);
}

.Pagelayer {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>
