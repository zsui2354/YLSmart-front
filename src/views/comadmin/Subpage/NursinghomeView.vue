<!-- 机构列表
增加:点击会弹出一个 窗口 ，在窗口中填写信息后点击保存后数据插入到数据表中
修改:根据当前行ID 查询数据到 组件中，编辑组件数据后点击保存后更新到数据表中
删除:根据当前行ID 删除数据 
-->
<template>
  <div class="NursinghomeView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        新增机构
      </el-button>
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
      <el-table-column
        label="操作"
        width="200"
      >
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item
          label="机构名称"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="地址"
          prop="address"
        >
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item
          label="机构介绍"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="经度"
          prop="longitude"
        >
          <el-input-number
            v-model="form.longitude"
            :precision="6"
          />
        </el-form-item>
        <el-form-item
          label="纬度"
          prop="latitude"
        >
          <el-input-number
            v-model="form.latitude"
            :precision="6"
          />
        </el-form-item>
        <el-form-item
          label="评级等级"
          prop="level"
        >
          <el-select
            v-model="form.level"
            placeholder="请选择评级等级"
          >
            <el-option
              label="五星"
              value="五星"
            />
            <el-option
              label="四星"
              value="四星"
            />
            <el-option
              label="三星"
              value="三星"
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

export default {
  name: 'NursinghomeView',
  setup() {
    const tableData = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchQuery = ref('')
    const dialogVisible = ref(false)
    const dialogTitle = ref('新增机构')
    const formRef = ref(null)

    const form = reactive({
      id: null,
      name: '',
      address: '',
      phone: '',
      description: '',
      longitude: null,
      latitude: null,
      level: '',
      created_at: null
    })

    const rules = {
      name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
      address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      level: [{ required: true, message: '请选择评级等级', trigger: 'change' }]
    }

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

    const handleAdd = () => {
      dialogTitle.value = '新增机构'
      Object.keys(form).forEach(key => {
        form[key] = null
      })
      dialogVisible.value = true
    }

    const handleEdit = async (row) => {
      dialogTitle.value = '编辑机构'
      try {
        console.log('正在查询机构ID:', row.id)
        const response = await axios.get(`http://localhost:8089/api/sysadmin/nursinghome/SelectById?id=${row.id}`)
        console.log('查询结果:', response.data)
        if (response.data) {
          Object.assign(form, response.data)
          dialogVisible.value = true
        } else {
          ElMessage.error('未找到机构信息')
        }
      } catch (error) {
        console.error('查询失败:', error)
        ElMessage.error('获取机构信息失败')
      }
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm('确定要删除该机构吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await axios.post('http://localhost:8089/api/sysadmin/nursinghome/deleteById', 
            { id: row.id },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          ElMessage.success('删除成功')
          fetchData()
        } catch (error) {
          console.error('删除失败:', error)
          ElMessage.error('删除失败')
        }
      })
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (form.id) {
              await axios.post('http://localhost:8089/api/sysadmin/nursinghome/updateById', 
                form,
                {
                  headers: {
                    'token': localStorage.getItem('yltoken')
                  }
                }
              )
              ElMessage.success('更新成功')
            } else {
              await axios.post('http://localhost:8089/api/sysadmin/nursinghome/add', 
                form,
                {
                  headers: {
                    'token': localStorage.getItem('yltoken')
                  }
                }
              )
              ElMessage.success('添加成功')
            }
            dialogVisible.value = false
            fetchData()
          } catch (error) {
            ElMessage.error(form.id ? '更新失败' : '添加失败')
          }
        }
      })
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
      dialogVisible,
      dialogTitle,
      form,
      rules,
      formRef,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
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