<!-- 新闻列表管理 -->
<template>
  <div class="NewsView">
    <div class="header">
      <el-button
        type="primary"
        @click="handleAdd"
      >
        添加新闻
      </el-button>
    </div>

    <el-table
      :data="newsList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
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
        prop="published_at"
        label="发布时间"
        width="180"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.published_at) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="来源"
        width="150"
      />
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
      class="Pagelayer"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="wang-edit-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="form.title"
              placeholder="请输入新闻标题"
            />
          </el-form-item>
          <el-form-item
            label="来源"
            prop="source"
          >
            <el-input
              v-model="form.source"
              placeholder="请输入新闻来源"
            />
          </el-form-item>
          <el-form-item
            label="内容"
            prop="content"
          >
            <div id="editor"></div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { format } from 'date-fns'
import WangEditor from 'wangeditor'

export default {
  name: 'NewsView',
  data() {
    return {
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '添加新闻',
      form: {
        id: null,
        title: '',
        content: '',
        source: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' }
        ]
      },
      editor: null
    }
  },
  created() {
    this.fetchNews()
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get('http://localhost:8089/api/sysadmin/news/newslist', {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        this.newsList = response.data.list
        this.total = response.data.total
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        this.$message.error('获取新闻列表失败')
      }
    },
    formatDateTime(dateTime) {
      return dateTime ? format(new Date(dateTime), 'yyyy-MM-dd HH:mm:ss') : ''
    },
    handleAdd() {
      this.dialogTitle = '添加新闻'
      this.form = {
        id: null,
        title: '',
        content: '',
        source: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
      })
    },
    handleEdit(row) {
      this.dialogTitle = '编辑新闻'
      this.form = { ...row }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEditor()
        this.editor.txt.html(row.content)
      })
    },
    initEditor() {
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = new WangEditor('#editor')
      this.editor.config.onchange = (newHtml) => {
        this.form.content = newHtml
      }

      // 配置图片上传
      this.editor.config.uploadImgServer = 'http://localhost:8089/publicapi/files/upload'
      this.editor.config.uploadFileName = 'file'
      
      // 配置图片相关设置
      this.editor.config.uploadImgShowBase64 = false  // 不使用 base64
      this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']  // 允许的图片类型
      this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024  // 5M
      this.editor.config.uploadImgMaxLength = 5  // 最多上传5张图片
      
      this.editor.config.uploadImgHooks = {
        success: (xhr, editor, result) => {
          console.log('上传成功:', result)
          // 从返回的数据中获取图片URL
          const imgUrl = result.data
          if (imgUrl) {
            // 使用 wangEditor 的 API 插入图片
            editor.cmd.do('insertHtml', `<img src="${imgUrl}" style="max-width:100%;"/>`)
          } else {
            this.$message.error('获取图片地址失败')
          }
        },
        fail: (xhr, editor, result) => {
          console.error('上传失败:', result)
          this.$message.error(result.msg || '图片上传失败')
        },
        // eslint-disable-next-line no-unused-vars
        error: (xhr, editor) => {
          console.error('上传错误')
          this.$message.error('图片上传出错')
        },
        customInsert: (insertImgFn, result) => {
          // 从 result 中获取图片 url
          const url = result.data
          // 插入图片
          insertImgFn(url)
        }
      }

      this.editor.create()
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该新闻吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.post('http://localhost:8089/api/sysadmin/news/DeleteById', null, {
          params: {
            id: row.id
          }
        })
        
        this.$message.success('删除成功')
        this.fetchNews()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除新闻失败:', error)
          this.$message.error('删除新闻失败')
        }
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        
        if (this.form.id) {
          // 更新新闻
          await axios.post('http://localhost:8089/api/sysadmin/news/Update', this.form)
          this.$message.success('更新成功')
        } else {
          await axios.post('http://localhost:8089/api/sysadmin/news/Insert', null, {
            params: {
              title: this.form.title,
              content: this.form.content,
              source: this.form.source
            }
          })
          this.$message.success('添加成功')
        }
        
        this.dialogVisible = false
        this.fetchNews()
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchNews()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchNews()
    }
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
    }
  }
}
</script>

<style scoped>
.NewsView {
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

.NewsView:hover {
  box-shadow: var(--box-shadou_SJ);
}

.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;

}

.Pagelayer {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.wang-edit-container {
  padding: 20px;
}

#editor {
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

#editor :deep(.w-e-text-container) {
  height: 400px !important;
}

#editor :deep(.w-e-text) {
  height: 100% !important;
}

#editor :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>