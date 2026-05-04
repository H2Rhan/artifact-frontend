<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="nav-title">AI 智能诊断</text>
      <text class="nav-placeholder"></text>
    </view>
    
    <!-- 文物信息 -->
    <view class="artifact-info">
      <text class="artifact-name">{{ artifactName }}</text>
      <text class="artifact-dynasty">{{ dynasty }}</text>
    </view>
    
    <!-- 诊断输入区 -->
    <view class="diagnosis-input">
      <text class="input-label">请描述文物的病害情况：</text>
      <textarea 
        v-model="damageDesc" 
        class="diagnosis-textarea" 
        placeholder="例如：瓷器表面有裂纹，边缘有缺损，釉色脱落..."
        maxlength="500"
      ></textarea>
      <text class="char-count">{{ damageDesc.length }}/500</text>
    </view>
    
    <!-- 诊断按钮 -->
    <button class="diagnose-btn" @click="startDiagnosis" :disabled="!damageDesc.trim() || thinking">
      <text v-if="thinking">🔍 诊断中...</text>
      <text v-else>🤖 开始 AI 诊断</text>
    </button>
    
    <!-- 诊断结果 -->
    <view v-if="diagnosisResult" class="result-card">
      <text class="result-title">📋 诊断报告</text>
      <view class="result-content">
        <text class="result-text">{{ diagnosisResult }}</text>
      </view>
      
      <!-- 操作按钮 -->
      <view class="result-actions">
        <button class="action-btn copy-btn" @click="copyResult">📋 复制报告</button>
        <button class="action-btn share-btn" @click="shareResult">📤 分享报告</button>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="thinking" class="loading-overlay">
      <view class="loading-spinner"></view>
      <text class="loading-text">AI 正在分析病害...</text>
    </view>
  </view>
</template>

<script>
import { callOpenAI, getRestorationPrompt } from '../../utils/api.js'

export default {
  data() { 
    return { 
      artifactName: '未知文物',
      dynasty: '',
      damageDesc: '',
      diagnosisResult: '',
      thinking: false
    } 
  },
  onLoad(options) {
    this.artifactName = options.name || '未知文物'
    this.dynasty = options.dynasty || ''
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    async startDiagnosis() {
      if (!this.damageDesc.trim() || this.thinking) return
      
      this.thinking = true
      this.diagnosisResult = ''
      
      try {
        const messages = getRestorationPrompt(this.artifactName, this.damageDesc)
        const response = await callOpenAI(messages, 0.7)
        
        this.diagnosisResult = response
        this.scrollToResult()
        
      } catch (error) {
        console.error('诊断失败:', error)
        uni.showToast({ 
          title: '诊断失败，请重试', 
          icon: 'none',
          duration: 2000
        })
      } finally {
        this.thinking = false
      }
    },
    
    scrollToResult() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 999999,
          duration: 300
        })
      })
    },
    
    copyResult() {
      uni.setClipboardData({
        data: this.diagnosisResult,
        success: () => {
          uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
        }
      })
    },
    
    shareResult() {
      uni.showShareMenu({
        withShareTicket: true
      })
    }
  }
}
</script>

<style>
.container {
  background: #faf7f2;
  min-height: 100vh;
  padding-bottom: 50rpx;
}

/* 顶部导航 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #2c2416 0%, #5c4a3a 100%);
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}
.back-btn {
  font-size: 40rpx;
  color: #d4a574;
  width: 60rpx;
}
.nav-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #d4a574;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.nav-placeholder {
  width: 60rpx;
}

/* 文物信息 */
.artifact-info {
  padding: 30rpx;
  text-align: center;
}
.artifact-name {
  font-size: 40rpx;
  font-weight: 800;
  color: #2c2416;
  display: block;
  margin-bottom: 10rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.artifact-dynasty {
  font-size: 26rpx;
  color: #8b6914;
}

/* 诊断输入区 */
.diagnosis-input {
  margin: 0 30rpx 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.06);
}
.input-label {
  font-size: 28rpx;
  color: #2c2416;
  font-weight: 600;
  display: block;
  margin-bottom: 15rpx;
}
.diagnosis-textarea {
  width: 100%;
  min-height: 200rpx;
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #2c2416;
  line-height: 1.6;
}
.char-count {
  font-size: 22rpx;
  color: #999;
  display: block;
  text-align: right;
  margin-top: 10rpx;
}

/* 诊断按钮 */
.diagnose-btn {
  margin: 0 30rpx 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  border-radius: 45rpx;
  box-shadow: 0 8rpx 20rpx rgba(139, 105, 20, 0.3);
}
.diagnose-btn[disabled] {
  background: #e0d5c5;
  color: #999;
  box-shadow: none;
}

/* 诊断结果 */
.result-card {
  margin: 0 30rpx 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.08);
}
.result-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #2c2416;
  display: block;
  margin-bottom: 20rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.result-content {
  background: #faf7f2;
  border-radius: 12rpx;
  padding: 25rpx;
  margin-bottom: 25rpx;
}
.result-text {
  font-size: 28rpx;
  color: #2c2416;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 操作按钮 */
.result-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}
.action-btn {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
}
.copy-btn {
  background: #faf7f2;
  color: #8b6914;
  border: 2rpx solid #d4a574;
}
.share-btn {
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #d4a574;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 30rpx;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}
</style>