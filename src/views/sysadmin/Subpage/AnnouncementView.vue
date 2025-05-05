<!-- 公告列表管理 -->
<template>
  <div class="AnnouncementView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        添加公告
      </el-button>
    </div>
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
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
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
    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
          />
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
        >
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
          >
            <el-option
              label="系统"
              value="系统"
            />
            <el-option
              label="社区"
              value="社区"
            />
            <el-option
              label="机构"
              value="机构"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="目标角色"
          prop="target_role"
        >
          <el-select
            v-model="form.target_role"
            placeholder="请选择目标角色"
          >
            <el-option
              label="全部"
              value="all"
            />
            <el-option
              label="管理员"
              value="admin"
            />
            <el-option
              label="用户"
              value="user"
            />
          </el-select>
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
export default {
  name: 'AnnouncementView',
  data() {
    return {
      announcementList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '添加公告',
      form: {
        id: null,
        title: '',
        content: '',
        type: '',
        target_role: ''
      },
      rules: {
        title: [ { required: true, message: '请输入公告标题', trigger: 'blur' } ],
        content: [ { required: true, message: '请输入公告内容', trigger: 'blur' } ],
        type: [ { required: true, message: '请选择类型', trigger: 'change' } ],
        target_role: [ { required: true, message: '请选择目标角色', trigger: 'change' } ]
      }
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
    handleAdd() {
      this.dialogTitle = '添加公告'
      this.form = { id: null, title: '', content: '', type: '', target_role: '' }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该公告吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        await axios.post('http://localhost:8089/api/sysadmin/announcement/DeleteById', null, { params: { id: row.id } })
        this.$message.success('删除成功')
        this.fetchAnnouncements()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除公告失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        const payload = {
          title: this.form.title,
          content: this.form.content,
          type: this.form.type,
          target_role: this.form.target_role
        }
        await axios.post('http://localhost:8089/api/sysadmin/announcement/publishNotice', payload)
          this.$message.success('添加成功')
        this.dialogVisible = false
        this.fetchAnnouncements()
      } catch (error) {
        this.$message.error('提交失败')
      }
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
.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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