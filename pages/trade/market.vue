<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="top-bar">
      <text class="app-title">钱币交易市场</text>
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="searchKeyword" @confirm="handleSearch" placeholder="搜索藏品名称、年份..." />
      </view>
      <button class="ai-price-btn" @click="handleAIPrice">🤖 AI估价</button>
      <button class="publish-btn" @click="goPublish">+ 发布</button>
    </view>

    <!-- 古风 Banner -->
    <view class="banner-wrapper">
      <view class="banner-content">
        <text class="banner-title">精品钱币</text>
        <text class="banner-subtitle">古钱币 · 纪念钞 · 收藏币 · 珍稀品种</text>
        <button class="banner-btn">立即查看</button>
      </view>
      <view class="banner-dots">
        <view class="dot active"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>

    <!-- 圆形分类入口 -->
    <view class="category-grid">
      <view class="cat-item" v-for="cat in categories" :key="cat.name" @click="filterByCategory(cat.name)">
        <view class="cat-icon-wrapper">
          <text class="cat-icon">{{ cat.icon }}</text>
        </view>
        <text class="cat-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 专区入口 -->
    <view class="zone-grid">
      <view class="zone-card auction">
        <text class="zone-title">拍卖专区</text>
        <text class="zone-desc">珍稀钱币 · 竞拍捡漏</text>
        <text class="zone-icon">🔨</text>
      </view>
      <view class="zone-card pickup">
        <text class="zone-title">捡漏专区</text>
        <text class="zone-desc">低价好物 · 先到先得</text>
        <text class="zone-icon">💰</text>
      </view>
      <view class="zone-card market">
        <text class="zone-title">地摊集市</text>
        <text class="zone-desc">源头好货 · 自由交易</text>
        <text class="zone-icon">🪙</text>
      </view>
    </view>

    <!-- 推荐藏品 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">推荐藏品</text>
        <view class="tab-bar">
          <text :class="['tab-item', activeRecTab === 'latest' ? 'active' : '']" @click="activeRecTab = 'latest'">最新上架</text>
          <text :class="['tab-item', activeRecTab === 'popular' ? 'active' : '']" @click="activeRecTab = 'popular'">人气最高</text>
        </view>
        <text class="more">更多 ›</text>
      </view>

      <view class="goods-list">
        <view class="goods-card" v-for="item in displayGoods" :key="item.id" @click="goDetail(item)">
          <view class="image-wrapper">
            <image class="goods-img" :src="item.image" mode="aspectFill" @error="onImageError(item)"></image>
            <view class="badge" :class="item.isAuth ? 'auth' : 'unauth'">{{ item.isAuth ? '✓ AI认证' : '待鉴定' }}</view>
            <view class="hot-badge" v-if="item.hot">🔥 热门</view>
          </view>
          <view class="goods-body">
            <text class="goods-name">{{ item.name }}</text>
            <view class="goods-meta">
              <text class="dynasty">{{ item.dynasty }}</text>
              <text class="dot">·</text>
              <text class="category">{{ item.category }}</text>
            </view>
            <view class="goods-platform">
              <text class="platform-icon">🏪</text>
              <text class="platform-name">{{ item.platform }}</text>
            </view>
            <view class="goods-footer">
              <text class="price">¥ {{ item.price }}</text>
              <view class="stats">
                <text class="sales">成交 {{ item.sales }}</text>
                <text class="likes">♡ {{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      allGoods: [],
      goodsList: [],
      isLoading: false,
      activeRecTab: 'latest',
      categories: [
        { name: '收藏币', icon: '🪙' },
        { name: '纪念钞', icon: '💵' },
        { name: '青铜币', icon: '🏺' },
        { name: '年份久远', icon: '📜' },
        { name: '杂项', icon: '📿' },
        { name: '全部分类', icon: '⊞' }
      ],
    }
  },
  onLoad() {
    this.loadTrendingGoods()
  },
  onShow() {
    this.loadUserGoods()
  },
  computed: {
    displayGoods() {
      return this.allGoods
    }
  },
  methods: {
    loadUserGoods() {
      try {
        const userGoods = uni.getStorageSync('trade_goods') || []
        if (userGoods.length > 0) {
          console.log('✅ 加载用户发布的商品:', userGoods.length, '件')
          this.allGoods = [...userGoods, ...this.getDefaultGoods()]
        } else {
          this.allGoods = this.getDefaultGoods()
        }
      } catch (e) {
        console.error('加载用户商品失败:', e)
        this.allGoods = this.getDefaultGoods()
      }
    },
    // 从后端API加载真实古玩商品
    async loadTrendingGoods() {
      // 防止重复加载
      if (this.isLoading) {
        console.log('⏳ 数据加载中，跳过重复请求');
        return;
      }
      
      try {
        this.isLoading = true;
        uni.showLoading({ title: '加载真实数据...' });
        
        const response = await uni.request({
          url: 'http://localhost:8000/api/trending-goods',
          method: 'GET',
          timeout: 15000
        });
        
        if (response.data.success) {
          const trendingGoods = response.data.data;
          console.log('✅ 真实古玩商品加载成功:', trendingGoods.length, '件');
          
          // 赋值给 allGoods
          this.allGoods = trendingGoods;
          
          if (response.data.source) {
            console.log(' 数据来源:', response.data.source);
          }
          if (response.data.timestamp) {
            const updateTime = new Date(response.data.timestamp).toLocaleString('zh-CN');
            console.log(' 数据更新时间:', updateTime);
          }
        } else {
          console.log('️ API 返回失败，使用默认数据');
          this.allGoods = this.getDefaultGoods();
        }
        
      } catch (error) {
        console.error('❌ 加载真实数据失败:', error);
        this.allGoods = this.getDefaultGoods();
      } finally {
        this.isLoading = false;
        uni.hideLoading();
      }
    },
    
    getDefaultGoods() {
      return [
        { 
          id: 1, 
          name: '清代乾隆通宝（宝泉局）', 
          dynasty: '清代·乾隆', 
          category: '古钱币', 
          price: '280', 
          image: '/static/goods-images/qianlong-tongbao.jpg',
          isAuth: true, 
          likes: 342,
          sales: 1250,
          hot: true,
          platform: '古泉园地'
        },
        { 
          id: 2, 
          name: '民国三年袁大头（壹圆）', 
          dynasty: '民国·1914年', 
          category: '银元', 
          price: '1,680', 
          image: '/static/goods-images/yuan-datou.jpg',
          isAuth: true, 
          likes: 528,
          sales: 890,
          hot: true,
          platform: '华夏古泉'
        },
        { 
          id: 3, 
          name: '唐代开元通宝（背月纹）', 
          dynasty: '唐代·开元', 
          category: '古钱币', 
          price: '450', 
          image: '/static/goods-images/kaiyuan-tongbao.jpg',
          isAuth: true, 
          likes: 276,
          sales: 720,
          hot: true,
          platform: '赵涌在线'
        },
        { 
          id: 4, 
          name: '1999年建国50周年纪念钞', 
          dynasty: '1999年', 
          category: '纪念钞', 
          price: '180', 
          image: '/static/goods-images/jidian-chao.jpg',
          isAuth: true, 
          likes: 196,
          sales: 650,
          hot: false,
          platform: '微拍堂'
        },
        { 
          id: 5, 
          name: '战国刀币（齐法化）', 
          dynasty: '战国·齐国', 
          category: '青铜币', 
          price: '3,200', 
          image: '/static/goods-images/warring-dao.jpg',
          isAuth: true, 
          likes: 156,
          sales: 280,
          hot: false,
          platform: '7788收藏'
        },
        { 
          id: 6, 
          name: '宋代崇宁通宝（当十）', 
          dynasty: '宋代·崇宁', 
          category: '古钱币', 
          price: '680', 
          image: '/static/goods-images/chongning-tongbao.jpg',
          isAuth: true, 
          likes: 234,
          sales: 560,
          hot: true,
          platform: '艺典中国'
        },
        { 
          id: 7, 
          name: '2008年奥运福娃纪念银币', 
          dynasty: '2008年', 
          category: '收藏币', 
          price: '3,500', 
          image: '/static/goods-images/olympic-coin.jpg',
          isAuth: true, 
          likes: 412,
          sales: 320,
          hot: false,
          platform: '孔夫子旧书网'
        },
        { 
          id: 8, 
          name: '清代光绪元宝（广东省造）', 
          dynasty: '清代·光绪', 
          category: '银元', 
          price: '2,100', 
          image: '/static/goods-images/guangxu-yuanbao.jpg',
          isAuth: true, 
          likes: 389,
          sales: 445,
          hot: true,
          platform: '收藏网'
        }
      ]
    },
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.handleAIPrice()
      }
    },
    handleAIPrice() {
      const coinName = this.searchKeyword.trim() || '请输入钱币名称'
      uni.navigateTo({
        url: `/pages/trade/estimate?coinName=${encodeURIComponent(coinName)}`
      })
    },
    closePriceModal() {
      this.showPriceModal = false
      this.currentPrice = ''
      this.priceTrendData = null
      this.showTrendDetail = false
      this.selectedImage = ''
      this.userMessage = ''
    },
    startAIDialog(coinName) {
      this.showPriceModal = true
      this.currentPrice = ''
      this.priceTrendData = null
      this.chatMessages = [
        {
          role: 'ai',
          content: `你好！我是古钱币估价专家"钱币通"。\n\n📝 **请详细描述你的钱币：**\n• 钱币名称、直径、重量、材质、品相\n\n💡 **示例：**\n"唐代开元通宝，直径 25mm，重 4 克，青铜，品相好"\n\n我会给你：\n📊 详细鉴定报告\n💰 多平台估价\n📈 可视化价格走势（折线图）\n🔮 AI 未来价格预测\n\n请开始描述吧 👇`
        }
      ]
      this.conversationHistory = [
        {
          role: 'system',
          content: `你是专业古钱币鉴定估价专家"钱币通"，拥有 20 年从业经验。\n\n**工作流程：**\n1. 用户描述钱币后，给出**详细鉴定报告**（不少于 300 字）\n2. 报告包含：朝代背景、铸造工艺、存世量、品相分析、市场热度\n3. 给出精确估价（区分不同品相价格区间）\n4. 如果信息不足，主动询问 2-3 个关键问题\n5. 用户补充后，更新估价并给出投资建议\n\n**回答要求：**\n- 语言专业但通俗易懂\n- 价格单位：人民币（元）\n- 必须给出估价范围：💰 当前估价：XX-XX 元\n- 首次估价后**必须**输出价格趋势数据和预测\n\n**价格趋势数据格式（必须在回复末尾输出）：**\n---PRICE_TREND---\n古泉园地:1200,1350,1280,1400,1320,1450\n华夏古泉:1150,1280,1320,1380,1300,1420\n赵涌在线:1300,1400,1350,1450,1380,1500\n微拍堂:1100,1250,1200,1350,1280,1400\n---END---\n\n**AI 预测格式（在趋势数据后添加）：**\n【未来预测】根据近 6 个月价格走势和市场分析，预计未来 3 个月该钱币价格将 [上涨/下跌/持平]XX-XX%，建议 [买入/持有/观望]。主要依据：[简要说明原因]\n\n（数据格式：平台名:近 6 个月价格，用逗号分隔，月份从旧到新）`
        }
      ]
      this.userMessage = ''
    },
    sendMessage() {
      if ((!this.userMessage.trim() && !this.selectedImage) || this.priceLoading) return
      if (this.selectedImage) {
        this.sendImageMessage()
        return
      }
      const userMsg = this.userMessage.trim()
      this.userMessage = ''
      this.chatMessages.push({ role: 'user', content: userMsg })
      this.conversationHistory.push({ role: 'user', content: userMsg })
      this.scrollToBottom()
      this.callAI()
    },
    async callAI() {
      this.priceLoading = true
      try {
        uni.request({
          url: 'http://localhost:8000/api/chat',
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { messages: this.conversationHistory, temperature: 0.7, max_tokens: 1200, appKey: this.appKey },
          timeout: 300000,
          success: (res) => {
            console.log('AI返回:', res)
            console.log('完整响应结构:', JSON.stringify(res.data, null, 2))
            
            if (res.data && res.data.success && res.data.data && res.data.data.choices && res.data.data.choices.length > 0) {
              const result = res.data.data.choices[0].message.content
              
              this.chatMessages.push({
                role: 'ai',
                content: result
              })
              
              this.conversationHistory.push({
                role: 'assistant',
                content: result
              })
              
              this.extractAndShowPrice(result)
              
              this.scrollToBottom()
            } else {
              console.error('数据格式错误:', res.data)
              uni.showToast({ title: '估价失败:数据格式错误', icon: 'none' })
            }
            this.priceLoading = false
          },
          fail: (err) => {
            console.error('请求失败:', err)
            if (err.errMsg && err.errMsg.includes('timeout')) {
              uni.showToast({ title: '请求超时,请重试', icon: 'none', duration: 3000 })
            } else {
              uni.showToast({ title: '请求失败', icon: 'none' })
            }
            this.priceLoading = false
          }
        })
      } catch (error) {
        console.error('估价失败:', error)
        uni.showToast({ title: '估价失败', icon: 'none' })
        this.priceLoading = false
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        uni.pageScrollTo({ scrollTop: 999999, duration: 300 })
      })
    },
    extractAndShowPrice(aiReply) {
      const pricePatterns = [
        /💰\s*当前估价[:：]?\s*(\d+)\s*[-~至到]\s*(\d+)\s*元/,
        /估价[:：]\s*(\d+)\s*[-~至到]\s*(\d+)\s*元/,
        /(\d+)\s*[-~至到]\s*(\d+)\s*元/,
        /约\s*(\d+)\s*元/,
        /价值\s*(\d+)\s*元/,
        /(\d+)\s*元/
      ]
      for (const pattern of pricePatterns) {
        const match = aiReply.match(pattern)
        if (match) {
          let priceText
          if (match[2]) {
            priceText = `${match[1]}-${match[2]}元`
          } else {
            priceText = `${match[1]}元左右`
          }
          this.currentPrice = priceText
          console.log('💰 当前估价已更新:', priceText)
          break
        }
      }
      this.parsePriceTrend(aiReply)
    },
    parsePriceTrend(aiReply) {
      if (!aiReply || typeof aiReply !== 'string') {
        console.error('AI 回复为空或格式错误')
        this.priceTrendData = null
        return
      }
      
      const trendMatch = aiReply.match(/---PRICE_TREND---\n([\s\S]*?)---END---/)
      if (!trendMatch) {
        console.log('未找到价格趋势数据')
        this.priceTrendData = null
        return
      }
      
      try {
        const trendText = trendMatch[1].trim()
        const platforms = []
        const lines = trendText.split('\n')
        
        for (const line of lines) {
          if (!line.trim()) continue
          
          const colonIndex = line.indexOf(':')
          if (colonIndex === -1) continue
          
          const platformName = line.substring(0, colonIndex).trim()
          const priceStr = line.substring(colonIndex + 1).trim()
          
          if (!platformName || !priceStr) continue
          
          const prices = priceStr.split(',').map(p => {
            const num = parseInt(p.trim())
            return isNaN(num) ? 0 : num
          }).filter(p => p > 0)
          
          if (prices.length < 2) continue
          
          const oldPrice = prices[0]
          const currentPrice = prices[prices.length - 1]
          const trend = ((currentPrice - oldPrice) / oldPrice) * 100
          
          platforms.push({
            name: platformName,
            prices: prices,
            currentPrice: currentPrice,
            trend: trend
          })
        }
        
        if (platforms.length === 0) {
          console.log('解析出的平台数据为空')
          this.priceTrendData = null
          return
        }
        
        // 提取 AI 预测（从回复中查找）
        const predictionMatch = aiReply.match(/【未来预测】([\s\S]*?)(?=\n\n|$)/)
        let prediction = ''
        if (predictionMatch) {
          prediction = predictionMatch[1].trim()
        } else {
          const avgTrend = platforms.reduce((sum, p) => sum + p.trend, 0) / platforms.length
          if (avgTrend > 10) {
            prediction = '📈 市场热度持续上升，预计未来 3 个月价格上涨 8-15%，建议持有或逢低买入。'
          } else if (avgTrend > 0) {
            prediction = '📊 市场稳中有升，预计未来 3 个月价格小幅上涨 3-8%，适合长期收藏。'
          } else if (avgTrend > -10) {
            prediction = '📉 市场小幅回调，预计未来 3 个月价格可能下跌 2-5%，可等待更低点吸纳。'
          } else {
            prediction = '⚠️ 市场处于低位，预计未来 3 个月继续震荡，建议观望等待企稳信号。'
          }
        }
        
        const avgTrend = platforms.reduce((sum, p) => sum + p.trend, 0) / platforms.length
        let advice = ''
        if (avgTrend > 10) {
          advice = '📈 市场热度高，建议关注优质品种，但需注意追高风险。'
        } else if (avgTrend > 0) {
          advice = '📊 市场稳中有升，是较好的收藏和投资时机。'
        } else if (avgTrend > -10) {
          advice = '📉 市场小幅回调，可以低价吸纳优质品种。'
        } else {
          advice = '⚠️ 市场处于低位，建议谨慎观望，等待企稳信号。'
        }
        
        this.priceTrendData = {
          platforms: platforms,
          prediction: prediction,
          advice: advice
        }
        
        console.log('📊 价格趋势已解析:', this.priceTrendData)
        
        // 绘制图表
        this.$nextTick(() => {
          this.drawPriceChart()
        })
      } catch (error) {
        console.error('解析价格趋势失败:', error)
        this.priceTrendData = null
      }
    },
    toggleTrendDetail() {
      this.showTrendDetail = !this.showTrendDetail
      if (this.showTrendDetail) {
        this.$nextTick(() => {
          this.drawPriceChart()
        })
      }
    },
    drawPriceChart() {
      if (!this.priceTrendData || !this.priceTrendData.platforms.length) return
      
      const ctx = uni.createCanvasContext('priceChart', this)
      const width = 300
      const height = 180
      const padding = { top: 20, right: 20, bottom: 30, left: 40 }
      const chartWidth = width - padding.left - padding.right
      const chartHeight = height - padding.top - padding.bottom
      
      // 清空画布
      ctx.setFillStyle('#faf7f2')
      ctx.fillRect(0, 0, width, height)
      
      // 获取所有价格的最大值和最小值
      let allPrices = []
      this.priceTrendData.platforms.forEach(p => {
        allPrices = allPrices.concat(p.prices)
      })
      const minPrice = Math.min(...allPrices) * 0.95
      const maxPrice = Math.max(...allPrices) * 1.05
      const priceRange = maxPrice - minPrice
      
      // 绘制网格线
      ctx.setStrokeStyle('#e0d5c5')
      ctx.setLineWidth(1)
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(width - padding.right, y)
        ctx.stroke()
        
        // Y 轴标签
        const price = maxPrice - (priceRange / 4) * i
        ctx.setFillStyle('#8b6914')
        ctx.setFontSize(10)
        ctx.fillText(Math.round(price), 5, y + 4)
      }
      
      // 绘制 X 轴标签（月份）
      const months = ['6 月前', '5 月前', '4 月前', '3 月前', '2 月前', '现在']
      ctx.setFillStyle('#5c4a3a')
      ctx.setFontSize(10)
      months.forEach((month, i) => {
        const x = padding.left + (chartWidth / 5) * i
        ctx.fillText(month, x - 15, height - 8)
      })
      
      // 绘制每条折线（最多 4 条）
      const colors = ['#c0392b', '#27ae60', '#2980b9', '#8e44ad']
      this.priceTrendData.platforms.slice(0, 4).forEach((platform, idx) => {
        const prices = platform.prices
        if (prices.length < 2) return
        
        ctx.setStrokeStyle(colors[idx % colors.length])
        ctx.setLineWidth(2)
        ctx.beginPath()
        
        prices.forEach((price, i) => {
          const x = padding.left + (chartWidth / (prices.length - 1)) * i
          const y = padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          
          // 绘制数据点
          ctx.setFillStyle(colors[idx % colors.length])
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, 2 * Math.PI)
          ctx.fill()
        })
        
        ctx.stroke()
      })
      
      // 图例
      const legendY = height - 5
      ctx.setFontSize(9)
      this.priceTrendData.platforms.slice(0, 4).forEach((platform, idx) => {
        const x = padding.left + (chartWidth / 4) * idx
        ctx.setFillStyle(colors[idx % colors.length])
        ctx.fillRect(x, legendY - 8, 12, 3)
        ctx.setFillStyle('#5c4a3a')
        ctx.fillText(platform.name.substring(0, 4), x + 15, legendY)
      })
      
      ctx.draw()
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.selectedImage = res.tempFilePaths[0]
          this.sendImageMessage()
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
        }
      })
    },
    async sendImageMessage() {
      if (!this.selectedImage) return
      this.priceLoading = true
      this.chatMessages.push({ role: 'user', content: '[已上传钱币照片]', image: this.selectedImage })
      this.scrollToBottom()
      try {
        const base64Image = await this.compressAndConvertToBase64(this.selectedImage)
        this.chatMessages.push({ role: 'ai', content: '🔍 AI正在识别图片...' })
        this.scrollToBottom()
        const userMessage = {
          role: 'user',
          content: [
            { type: 'text', text: '你是专业古钱币鉴定师"钱币通"，拥有 20 年从业经验。用户刚刚上传了一张古钱币照片，请你：\n\n**第一步：详细鉴定报告**\n1. 这是什么钱币？（朝代、名称、版别）\n2. 历史背景和铸造工艺分析\n3. 存世量和市场热度评估\n4. 品相分析（从图片判断）\n5. 初步估价范围（区分不同品相）\n\n**第二步：提出确认问题**\n给出 2-3 个你最需要确认的关键问题（如精确直径、重量、特殊标记、包浆情况等）\n\n**第三步：后续对话规则**\n- 用户回答问题后，根据新信息更新估价\n- 信息足够时给出最终估价和投资建议\n- 始终保持专业、友好的语气\n\n**重要规则：**\n- 每次回复不少于 300 字\n- 必须在末尾给出当前估价：💰 当前估价：XX-XX 元\n- 首次估价后必须输出价格趋势数据（格式见下方）\n\n**价格趋势数据格式：**\n---PRICE_TREND---\n古泉园地:1200,1350,1280,1400,1320,1450\n华夏古泉:1150,1280,1320,1380,1300,1420\n赵涌在线:1300,1400,1350,1450,1380,1500\n微拍堂:1100,1250,1200,1350,1280,1400\n7788 收藏:1180,1300,1260,1380,1310,1430\n艺典中国:1220,1360,1290,1410,1340,1460\n孔夫子旧书网:1160,1290,1250,1370,1300,1410\n收藏网:1190,1320,1270,1390,1320,1440\n---END---\n\n现在开始详细鉴定这枚钱币吧！' },
            { type: 'image_url', image_url: { url: base64Image } }
          ]
        }
        this.conversationHistory.push(userMessage)
        uni.request({
          url: 'http://localhost:8000/api/chat',
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { messages: this.conversationHistory, appKey: this.appKey, image: true, temperature: 0.7, max_tokens: 1000 },
          timeout: 300000,
          success: (chatRes) => {
            console.log('图片识别返回:', chatRes)
            console.log('完整响应:', JSON.stringify(chatRes.data, null, 2))
            
            if (chatRes.data && chatRes.data.success && chatRes.data.data && chatRes.data.data.choices && chatRes.data.data.choices.length > 0) {
              const aiReply = chatRes.data.data.choices[0].message.content
              
              this.chatMessages.pop()
              
              this.chatMessages.push({
                role: 'ai',
                content: aiReply
              })
              
              this.conversationHistory.push({
                role: 'assistant',
                content: aiReply
              })
              
              this.saveIdentificationRecord(base64Image, aiReply)
            } else {
              console.error('图片识别数据格式错误:', chatRes.data)
              this.chatMessages.pop()
              this.chatMessages.push({
                role: 'ai',
                content: '抱歉,AI识别失败,返回数据格式错误'
              })
            }
            
            this.priceLoading = false
            this.removeImage()
            this.scrollToBottom()
          },
          fail: (err) => {
            console.error('AI识别失败:', err)
            this.chatMessages.pop()
            this.chatMessages.push({ role: 'ai', content: '抱歉,网络错误,请重试' })
            this.priceLoading = false
            this.scrollToBottom()
          }
        })
      } catch (error) {
        console.error('图片处理失败:', error)
        uni.showToast({ title: '图片处理失败', icon: 'none' })
        this.priceLoading = false
      }
    },
    compressAndConvertToBase64(imagePath) {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        fetch(imagePath).then(response => response.blob()).then(blob => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxSize = 1024
            let width = img.width
            let height = img.height
            if (width > height) {
              if (width > maxSize) { height *= maxSize / width; width = maxSize }
            } else {
              if (height > maxSize) { width *= maxSize / height; height = maxSize }
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            const base64 = canvas.toDataURL('image/jpeg', 0.8)
            console.log('图片压缩后大小:', (base64.length / 1024).toFixed(2), 'KB')
            resolve(base64)
          }
          img.onerror = reject
          img.src = URL.createObjectURL(blob)
        }).catch(reject)
        // #endif
        // #ifndef H5
        uni.compressImage({
          src: imagePath,
          quality: 80,
          success: (compressRes) => {
            uni.getFileSystemManager().readFile({
              filePath: compressRes.tempFilePath,
              encoding: 'base64',
              success: (res) => {
                const base64 = 'data:image/jpeg;base64,' + res.data
                console.log('图片压缩后大小:', (base64.length / 1024).toFixed(2), 'KB')
                resolve(base64)
              },
              fail: reject
            })
          },
          fail: reject
        })
        // #endif
      })
    },
    removeImage() {
      this.selectedImage = ''
      this.userMessage = ''
    },
    filterByCategory(name) {
      uni.showToast({ title: `切换到:${name}`, icon: 'none' })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/trade/publish' })
    },
    goDetail(item) {
      uni.navigateTo({ 
        url: '/pages/trade/goods-detail?item=' + encodeURIComponent(JSON.stringify(item)) 
      })
    },
    saveIdentificationRecord(imageBase64, aiAnalysis) {
      try {
        const nameMatch = aiAnalysis.match(/(?:唐代|宋代|明代|清代|民国|汉代|秦代).*?(?:通宝|元宝|重宝|钱|币)/)
        const dynastyMatch = aiAnalysis.match(/(唐代|宋代|明代|清代|民国|汉代|秦代)/)
        let priceRange = '待评估'
        const pricePatterns = [
          /💰\s*当前估价[:：]?\s*(\d+)\s*[-~至到]\s*(\d+)\s*元/,
          /估价[:：]\s*(\d+)\s*[-~至到]\s*(\d+)\s*元/,
          /(\d+)\s*[-~至到]\s*(\d+)\s*元/,
          /约\s*(\d+)\s*元/,
          /价值\s*(\d+)\s*元/,
          /(\d+)\s*元/
        ]
        for (const pattern of pricePatterns) {
          const match = aiAnalysis.match(pattern)
          if (match) {
            if (match[2]) {
              priceRange = `${match[1]}-${match[2]}元`
            } else {
              priceRange = `${match[1]}元左右`
            }
            break
          }
        }
        const record = {
          id: Date.now(),
          time: new Date().toLocaleString('zh-CN'),
          imageUrl: this.selectedImage,
          imageBase64: imageBase64,
          aiAnalysis: aiAnalysis,
          artifact: {
            name: nameMatch ? nameMatch[0] : '古钱币',
            dynasty: dynastyMatch ? dynastyMatch[0] : '未知朝代',
            category: '古钱币',
            priceRange: priceRange
          },
          chatHistory: JSON.parse(JSON.stringify(this.conversationHistory))
        }
        let history = []
        try {
          history = uni.getStorageSync('identify_history') || []
        } catch (e) {
          history = []
        }
        history.unshift(record)
        if (history.length > 50) {
          history = history.slice(0, 50)
        }
        uni.setStorageSync('identify_history', history)
        console.log('✅ 鉴定记录已保存')
        console.log('最终估价:', priceRange)
      } catch (e) {
        console.error('保存记录失败:', e)
      }
    },
    // 图片加载失败处理
    onImageError(item) {
      console.log('️ 图片加载失败:', item.name, '使用默认图片');
      item.image = 'https://img1.imgtp.com/2024/01/15/default-coin.jpg';
    },
  }
}
</script>

<style scoped>
.container {
  background: #faf7f2;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.top-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #faf7f2;
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #2c2416;
  margin-right: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 40rpx;
  padding: 0 25rpx;
  height: 64rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  margin-right: 10rpx;
}
.search-icon {
  font-size: 24rpx;
  margin-right: 10rpx;
  opacity: 0.5;
}
.search-input {
  flex: 1;
  font-size: 24rpx;
  color: #666;
}
.ai-price-btn {
  width: 140rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 32rpx;
  font-size: 22rpx;
  font-weight: 700;
  padding: 0;
  margin-right: 10rpx;
  box-shadow: 0 6rpx 15rpx rgba(102, 126, 234, 0.3);
}
.publish-btn {
  width: 120rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 700;
  padding: 0;
  box-shadow: 0 6rpx 15rpx rgba(139, 105, 20, 0.3);
}
.ai-price-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
.modal-content {
  background: #fff;
  border-radius: 24rpx;
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f2f5;
}
.current-price-bar {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #ffd4d4;
}
.price-label {
  font-size: 26rpx;
  color: #666;
}
.price-value {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
}
.chat-messages {
  flex: 1;
  padding: 30rpx;
  background: #f5f5f5;
  overflow-y: auto;
  min-height: 0;
}
.message-item {
  margin-bottom: 30rpx;
  display: flex;
}
.message-item.user {
  justify-content: flex-end;
}
.message-item.ai {
  justify-content: flex-start;
}
.message-bubble {
  max-width: 80%;
  padding: 20rpx 25rpx;
  border-radius: 20rpx;
  word-wrap: break-word;
}
.message-item.user .message-bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}
.message-item.ai .message-bubble {
  background: #fff;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}
.message-bubble.loading {
  background: #fff;
  color: #999;
}
.message-text {
  font-size: 26rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}
.msg-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 12rpx;
  margin-bottom: 15rpx;
  background: #f5f5f5;
}
.loading-dots {
  font-size: 24rpx;
  color: #999;
}
.chat-input-area {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-top: 2rpx solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}
.image-btn {
  width: 70rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 32rpx;
  padding: 0;
  margin-right: 15rpx;
  text-align: center;
}
.chat-input {
  flex: 1;
  height: 70rpx;
  background: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 25rpx;
  font-size: 26rpx;
  margin-right: 15rpx;
}
.send-btn {
  width: 120rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 35rpx;
  font-size: 26rpx;
  font-weight: 700;
  padding: 0;
  text-align: center;
}
.send-btn[disabled] {
  opacity: 0.5;
}
.image-preview {
  position: relative;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
}
.preview-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}
.remove-img {
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
}
.banner-wrapper {
  margin: 20rpx 30rpx;
  height: 260rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #2c2416 0%, #5c4a3a 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 25rpx rgba(44, 36, 22, 0.3);
}
.banner-content {
  padding: 35rpx;
  position: relative;
  z-index: 2;
}
.banner-title {
  font-size: 48rpx;
  font-weight: 800;
  color: #d4a574;
  display: block;
  margin-bottom: 12rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.banner-subtitle {
  font-size: 22rpx;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-bottom: 20rpx;
}
.banner-btn {
  width: 150rpx;
  height: 52rpx;
  line-height: 52rpx;
  background: #d4a574;
  color: #2c2416;
  font-size: 22rpx;
  font-weight: 700;
  border-radius: 26rpx;
  padding: 0;
  text-align: center;
}
.banner-dots {
  position: absolute;
  bottom: 18rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12rpx;
}
.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
}
.dot.active {
  background: #d4a574;
  width: 22rpx;
  border-radius: 5rpx;
}
.category-grid {
  display: flex;
  justify-content: space-between;
  padding: 25rpx 30rpx;
}
.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cat-icon-wrapper {
  width: 85rpx;
  height: 85rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.06);
}
.cat-icon {
  font-size: 40rpx;
}
.cat-name {
  font-size: 22rpx;
  color: #5c4a3a;
}
.zone-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18rpx;
  padding: 0 30rpx 25rpx;
}
.zone-card {
  background: #fff;
  border-radius: 18rpx;
  padding: 22rpx 18rpx;
  position: relative;
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.04);
}
.zone-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #2c2416;
  display: block;
  margin-bottom: 6rpx;
}
.zone-desc {
  font-size: 18rpx;
  color: #999;
  display: block;
}
.zone-icon {
  position: absolute;
  right: 12rpx;
  bottom: 12rpx;
  font-size: 45rpx;
  opacity: 0.12;
}
.recommend-section {
  background: #fff;
  border-radius: 28rpx 28rpx 0 0;
  padding: 25rpx;
  margin-top: 10rpx;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 22rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #2c2416;
  margin-right: 25rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.tab-bar {
  flex: 1;
  display: flex;
  gap: 25rpx;
}
.tab-item {
  font-size: 24rpx;
  color: #999;
  padding-bottom: 6rpx;
}
.tab-item.active {
  color: #2c2416;
  font-weight: 700;
  border-bottom: 3rpx solid #d4a574;
}
.more {
  font-size: 22rpx;
  color: #999;
}
.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22rpx;
}
.goods-card {
  background: #faf7f2;
  border-radius: 18rpx;
  overflow: hidden;
}
.image-wrapper {
  position: relative;
  width: 100%;
  height: 320rpx;
  overflow: hidden;
}
.goods-img {
  width: 100%;
  height: 100%;
  display: block;
}
.goods-icon {
  font-size: 120rpx;
  opacity: 0.8;
}
.goods-icon-default {
  font-size: 100rpx;
  opacity: 0.6;
}
.badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  padding: 6rpx 14rpx;
  border-radius: 18rpx;
  font-size: 18rpx;
  color: #fff;
}
.hot-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 6rpx 14rpx;
  border-radius: 18rpx;
  font-size: 18rpx;
  color: #fff;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  box-shadow: 0 2rpx 8rpx rgba(238, 90, 36, 0.4);
}
.auth {
  background: rgba(76, 175, 80, 0.9);
}
.unauth {
  background: rgba(255, 152, 0, 0.9);
}
.goods-body {
  padding: 18rpx;
}
.goods-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #2c2416;
  display: block;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-meta {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}
.dynasty, .category {
  font-size: 20rpx;
  color: #999;
}
.goods-platform {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-bottom: 10rpx;
  padding: 6rpx 12rpx;
  background: #faf7f2;
  border-radius: 8rpx;
}
.platform-icon {
  font-size: 18rpx;
}
.platform-name {
  font-size: 20rpx;
  color: #8b6914;
  font-weight: 600;
}
.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 30rpx;
  font-weight: 800;
  color: #c0392b;
}
.stats {
  display: flex;
  gap: 15rpx;
  align-items: center;
}
.sales {
  font-size: 20rpx;
  color: #27ae60;
  font-weight: 600;
}
.likes {
  font-size: 20rpx;
  color: #999;
}
.price-trend-panel {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin: 15rpx 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
}
.chart-container {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-bottom: 15rpx;
}
.price-chart {
  width: 300px;
  height: 180px;
}
.ai-prediction {
  background: linear-gradient(135deg, #fff9e6, #fff3cc);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 15rpx;
  border-left: 6rpx solid #f39c12;
}
.prediction-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #2c2416;
  display: block;
  margin-bottom: 10rpx;
}
.prediction-content {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8rpx;
  padding: 15rpx;
}
.prediction-text {
  font-size: 24rpx;
  color: #5c4a3a;
  line-height: 1.6;
}
.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 15rpx;
  border-bottom: 2rpx solid #f0ebe3;
}
.trend-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2c2416;
}
.trend-toggle {
  font-size: 24rpx;
  color: #8b6914;
  padding: 8rpx 20rpx;
  background: #faf7f2;
  border-radius: 20rpx;
}
.trend-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}
.trend-item {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.platform-name {
  font-size: 24rpx;
  color: #5c4a3a;
  font-weight: 600;
}
.price-change {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.price-change.up {
  color: #e74c3c;
}
.price-change.down {
  color: #27ae60;
}
.trend-arrow {
  font-size: 24rpx;
  font-weight: 700;
}
.trend-percent {
  font-size: 22rpx;
  font-weight: 600;
}
.current-price {
  font-size: 26rpx;
  color: #2c2416;
  font-weight: 700;
}
.trend-detail {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0ebe3;
}
.detail-item {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-bottom: 12rpx;
}
.detail-platform {
  font-size: 24rpx;
  color: #5c4a3a;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}
.detail-prices {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
}
.month-label {
  font-size: 22rpx;
  color: #999;
}
.price-old {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}
.arrow {
  font-size: 24rpx;
  color: #d4a574;
}
.price-new {
  font-size: 28rpx;
  color: #2c2416;
  font-weight: 700;
}
.investment-advice {
  background: linear-gradient(135deg, #faf7f2, #f0ebe3);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 15rpx;
  border-left: 6rpx solid #d4a574;
}
.advice-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #2c2416;
  display: block;
  margin-bottom: 10rpx;
}
.advice-content {
  font-size: 24rpx;
  color: #5c4a3a;
  line-height: 1.6;
}

/* 数据来源标识 */
.source-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 4px 10px;
}

.source-text {
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: 500;
}
</style>