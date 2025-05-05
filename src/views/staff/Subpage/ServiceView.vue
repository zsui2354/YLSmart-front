<!-- 服务信息列表管理 -->
<template>
  <div class="ServiceView">
    <div class="header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索服务id"
        style="width: 300px; margin-left: 20px"
        @input="handleSearch"
      >
        <template #append>
          <el-button>搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-table
      :data="serviceList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="name"
        label="服务名称"
        width="150"
      />
      <el-table-column
        prop="description"
        label="服务介绍"
      />
      <el-table-column
        prop="price"
        label="价格"
        width="120"
      >
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>
      <el-table-column
        prop="home_id"
        label="所属机构"
        width="120"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click="handleViewHome(row.home_id)"
          >
            {{ homeNames[row.home_id] || '加载中...' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next"
      class="Pagelayer"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ServiceView',
  data() {
    return {
      serviceList: [],
      nursingHomes: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: '',
      homeNames: {}
    }
  },
  created() {
    this.fetchServices()
  },
  methods: {
    async fetchServices() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/service/servicequeryBypage', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        console.log('服务列表完整响应:', response.data)
        console.log('服务列表数据:', response.data.list)
        console.log('第一个服务的完整数据:', response.data.list[0])
        
        this.serviceList = response.data.list
        this.total = response.data.total
        
        // 获取所有需要查询的机构ID
        const homeIds = [...new Set(this.serviceList.map(service => service.home_id).filter(Boolean))]
        console.log('需要查询的机构ID:', homeIds)
        
        // 批量获取机构信息
        const homePromises = homeIds.map(id => 
          axios.get(`http://localhost:8089/api/staff/nursinghome/SelectById?id=${id}`)
            .then(response => {
              if (response.data) {
                this.homeNames[id] = response.data.name
                console.log(`机构 ${id} 的名称:`, response.data.name)
              }
            })
            .catch(error => {
              console.error(`获取机构 ${id} 信息失败:`, error)
              this.homeNames[id] = '未知机构'
            })
        )
        
        await Promise.all(homePromises)
        console.log('所有机构名称:', this.homeNames)
        this.$forceUpdate()
      } catch (error) {
        console.error('获取服务列表失败:', error)
        this.$message.error('获取服务列表失败')
      }
    },
    async handleSearch() {
      if (!this.searchQuery) {
        // 如果搜索框为空，显示所有服务
        this.currentPage = 1
        this.fetchServices()
        return
      }

      try {
        // 根据ID搜索服务
        const response = await axios.get('http://localhost:8089/api/sysadmin/service/getServiceDetail', {
          params: {
            id: this.searchQuery
          }
        })
        
        if (response.data) {
          // 将单个服务转换为数组格式
          this.serviceList = [response.data]
          this.total = 1
          
          // 获取该服务的机构信息
          if (response.data.home_id) {
            const homeResponse = await axios.get(`http://localhost:8089/api/staff/nursinghome/SelectById?id=${response.data.home_id}`)
            if (homeResponse.data) {
              this.homeNames[response.data.home_id] = homeResponse.data.name
            }
          }
        } else {
          this.serviceList = []
          this.total = 0
          this.$message.warning('未找到相关服务')
        }
      } catch (error) {
        console.error('搜索服务失败:', error)
        this.$message.error('搜索服务失败')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchServices()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchServices()
    },
    async handleViewHome(homeId) {
      if (!homeId) {
        this.$message.warning('机构ID不存在')
        return
      }
      try {
        const response = await axios.get('http://localhost:8089/api/staff/nursinghome/SelectById', {
          params: {
            id: homeId
          }
        })
        if (response.data) {
          this.$message.info(`机构名称: ${response.data.name}\n地址: ${response.data.address}\n电话: ${response.data.phone}`)
        }
      } catch (error) {
        console.error('获取机构详情失败:', error)
        this.$message.error('获取机构详情失败')
      }
    }
  }
}
</script>

<style scoped>
.ServiceView {
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

.ServiceView:hover {
  box-shadow: var(--box-shadou_SJ);
}

.Pagelayer{
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>