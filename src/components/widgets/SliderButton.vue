<template>
  <div
    class="SliderButton"
    @click="handleButton"
  >
    <div
      ref="radiu"
      class="radiu"
    />
  </div>
</template>

<script>
import { useThemeStore } from '@/stores/themeStore'

export default{
    name: 'SliderButton',
    data(){
        return{
            ButtonStatus: true,
            themeStore: useThemeStore()
        }
    },
    computed: {
            theme() {
                return this.themeStore.theme
            }
    },
    methods:{
            handleButton(){
                this.themeStore.toggleTheme()
                const rad = this.$refs.radiu
                if(this.ButtonStatus){
                    rad.style.transform = 'translateX(80%)'
                }else{
                    rad.style.transform = 'translateX(0%)'
                }
                this.ButtonStatus = !this.ButtonStatus;
            }
    }
}
</script>

<style>
.SliderButton{
    /* border: 1px solid red; */
    position: fixed;
    width: 50px;
    height: 22px;
    border-radius: 100px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.35);
    bottom: 10px;
    left: 100px;
    
    /* transform: translateX(90px); */
    background-color: #ffffff;
    cursor: pointer;
    
}
.SliderButton .radiu{
    /* border: 1px solid red; */
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 100px;
    background-color:rgb(70, 195, 199) ;
    /* top: 50%; */
    top: -3px;
    /* transform: translateY(-50%); */
    transition: all 0.3s ease;
    box-shadow: 0 0px 15px rgba(70, 195, 199, 0.9);
}
</style>