<template>
  <div class="user-view">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 横幅轮播图 -->
      <div class="banner-carousel-wrapper">
        <el-carousel
          height="1000px"
          :interval="3000"
          arrow="always"
        >
          <el-carousel-item
            v-for="(item, idx) in bannerImages"
            :key="idx"
          >
            <img
              :src="item"
              class="banner-carousel-img"
              alt="banner"
            >
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 新闻区 -->
      <div class="news-section">
        <div class="news-header">
          <h2 class="news-title">
            最新新闻
          </h2>
          <div class="news-filter">
            <el-radio-group
              v-model="newsFilter"
              size="small"
            >
              <el-radio-button label="all">
                全部
              </el-radio-button>
              <el-radio-button label="官网发布">
                官网发布
              </el-radio-button>
              <el-radio-button label="人事处">
                人事处
              </el-radio-button>
              <el-radio-button label="运营部">
                运营部
              </el-radio-button>
              <el-radio-button label="健康中心">
                健康中心
              </el-radio-button>
              <el-radio-button label="技术部">
                技术部
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="news-container">
          <div class="news-list">
            <div
              v-for="item in newsList"
              :key="item.id"
              class="news-item"
              @click="showNewsDetail(item)"
            >
              <div class="news-item-content">
                <div class="news-item-tag">
                  {{ item.source }}
                </div>
                <h4 class="news-item-title">
                  {{ item.title }}
                </h4>
                <div class="news-item-meta">
                  <span class="news-date">{{ formatDate(item.published_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 公告区 -->
      <div class="announcement-area">
        <div class="announcement-header">
          <h2 class="announcement-title">
            最新公告
          </h2>
          <div class="announcement-type-filter">
            <el-radio-group
              v-model="announcementType"
              size="small"
            >
              <el-radio-button label="all">
                全部
              </el-radio-button>
              <el-radio-button label="系统">
                系统
              </el-radio-button>
              <el-radio-button label="社区">
                社区
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="announcement-list">
          <div
            v-for="item in announcementList"
            :key="item.id"
            class="announcement-item"
          >
            <div
              class="announcement-type-tag"
              :class="item.type === '系统' ? 'system' : 'community'"
            >
              {{ item.type }}
            </div>
            <div class="announcement-content">
              <div class="announcement-title">
                {{ item.title }}
              </div>
              <div class="announcement-desc">
                {{ item.content }}
              </div>
              <div class="announcement-time">
                {{ formatDate(item.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻详情弹窗 -->
    <el-dialog
      v-model="newsDialogVisible"
      :title="selectedNews?.title"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="news-detail">
        <div class="news-detail-meta">
          <span class="news-source">{{ selectedNews?.source }}</span>
          <span class="news-date">{{ formatDate(selectedNews?.published_at) }}</span>
        </div>
        <div class="news-detail-content" v-html="selectedNews?.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import yl3 from '@/assets/yl3.jpg'
import yl4 from '@/assets/yl4.jpeg'

const bannerImages = [yl3, yl4]

// 新闻模块
const newsList = ref([])
const newsFilter = ref('all')
const loadingNews = ref(true)
const newsDialogVisible = ref(false)
const selectedNews = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8089/api/user/news/list?pageNum=1&pageSize=1000')
    newsList.value = res.data.list || []
  } catch (e) {
    newsList.value = []
  } finally {
    loadingNews.value = false
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 显示新闻详情
const showNewsDetail = (news) => {
  selectedNews.value = news
  newsDialogVisible.value = true
}

// 公告模块
const announcementList = ref([])
const announcementType = ref('all')
const loadingAnnouncement = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8089/api/user/announcement/announcementqueryByPage?pageNum=1&pageSize=10')
    announcementList.value = res.data.list || []
  } catch (e) {
    announcementList.value = []
  } finally {
    loadingAnnouncement.value = false
  }
})
</script>

<style scoped>
.user-view {
  min-height: 100vh;
  background-color: #fff;
}

.content-wrapper {
}

/* 轮播图样式 */
.banner-carousel-wrapper,
.banner-carousel-wrapper .el-carousel,
.banner-carousel-wrapper .el-carousel__container,
.banner-carousel-wrapper .el-carousel__item {
  height: 1000px !important;
  min-height: 1000px !important;
}

.banner-carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 新闻区样式 */
.news-section {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.news-title {
  font-size: 28px;
  color: #333;
  margin: 0;
  font-weight: 600;
  position: relative;
  padding-left: 15px;
}

.news-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background-color: #2196f3;
  border-radius: 2px;
}

.news-container {
  display: flex;
  gap: 30px;
}

.news-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.news-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-right: 6px;
  cursor: pointer;
}

.news-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.news-item-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #f5f5f5;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}

.news-item-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
}

.news-item-meta {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.news-date {
  display: flex;
  align-items: center;
}

.news-date::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'/%3E%3C/svg%3E") no-repeat center;
  margin-right: 5px;
}

/* 公告区样式 */
.announcement-area {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.announcement-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.announcement-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-height: 900px;
  overflow-y: auto;
  padding-right: 10px;
}

.announcement-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.announcement-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.announcement-type-tag {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 12px;
  font-size: 12px;
  color: white;
  border-radius: 0 8px 0 0;
}

.announcement-type-tag.system {
  background-color: #2196f3;
}

.announcement-type-tag.community {
  background-color: #4caf50;
}

.announcement-content {
  margin-top: 10px;
}

.announcement-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.announcement-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.announcement-time {
  font-size: 12px;
  color: #999;
}

/* 新闻详情弹窗样式 */
.news-detail {
  padding: 20px;
}

.news-detail-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.news-source {
  padding: 4px 10px;
  background: #e3f2fd;
  color: #2196f3;
  border-radius: 4px;
}

.news-detail-content {
  line-height: 1.8;
  color: #333;
}

:deep(.news-detail-content img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 8px;
}

:deep(.news-detail-content p) {
  margin: 1em 0;
}

:deep(.news-detail-content h1),
:deep(.news-detail-content h2),
:deep(.news-detail-content h3),
:deep(.news-detail-content h4),
:deep(.news-detail-content h5),
:deep(.news-detail-content h6) {
  margin: 1.5em 0 1em;
  font-weight: 600;
}

:deep(.news-detail-content ul),
:deep(.news-detail-content ol) {
  margin: 1em 0;
  padding-left: 2em;
}

:deep(.news-detail-content li) {
  margin: 0.5em 0;
}

:deep(.news-detail-content blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #2196f3;
  background-color: #f5f5f5;
}

:deep(.news-detail-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

:deep(.news-detail-content th),
:deep(.news-detail-content td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(.news-detail-content th) {
  background-color: #f5f5f5;
}
</style>
