<!-- 服务信息列表管理 -->
<template>
  <div class="ServiceView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        新增服务
      </el-button>
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
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next"
      class="Pagelayer"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 编辑对话框 -->
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
          label="服务名称"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="服务介绍"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item
          label="价格"
          prop="price"
        >
          <el-input-number
            v-model="form.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          label="所属机构"
          prop="home_id"
        >
          <el-select
            v-model="form.home_id"
            placeholder="请选择机构"
          >
            <el-option
              v-for="home in nursingHomes"
              :key="home.id"
              :label="home.name"
              :value="home.id"
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
      dialogVisible: false,
      dialogTitle: '编辑服务',
      homeNames: {},
      form: {
        id: null,
        name: '',
        description: '',
        price: 0,
        home_id: null
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入服务介绍', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        home_id: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchServices()
    this.fetchNursingHomes()
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
    async fetchNursingHomes() {
      try {
        // 获取所有机构的ID列表
        const response = await axios.get('http://localhost:8089/api/sysadmin/nursinghome/query')
        const homeIds = response.data.map(home => home.id)
        
        // 获取每个机构的详细信息
        const homePromises = homeIds.map(id => 
          axios.get(`http://localhost:8089/api/staff/nursinghome/SelectById?id=${id}`)
        )
        
        const homeResponses = await Promise.all(homePromises)
        this.nursingHomes = homeResponses.map(res => res.data)
      } catch (error) {
        console.error('获取养老机构列表失败:', error)
        this.$message.error('获取养老机构列表失败')
      }
    },
    async getHomeName(homeId) {
      try {
        if (!homeId) return '未知机构'
        if (this.homeNames[homeId]) return this.homeNames[homeId]
        
        const response = await axios.get(`http://localhost:8089/api/staff/nursinghome/SelectById?id=${homeId}`)
        const name = response.data ? response.data.name : '未知机构'
        this.homeNames[homeId] = name
        return name
      } catch (error) {
        console.error('获取机构信息失败:', error)
        return '未知机构'
      }
    },
    handleEdit(row) {
      this.dialogTitle = '编辑服务'
      this.form = { ...row }
      this.dialogVisible = true
    },
    handleAdd() {
      this.dialogTitle = '新增服务'
      this.form = {
        id: null,
        name: '',
        description: '',
        price: 0,
        home_id: null
      }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        // 只发送指定字段
        const payload = {
          id: this.form.id,
          name: this.form.name,
          description: this.form.description,
          price: this.form.price,
          home_id: this.form.home_id
        }
        
        if (this.form.id) {
          // 编辑现有服务
          await axios.post('http://localhost:8089/api/sysadmin/service/updateServiceItem', payload)
          this.$message.success('更新成功')
        } else {
          // 新增服务
          await axios.post('http://localhost:8089/api/sysadmin/service/insertServiceItem', payload)
          this.$message.success('添加成功')
        }
        
        this.dialogVisible = false
        this.fetchServices()
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败')
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该服务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.post(`http://localhost:8089/api/sysadmin/service/DeleteServiceItem?id=${row.id}`)
        this.$message.success('删除成功')
        this.fetchServices()
      } catch (error) {
        if (error === 'cancel') {
          return
        }
        if (error.response && error.response.status === 400) {
          this.$message.error('该服务已经有人预约，无法删除')
        } else {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
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