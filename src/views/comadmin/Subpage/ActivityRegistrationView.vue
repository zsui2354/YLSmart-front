<!-- 活动报名列表管理 -->
<template>
  <div class="ActivityRegistrationView">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="registrationList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="报名ID"
      />
      <el-table-column
        prop="user_id"
        label="用户ID"
      />
      <el-table-column
        prop="activity_id"
        label="活动ID"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click="handleViewActivity(row.activity_id)"
          >
            {{ row.activity_id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="enrolled_at"
        label="报名时间"
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
    <!-- 活动详情弹窗 -->
    <el-dialog
      v-model="activityDialogVisible"
      title="活动详情"
      width="500px"
    >
      <el-descriptions
        v-if="activityDetail"
        :column="1"
        border
      >
        <el-descriptions-item label="活动ID">
          {{ activityDetail.id }}
        </el-descriptions-item>
        <el-descriptions-item label="标题">
          {{ activityDetail.title }}
        </el-descriptions-item>
        <el-descriptions-item label="内容">
          {{ activityDetail.content }}
        </el-descriptions-item>
        <el-descriptions-item label="地点">
          {{ activityDetail.place }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ activityDetail.start_time }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ activityDetail.end_time }}
        </el-descriptions-item>
        <el-descriptions-item label="最大参与人数">
          {{ activityDetail.max_participants }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ activityDetail.created_at }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ActivityRegistrationView',
  data() {
    return {
      registrationList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      activityDialogVisible: false,
      activityDetail: null
    }
  },
  created() {
    this.fetchRegistrations()
  },
  methods: {
    async fetchRegistrations() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/news/Activity_enrolllist', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        this.registrationList = response.data.list || []
        this.total = response.data.total || 0
      } catch (error) {
        this.$message.error('获取报名列表失败')
      } finally {
        this.loading = false
        this.$nextTick(() => {
          if (this.$refs.tableRef) this.$refs.tableRef.doLayout();
        });
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchRegistrations()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchRegistrations()
    },
    async handleViewActivity(activityId) {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/news/ActivitySelectById', {
          params: { id: activityId }
        })
        this.activityDetail = response.data
        this.activityDialogVisible = true
      } catch (error) {
        this.$message.error('获取活动详情失败')
      }
    }
  }
}
</script>

<style scoped>
.ActivityRegistrationView {
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

.ActivityRegistrationView:hover {
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
