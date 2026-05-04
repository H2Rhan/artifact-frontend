<template>
  <view class="container">
    <!-- 顶部图片 -->
    <view class="image-section">
      <image :src="record.imageUrl" mode="aspectFit" class="main-image"></image>
    </view>
    
    <!-- 基本信息 -->
    <view class="info-section">
      <text class="section-title">📋 基本信息</text>
      <view class="info-grid">
        <view class="info-item">
          <text class="label">名称</text>
          <text class="value">{{ record.artifact.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">朝代</text>
          <text class="value">{{ record.artifact.dynasty }}</text>
        </view>
        <view class="info-item">
          <text class="label">类别</text>
          <text class="value">{{ record.artifact.category }}</text>
        </view>
        <view class="info-item price-item">
          <text class="label">市场估价</text>
          <text class="value price">{{ record.artifact.priceRange }}</text>
        </view>
      </view>
    </view>
    
    <!-- AI鉴定报告 -->
    <view class="report-section">
      <text class="section-title">🤖 AI鉴定报告</text>
      <view class="report-content">
        <text class="report-text">{{ record.aiAnalysis }}</text>
      </view>
    </view>
    
    <!-- 对话历史 -->
    <view class="chat-section">
      <text class="section-title">💬 鉴定对话</text>
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
    
    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="btn-secondary" @click="goBack">返回记录</button>
      <button class="btn-primary" @click="shareReport">分享报告</button>
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
    } catch (e) {
      console.error('加载记录失败:', e)
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
      // 处理数组格式的消息(带图片的消息)
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

.info-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.info-item {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
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

.price-item {
  grid-column: span 2;
  background: #fff5f5;
}

.price {
  color: #ff6b6b;
  font-size: 32rpx;
  font-weight: bold;
}

.report-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
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

.chat-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
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

.action-section {
  padding: 0 20rpx;
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.btn-primary, .btn-secondary {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-secondary {
  background: #f0f2f5;
  color: #666;
}
</style>