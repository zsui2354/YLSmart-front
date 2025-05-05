<!-- 登入日志 -->
<template>
  <div class="LoginLogView">
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
        this.logList = response.data
        this.total = response.data.length
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
    /* border: 1px solid red; */
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
.LoginLogView:hover{
    box-shadow: var(--box-shadou_SJ);
}
.Pagelayer{
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>