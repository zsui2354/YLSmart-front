<!-- 新闻列表管理 -->
<template>
  <div class="NewsView">
    <el-table
      :data="newsList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="title"
        label="标题"
        width="200"
      />
      <el-table-column
        prop="content"
        label="内容"
        show-overflow-tooltip
      />
      <el-table-column
        prop="published_at"
        label="发布时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.published_at) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="来源"
        width="150"
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

export default {
  name: 'NewsView',
  data() {
    return {
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchNews()
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/news/newslist', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        this.newsList = response.data.list
        this.total = response.data.total
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        this.$message.error('获取新闻列表失败')
      }
    },
    formatDateTime(dateTime) {
      return dateTime ? format(new Date(dateTime), 'yyyy-MM-dd HH:mm:ss') : ''
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchNews()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchNews()
    }
  }
}
</script>

<style scoped>
.NewsView {
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

.NewsView:hover {
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