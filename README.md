# 🏺 文物鉴定与交易平台

一个基于 **AI + C++** 的智能文物鉴定、估价与交易平台。

---

## ✨ 核心亮点

- 🤖 **AI大模型驱动**：集成vivo蓝心大模型
- ⚡ **C++高性能计算**：核心算法使用C++实现
- 📊 **技术分析引擎**：SMA/EMA/RSI/MACD等专业指标
-  **多平台数据聚合**：实时爬取主流平台数据

---

## 🛠 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| C++ 11 | 核心算法引擎 | 价格预测、技术分析、图像处理 |
| Node.js / Express | Web后端服务 | HTTP服务、API代理 |
| Vue 2 / uni-app | 前端框架 | 跨平台应用开发 |
| vivo AI平台 | AI能力 | 图片理解、文字生成 |

---

## 📦 C++ 核心模块

### 1. 价格预测引擎 (artifact_analyzer.cpp)
- 移动平均线计算（SMA/EMA）
- 相对强弱指数（RSI）
- MACD指标分析
- 布林带计算
- 线性回归预测

### 2. 图像处理与识别 (image_processor.cpp)
- 颜色直方图提取
- Sobel边缘检测
- 纹理特征分析
- 文物智能分类

### 3. 爬虫核心引擎 (scraper_core.cpp)
- HTTP请求封装
- JSON数据解析
- 多平台数据聚合

### 4. 价格预测工具 (price_prediction.cpp)
- 命令行价格预测
- 统计数据计算

---

## 📁 项目结构

- **artifact_analyzer.cpp** - C++文物分析引擎
- **image_processor.cpp** - C++图像处理模块
- **scraper_core.cpp** - C++爬虫引擎
- **price_prediction.cpp** - C++价格预测工具
- **cpp-module/** - C++模块目录
- **pages/** - 前端页面
- **utils/** - 工具函数
- **static/** - 静态资源
- **server.js** - Node.js后端
- **package.json** - 项目依赖

---

## 🚀 快速开始

### 环境要求

- Node.js >= 14.x
- C++ Compiler：g++ >= 10.0
- HBuilderX（推荐）
- npm 或 yarn

### 安装步骤

1. **克隆项目**   git clone https://github.com/H2Rhan/artifact-frontend.git
cd artifact-frontend  plaintext           
2. **安装依赖**   npm install  plaintext           
3. **编译C++模块**   g++ -o artifact_analyzer.exe artifact_analyzer.cpp -std=c++11
g++ -o image_processor.exe image_processor.cpp -std=c++11
g++ -o scraper_core.exe scraper_core.cpp -std=c++11
g++ -o price_prediction.exe price_prediction.cpp -std=c++11  plaintext           
4. **配置API密钥**
   在 `server.js` 中配置vivo AI平台的认证信息

5. **启动服务**   node server.js  plaintext           
6. **运行前端**
   使用HBuilderX打开项目，选择运行到浏览器

---

## 🔧 API接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/identify | POST | AI文物鉴定 |
| /api/estimate | POST | AI智能估价 |
| /api/diagnosis | POST | 病害诊断 |
| /api/chat | POST | AI对话 |
| /api/predict-price | POST | C++价格预测 |

---

## 📊 技术指标

| 指标 | 全称 | 用途 |
|------|------|------|
| SMA | Simple Moving Average | 简单移动平均 |
| EMA | Exponential Moving Average | 指数移动平均 |
| RSI | Relative Strength Index | 相对强弱指数 |
| MACD | Moving Average Convergence Divergence | 趋势指标 |
| Bollinger Bands | 布林带 | 价格波动区间 |

---

## ⚠️ 注意事项

- 🔐 不要将API密钥提交到Git
- 📷 示例图片来自公开数据源
- 🌍 本地开发注意跨域配置

---

⭐ **如果这个项目对你有帮助，欢迎Star！**
