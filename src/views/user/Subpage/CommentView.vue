<template>
  <div class="comment-issue-view">
    <el-row :gutter="32">
      <!-- 左侧标题列表 -->
      <el-col :span="6">
        <el-card class="issue-list-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: bold; font-size: 16px;">议题列表</span>
            <el-button type="primary" size="small" @click="showAddIssueDialog = true">添加议题</el-button>
          </div>
          <div class="issue-list">
            <div
              v-for="item in titleList"
              :key="item.id"
              :class="['issue-item', { active: item.id === selectedId }]"
              @click="selectTitle(item)"
            >
              <span class="issue-title">{{ item.title }}</span>
              <span class="issue-date">{{ item.created_at.slice(0, 10) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧内容和评论流 -->
      <el-col :span="18">
        <el-card class="issue-detail-card">
          <template v-if="selectedDiscussion">
            <div class="issue-main-block">
              <div class="issue-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <el-avatar
                    :size="32"
                    :src="userMap[selectedDiscussion.creator_id]?.avatar ? 'http://localhost:8089' + userMap[selectedDiscussion.creator_id].avatar : ''"
                  />
                  <span style="color: #888; font-size: 14px;">{{ userMap[selectedDiscussion.creator_id]?.real_name || ('用户ID: ' + selectedDiscussion.creator_id) }}</span>
                  <span class="issue-main-title" style="margin-left: 8px;">{{ selectedDiscussion.title }}</span>
                </div>
                <span class="issue-main-date">{{ selectedDiscussion.created_at }}</span>
                <el-button type="primary" size="small" class="comment-btn" @click="showCommentDialog = true">评论</el-button>
              </div>
              <div class="issue-main-content">{{ selectedDiscussion.content }}</div>
            </div>
            <div class="comment-flow">
              <div v-if="commentList.length === 0" class="no-comment">暂无评论</div>
              <div v-else>
                <div v-for="comment in commentList" :key="comment.id" class="comment-block" @click="handleCommentClick(comment)">
                  <div class="comment-avatar">
                    <el-avatar
                      :size="36"
                      :src="userMap[comment.user_id]?.avatar ? 'http://localhost:8089' + userMap[comment.user_id].avatar : ''"
                    />
                  </div>
                  <div class="comment-body">
                    <div class="comment-meta">
                      <span class="comment-user">{{ userMap[comment.user_id]?.real_name || ('用户ID: ' + comment.user_id) }}</span>
                      <span class="comment-time">{{ comment.created_at }}</span>
                    </div>
                    <div class="comment-content">{{ comment.content }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 评论弹窗 -->
            <el-dialog v-model="showCommentDialog" title="发表评论" width="400px">
              <el-input
                v-model="newCommentContent"
                type="textarea"
                :rows="4"
                placeholder="请输入评论内容"
                maxlength="200"
                show-word-limit
              />
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="showCommentDialog = false">取消</el-button>
                  <el-button type="primary" @click="submitComment" :loading="submittingComment">发送</el-button>
                </span>
              </template>
            </el-dialog>
          </template>
          <div v-else class="no-select">请选择左侧标题查看详情</div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加议题弹窗 -->
    <el-dialog v-model="showAddIssueDialog" title="添加议题" width="400px">
      <el-input v-model="newIssueTitle" placeholder="请输入议题标题" maxlength="50" show-word-limit style="margin-bottom: 12px;" />
      <el-input v-model="newIssueContent" type="textarea" :rows="4" placeholder="请输入议题内容" maxlength="200" show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddIssueDialog = false">取消</el-button>
          <el-button type="primary" @click="submitNewIssue" :loading="submittingIssue">提交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除评论弹窗 -->
    <el-dialog v-model="showDeleteDialog" title="删除评论" width="300px">
      <div>确定要删除这条评论吗？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="deleteComment">删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const titleList = ref([])
const selectedId = ref(null)
const selectedDiscussion = ref(null)
const commentList = ref([])
const userMap = ref({})
const showCommentDialog = ref(false)
const newCommentContent = ref('')
const submittingComment = ref(false)
const currentUserId = ref(null)
const showAddIssueDialog = ref(false)
const newIssueTitle = ref('')
const newIssueContent = ref('')
const submittingIssue = ref(false)
const selectedComment = ref(null)
const showDeleteDialog = ref(false)

const fetchUserMap = async () => {
  try {
    let pageNum = 1
    let allUsers = []
    let hasNext = true
    while (hasNext) {
      const res = await axios.get('http://localhost:8089/api/sysadmin/user/list', {
        params: { pageNum, pageSize: 100 }
      })
      allUsers = allUsers.concat(res.data.list)
      hasNext = res.data.nextPage > 0
      pageNum++
    }
    const map = {}
    allUsers.forEach(u => {
      map[u.id] = { real_name: u.real_name, avatar: u.avatar }
    })
    userMap.value = map
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

const fetchCurrentUserId = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
      headers: {
        'Authorization': `${localStorage.getItem('yltoken')}`
      }
    })
    currentUserId.value = response.data.id
  } catch (error) {
    ElMessage.error('获取当前用户信息失败')
  }
}

const fetchTitleList = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/issues/getDiscussionsqueryByPage')
    titleList.value = response.data.list
    if (titleList.value.length && !selectedId.value) {
      selectTitle(titleList.value[0])
    }
  } catch (error) {
    ElMessage.error('获取标题失败')
  }
}

const selectTitle = async (item) => {
  selectedId.value = item.id
  selectedDiscussion.value = item
  await fetchComments(item.id)
}

const fetchComments = async (discussionId) => {
  try {
    const response = await axios.get(`http://localhost:8089/api/user/issues/queryIssuesComment?id=${discussionId}`)
    commentList.value = response.data
  } catch (error) {
    ElMessage.error('获取评论失败')
  }
}

const submitComment = async () => {
  if (!newCommentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  if (!currentUserId.value) {
    await fetchCurrentUserId()
    if (!currentUserId.value) {
      ElMessage.error('请先登录')
      return
    }
  }
  submittingComment.value = true
  try {
    const commentData = {
      discussion_id: selectedId.value,
      user_id: currentUserId.value,
      content: newCommentContent.value,
      parent_id: 1
    }
    await axios.post('http://localhost:8089/api/user/issues/addcomment', commentData)
    ElMessage.success('评论成功')
    showCommentDialog.value = false
    newCommentContent.value = ''
    fetchComments(selectedId.value)
  } catch (error) {
    console.error(error.response?.data)
    ElMessage.error(error.response?.data?.message || '评论失败')
  } finally {
    submittingComment.value = false
  }
}

const submitNewIssue = async () => {
  if (!newIssueTitle.value.trim()) {
    ElMessage.warning('议题标题不能为空')
    return
  }
  if (!newIssueContent.value.trim()) {
    ElMessage.warning('议题内容不能为空')
    return
  }
  if (!currentUserId.value) {
    await fetchCurrentUserId()
    if (!currentUserId.value) {
      ElMessage.error('请先登录')
      return
    }
  }
  submittingIssue.value = true
  try {
    await axios.post('http://localhost:8089/api/user/issues/createIssues', {
      title: newIssueTitle.value,
      content: newIssueContent.value,
      creator_id: currentUserId.value
    })
    ElMessage.success('议题创建成功')
    showAddIssueDialog.value = false
    newIssueTitle.value = ''
    newIssueContent.value = ''
    fetchTitleList()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '议题创建失败')
  } finally {
    submittingIssue.value = false
  }
}

const handleCommentClick = (comment) => {
  if (comment.user_id === currentUserId.value) {
    selectedComment.value = comment
    showDeleteDialog.value = true
  }
}

const deleteComment = async () => {
  if (!selectedComment.value) return
  try {
    await axios.post(
      `http://localhost:8089/api/sysadmin/issues/deleteComment?id=${selectedComment.value.id}`,
      {},
      {
        headers: {
          token: `${localStorage.getItem('yltoken')}`
        }
      }
    )
    ElMessage.success('删除成功')
    showDeleteDialog.value = false
    selectedComment.value = null
    fetchComments(selectedId.value)
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '删除失败')
  }
}

onMounted(async () => {
  await fetchUserMap()
  await fetchCurrentUserId()
  fetchTitleList()
  window.addEventListener('user-info-updated', fetchUserMap)
})

onUnmounted(() => {
  window.removeEventListener('user-info-updated', fetchUserMap)
})
</script>

<style scoped>
.comment-issue-view {
  background: #f5f7fa;
  min-height: 100vh;
}
.issue-list-card {
  min-height: 500px;
  border-radius: 10px;
  margin-top: 50px;
  height: 80vh;
  max-height: 80vh;
  overflow-y: auto;
}
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.issue-item {
  padding: 14px 16px 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: background 0.2s, color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.issue-item.active {
  background: #e6f0ff;
  color: #409EFF;
  font-weight: 600;
}
.issue-title {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.issue-date {
  color: #bbb;
  font-size: 13px;
  margin-left: 12px;
}
.issue-detail-card {
  min-height: 500px;
  border-radius: 10px;
  padding-bottom: 24px;
  margin-top: 50px;
  height: 80vh;
  max-height: 80vh;
  overflow-y: auto;
}
.issue-main-block {
  background: #f8fafd;
  border-radius: 8px;
  padding: 18px 20px 12px 20px;
  margin-bottom: 24px;
}
.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.issue-main-title {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}
.issue-main-date {
  color: #bbb;
  font-size: 13px;
}
.issue-main-content {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}
.comment-flow {
  margin-top: 8px;
}
.comment-block {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  padding: 14px 18px 10px 14px;
  margin-bottom: 16px;
}
.comment-avatar {
  flex-shrink: 0;
}
.comment-body {
  flex: 1;
}
.comment-meta {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.comment-content {
  font-size: 15px;
  color: #222;
  word-break: break-all;
}
.no-comment {
  color: #bbb;
  text-align: center;
  margin: 24px 0;
}
.no-select {
  color: #bbb;
  text-align: center;
  margin: 80px 0;
  font-size: 18px;
}
.comment-btn {
  margin-left: 16px;
}
</style>
