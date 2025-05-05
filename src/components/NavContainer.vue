<template>
  <div class="NavContainer">
    <slot />
  </div>
</template>

<script>
export default{
    name:'NavContainer',
    props:{
        title: String
    }
}
</script>

<style scoped>
.NavContainer{
    /* border: 1px solid red; */
    position: fixed;
    height: 90%;
    min-height: 90%;
    width: 240px;       /* 导航条宽度 */
    top: 50%;
    transform: translateY(-50%);
    margin: 0 10px;
    transition: all 0.3s ease;
    border-radius: 100px;
}
.NavContainer #Logopostion{
    height: 20%;
}

.NavContainer:hover{
    /* border: 1px solid red; */
    position: fixed;
    height: 90%;
    width: 240px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 10px;
    border-radius: 0px;
}
</style>