NEW_FILE_CODE
# 文物鉴定与交易平台

一个基于 AI 大模型的文物鉴定、估价与交易平台，支持古玩、钱币、瓷器等多种文物的智能识别、真伪鉴定、市场估价和在线交易功能。

## ✨ 功能特性

### 🤖 AI 智能鉴定
- **图片识别**：上传文物图片，AI 自动识别文物类型、年代和特征
- **真伪鉴定**：基于 AI 分析生成详细的鉴定报告
- **病害诊断**：智能检测文物保存状况，提供修复建议
- **联网搜索**：实时搜索市场价格和相似藏品信息

###  智能估价系统
- **AI 估价**：基于历史数据和市场行情，提供精准价格评估
- **价格走势**：可视化展示文物价格历史趋势图
- **对话式估价**：支持多轮对话，获取更详细的估价分析
- **价格预测**：AI 预测未来价格走势

### 🛒 交易大厅
- **藏品发布**：支持双轨制发布（AI 自动分类 + 手动编辑）
- **分类浏览**：按钱币、瓷器、书画等分类浏览藏品
- **在线交易**：完整的订单管理和交易流程
- **市场动态**：实时查看市场行情和热门藏品

### 📱 用户体验
- **历史记录**：保存所有鉴定和估价记录
- **个人中心**：管理个人信息和收藏
- **多端适配**：支持小程序和 App 多端运行

## 🛠 技术栈

### 前端
- **框架**：uni-app（Vue 2）
- **UI 组件**：uni-ui
- **图表**：Canvas 自定义绘制（价格走势图）
- **网络请求**：uni.request + Promise 封装

### 后端
- **运行环境**：Node.js
- **Web 框架**：Express 5.2
- **HTTP 客户端**：Axios
- **工具库**：UUID、CORS
- **数据爬取**：cheerio、爬虫模块

### AI 服务
- **vivo AIGC 平台**：图片理解、文字生成
- **蓝心大模型**：智能对话、估价分析
- **OCR 识别**：文字提取与信息识别
- **联网搜索**：实时获取市场数据

## 📦 项目结构
   artifact-frontend/
├── pages/ # 页面文件
│ ├── index/ # 首页
│ ├── detail/ # 详情页（鉴定、诊断、聊天）
│ ├── trade/ # 交易相关（大厅、发布、订单）
│ ├── history/ # 历史记录
│ ├── profile/ # 个人中心
│ └── result/ # 鉴定结果
├── utils/ # 工具函数
│ ├── api.js # API 请求封装
│ ├── coinPriceScraper.js # 钱币价格爬虫
│ └── ultimateScraper.js # 通用爬虫模块
├── static/ # 静态资源
│ ├── tabbar/ # 底部导航图标
│ ├── goods-images/ # 商品示例图片
│ └── logo.png # 应用图标
├── server.js # 后端服务（Express）
├── scrape-images.js # 图片爬取脚本
├── App.vue # 应用入口
├── main.js # 主配置文件
├── pages.json # 页面路由配置
├── manifest.json # 应用配置
└── package.json # 项目依赖  plaintext           
## 🚀 快速开始

### 环境要求
- Node.js >= 14.x
- HBuilderX（推荐）或 uni-app CLI
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/H2Rhan/artifact-frontend.git
cd artifact-frontend   2. 安装依赖   bash     npm install   3. 配置 API 密钥  在 server.js 中配置 vivo AI 平台的认证信息：  javascript           const API_CONFIG = {
  app_id: '你的 app_id',
  api_key: '你的 api_key',
}   4. 启动后端服务   bash     node server.js   5. 运行前端项目  • 使用 HBuilderX 打开项目 • 选择运行到浏览器/模拟器/真机  开发模式  bash     # 后端热重载（需要安装 nodemon）
npm install -g nodemon
nodemon server.js

# 前端开发
# 在 HBuilderX 中点击"运行" -> "运行到浏览器"   📖 使用说明 AI 鉴定流程 1. 打开应用，点击"AI 鉴定" 2. 选择或拍摄文物照片 3. 等待 AI 分析（约 5-10 秒） 4. 查看鉴定报告和详细信息 5. 可选择查看病害诊断或进行对话咨询  发布藏品 1. 进入"交易大厅" -> "发布藏品" 2. 上传藏品照片 3. AI 自动识别并填写基本信息 4. 补充价格、描述等信息 5. 提交发布  估价功能 1. 在鉴定页面或交易页面点击"估价" 2. AI 分析文物特征和市场行情 3. 获取估价结果和价格趋势图 4. 支持多轮对话深入了解估价依据  🔧 API 说明 主要接口 接口 方法 描述   /api/identify POST AI 文物鉴定  /api/estimate POST AI 智能估价  /api/diagnosis POST 病害诊断  /api/chat POST AI 对话  /api/search POST 联网搜索  /api/publish POST 发布藏品  /api/trade/list GET 获取交易列表   vivo AI 平台配置 本项目使用 vivo AIGC 平台提供 AI 能力，需要申请以下服务： • 图片理解 API：文物识别与分析 • 文字生成 API：鉴定报告生成 • 联网搜索 API：市场价格查询  详细配置请参考 vivo 开放平台文档 ⚠️ 注意事项 1. API 密钥安全 ◦ 不要将 API 密钥提交到 Git ◦ 使用环境变量管理敏感信息 ◦ 定期更新密钥   2. 图片资源 ◦ 示例图片来自公开数据源 ◦ 生产环境建议使用自己的图片服务器 ◦ 注意图片版权和合规性   3. 网络请求 ◦ 本地开发时注意跨域配置 ◦ 生产环境配置正确的请求域名 ◦ 合理设置超时时间    🤝 贡献指南 欢迎提交 Issue 和 Pull Request！ 1. Fork 本项目 2. 创建特性分支 (git checkout -b feature/AmazingFeature) 3. 提交更改 (git commit -m 'Add some AmazingFeature') 4. 推送到分支 (git push origin feature/AmazingFeature) 5. 开启 Pull Request  📄 许可证 本项目采用 MIT 许可证 📞 联系方式 • 项目地址：https://github.com/H2Rhan/artifact-frontend • 问题反馈：Issues    感谢使用！如果觉得项目对你有帮助，欢迎 Star ⭐