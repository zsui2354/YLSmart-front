<template>
  <div class="health-index-view">
    <el-card>
      <div class="charts-container">
        <div class="chart-box">
          <h3>体温变化</h3>
          <div ref="tempChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>心率变化</h3>
          <div ref="heartChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>血压变化</h3>
          <div ref="bpChart" class="chart"></div>
        </div>
      </div>
      <!-- 健康报告生成区 -->
      <DeepSeekCopy :healthData="healthRecords" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import DeepSeekCopy from '@/components/DeepSeekCopy.vue'

const tempChart = ref(null)
const heartChart = ref(null)
const bpChart = ref(null)
const currentUserId = ref(null)
const healthRecords = ref([])

const getCurrentUserInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/sysadmin/user/getUser', {
      headers: {
        'Authorization': `${localStorage.getItem('yltoken')}`
      }
    })
    currentUserId.value = response.data.id
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

const fetchHealthRecords = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/user/healthrecord/healthrecordqueryByPage', {
      params: { pageNum: 1, pageSize: 100 }
    })
    // 只保留当前用户
    healthRecords.value = (response.data.list || []).filter(item => item.user_id === currentUserId.value)
  } catch (error) {
    ElMessage.error('获取健康记录失败')
  }
}

const renderCharts = () => {
  // 按日期升序
  const sorted = [...healthRecords.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  const dates = sorted.map(r => r.date.slice(0, 16))
  const temps = sorted.map(r => r.temperature)
  const hearts = sorted.map(r => r.heart_rate)
  const bps = sorted.map(r => {
    if (!r.blood_pressure) return null
    const [high, low] = r.blood_pressure.split('/').map(Number)
    return { high, low }
  })

  // 体温
  const tempInstance = echarts.init(tempChart.value)
  tempInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '°C', min: 35, max: 42 },
    series: [{
      data: temps,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      areaStyle: { color: '#ffe4b5' },
      lineStyle: { color: '#ff9900' }
    }]
  })

  // 心率
  const heartInstance = echarts.init(heartChart.value)
  heartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '次/分', min: 40, max: 200 },
    series: [{
      data: hearts,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      areaStyle: { color: '#b5e4ff' },
      lineStyle: { color: '#0099ff' }
    }]
  })

  // 血压
  const bpInstance = echarts.init(bpChart.value)
  bpInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['收缩压', '舒张压'] },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: 'mmHg', min: 60, max: 200 },
    series: [
      {
        name: '收缩压',
        data: bps.map(bp => bp ? bp.high : null),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        areaStyle: { color: '#ffd6e0' },
        lineStyle: { color: '#ff3366' }
      },
      {
        name: '舒张压',
        data: bps.map(bp => bp ? bp.low : null),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        areaStyle: { color: '#d6e0ff' },
        lineStyle: { color: '#3366ff' }
      }
    ]
  })
}

onMounted(async () => {
  await getCurrentUserInfo()
  await fetchHealthRecords()
  await nextTick()
  renderCharts()
})
</script>

<style scoped>
.health-index-view {
  padding: 20px;
  background: #f5f7fa;
}
.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
}
.chart-box {
  width: 420px;
  min-width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  padding: 24px 16px 16px 16px;
  margin-bottom: 24px;
}
.chart {
  width: 100%;
  height: 280px;
}
.chart-box h3 {
  text-align: center;
  margin-bottom: 12px;
  color: #333;
  font-weight: 500;
}
</style>