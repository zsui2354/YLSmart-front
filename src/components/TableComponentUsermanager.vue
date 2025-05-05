<template>
  <div class="TableComponent">
    <!-- 表格 -->
    <el-table
      id="TableComponent_table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'name', order: 'ascending'}"
        
      @row-click="handleRowClick"
    >
      <!-- 多选框 -->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->

      <!-- 列：ID -->
      <el-table-column
        prop="id"
        label="ID"
        class="TableItem"
      />

      <!-- 列：姓名 -->
      <el-table-column
        prop="username"
        label="姓名"
        class="TableItem"
      />

      <!-- 列：昵称 -->
      <el-table-column
        prop="real_name"
        label="昵称"
        class="TableItem"
      />

      <!-- 列：手机号 -->
      <el-table-column
        prop="phone"
        label="手机号"
        class="TableItem"
      />

      <!-- 列：头像路径 -->
      <el-table-column
        prop="avatar"
        label="头像路径"
        class="TableItem"
      />

      <!-- 列：角色ID -->
      <el-table-column
        prop="role_id"
        label="角色ID"
        class="TableItem"
      />

      <!-- 列：账户状态 -->
      <el-table-column
        prop="status"
        label="账户状态 禁用/启用"
        class="TableItem"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <!-- 列：创建时间 -->
      <el-table-column
        prop="created_at"
        label="创建时间"
        class="TableItem"
      />

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        width="120"
      >
        <template #default="scope">
          <el-button 
            type="primary" 
            size="mini" 
            @click="showEditDialog(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog 
      v-model="dialogVisible"
      :title="'编辑用户信息 - ' + editForm.username"
      width="50%"
    >
      <el-form 
        ref="editFormRef" 
        :model="editForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editForm.username"
            disabled
          />
        </el-form-item>
                
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="editForm.password"
            type="password"
          />
        </el-form-item>
                
        <el-form-item
          label="昵称"
          prop="real_name"
        >
          <el-input v-model="editForm.real_name" />
        </el-form-item>
                
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input v-model="editForm.phone" />
        </el-form-item>
                
        <el-form-item
          label="头像路径"
          prop="avatar"
        >
          <el-input v-model="editForm.avatar" />
        </el-form-item>
                
        <el-form-item
          label="角色ID"
          prop="role_id"
        >
          <el-input
            v-model="editForm.role_id"
            type="number"
          />
        </el-form-item>
                
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-switch 
            v-model="editForm.status" 
            :active-value="1" 
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
            
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitEdit"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="Pagelayer">
      <!-- 分页插件 -->
      <el-pagination 
        layout="prev, pager, next" 
        :total="totalItems" 
        :page-size="pageSize" 
        :current-page="currentPage" 
        @current-change="handlePageChange" 
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default{
    name: 'TableComponent',
    data(){
        return{
            // 表格数据
            tableData: [],
            selectedRows: [],   // 当前选中的行
            loading: false,     // 表格加载状态
            dialogVisible: false, // 编辑弹窗显示状态
            editForm: {         // 编辑表单数据
                id: '',
                username: '',
                password: '',
                real_name: '',
                phone: '',
                avatar: '',
                role_id: '',
                status: 1
            },
            rules: {            // 表单验证规则
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                real_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                role_id: [{ required: true, message: '请输入角色ID', trigger: 'blur' }]
            },

            // 当前页码
            currentPage: 1,
            // 每页显示的数据条数
            pageSize: 10,
            // 总数据条数
            totalItems: 1000,
            // 当前页的数据
            items: [],
        }
    },
    mounted(){
        this.GetUserListInfo();
    },
    methods: {
        // 显示编辑弹窗
        showEditDialog(row) {
            this.editForm = { ...row }; // 使用对象展开符避免引用问题
            this.dialogVisible = true;
        },
        
        // 提交编辑
        submitEdit() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    axios
                        .post("http://localhost:8089/api/sysadmin/user/Change_UserInformation", {
                            id: this.editForm.id,
                            username: this.editForm.username,
                            password: this.editForm.password,
                            real_name: this.editForm.real_name,
                            phone: this.editForm.phone,
                            avatar: this.editForm.avatar,
                            role_id: this.editForm.role_id,
                            status: this.editForm.status,
                            token: localStorage.getItem('yltoken')
                        },
                        {
                            headers: {
                                'Authorization': `${localStorage.getItem('yltoken')}`
                            }
                        })
                        .then(() => {
                            ElMessage.success("用户信息更新成功");
                            this.dialogVisible = false;
                            this.GetUserListInfo(); // 刷新列表
                        })
                        .catch((error) => {
                            console.error("用户信息更新失败:", error);
                            ElMessage.error("用户信息更新失败");
                        });
                }
            });
        },
        // 页码变化时触发
        handlePageChange(page) {
            this.currentPage = page;
            this.GetUserListInfo();
        },
        // 每页显示条数变化时触发
        handleSizeChange(size) {
            this.pageSize = size;
            this.GetUserListInfo();
        },
        handleStatusChange(row){
            console.log(row.status)
            axios
                .post("http://localhost:8089/api/sysadmin/user/Change_UserInformation", {
                    id: row.id,
                    username: row.username,
                    password: row.password,
                    real_name: row.real_name,
                    phone: row.phone,
                    avatar: row.avatar,
                    role_id: row.role_id,
                    status: row.status,
                    token: localStorage.getItem('yltoken')
                },
                {
                    headers: {
                        'Authorization': `${localStorage.getItem('yltoken')}`
                    }
                })
                .then((response) => {
                    // 请求成功后的回调
                    console.log("用户信息更新成功:", response.data);
                    this.$message.success("状态更新成功");
                })
                .catch((error) => {
                    // 请求失败后的回调
                    console.error("用户信息更新失败:", error);
                    this.$message.error("状态更新失败");
            });

        },
        // 单行点击事件
        handleRowClick(row) {
            this.selectedRow = row;
            console.log("当前选中的行:", row);
        },

        // 处理多选框的变化
        // handleSelectionChange(selectedRows) {
        //     this.selectedRows = selectedRows.map(row => row.id); // 获取每个行的 id
        //     console.log("当前选中的行 :", this.selectedRows);
        // },


        // 排序函数：根据姓名进行排序
        sortByName(a, b) {
            return a.name.localeCompare(b.name);
        },

        // 排序函数：根据年龄进行排序
        sortByAge(a, b) {
            return a.age - b.age;
        },

        //获取用户列表信息
        GetUserListInfo(){
            axios.get('http://localhost:8089/api/sysadmin/user/list',{
                params:{
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                }
            })
            .then(res => {
                console.log('请求成功:', res.data.list);
                this.tableData = res.data.list;
            })
            .catch(error =>{
                console.error('请求失败:', error);
            })
        },
    }
}
</script>

<style scoped>
.TableComponent{
    /* border: 1px solid red; */
    height: 100%;
    overflow-y: scroll;  /* 允许纵向滚动 */
    overflow-x: auto;    /* 允许横向滚动 */
}
.TableComponent::-webkit-scrollbar{
    display: none;  /* 隐藏滚动条 */
}
#TableComponent_table{
    background-color: var(--component-bg);
    color: var(--text-color);
    max-width: 100%;
    overflow-x: auto;
    /* border: 1px solid red; */
}
el-table{
    border: 1;
    width: 100%;
    max-height: 400px; /* 可调节，确保表格容器有高度 */
    overflow-x: auto; /* 横向滚动条 */
    overflow-y: auto; /* 纵向滚动条 */
}
.Pagelayer{
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
   /*  border: 1px solid red; */
    align-items: center;
    justify-content: center;
}

</style>


