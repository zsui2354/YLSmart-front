<!-- 讨论列表管理 -->
<template>
  <div class="IssuesView">
    <div class="header" />
    <el-table
      v-loading="loading"
      :data="issuesList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="讨论ID"
        width="80"
      />
      <el-table-column
        prop="title"
        label="主题标题"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="content"
        label="主题内容"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="creator_id"
        label="创建者ID"
        width="100"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.updated_at) }}
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

    <!-- 添加/编辑讨论的弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="discussionFormRef"
        :model="discussionForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="主题标题"
          prop="title"
        >
          <el-input
            v-model="discussionForm.title"
            placeholder="请输入主题标题"
          />
        </el-form-item>
        <el-form-item
          label="主题内容"
          prop="content"
        >
          <el-input
            v-model="discussionForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入主题内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitDiscussion"
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
  name: 'IssuesView',
  data() {
    return {
      issuesList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: '',
      loading: false,
      dialogVisible: false,
      dialogTitle: '添加讨论',
      discussionForm: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入主题标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入主题内容', trigger: 'blur' },
          { min: 5, message: '内容不能少于5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchDiscussions()
  },
  methods: {
    async fetchDiscussions() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/issues/list', {
          params: { 
            pageNum: this.currentPage, 
            pageSize: this.pageSize,
            search: this.searchQuery 
          }
        })
        this.issuesList = response.data.list
        this.total = response.data.total
      } catch (error) {
        ElMessage.error('获取讨论列表失败')
        console.error('Error fetching discussions:', error)
      } finally {
        this.loading = false
      }
    },
    formatDateTime(dateTime) {
      if (!dateTime) return ''
      try {
        return format(new Date(dateTime), 'yyyy-MM-dd HH:mm:ss')
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateTime
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchDiscussions()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchDiscussions()
    }
  }
}
</script>

<style scoped>
.IssuesView {
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
.IssuesView:hover {
  box-shadow: var(--box-shadou_SJ);
}
.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
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