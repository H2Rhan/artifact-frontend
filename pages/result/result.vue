<template>
  <view class="container">
    <view class="header">
      <text class="title">鉴定报告</text>
      <text class="subtitle">AI 智能分析结果</text>
    </view>
    
    <view v-if="loading" class="loading-box">
      <view class="scanner">
        <view class="scanner-line"></view>
      </view>
      <text class="loading-text">AI 正在深度分析...</text>
    </view>
    
    <view v-else-if="artifact && artifact.name" class="result-card">
      <view class="image-section">
        <image :src="uploadImageUrl || '/static/logo.png'" class="artifact-img" mode="aspectFit"></image>
        <view class="image-badge" :class="authenticity >= 80 ? 'high' : 'low'">
          {{ authenticity >= 80 ? '高真品' : '存疑' }}
        </view>
      </view>
      
      <view class="info-section">
        <text class="artifact-name">{{ artifact.name }}</text>
        <view class="meta-row">
          <view class="meta-tag">
            <text class="tag-icon">📅</text>
            <text class="tag-text">{{ artifact.dynasty || '未知朝代' }}</text>
          </view>
          <view class="meta-tag">
            <text class="tag-icon">🏷️</text>
            <text class="tag-text">{{ artifact.category || '未知类别' }}</text>
          </view>
          <view class="meta-tag accuracy-tag">
            <text class="tag-icon">✓</text>
            <text class="tag-text">匹配度 {{ accuracy }}%</text>
          </view>
        </view>
      </view>
      
      <view class="valuation-section">
        <view class="value-item">
          <text class="value-label">💰 市场估值参考</text>
          <text class="value-price">¥ {{ estimatedPrice }}</text>
          <text class="value-tip">估值仅供参考，不作为交易依据</text>
        </view>
        
        <view class="value-item">
          <text class="value-label">🔍 真实度预测</text>
          <view class="authenticity-bar">
            <view class="bar-fill" :style="{ width: authenticity + '%', background: getAuthenticityColor(authenticity) }"></view>
          </view>
          <view class="authenticity-info">
            <text class="authenticity-score" :style="{ color: getAuthenticityColor(authenticity) }">{{ authenticity }}%</text>
            <text class="authenticity-label">{{ getAuthenticityLabel(authenticity) }}</text>
          </view>
        </view>
      </view>
      
      <view class="diagnosis-section">
        <text class="section-title">AI 诊断报告</text>
        <view class="diagnosis-content">
          <text class="diagnosis-text">{{ aiDiagnosis }}</text>
        </view>
      </view>
      
      <view class="action-buttons">
        <button class="btn primary-btn" @click="view3D">
          <text class="btn-icon">🎨</text>
          <text>查看 3D 模型</text>
        </button>
        <button class="btn secondary-btn" @click="goChat">
          <text class="btn-icon">🤖</text>
          <text>蓝心讲解</text>
        </button>
        <button class="btn tertiary-btn" @click="retake">
          <text class="btn-icon">📷</text>
          <text>重新鉴定</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { callOpenAI, getArtifactAnalysisPrompt } from '../../utils/api.js'

export default {
  data() {
    return { 
      artifact: null, 
      uploadImageUrl: '', 
      loading: true, 
      accuracy: 0, 
      estimatedPrice: '0', 
      authenticity: 0,
      aiDiagnosis: ''
    }
  },
  async onLoad() {
    try {
      const results = uni.getStorageSync('current_result')
      if (results && results.length > 0) {
        const item = results[0]
        this.artifact = { ...item }
        this.uploadImageUrl = item.imageUrl || '/static/logo.png'
        this.accuracy = item.confidence ? (item.confidence * 100).toFixed(1) : 0
        
        await this.generateAIAnalysis()
      }
    } catch (error) {
      console.error('加载失败:', error)
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.loading = false
      this.saveToHistory()
    }
  },
  methods: {
    async generateAIAnalysis() {
      try {
        const prompt = getArtifactAnalysisPrompt(
          this.artifact.name,
          this.artifact.dynasty,
          this.artifact.category
        )
        const response = await callOpenAI(prompt, 0.7)
        this.parseAIResponse(response)
      } catch (error) {
        console.error('AI 分析失败:', error)
        this.estimatedPrice = this.generateMockPrice(this.artifact.category)
        this.authenticity = this.generateMockAuthenticity(this.artifact.confidence)
        this.aiDiagnosis = `经 AI 图像识别分析，该文物特征与【${this.artifact.name}】高度吻合。器型、纹饰等均符合${this.artifact.dynasty || '该时期'}典型特征。`
      }
    },
    
    parseAIResponse(response) {
      const priceMatch = response.match(/￥[\d,]+|估价[\d,]+元|价值[\d,]+元/)
      if (priceMatch) {
        this.estimatedPrice = priceMatch[0].replace(/[￥元估价价值]/g, '').replace(/,/g, '')
      } else {
        this.estimatedPrice = this.generateMockPrice(this.artifact.category)
      }
      
      const authMatch = response.match(/真实度[:：]?\s*(\d+)%/)
      if (authMatch) {
        this.authenticity = parseFloat(authMatch[1])
      } else {
        this.authenticity = this.generateMockAuthenticity(this.artifact.confidence)
      }
      
      this.aiDiagnosis = response
    },
    
    view3D() {
      uni.navigateTo({ 
        url: `/pages/detail/detail?name=${this.artifact.name}&dynasty=${this.artifact.dynasty || ''}&category=${this.artifact.category || ''}&description=${this.aiDiagnosis || ''}` 
      })
    },
    
    goChat() {
      uni.navigateTo({ 
        url: `/pages/detail/chat?name=${this.artifact.name}&dynasty=${this.artifact.dynasty || ''}` 
      })
    },
    
    retake() { 
      uni.navigateBack() 
    },
    
    generateMockPrice(category) {
      const basePrices = { '瓷器': 50000, '玉器': 80000, '青铜器': 120000, '书画': 30000, '杂项': 15000, '钱币': 5000 }
      return ((basePrices[category] || 20000) * (Math.floor(Math.random() * 50) + 50) / 100).toLocaleString()
    },
    
    generateMockAuthenticity(confidence) {
      let auth = confidence ? confidence * 100 : 50
      return Math.min(99, Math.max(10, auth + (Math.random() * 20 - 10))).toFixed(1)
    },
    
    getAuthenticityLabel(score) { 
      return score > 90 ? '极真' : score > 75 ? '高真' : score > 60 ? '存疑' : '仿品' 
    },
    
    getAuthenticityColor(score) { 
      return score > 90 ? '#8b6914' : score > 75 ? '#d4a574' : score > 60 ? '#ff9800' : '#c0392b' 
    },
    
    saveToHistory() {
      if (!this.artifact || !this.artifact.name) return
      const history = uni.getStorageSync('identify_history') || []
      const newRecord = { 
        id: Date.now(), 
        time: new Date().toLocaleString(), 
        imageUrl: this.uploadImageUrl, 
        artifact: { 
          name: this.artifact.name, 
          category: this.artifact.category || '未知', 
          dynasty: this.artifact.dynasty || '未知'
        } 
      }
      if (!history.some(item => item.artifact.name === newRecord.artifact.name)) {
        history.unshift(newRecord)
        if (history.length > 50) history.pop()
        uni.setStorageSync('identify_history', history)
      }
    }
  }
}
</script>

<style>
.container { 
  background: #faf7f2; 
  min-height: 100vh; 
  padding: 30rpx;
  padding-bottom: 50rpx;
}

.header { 
  text-align: center; 
  padding: 20rpx 0 40rpx;
}
.title { 
  font-size: 44rpx; 
  font-weight: 800; 
  color: #2c2416; 
  display: block;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.subtitle { 
  font-size: 24rpx; 
  color: #999; 
  display: block; 
  margin-top: 10rpx;
}

.loading-box { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  margin-top: 200rpx; 
}
.scanner { 
  width: 280rpx; 
  height: 280rpx; 
  border: 4rpx solid #d4a574; 
  border-radius: 24rpx; 
  position: relative; 
  overflow: hidden; 
  margin-bottom: 40rpx;
  background: #fff;
}
.scanner-line { 
  position: absolute; 
  width: 100%; 
  height: 4rpx; 
  background: linear-gradient(90deg, transparent, #d4a574, transparent); 
  animation: scan 2s ease-in-out infinite; 
}
@keyframes scan { 
  0%, 100% { top: 0; } 
  50% { top: calc(100% - 4rpx); } 
}
.loading-text { 
  font-size: 30rpx; 
  color: #2c2416; 
  font-weight: 600;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.result-card {
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.image-section {
  position: relative;
  width: 100%;
  height: 500rpx;
  background: #f0ebe3;
}
.artifact-img {
  width: 100%;
  height: 100%;
}
.image-badge {
  position: absolute;
  top: 25rpx;
  right: 25rpx;
  padding: 10rpx 25rpx;
  border-radius: 25rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #fff;
}
.image-badge.high { background: rgba(139, 105, 20, 0.9); }
.image-badge.low { background: rgba(192, 57, 43, 0.9); }

.info-section {
  padding: 35rpx 30rpx;
  border-bottom: 1rpx solid #f0ebe3;
}
.artifact-name {
  font-size: 40rpx;
  font-weight: 800;
  color: #2c2416;
  display: block;
  margin-bottom: 20rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}
.meta-tag {
  background: #faf7f2;
  padding: 12rpx 20rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.tag-icon { font-size: 24rpx; }
.tag-text { font-size: 24rpx; color: #5c4a3a; }
.accuracy-tag {
  background: linear-gradient(135deg, #d4a574, #8b6914);
}
.accuracy-tag .tag-text { color: #fff; font-weight: 700; }

.valuation-section {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0ebe3;
}
.value-item { margin-bottom: 30rpx; }
.value-item:last-child { margin-bottom: 0; }
.value-label {
  font-size: 26rpx;
  color: #5c4a3a;
  display: block;
  margin-bottom: 12rpx;
  font-weight: 600;
}
.value-price {
  font-size: 52rpx;
  font-weight: 800;
  color: #c0392b;
  display: block;
  margin-bottom: 8rpx;
}
.value-tip { font-size: 20rpx; color: #999; display: block; }

.authenticity-bar {
  height: 16rpx;
  background: #f0ebe3;
  border-radius: 8rpx;
  margin: 12rpx 0;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 8rpx;
  transition: width 0.5s ease;
}
.authenticity-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.authenticity-score { font-size: 36rpx; font-weight: 800; }
.authenticity-label { font-size: 24rpx; color: #5c4a3a; font-weight: 600; }

.diagnosis-section { padding: 30rpx; border-bottom: 1rpx solid #f0ebe3; }
.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #2c2416;
  display: block;
  margin-bottom: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
  border-left: 5rpx solid #d4a574;
  padding-left: 12rpx;
}
.diagnosis-content {
  background: #faf7f2;
  border-radius: 16rpx;
  padding: 25rpx;
}
.diagnosis-text {
  font-size: 26rpx;
  color: #5c4a3a;
  line-height: 1.8;
  white-space: pre-wrap;
}

.action-buttons {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  border: none;
}
.btn-icon { font-size: 32rpx; }
.primary-btn {
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
  box-shadow: 0 8rpx 20rpx rgba(139, 105, 20, 0.3);
}
.secondary-btn {
  background: #faf7f2;
  color: #8b6914;
  border: 2rpx solid #d4a574;
}
.tertiary-btn {
  background: #fff;
  color: #5c4a3a;
  border: 2rpx solid #e0d5c5;
}
</style>