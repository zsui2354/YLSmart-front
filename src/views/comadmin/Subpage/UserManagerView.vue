<!-- 用户列表管理 -->
<template>
  <div class="UserManagerView">
    <TableComponentUsermanager />
  </div>
</template>

<script>
import TableComponentUsermanager from '@/components/TableComponentUsermanager.vue'

export default{
    components:{
        TableComponentUsermanager
    }
}
</script>

<style scoped>
.UserManagerView{
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
.UserManagerView:hover{
    box-shadow: var(--box-shadou_SJ);
}
</style>


<!-- 

:root[data-theme='light'] {
    --bg-color: #fff;
    --component-bg: #ffffff;
    --text-color: #000;
    --box-shadou_JJ:0 3px 15px rgba(0,0,0,0.35);
    --box-shadou_SJ:0 3px 15px rgba(0,0,0,0.20);

    --iconBg:rgba(70, 195, 199, 0);
}
:root[data-theme='dark'] {
    --bg-color: #1a1a1a;            /* 页面配色 */
    --component-bg:#1d1c1c;    /* 组件暗色主题背景配色 */
    --text-color: #fff;
    --box-shadou_JJ:0 3px 15px rgba(190, 190, 190, 0.25);
    --box-shadou_SJ:0 3px 15px rgba(190, 190, 190, 0.15);

    --iconBg:#ffffff;
}
body {
    background-color: var(--bg-color);
    color: var(--text-color);
    
}


-->