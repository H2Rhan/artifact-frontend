# 🏺 文物鉴定与交易平台

一个基于 **AI + C++** 的智能文物鉴定、估价与交易平台，融合深度学习、数值计算和现代Web技术，支持古玩、钱币、瓷器等多种文物的智能识别、真伪鉴定、市场估价和在线交易功能。

---

## ✨ 核心亮点

- 🤖 **AI大模型驱动**：集成vivo蓝心大模型，实现智能鉴定与对话估价
- ⚡ **C++高性能计算**：核心算法模块采用C++实现，确保数值计算的高效性
- 📊 **技术分析引擎**：内置SMA/EMA/RSI/MACD/布林带等专业金融指标
-  **多平台数据聚合**：实时爬取古泉园地、微拍堂、华夏古泉等主流平台数据
- 🎨 **古风UI设计**：高端暖色调古风设计，提供沉浸式用户体验

---

## 🛠 技术栈

###  核心技术

| 技术 | 用途 | 说明 |
|------|------|------|
| **C++ 11** | 核心算法引擎 | 价格预测、技术分析、图像处理 |
| **Node.js / Express** | Web后端服务 | HTTP服务、API代理、数据管理 |
| **Vue 2 / uni-app** | 前端框架 | 跨平台应用开发（小程序+App） |
| **vivo AI平台** | AI能力 | 图片理解、文字生成、OCR识别 |

### 📦 C++ 核心模块

#### 1. **价格预测引擎** (artifact_analyzer.cpp)
- ✅ 移动平均线计算（SMA/EMA）
- ✅ 相对强弱指数（RSI）
- ✅ MACD指标分析
- ✅ 布林带计算
- ✅ 线性回归/多项式回归预测
- ✅ 波动率分析

#### 2. **图像处理与识别** (image_processor.cpp)
- ✅ 颜色直方图提取
- ✅ Sobel边缘检测
- ✅ 纹理特征分析
- ✅ 图像质量评估
- ✅ 文物智能分类
- ✅ 特征相似度计算

#### 3. **爬虫核心引擎** (scraper_core.cpp)
- ✅ HTTP请求封装（带重试机制）
- ✅ JSON数据解析
- ✅ 多平台数据聚合
- ✅ 数据去重与搜索
- ✅ 自动朝代/分类识别

#### 4. **价格预测工具** (price_prediction.cpp)
- ✅ 命令行价格预测
- ✅ 统计数据计算
- ✅ 趋势分析

### 🌐 后端服务

- **Express 5.2**：Web框架
- **Axios**：HTTP客户端
- **cheerio**：HTML解析
- **UUID**：唯一标识生成
- **CORS**：跨域支持

### 🎨 前端技术

- **uni-app**：跨平台框架
- **Vue 2**：视图层
- **Canvas**：自定义图表绘制
- **uni-ui**：UI组件库

---

## 📦 项目结构
   artifact-frontend/
├── artifact_analyzer.cpp # C++文物分析引擎
├── image_processor.cpp # C++图像处理模块
├── scraper_core.cpp # C++爬虫引擎
├── price_prediction.cpp # C++价格预测工具
├── cpp-module/ # C++模块
├── pages/ # 前端页面
├── utils/ # 工具函数
├── static/ # 静态资源
├── server.js # Node.js后端
└── package.json # 项目依赖  plaintext           
---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 14.x
- **C++ Compiler**：g++ >= 10.0
- **HBuilderX**（推荐）
- **npm** 或 yarn

### 安装步骤

#### 1. 克隆项目
git clone https://github.com/H2Rhan/artifact-frontend.git
cd artifact-frontend
 2. 安装依赖 
 npm install
 3. 编译C++模块
g++ -o artifact_analyzer.exe artifact_analyzer.cpp -std=c++11
g++ -o image_processor.exe image_processor.cpp -std=c++11
g++ -o scraper_core.exe scraper_core.cpp -std=c++11
g++ -o price_prediction.exe price_prediction.cpp -std=c++11
 4. 配置API密钥 在 server.js 中配置vivo AI平台的认证信息。
5. 启动服务
node server.js
6. 运行前端 使用HBuilderX打开项目，选择运行到浏览器。
📖 功能说明 AI鉴定流程 1. 打开应用，点击 AI鉴定 2. 选择或拍摄文物照片 3. 等待AI分析（约5-10秒） 4. 查看鉴定报告
💰 智能估价系统 1. 点击 估价 2. C++引擎计算技术指标 3. AI分析市场行情 4. 获取估价结果和趋势图
🛒 发布藏品 1. 进入 交易大厅 → 发布藏品 2. 上传照片 3. AI自动识别 4. 提交发布
🔧 API接口 接口 方法 描述   /api/identify POST AI文物鉴定  /api/estimate POST AI智能估价  /api/diagnosis POST 病害诊断  /api/chat POST AI对话  /api/predict-price POST C++价格预测  
C++调用示例  
./price_prediction.exe predict "350,365,358,372,380" 7  
输出：  {
  "prediction": 395.2,
  "sma_7": 375.0,
  "volatility": 0.035
}
📊 技术指标 指标 全称 用途   SMA Simple Moving Average 简单移动平均  EMA Exponential Moving Average 指数移动平均  RSI Relative Strength Index 相对强弱指数  MACD Moving Average Convergence Divergence 指数平滑异同平均线  Bollinger Bands 布林带 价格波动区间
 ⚠️ 注意事项
• 🔐 不要将API密钥提交到Git
• 📷 示例图片来自公开数据源
• 🌍 本地开发注意跨域配置
 ⭐ 如果这个项目对你有帮助，欢迎Star！
