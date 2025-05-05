<!-- 评论列表 -->
<template>
  <div class="CommentView">
    <div class="header">
      <el-input
        v-model="discussionId"
        placeholder="请输入讨论ID"
        style="width: 200px; margin-right: 10px"
      />
      <el-button
        type="primary"
        @click="fetchComments"
      >
        查询评论
      </el-button>
    </div>
    <el-table
      :data="commentList"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="id"
        label="评论ID"
        width="80"
      />
      <el-table-column
        prop="discussion_id"
        label="讨论ID"
        width="80"
      />
      <el-table-column
        prop="user_id"
        label="用户ID"
        width="80"
      />
      <el-table-column
        prop="content"
        label="内容"
      />
      <el-table-column
        prop="parent_id"
        label="父评论ID"
        width="100"
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="180"
      />
      <el-table-column
        prop="updated_at"
        label="更新时间"
        width="180"
      />
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CommentView',
  data() {
    return {
      discussionId: '',
      commentList: []
    }
  },
  methods: {
    async fetchComments() {
      if (!this.discussionId) {
        this.commentList = []
        this.$message.warning('请输入讨论ID')
        return
      }
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/issues/SelectIssuesComment', {
          params: { id: this.discussionId }
        })
        this.commentList = response.data || []
      } catch (error) {
        this.commentList = []
        this.$message.error('获取评论失败')
      }
    }
  }
}
</script>

<style scoped>
.CommentView {
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

.CommentView:hover {
  box-shadow: var(--box-shadou_SJ);
}
.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}
</style>
