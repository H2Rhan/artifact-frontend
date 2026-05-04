<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="nav-title">3D 模型</text>
      <text class="nav-placeholder"></text>
    </view>
    
    <!-- 3D 模型展示区 -->
    <view class="model-wrapper">
      <web-view v-if="viewerUrl" :src="viewerUrl"></web-view>
      <view v-else class="no-model">
        <text class="no-model-icon">🎨</text>
        <text class="no-model-text">暂无 3D 模型</text>
        <text class="no-model-desc">该文物暂未上传 3D 模型</text>
      </view>
    </view>
    
    <!-- 文物信息 -->
    <scroll-view class="info-panel" scroll-y>
      <view class="info-header">
        <text class="artifact-name">{{ artifactName }}</text>
        <view class="tags">
          <text class="tag dynasty">{{ dynasty }}</text>
          <text class="tag category">{{ category }}</text>
        </view>
      </view>
      
      <view class="info-content">
        <text class="label">📜 文物介绍</text>
        <text class="value">{{ description || '暂无详细介绍' }}</text>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn primary" @click="goChat">
          <text class="btn-icon">🤖</text>
          <text>蓝心讲解</text>
        </button>
        <button class="action-btn secondary" @click="goDiagnosis">
          <text class="btn-icon">🔍</text>
          <text>AI 诊断</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      artifactName: '未知文物',
      dynasty: '',
      category: '',
      description: '',
      viewerUrl: ''
    }
  },
  onLoad(options) {
    this.artifactName = options.name || '未知文物'
    this.dynasty = options.dynasty || ''
    this.category = options.category || ''
    this.description = options.description || ''
    
    // 注意：由于没有后端服务器，暂时无法显示 3D 模型
    // 如果您有 3D 模型文件的 URL，可以取消下面的注释
    // const modelUrl = options.modelUrl
    // if (modelUrl) {
    //   this.viewerUrl = modelUrl
    // }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    goChat() {
      uni.navigateTo({
        url: `/pages/detail/chat?name=${this.artifactName}&dynasty=${this.dynasty}`
      })
    },
    goDiagnosis() {
      uni.navigateTo({
        url: `/pages/detail/diagnosis?name=${this.artifactName}&dynasty=${this.dynasty}`
      })
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #faf7f2;
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

/* 3D 模型展示区 */
.model-wrapper {
  height: 50vh;
  background: #2c2416;
  position: relative;
}
.no-model {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d4a574;
}
.no-model-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}
.no-model-text {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
}
.no-model-desc {
  font-size: 24rpx;
  color: rgba(212, 165, 116, 0.6);
}

/* 信息面板 */
.info-panel {
  flex: 1;
  padding: 30rpx;
  background: #faf7f2;
}
.info-header {
  margin-bottom: 30rpx;
}
.artifact-name {
  font-size: 44rpx;
  font-weight: 800;
  color: #2c2416;
  display: block;
  margin-bottom: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.tags {
  display: flex;
  gap: 15rpx;
}
.tag {
  padding: 10rpx 25rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
}
.tag.dynasty {
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
}
.tag.category {
  background: #faf7f2;
  color: #8b6914;
  border: 2rpx solid #d4a574;
}

/* 内容区 */
.info-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.06);
}
.label {
  font-size: 28rpx;
  font-weight: 700;
  color: #2c2416;
  display: block;
  margin-bottom: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.value {
  font-size: 28rpx;
  color: #5c4a3a;
  line-height: 1.8;
  display: block;
}

/* 操作按钮 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}
.action-btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.action-btn.primary {
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
  box-shadow: 0 6rpx 15rpx rgba(139, 105, 20, 0.3);
}
.action-btn.secondary {
  background: #fff;
  color: #8b6914;
  border: 2rpx solid #d4a574;
}
.btn-icon {
  font-size: 32rpx;
}
</style>