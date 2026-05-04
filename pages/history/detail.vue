<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">‹ 返回</text>
      <text class="title">鉴定报告</text>
      <text class="share-btn" @click="shareReport">分享</text>
    </view>

    <!-- 钱币图片 -->
    <view class="image-section">
      <image :src="record.imageUrl" mode="aspectFit" class="main-image"></image>
    </view>
    
    <!-- 基本信息卡片 -->
    <view class="info-card">
      <view class="card-header">
        <text class="card-title">📋 基本信息</text>
      </view>
      <view class="info-grid">
        <view class="info-item">
          <text class="label">钱币名称</text>
          <text class="value">{{ record.artifact.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">所属朝代</text>
          <text class="value">{{ record.artifact.dynasty }}</text>
        </view>
        <view class="info-item">
          <text class="label">藏品类别</text>
          <text class="value">{{ record.artifact.category }}</text>
        </view>
        <view class="info-item highlight">
          <text class="label">市场估价</text>
          <text class="value price">{{ record.artifact.priceRange }}</text>
        </view>
      </view>
      <view class="time-info">
        <text class="label">鉴定时间</text>
        <text class="value">{{ record.time }}</text>
      </view>
    </view>
    
    <!-- AI鉴定报告 -->
    <view class="report-card">
      <view class="card-header">
        <text class="card-title">🤖 AI鉴定报告</text>
      </view>
      <view class="report-content">
        <text class="report-text">{{ record.aiAnalysis }}</text>
      </view>
    </view>
    
    <!-- 对话历史 -->
    <view class="chat-card" v-if="record.chatHistory && record.chatHistory.length > 0">
      <view class="card-header">
        <text class="card-title">💬 鉴定对话记录</text>
      </view>
      <view class="chat-list">
        <view 
          v-for="(msg, index) in record.chatHistory" 
          :key="index"
          :class="['chat-item', msg.role === 'user' ? 'user-msg' : 'ai-msg']"
        >
          <view class="chat-avatar">
            <text>{{ msg.role === 'user' ? '👤' : '🤖' }}</text>
          </view>
          <view class="chat-bubble">
            <text class="chat-text">{{ formatMessage(msg.content) }}</text>
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
      record: {}
    }
  },
  onLoad() {
    try {
      this.record = uni.getStorageSync('current_identification') || {}
      if (!this.record.id) {
        uni.showToast({
          title: '记录不存在',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    } catch (e) {
      console.error('加载记录失败:', e)
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    shareReport() {
      uni.showModal({
        title: '分享报告',
        content: '是否将鉴定报告复制到剪贴板?',
        success: (res) => {
          if (res.confirm) {
            const reportText = `
📜 古玩鉴定报告
━━━━━━━━━━━━━
名称: ${this.record.artifact.name}
朝代: ${this.record.artifact.dynasty}
类别: ${this.record.artifact.category}
估价: ${this.record.artifact.priceRange}
鉴定时间: ${this.record.time}
━━━━━━━━━━━━━

${this.record.aiAnalysis}
            `.trim()
            
            uni.setClipboardData({
              data: reportText,
              success: () => {
                uni.showToast({
                  title: '已复制到剪贴板',
                  icon: 'success'
                })
              }
            })
          }
        }
      })
    },
    formatMessage(content) {
      if (Array.isArray(content)) {
        return content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n')
      }
      return content || ''
    }
  }
}
</script>

<style>
.container {
  background: #f5f6f8;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.nav-bar {
  background: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
}

.back-btn {
  font-size: 28rpx;
  color: #667eea;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.share-btn {
  font-size: 28rpx;
  color: #667eea;
}

.image-section {
  background: #fff;
  padding: 40rpx;
  text-align: center;
}

.main-image {
  width: 100%;
  max-height: 600rpx;
  border-radius: 16rpx;
}

.info-card, .report-card, .chat-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.card-header {
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f2f5;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.info-item {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
}

.info-item.highlight {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  grid-column: span 2;
}

.label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

.price {
  color: #ff6b6b;
  font-size: 36rpx;
  font-weight: bold;
}

.time-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0f2f5;
}

.report-content {
  background: #f8f9fa;
  padding: 24rpx;
  border-radius: 12rpx;
  border-left: 4rpx solid #667eea;
}

.report-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.chat-list {
  max-height: 800rpx;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  margin-bottom: 24rpx;
}

.user-msg {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.chat-bubble {
  max-width: 70%;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  margin: 0 16rpx;
}

.user-msg .chat-bubble {
  background: #667eea;
  color: #fff;
}

.ai-msg .chat-bubble {
  background: #f0f2f5;
  color: #333;
}

.chat-text {
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>