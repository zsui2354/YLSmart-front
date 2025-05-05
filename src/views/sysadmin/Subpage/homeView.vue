<!-- 首页 -->
<template>
  <div class="homeView">
    <!-- 数据统计环形进度条 -->
    <div class="statistics-container">
      <el-row :gutter="20">
        <el-col
          v-for="item in statList"
          :key="item.id"
          :span="6"
        >
          <div class="circle-stat">
            <div
              :id="item.id"
              class="circle-chart"
            />
            <div class="circle-center">
              <div class="circle-label">
                {{ item.label }}
              </div>
              <div class="circle-value">
                {{ item.value }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 最近公告 -->
    <div class="announcements-container">
      <el-card class="announcement-card">
        <template #header>
          <div class="card-header">
            <span>最近公告</span>
            <el-button
              type="text"
              @click="refreshAnnouncements"
            >
              刷新
            </el-button>
          </div>
        </template>
        <el-table
          v-loading="loading"
          :data="recentAnnouncements"
          style="width: 100%"
        >
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
            prop="created_at"
            label="发布时间"
            width="180"
          >
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts';

export default {
    name: 'HomeView',
    data() {
        return {
            statistics: {
                userCount: 0,
                Raminfo: 0,
                Cpuinfo: 0,
                Admin_total: 0
            },
            statList: [
                { id: 'userCount', label: '用户', value: 0, color: '#f06292' },
                { id: 'Admin_total', label: '管理员', value: 0, color: '#f06292' },
                { id: 'Raminfo', label: 'RAM', value: 0, color: '#f06292' },
                { id: 'Cpuinfo', label: 'CPU', value: 0, color: '#f06292' }
               
            ],
            recentAnnouncements: [],
            loading: false
        }
    },
    watch: {
        statistics: {
            handler(val) {
                this.statList[0].value = val.userCount;
                this.statList[3].value = Number(val.Raminfo).toFixed(2);
                this.statList[2].value = Number(val.Cpuinfo).toFixed(2);
                this.statList[1].value = val.Admin_total;
                this.$nextTick(this.renderCharts);
            },
            deep: true
        }
    },
    mounted() {
        this.$nextTick(this.renderCharts);
    },
    created() {
        this.fetchStatistics()
        this.fetchRecentAnnouncements()
    },
    methods: {
        renderCharts() {
            this.statList.forEach(item => {
                const chartDom = document.getElementById(item.id);
                if (!chartDom) return;
                const myChart = echarts.init(chartDom);
                myChart.setOption({
                    series: [{
                        type: 'pie',
                        radius: ['70%', '90%'],
                        avoidLabelOverlap: false,
                        silent: true,
                        label: { show: false },
                        data: [
                            { value: item.value, name: item.label, itemStyle: { color: item.color } },
                            { value: Math.max(100 - item.value, 0), itemStyle: { color: '#f8bbd0' } }
                        ]
                    }]
                });
            });
        },
        async fetchStatistics() {
            try {
                // 获取用户总数
                const userCountResponse = await axios.get('http://localhost:8089/api/sysadmin/analytics/User_total');
                this.statistics.userCount = userCountResponse.data;

                // 管理员总数
                const Admin_total = await axios.get('http://localhost:8089/api/sysadmin/analytics/Admin_total');
                this.statistics.Admin_total = Admin_total.data;

                // cpu占用
                const Cpuinfo = await axios.get('http://localhost:8089/api/sysadmin/analytics/Cpuinfo');
                this.statistics.Cpuinfo = Cpuinfo.data;

                // ram占用
                const Raminfo = await axios.get('http://localhost:8089/api/sysadmin/analytics/Raminfo');
                this.statistics.Raminfo = Raminfo.data;
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        },
        async fetchRecentAnnouncements() {
            this.loading = true
            try {
                const response = await axios.get('http://localhost:8089/api/sysadmin/announcement/list', {
                    params: {
                        pageNum: 1,
                        pageSize: 5
                    }
                })
                this.recentAnnouncements = response.data.list || []
            } catch (error) {
                console.error('获取最近公告失败:', error)
                this.$message.error('获取最近公告失败')
            } finally {
                this.loading = false
            }
        },
        refreshAnnouncements() {
            this.fetchRecentAnnouncements()
            this.$message.success('刷新成功')
        },
        formatDate(date) {
            if (!date) return ''
            const d = new Date(date)
            return d.toLocaleString()
        }
    }
}
</script>

<style scoped>
.homeView {
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

.homeView:hover {
    box-shadow: var(--box-shadou_SJ);
}

.statistics-container {
    margin-bottom: 20px;
}

.circle-stat {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
}
.circle-chart {
  width: 140px;
  height: 140px;
}
.circle-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.circle-label {
  color: #e91e63;
  font-size: 18px;
  font-weight: bold;
}
.circle-value {
  color: #e91e63;
  font-size: 20px;
  margin-top: 4px;
}

.announcements-container {
    margin-top: 20px;
}

.announcement-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-card {
    border-radius: 8px;
    transition: all 0.3s;
}

.el-card:hover {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
</style>