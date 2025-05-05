<template>
  <div id="mapContainer" />
</template>

<script setup>
// export default{
//     name:'MapContainer',
//     methods:{
//         initMap(){
//             this.AMap = AMap
//         },

//     }
// }


import { onMounted } from 'vue'

    onMounted(() => {
    const AMap = window.AMap

   // const base_url = "/"
    const layers = [new AMap.TileLayer({
        getTileUrl: (x, y, z) => {
            return `http://localhost:3333/tiles/${z}/${x}/${y}.png`
        },
        opacity: 1,
        zIndex: 99,
    })]

    const map = new AMap.Map('mapContainer', {
        resizeEnable: true,         /* 可调整大小 */
        zoom: 15,                   /* 缩放 */
        rotateEnable: true,         /* 可旋转 */
        pitchEnable: true,          /* 可倾斜 */
        center: [126.60, 45.76],     /* 中心 */
        defaultCursor: 'pointer',       /* 默认游标 */
        showLabel: true,                /* 展示标签 */
        layers: layers,                 /* 层次 */
    })

    console.log('地图加载成功', map)

    //异步加载控件
    AMap.plugin('AMap.ToolBar',function(){ 
    var toolbar = new AMap.ToolBar(); //缩放工具条实例化
    map.addControl(toolbar); //添加控件
    });

    //点标记显示内容
    const markerContent = `<div class="custom-content-marker">
    <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
    <div class="close-btn" onclick="clearMarker()">X</div>
    </div>`

    const position = new AMap.LngLat(116.397428, 39.90923); //Marker 经纬度
    const marker = new AMap.Marker({
        position: position,
        content: markerContent, //将 html 传给 content
        offset: new AMap.Pixel(126.63,45.76), //以 icon 的 [center bottom] 为原点
    });

    map.add(marker);
    
    
    })



</script>

<style scoped>
#mapContainer {
    width: 700px;
    height: 100%;
    min-height: 400px; /* 避免没高度 */
}










.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}

.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
}

.custom-content-marker .close-btn:hover{
  background: #666;
}
</style>