<!-- 登入日志 -->
<template>
  <div class="LoginLogView">
    <div class="table-container">
      <el-table
        :data="logList"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="日志ID"
          width="80"
        />
        <el-table-column
          prop="user_id"
          label="用户ID"
          width="100"
        />
        <el-table-column
          prop="username"
          label="用户名"
          width="120"
        >
          <template #default="{ row }">
            {{ getUserName(row.user_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ip_address"
          label="登录IP"
          width="150"
        />
        <el-table-column
          prop="login_time"
          label="登录时间"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.login_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="user_agent"
          label="设备信息"
        />
      </el-table>
    </div>

    <el-pagination 
      layout="prev, pager, next" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="currentPage" 
      class="Pagelayer" 
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginLogView',
  data() {
    return {
      logList: [],
      userMap: new Map(), // 用于存储用户ID和用户名的映射
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchLogs()
    this.fetchUsers()
  }, 
  methods: {
    async fetchLogs() {
      try { 
        const response = await axios.get('http://localhost:8089/api/sysadmin/user/getLoginLogs', {
          headers: {
            'token': localStorage.getItem('yltoken')
          }
        })
        this.total = response.data.length
        // 手动分页
        const start = (this.currentPage - 1) * this.pageSize
        const end = start + this.pageSize
        this.logList = response.data.slice(start, end)
      } catch (error) {
        console.error('获取登录日志失败:', error)
        this.$message.error('获取登录日志失败')
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/user/SelectAll', {
          headers: {
            'token': localStorage.getItem('yltoken')
          }
        })
        // 将用户数据转换为Map，方便查找
        response.data.forEach(user => {
          this.userMap.set(user.id, user.username)
        })
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.$message.error('获取用户列表失败')
      }
    },
    getUserName(userId) {
      return this.userMap.get(userId) || '未知用户'
    },
    formatDate(date) {
      if (!date) return ''
      // 直接返回后端传来的日期字符串，因为格式已经是正确的
      return date
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchLogs()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchLogs()
    }
  }
}
</script>

<style scoped>
.LoginLogView{
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
    display: flex;
    flex-direction: column;
}

.LoginLogView:hover{
    box-shadow: var(--box-shadou_SJ);
}

.table-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
}

.Pagelayer{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
}

/* 自定义滚动条样式 */
.table-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>