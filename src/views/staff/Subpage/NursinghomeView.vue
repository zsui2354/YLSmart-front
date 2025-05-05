<!-- 机构列表
增加:点击会弹出一个 窗口 ，在窗口中填写信息后点击保存后数据插入到数据表中
修改:根据当前行ID 查询数据到 组件中，编辑组件数据后点击保存后更新到数据表中
删除:根据当前行ID 删除数据 
-->
<template>
  <div class="NursinghomeView">
    <div class="header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索机构id"
        style="width: 300px; margin-left: 20px"
        @input="handleSearch"
      >
        <template #append>
          <el-button>搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="name"
        label="机构名称"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        prop="phone"
        label="联系电话"
      />
      <el-table-column
        prop="level"
        label="评级等级"
      />
      <el-table-column
        prop="created_at"
        label="添加时间"
      />
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'NursinghomeView',
  setup() {
    const tableData = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchQuery = ref('')

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8089/api/sysadmin/nursinghome/list`, {
          headers: {
            'token': localStorage.getItem('yltoken')
          },
          params: {
            pageNum: currentPage.value,
            pageSize: pageSize.value
          }
        })
        tableData.value = response.data.list
        total.value = response.data.total
      } catch (error) {
        ElMessage.error('获取数据失败')
      }
    }

    const handleSearch = async () => {
      if (searchQuery.value) {
        try {
          const response = await axios.get(`http://localhost:8089/api/sysadmin/nursinghome/SelectById?id=${searchQuery.value}`)
          if (response.data) {
            tableData.value = [response.data]
          } else {
            tableData.value = []
            ElMessage.warning('未找到匹配的机构')
          }
        } catch (error) {
          console.error('搜索失败:', error)
          ElMessage.error('搜索失败')
        }
      } else {
        fetchData()
      }
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchData()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchData()
    }

    onMounted(() => {
      fetchData()
    })

    return {
      tableData,
      currentPage,
      pageSize,
      total,
      searchQuery,
      handleSearch,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.NursinghomeView{
    /* border: 1px solid red; */
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
.NursinghomeView:hover{
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