
<template>
    <div>
      <h2>{{ isEditMode ? '编辑新闻' : '发布新闻' }}</h2>
      <div id="editor"></div>
      <button @click="saveContent">保存</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import WangEditor from 'wangeditor'
  
  export default {
    data() {
      return {
        editor: null,
        content: ''
      }
    },
    computed: {
      isEditMode() {
        return this.$route.params.id != null
      }
    },
    mounted() {
      this.initEditor()
      if (this.isEditMode) {
        this.fetchNewsContent()
      }
    },
    methods: {
      initEditor() {
        this.editor = new WangEditor('#editor')
        this.editor.config.onchange = (newHtml) => {
          this.content = newHtml
        }
  
        this.editor.config.uploadImgServer = 'http://localhost:8089/publicapi/files/upload'  // 后端上传接口
        this.editor.config.uploadImgParams = {}  // 可以添加需要的额外参数（如权限令牌等）

        // 配置上传图片的处理函数
        this.editor.config.uploadImgHooks = {
        success: (xhr, editor, result) => {
            const imageUrl = result.url // 假设接口返回的是图片的URL
            editor.cmd.do('insertHtml', `<img src="${imageUrl}" />`) // 在编辑器插入图片
        },
        fail: (result) => {
            console.error('上传失败', result)
        },
        error: () => {
            console.error('上传错误')
        }
        }

        this.editor.create()
      },
      fetchNewsContent() {
        const newsId = this.$route.params.id
        // 发起请求获取新闻内容
        axios.get(`http://localhost:8089/api/sysadmin/news/${newsId}`).then((response) => {
          this.editor.txt.html(response.data.content)
        })
      },
      saveContent() {
        const title = '测试插入' // 可以根据实际情况获取
        const source = '来源' // 来源字段
        const content = this.content // 获取编辑器中的内容
  
        // 发起请求保存新闻
        axios.post(`http://localhost:8089/api/sysadmin/news/Insert`, null, {
          params: {
            title: title,
            content: content,
            source: source
          }
        })
        .then(response => {
          console.log('新闻插入成功', response)
          // 处理插入成功后的操作，如跳转到新闻列表页面
          this.$router.push('/news/list') // 假设跳转到新闻列表页面
        })
        .catch(error => {
          console.error('插入新闻失败', error)
        })
      }
    }
  }
  </script>
  
  <style scoped>
  #editor {
    height: 400px;
  }
  </style>
  