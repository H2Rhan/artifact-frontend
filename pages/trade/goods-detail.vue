<template>
  <view class="container">
    <!-- 商品主图 -->
    <view class="image-section">
      <image :src="item.image" mode="aspectFill" class="main-image"></image>
      <view class="image-overlay">
        <view class="badge" :class="item.isAuth ? 'auth' : 'unauth'">
          {{ item.isAuth ? '✓ AI认证' : '待鉴定' }}
        </view>
        <view class="hot-badge" v-if="item.hot">🔥 热门</view>
      </view>
    </view>
    
    <!-- 商品信息 -->
    <view class="info-card">
      <text class="item-name">{{ item.name }}</text>
      <view class="meta-row">
        <text class="dynasty">{{ item.dynasty }}</text>
        <text class="dot">·</text>
        <text class="category">{{ item.category }}</text>
      </view>
      <view class="platform-row">
        <text class="platform-icon">🏪</text>
        <text class="platform-name">{{ item.platform }}</text>
      </view>
    </view>
    
    <!-- 价格信息 -->
    <view class="price-card">
      <view class="price-row">
        <text class="price-label">当前售价</text>
        <text class="price-value">¥ {{ item.price }}</text>
      </view>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-label">成交量</text>
          <text class="stat-value">{{ item.sales }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">点赞数</text>
          <text class="stat-value">{{ item.likes }}</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-bar">
      <button class="btn-contact">联系卖家</button>
      <button class="btn-buy">立即购买</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      item: {}
    }
  },
  onLoad(options) {
    if (options.item) {
      try {
        this.item = JSON.parse(decodeURIComponent(options.item))
        console.log('✅ 加载商品详情:', this.item.name)
      } catch (e) {
        console.error('解析商品数据失败:', e)
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.container {
  background: #f5f6f8;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.image-section {
  position: relative;
  width: 100%;
  height: 600rpx;
  background: #fff;
}

.main-image {
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.badge.auth {
  background: rgba(76, 175, 80, 0.9);
  color: #fff;
}

.badge.unauth {
  background: rgba(255, 152, 0, 0.9);
  color: #fff;
}

.hot-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 87, 34, 0.9);
  color: #fff;
  font-size: 22rpx;
}

.info-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.item-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.dynasty {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 500;
}

.dot {
  color: #999;
}

.category {
  font-size: 28rpx;
  color: #666;
}

.platform-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.platform-icon {
  font-size: 28rpx;
}

.platform-name {
  font-size: 26rpx;
  color: #999;
}

.price-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.price-label {
  font-size: 28rpx;
  color: #666;
}

.price-value {
  font-size: 48rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.btn-contact, .btn-buy {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.btn-contact {
  background: #f0f2f5;
  color: #666;
}

.btn-buy {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
}
</style>