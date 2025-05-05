// tile-server.js
// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3333; // 本地服务端口

// // 让 tiles 静态挂载
// app.use('/tiles', express.static(path.join(__dirname, 'MapData')));

// app.listen(port, () => {
//     console.log(`🚀 Tile server running at http://localhost:${port}/tiles`);
// });


const express = require('express');
const path = require('path');
const cors = require('cors');  // 引入 CORS 模块
const app = express();
const port = 3333;

// 使用 CORS 中间件，允许所有来源的请求
app.use(cors());

// 静态资源挂载
app.use('/tiles', express.static(path.join(__dirname, 'MapData')));

app.listen(port, () => {
    console.log(`🚀 Tile server running at http://localhost:${port}/tiles`);
});