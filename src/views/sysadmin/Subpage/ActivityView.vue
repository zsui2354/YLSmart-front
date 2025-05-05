<!-- 活动列表管理 -->
<template>
  <div class="ActivityView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        添加活动
      </el-button>
    </div>

    <el-table
      :data="activityList"
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
        prop="place"
        label="地点"
        width="150"
      />
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.start_time) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="max_participants"
        label="最大参与人数"
        width="120"
      />
      <el-table-column
        label="操作"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
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
            placeholder="请输入活动标题"
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
            placeholder="请输入活动内容"
          />
        </el-form-item>
        <el-form-item
          label="地点"
          prop="place"
        >
          <el-input
            v-model="form.place"
            placeholder="请输入活动地点"
          />
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="start_time"
        >
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="end_time"
        >
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item
          label="最大参与人数"
          prop="max_participants"
        >
          <el-input-number
            v-model="form.max_participants"
            :min="1"
            placeholder="请输入最大参与人数"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { format } from 'date-fns'

export default {
  name: 'ActivityView',
  data() {
    return {
      activityList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '添加活动',
      form: {
        id: null,
        title: '',
        content: '',
        place: '',
        start_time: '',
        end_time: '',
        max_participants: 1
      },
      rules: {
        title: [
          { required: true, message: '请输入活动标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ],
        place: [
          { required: true, message: '请输入活动地点', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        end_time: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        max_participants: [
          { required: true, message: '请输入最大参与人数', trigger: 'blur' }
        ]
      },
      activityDialogVisible: false,
      activityDetail: null,
    }
  },
  created() {
    this.fetchActivities()
  },
  methods: {
    async fetchActivities() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/news/Activitylist', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        this.activityList = response.data.list
        this.total = response.data.total
      } catch (error) {
        console.error('获取活动列表失败:', error)
        this.$message.error('获取活动列表失败')
      }
    },
    formatDateTime(dateTime) {
      return dateTime ? format(new Date(dateTime), 'yyyy-MM-dd HH:mm:ss') : ''
    },
    handleAdd() {
      this.dialogTitle = '添加活动'
      this.form = {
        id: null,
        title: '',
        content: '',
        place: '',
        start_time: '',
        end_time: '',
        max_participants: 1
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑活动'
      this.form = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.post('http://localhost:8089/api/sysadmin/news/ActivityDeleteById', null, {
          params: {
            id: row.id
          }
        })
        
        this.$message.success('删除成功')
        this.fetchActivities()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除活动失败:', error)
          this.$message.error('删除活动失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        
        if (this.form.id) {
          // 更新活动
          await axios.post('http://localhost:8089/api/sysadmin/news/ActivityUpdate', this.form)
          this.$message.success('更新成功')
        } else {
          // 添加活动
          await axios.post('http://localhost:8089/api/sysadmin/news/ActivityInsert', this.form)
          this.$message.success('添加成功')
        }
        
        this.dialogVisible = false
        this.fetchActivities()
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchActivities()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchActivities()
    }
  }
}
</script>

<style scoped>
.ActivityView {
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

.ActivityView:hover {
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