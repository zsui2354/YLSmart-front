    <template>
        <div class="map-wrapper">
        <div id="map" class="map-container"></div>
        <div class="control-panel">
            <el-card class="max-w-3xl mx-auto mt-10">
            <h2 class="text-xl font-bold mb-4">添加养老院信息</h2>
            <el-form :model="form" label-width="100px">
                <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="请输入养老院名称" />
                </el-form-item>
    
                <el-form-item label="地址">
                <el-input v-model="form.address" placeholder="请输入地址" />
                </el-form-item>
    
                <el-form-item label="电话">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
    
                <el-form-item label="简介">
                <el-input
                    type="textarea"
                    v-model="form.description"
                    placeholder="请输入简介"
                    :rows="3"
                />
                </el-form-item>
    
                <el-form-item label="等级">
                <el-select v-model="form.level" placeholder="请选择等级">
                    <el-option label="一星" value="一星" />
                    <el-option label="二星" value="二星" />
                    <el-option label="三星" value="三星" />
                    <el-option label="四星" value="四星" />
                    <el-option label="五星" value="五星" />
                </el-select>
                </el-form-item>
    
                <el-form-item>
                <el-button type="primary" @click="saveToDB">提交</el-button>
                <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            </el-card>
        </div>
        </div>
    </template>
    
    <script setup>
    /* global AMap */
    import { ref, onMounted, reactive } from 'vue'
    import axios from 'axios'
    import { ElMessage } from 'element-plus'
    
    const map = ref(null)
    const marker = ref(null)
    const clickedLngLat = ref([])
    const defD  = 126.642464;
    const defB  = 45.756967;

    const form = reactive({
        name: '',
        address: '',
        phone: '',
        description: '',
        level: ''
    })
    
    function reset() {
        form.name = ''
        form.address = ''
        form.phone = ''
        form.description = ''
        form.level = ''
    }
    
    async function loadAMapScript() {
        return new Promise((resolve, reject) => {
        if (window.AMap) return resolve(window.AMap)
    
        const script = document.createElement('script')
        script.src =
            'https://webapi.amap.com/maps?v=2.0&key=035e6df047fb1cf9feabc3c253276b44&plugin=AMap.Scale,AMap.ToolBar'
        script.onload = () => resolve(window.AMap)
        script.onerror = () => reject(new Error('AMap 加载失败'))
        document.head.appendChild(script)
        })
    }
    
    onMounted(async () => {
        try {
        await loadAMapScript()
    
        map.value = new AMap.Map('map', {
            zoom: 11,
            center: [defD, defB]
        })
    
        // 加载插件
        AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
            map.value.addControl(new AMap.Scale())
            map.value.addControl(new AMap.ToolBar())
        })
    
        map.value.on('click', (e) => {
            const { lng, lat } = e.lnglat
            clickedLngLat.value = [lng, lat]
            if (marker.value) marker.value.setMap(null)
    
            marker.value = new AMap.Marker({
            position: clickedLngLat.value,
            map: map.value
            })
        })
        } catch (err) {
        console.error('地图加载失败:', err)
        ElMessage.error('地图加载失败，请检查网络或 Key 是否正确')
        }
    })
    
    const saveToDB = async () => {
        if (!clickedLngLat.value.length) {
        ElMessage.warning('请先在地图上点击选择位置')
        return
        }
    
        const [lng, lat] = clickedLngLat.value
        const token = localStorage.getItem('yltoken')
    
        try {
        const res = await axios.post(
            'http://localhost:8089/api/sysadmin/nursinghome/add',
            {
            name: form.name,
            address: form.address,
            phone: form.phone,
            description: form.description,
            longitude: lng,
            latitude: lat,
            level: form.level
            },
            {
            headers: {
                Authorization: `${token}`
            }
            }
        )
    
        console.log('接口返回:', res)
        ElMessage.success('已保存坐标')
        } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请检查网络或接口服务是否可用')
        }
    }
    </script>
    
    <style scoped>
    .map-wrapper {
        display: flex;
        flex-direction: column;
    }
    
    .map-container {
        width: 100%;
        height: 500px;
        margin-bottom: 20px;
    }
    
    .control-panel {
        padding: 0 20px;
    }
    </style>
  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
<!--     
    <template>
        <div class="map-wrapper">
        <div id="map" class="map-container"></div>
        <div class="control-panel"> -->
            <!-- <p>当前点击位置：{{ clickedLngLat }}</p> -->
            <!-- <button @click="addMarker">添加定位点</button> -->

<!--             <el-card class="max-w-3xl mx-auto mt-10">
                <h2 class="text-xl font-bold mb-4">添加养老院信息</h2>
                <el-form :model="form" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="form.name" placeholder="请输入养老院名称" />
                </el-form-item>

                <el-form-item label="地址">
                    <el-input v-model="form.address" placeholder="请输入地址" />
                </el-form-item>

                <el-form-item label="电话">
                    <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>

                <el-form-item label="简介">
                    <el-input
                    type="textarea"
                    v-model="form.description"
                    placeholder="请输入简介"
                    :rows="3"
                    />
                </el-form-item>

                <el-form-item label="等级">
                    <el-select v-model="form.level" placeholder="请选择等级">
                    <el-option label="一星" value="一星" />
                    <el-option label="二星" value="二星" />
                    <el-option label="三星" value="三星" />
                    <el-option label="四星" value="四星" />
                    <el-option label="五星" value="五星" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button style="color: #333;" type="primary" @click="saveToDB">提交</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
                </el-form>
            </el-card> -->
<!--             <button @click="saveToDB">保存到数据库</button>
            <button @click="fetchFromDB">查询并显示定位点</button> -->
<!--         </div>
        </div>
    </template>
    
    <script setup> -->
    /* global AMap */

/*     import { ref, onMounted ,reactive} from 'vue'
    import axios from 'axios'
    import { ElMessage } from 'element-plus'
    
    const map = ref(null)
    const marker = ref(null)
    const clickedLngLat = ref([])
    
    onMounted(() => {
        map.value = new AMap.Map('map', {
        zoom: 11,
        center: [126.642464, 45.756967] 
        })
    
        map.value.on('click', (e) => {
        const { lng, lat } = e.lnglat
        clickedLngLat.value = [lng, lat]
        if (!clickedLngLat.value.length) return
        if (marker.value) marker.value.setMap(null)
    
        marker.value = new AMap.Marker({
        position: clickedLngLat.value,
        map: map.value
        })
        })
    })
    

    const form = reactive({
        name: '',
        address: '',
        phone: '',
        description: '',
        level: ''
    })

    function reset() {
        form.name = ''
        form.address = ''
        form.phone = ''
        form.description = ''
        form.level = ''
    }


    const saveToDB = async () => {
        if (!clickedLngLat.value.length) return;
        const [lng, lat] = clickedLngLat.value;

        const token = localStorage.getItem('yltoken')

        try {
            const res = await axios.post('http://localhost:8089/api/sysadmin/nursinghome/add', {
            name: form.name,
            address: form.address,
            phone: form.phone,
            description: form.description,
            longitude: lng,
            latitude: lat,
            level: form.level
            },
            {
                headers: {
                    Authorization: `${token}`
                }
            }
        );

            console.log('接口返回:', res); // Debug: 看接口是否真的成功
            ElMessage.success('已保存坐标');
        } catch (error) {
            console.error('保存失败:', error);
            ElMessage.error('保存失败，请检查网络或接口服务是否可用');
        }
    }; */


    /* const fetchFromDB = async () => {
        const res = await axios.get('/api/location/query?id=1')
        const { lng, lat } = res.data
        if (marker.value) marker.value.setMap(null)
        
        marker.value = new AMap.Marker({
        position: [lng, lat],
        map: map.value
        })
        map.value.setCenter([lng, lat])

    } */

/* <!-- </script> --> */
 
    
/*     <style scoped>
    .map-wrapper{
    }
    .control-panel button{
        padding: 10px 10px;
        margin: 5px;
        font-size: 16px;
        background: transparent;
        border: 1px solid #5fc7d47a;
        border-radius: 10px;
        transition: all 0.3s ease;
        cursor: pointer;
        color: #333;
    }
    .control-panel button:hover{
        background-color: #68c7e4;
        color: #ffffff;
    }
    .amap-layers{
        display: none;
    }
    .map-wrapper {
        display: flex;
        flex-direction: column;
    }
    .map-container {
        width: 100%;
        height: 500px;
    }
    .control-panel {
        margin-top: 10px;
    }
    </style> */
