<!-- 健康指标 -->

<template>
  <div class="HealthIndexView">
    <div class="search-bar">
      <el-input
        v-model="searchUserId"
        placeholder="请输入用户ID"
        style="width: 200px; margin-right: 10px"
        @keyup.enter="handleSearch"
      />
      <el-button
        type="primary"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </div>
    <div class="charts-container">
      <div class="chart-item">
        <div class="chart-title">
          血压趋势
        </div>
        <div
          ref="bloodPressureChart"
          class="chart"
        />
      </div>
      <div class="chart-item">
        <div class="chart-title">
          心率趋势
        </div>
        <div
          ref="heartRateChart"
          class="chart"
        />
      </div>
      <div class="chart-item">
        <div class="chart-title">
          体温趋势
        </div>
        <div
          ref="temperatureChart"
          class="chart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

export default {
  name: 'HealthIndexView',
  data() {
    return {
      healthData: [],
      searchUserId: '',
      bloodPressureChart: null,
      heartRateChart: null,
      temperatureChart: null
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeUnmount() {
    if (this.bloodPressureChart) this.bloodPressureChart.dispose()
    if (this.heartRateChart) this.heartRateChart.dispose()
    if (this.temperatureChart) this.temperatureChart.dispose()
  },
  methods: {
    async fetchHealthData(userId) {
      if (!userId) {
        this.healthData = []
        this.updateCharts()
        return
      }
      try {
        // 使用 list 接口获取健康记录
        const response = await axios.get('http://localhost:8089/api/sysadmin/HealthRecird/list', {
          params: { 
            pageNum: 1,
            pageSize: 100
          }
        })
        console.log('Fetched health data:', response.data)
        // 过滤出指定用户的数据
        this.healthData = (response.data.list || []).filter(item => item.user_id === parseInt(userId))
        this.updateCharts()
      } catch (error) {
        ElMessage.error('获取健康数据失败')
        this.healthData = []
        this.updateCharts()
        console.error('Error fetching health data:', error)
      }
    },
    handleSearch() {
      this.fetchHealthData(this.searchUserId)
    },
    initCharts() {
      this.bloodPressureChart = echarts.init(this.$refs.bloodPressureChart)
      this.heartRateChart = echarts.init(this.$refs.heartRateChart)
      this.temperatureChart = echarts.init(this.$refs.temperatureChart)
      this.updateCharts()
    },
    updateCharts() {
      // Check if charts are initialized
      if (!this.bloodPressureChart || !this.heartRateChart || !this.temperatureChart) {
        console.error('Charts not initialized')
        return
      }

      console.log('Updating charts with data:', this.healthData)

      // 使用原始数据
      const rawData = JSON.parse(JSON.stringify(this.healthData))

      const dates = rawData.map(item => {
        // 确保日期格式正确
        const date = new Date(item.date)
        return date.toLocaleDateString()
      })

      console.log('Processed dates:', dates)

      // 血压处理（分高压/低压）
      const systolic = rawData.map(item => {
        if (!item.blood_pressure) return null
        const parts = item.blood_pressure.split('/')
        return parts.length === 2 ? Number(parts[0]) : null
      })
      const diastolic = rawData.map(item => {
        if (!item.blood_pressure) return null
        const parts = item.blood_pressure.split('/')
        return parts.length === 2 ? Number(parts[1]) : null
      })

      console.log('Processed blood pressure data:', { systolic, diastolic })

      // 血压图表
      const bloodPressureOption = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['收缩压', '舒张压'] },
        xAxis: { type: 'category', data: dates, name: '日期' },
        yAxis: { type: 'value', name: '血压 (mmHg)' },
        series: [
          { name: '收缩压', data: systolic, type: 'line', smooth: true },
          { name: '舒张压', data: diastolic, type: 'line', smooth: true }
        ]
      }

      // 心率图表
      const heartRateOption = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: dates, name: '日期' },
        yAxis: { type: 'value', name: '心率 (bpm)' },
        series: [{ data: rawData.map(item => item.heart_rate), type: 'line', smooth: true }]
      }

      // 体温图表
      const temperatureOption = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: dates, name: '日期' },
        yAxis: { type: 'value', name: '体温 (°C)' },
        series: [{ data: rawData.map(item => item.temperature), type: 'line', smooth: true }]
      }

      try {
        this.bloodPressureChart.setOption(bloodPressureOption, true)
        this.heartRateChart.setOption(heartRateOption, true)
        this.temperatureChart.setOption(temperatureOption, true)
        console.log('Charts updated successfully')
      } catch (error) {
        console.error('Error updating charts:', error)
      }
    }
  }
}
</script>

<style scoped>
.HealthIndexView {
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

.HealthIndexView:hover {
  box-shadow: var(--box-shadou_SJ);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-item {
  background-color: var(--component-bg);
  border-radius: 10px;
  padding: 15px;
  box-shadow: var(--box-shadou_JJ);
}

.chart-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart {
  height: 300px;
  width: 100%;
}
</style>