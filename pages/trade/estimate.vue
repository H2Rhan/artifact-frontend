<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">AI 智能估价</text>
      <view class="placeholder"></view>
    </view>

    <!-- 当前估价栏 -->
    <view class="price-bar">
      <text class="price-label">当前估价</text>
      <text class="price-value">{{ currentPrice || '待评估' }}</text>
    </view>

    <!-- 价格走势面板 -->
    <view class="trend-panel" v-if="priceTrendData">
      <view class="panel-header">
        <text class="panel-title">📊 多平台价格走势</text>
        <text class="toggle-btn" @click="toggleTrendDetail">{{ showTrendDetail ? '收起' : '展开' }}</text>
      </view>
      
      <!-- Canvas 图表 -->
      <view class="chart-box">
        <canvas canvas-id="priceChart" id="priceChart" class="chart-canvas"></canvas>
      </view>
      
      <!-- 价格概览 -->
      <view class="overview-grid">
        <view class="overview-item" v-for="(platform, index) in priceTrendData.platforms.slice(0, 4)" :key="index">
          <text class="platform-name">{{ platform.name }}</text>
          <view class="change-badge" :class="platform.trend > 0 ? 'up' : 'down'">
            <text class="arrow">{{ platform.trend > 0 ? '↑' : '↓' }}</text>
            <text class="percent">{{ Math.abs(platform.trend).toFixed(1) }}%</text>
          </view>
          <text class="current-price">{{ platform.currentPrice }}元</text>
        </view>
      </view>
      
      <!-- AI 预测 -->
      <view class="prediction-card" v-if="priceTrendData.prediction">
        <text class="prediction-title">🔮 AI 价格预测（未来 3 个月）</text>
        <view class="prediction-body">
          <text class="prediction-text">{{ priceTrendData.prediction }}</text>
        </view>
      </view>
      
      <!-- 详细数据 -->
      <view class="detail-section" v-if="showTrendDetail">
        <view class="detail-row" v-for="(platform, index) in priceTrendData.platforms" :key="index">
          <text class="detail-name">{{ platform.name }}</text>
          <view class="detail-price-row">
            <text class="old-price">{{ platform.prices[0] }}元</text>
            <text class="arrow-icon">→</text>
            <text class="new-price">{{ platform.currentPrice }}元</text>
          </view>
        </view>
        
        <!-- 投资建议 -->
        <view class="advice-card">
          <text class="advice-title">💡 投资建议</text>
          <text class="advice-text">{{ priceTrendData.advice }}</text>
        </view>
      </view>
    </view>

    <!-- 聊天记录区域 -->
    <scroll-view class="chat-area" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
      <view class="msg-item" v-for="(msg, index) in chatMessages" :key="index" :class="msg.role">
        <view class="msg-avatar">
          <text class="avatar-icon">{{ msg.role === 'ai' ? '🤖' : '👤' }}</text>
        </view>
        <view class="msg-content">
          <view class="msg-bubble">
            <image class="msg-img" v-if="msg.image" :src="msg.image" mode="aspectFit"></image>
            <text class="msg-text">{{ msg.content }}</text>
          </view>
        </view>
      </view>
      <view class="msg-item ai" v-if="priceLoading">
        <view class="msg-avatar">
          <text class="avatar-icon"></text>
        </view>
        <view class="msg-content">
          <view class="msg-bubble loading-bubble">
            <text class="loading-text">正在分析中...</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="input-bar">
      <button class="camera-btn" @click="chooseImage">📷</button>
      <input class="input-field" v-model="userMessage" @confirm="sendMessage" placeholder="补充钱币细节或发送图片..." :disabled="priceLoading" />
      <button class="send-btn" @click="sendMessage" :disabled="priceLoading || (!userMessage.trim() && !selectedImage)">
        {{ priceLoading ? '⏳' : '发送' }}
      </button>
    </view>

    <!-- 图片预览 -->
    <view class="image-preview-bar" v-if="selectedImage">
      <image class="preview-thumb" :src="selectedImage" mode="aspectFit"></image>
      <text class="remove-btn" @click="removeImage">✕</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      priceLoading: false,
      userMessage: '',
      chatMessages: [],
      conversationHistory: [],
      scrollTop: 0,
      selectedImage: '',
      appKey: 'sk-xuanji-2026446869-Q0ZoTXNtTnNtZkZ0ZnppSg==',
      currentPrice: '',
      priceTrendData: null,
      showTrendDetail: false,
      initialCoinName: ''
    }
  },
  onLoad(options) {
    if (options.coinName) {
      this.initialCoinName = decodeURIComponent(options.coinName)
      this.startAIDialog(this.initialCoinName)
    } else {
      this.startAIDialog('请输入钱币名称')
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    startAIDialog(coinName) {
      this.currentPrice = ''
      this.priceTrendData = null
      this.chatMessages = [
        {
          role: 'ai',
          content: `你好！我是古钱币估价专家"钱币通"。\n\n📝 **请详细描述你的钱币：**\n• 钱币名称、直径、重量、材质、品相\n\n💡 **示例：**\n"唐代开元通宝，直径 25mm，重 4 克，青铜，品相好"\n\n我会给你：\n 详细鉴定报告\n💰 多平台估价\n📈 可视化价格走势\n🔮 AI 未来价格预测\n\n请开始描述吧 👇`
        }
      ]
      this.conversationHistory = [
        {
          role: 'system',
          content: `你是专业古钱币鉴定估价专家"钱币通"，拥有 20 年从业经验。\n\n**工作流程：**\n1. 用户描述钱币后，给出**详细鉴定报告**（不少于 300 字）\n2. 报告包含：朝代背景、铸造工艺、存世量、品相分析、市场热度\n3. 给出精确估价（区分不同品相价格区间）\n4. 如果信息不足，主动询问 2-3 个关键问题\n5. 用户补充后，更新估价并给出投资建议\n\n**回答要求：**\n- 语言专业但通俗易懂\n- 价格单位：人民币（元）\n- 必须给出估价范围：💰 当前估价：XX-XX 元\n- 首次估价后**必须**输出价格趋势数据和预测\n\n**价格趋势数据格式（必须在回复末尾输出）：**\n---PRICE_TREND---\n古泉园地:1200,1350,1280,1400,1320,1450\n华夏古泉:1150,1280,1320,1380,1300,1420\n赵涌在线:1300,1400,1350,1450,1380,1500\n微拍堂:1100,1250,1200,1350,1280,1400\n---END---\n\n**AI 预测格式（在趋势数据后添加）：**\n【未来预测】根据近 6 个月价格走势和市场分析，预计未来 3 个月该钱币价格将 [上涨/下跌/持平]XX-XX%，建议 [买入/持有/观望]。主要依据：[简要说明原因]`
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
            console.log('AI 返回:', res)
            
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
              uni.showToast({ title: '估价失败：数据格式错误', icon: 'none' })
            }
            this.priceLoading = false
          },
          fail: (err) => {
            console.error('请求失败:', err)
            if (err.errMsg && err.errMsg.includes('timeout')) {
              uni.showToast({ title: '请求超时，请重试', icon: 'none', duration: 3000 })
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
        setTimeout(() => {
          uni.pageScrollTo({ scrollTop: 999999, duration: 300 })
        }, 100)
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
        this.priceTrendData = null
        return
      }
      
      const trendMatch = aiReply.match(/---PRICE_TREND---\n([\s\S]*?)---END---/)
      if (!trendMatch) {
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
          this.priceTrendData = null
          return
        }
        
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
        
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawPriceChart()
          }, 200)
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
          setTimeout(() => {
            this.drawPriceChart()
          }, 200)
        })
      }
    },
    drawPriceChart() {
      if (!this.priceTrendData || !this.priceTrendData.platforms.length) return
      
      const ctx = uni.createCanvasContext('priceChart', this)
      const width = 335
      const height = 200
      const padding = { top: 20, right: 20, bottom: 35, left: 45 }
      const chartWidth = width - padding.left - padding.right
      const chartHeight = height - padding.top - padding.bottom
      
      ctx.setFillStyle('#faf7f2')
      ctx.fillRect(0, 0, width, height)
      
      let allPrices = []
      this.priceTrendData.platforms.forEach(p => {
        allPrices = allPrices.concat(p.prices)
      })
      const minPrice = Math.min(...allPrices) * 0.95
      const maxPrice = Math.max(...allPrices) * 1.05
      const priceRange = maxPrice - minPrice
      
      ctx.setStrokeStyle('#e0d5c5')
      ctx.setLineWidth(1)
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(width - padding.right, y)
        ctx.stroke()
        
        const price = maxPrice - (priceRange / 4) * i
        ctx.setFillStyle('#8b6914')
        ctx.setFontSize(10)
        ctx.fillText(Math.round(price), 5, y + 4)
      }
      
      const months = ['6 月前', '5 月前', '4 月前', '3 月前', '2 月前', '现在']
      ctx.setFillStyle('#5c4a3a')
      ctx.setFontSize(10)
      months.forEach((month, i) => {
        const x = padding.left + (chartWidth / 5) * i
        ctx.fillText(month, x - 15, height - 8)
      })
      
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
          
          ctx.setFillStyle(colors[idx % colors.length])
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, 2 * Math.PI)
          ctx.fill()
        })
        
        ctx.stroke()
      })
      
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
        this.chatMessages.push({ role: 'ai', content: '🔍 AI 正在识别图片...' })
        this.scrollToBottom()
        const userMessage = {
          role: 'user',
          content: [
            { type: 'text', text: '你是专业古钱币鉴定师"钱币通"，拥有 20 年从业经验。用户刚刚上传了一张古钱币照片，请你：\n\n**第一步：详细鉴定报告**\n1. 这是什么钱币？（朝代、名称、版别）\n2. 历史背景和铸造工艺分析\n3. 存世量和市场热度评估\n4. 品相分析（从图片判断）\n5. 初步估价范围\n\n**第二步：提出确认问题**\n给出 2-3 个你最需要确认的关键问题\n\n**重要规则：**\n- 每次回复不少于 300 字\n- 必须在末尾给出当前估价： 当前估价：XX-XX 元\n- 首次估价后必须输出价格趋势数据\n\n**价格趋势数据格式：**\n---PRICE_TREND---\n古泉园地:1200,1350,1280,1400,1320,1450\n华夏古泉:1150,1280,1320,1380,1300,1420\n赵涌在线:1300,1400,1350,1450,1380,1500\n微拍堂:1100,1250,1200,1350,1280,1400\n---END---\n\n**AI 预测格式：**\n【未来预测】根据近 6 个月价格走势和市场分析，预计未来 3 个月该钱币价格将 [上涨/下跌/持平]XX-XX%，建议 [买入/持有/观望]。\n\n现在开始详细鉴定这枚钱币吧！' },
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
              
              this.extractAndShowPrice(aiReply)
            } else {
              this.chatMessages.pop()
              this.chatMessages.push({
                role: 'ai',
                content: '抱歉，AI 识别失败，返回数据格式错误'
              })
            }
            
            this.priceLoading = false
            this.removeImage()
            this.scrollToBottom()
          },
          fail: (err) => {
            console.error('AI 识别失败:', err)
            this.chatMessages.pop()
            this.chatMessages.push({ role: 'ai', content: '抱歉，网络错误，请重试' })
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
    }
  }
}
</script>

<style scoped>
.container {
  background: #faf7f2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 2rpx solid #f0ebe3;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 36rpx;
  color: #2c2416;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2c2416;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.placeholder {
  width: 60rpx;
}

.price-bar {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  padding: 25rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #ffd4d4;
}

.price-label {
  font-size: 28rpx;
  color: #666;
}

.price-value {
  font-size: 36rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.trend-panel {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 15rpx;
  border-bottom: 2rpx solid #f0ebe3;
}

.panel-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2c2416;
}

.toggle-btn {
  font-size: 24rpx;
  color: #8b6914;
  padding: 8rpx 20rpx;
  background: #faf7f2;
  border-radius: 20rpx;
}

.chart-box {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-bottom: 15rpx;
}

.chart-canvas {
  width: 335px;
  height: 200px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
  margin-bottom: 15rpx;
}

.overview-item {
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

.change-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.change-badge.up {
  color: #e74c3c;
}

.change-badge.down {
  color: #27ae60;
}

.arrow {
  font-size: 24rpx;
  font-weight: 700;
}

.percent {
  font-size: 22rpx;
  font-weight: 600;
}

.current-price {
  font-size: 26rpx;
  color: #2c2416;
  font-weight: 700;
}

.prediction-card {
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

.prediction-body {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8rpx;
  padding: 15rpx;
}

.prediction-text {
  font-size: 24rpx;
  color: #5c4a3a;
  line-height: 1.6;
}

.detail-section {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0ebe3;
}

.detail-row {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-bottom: 12rpx;
}

.detail-name {
  font-size: 24rpx;
  color: #5c4a3a;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}

.detail-price-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.old-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.arrow-icon {
  font-size: 24rpx;
  color: #d4a574;
}

.new-price {
  font-size: 28rpx;
  color: #2c2416;
  font-weight: 700;
}

.advice-card {
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

.advice-text {
  font-size: 24rpx;
  color: #5c4a3a;
  line-height: 1.6;
}

.chat-area {
  flex: 1;
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 0;
}

.msg-item {
  margin-bottom: 25rpx;
  display: flex;
  gap: 15rpx;
}

.msg-item.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 60rpx;
  height: 60rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 32rpx;
}

.msg-content {
  flex: 1;
  max-width: 75%;
}

.msg-bubble {
  padding: 20rpx 25rpx;
  border-radius: 20rpx;
  word-wrap: break-word;
}

.msg-item.user .msg-bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.msg-item.ai .msg-bubble {
  background: #fff;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.loading-bubble {
  background: #fff;
  color: #999;
}

.msg-text {
  font-size: 26rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}

.msg-img {
  width: 300rpx;
  height: 300rpx;
  border-radius: 12rpx;
  margin-bottom: 15rpx;
  background: #f5f5f5;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-top: 2rpx solid #f0f0f0;
  background: #fff;
}

.camera-btn {
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

.input-field {
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

.image-preview-bar {
  position: relative;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
}

.preview-thumb {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}

.remove-btn {
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
</style>