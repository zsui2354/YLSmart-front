<!-- 公告列表管理 -->
<template>
  <div class="AnnouncementView">
    <el-table
      :data="announcementList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="公告ID"
      />
      <el-table-column
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="content"
        label="内容"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="类型"
      />
      <el-table-column
        prop="target_role"
        label="目标角色"
      />
      <el-table-column
        prop="created_at"
        label="发布时间"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.created_at) }}
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
  </div>
</template>
<script>
import axios from 'axios'
import { format } from 'date-fns'
export default {
  name: 'AnnouncementView',
  data() {
    return {
      announcementList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchAnnouncements()
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/announcement/list', {
          params: { pageNum: this.currentPage, pageSize: this.pageSize }
        })
        this.announcementList = response.data.list
        this.total = response.data.total
      } catch (error) {
        console.error('获取公告列表失败:', error)
        this.$message.error('获取公告列表失败')
      }
    },
    formatDateTime(dateTime) {
      return dateTime ? format(new Date(dateTime), 'yyyy-MM-dd HH:mm:ss') : ''
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchAnnouncements()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchAnnouncements()
    }
  }
}
</script>
<style scoped>
.AnnouncementView {
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
.AnnouncementView:hover {
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