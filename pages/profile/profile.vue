<template>
  <view class="container">
    <!-- 顶部用户信息区 -->
    <view class="user-header">
      <view class="bg-decoration"></view>
      <view class="user-info">
        <view class="avatar-wrapper">
          <image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill"></image>
          <text class="edit-avatar">✎</text>
        </view>
        <view class="user-detail">
          <text class="username">{{ userInfo.nickname || '古玩爱好者' }}</text>
          <text class="user-id">ID: {{ userInfo.id || '88888888' }}</text>
        </view>
        <text class="settings-icon" @click="goSettings">⚙</text>
      </view>
      
      <!-- 数据统计 -->
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.collections || 0 }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.followers || 0 }}</text>
          <text class="stat-label">粉丝</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.following || 0 }}</text>
          <text class="stat-label">关注</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.identifications || 0 }}</text>
          <text class="stat-label">鉴定</text>
        </view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="more-btn" @click="goOrders">全部订单 ›</text>
      </view>
      <view class="order-grid">
        <view class="order-item" @click="goOrders">
          <text class="order-icon">💰</text>
          <text class="order-text">待付款</text>
        </view>
        <view class="order-item" @click="goOrders">
          <text class="order-icon">📦</text>
          <text class="order-text">待发货</text>
        </view>
        <view class="order-item" @click="goOrders">
          <text class="order-icon">🚚</text>
          <text class="order-text">待收货</text>
        </view>
        <view class="order-item" @click="goOrders">
          <text class="order-icon">⭐</text>
          <text class="order-text">待评价</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">我的服务</text>
      </view>
      <view class="service-list">
        <view class="service-item" @click="goPublish">
          <view class="service-icon-wrapper">
            <text class="service-icon">📝</text>
          </view>
          <text class="service-text">我的发布</text>
          <text class="arrow">›</text>
        </view>
        <view class="service-item" @click="goFavorites">
          <view class="service-icon-wrapper">
            <text class="service-icon">♡</text>
          </view>
          <text class="service-text">我的收藏</text>
          <text class="arrow">›</text>
        </view>
        <view class="service-item" @click="goHistory">
          <view class="service-icon-wrapper">
            <text class="service-icon">📜</text>
          </view>
          <text class="service-text">鉴定记录</text>
          <text class="arrow">›</text>
        </view>
        <view class="service-item" @click="goAddress">
          <view class="service-icon-wrapper">
            <text class="service-icon">📍</text>
          </view>
          <text class="service-text">收货地址</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 更多功能 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">更多功能</text>
      </view>
      <view class="service-list">
        <view class="service-item" @click="goHelp">
          <view class="service-icon-wrapper">
            <text class="service-icon">❓</text>
          </view>
          <text class="service-text">帮助中心</text>
          <text class="arrow">›</text>
        </view>
        <view class="service-item" @click="goFeedback">
          <view class="service-icon-wrapper">
            <text class="service-icon">💬</text>
          </view>
          <text class="service-text">意见反馈</text>
          <text class="arrow">›</text>
        </view>
        <view class="service-item" @click="goAbout">
          <view class="service-icon-wrapper">
            <text class="service-icon">ℹ</text>
          </view>
          <text class="service-text">关于我们</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        nickname: '古玩爱好者',
        id: '88888888',
        avatar: '/static/logo.png',
        collections: 28,
        followers: 156,
        following: 42,
        identifications: 89
      }
    }
  },
  methods: {
    goSettings() {
      uni.showToast({ title: '进入设置', icon: 'none' })
    },
    goOrders() {
      uni.showToast({ title: '查看订单', icon: 'none' })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/trade/publish' })
    },
    goFavorites() {
      uni.showToast({ title: '查看收藏', icon: 'none' })
    },
    goHistory() {
      uni.switchTab({ url: '/pages/history/history' })
    },
    goAddress() {
      uni.showToast({ title: '管理地址', icon: 'none' })
    },
    goHelp() {
      uni.showToast({ title: '帮助中心', icon: 'none' })
    },
    goFeedback() {
      uni.showToast({ title: '意见反馈', icon: 'none' })
    },
    goAbout() {
      uni.showToast({ title: '关于我们', icon: 'none' })
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已退出登录', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style>
/* 容器 */
.container {
  background: #faf7f2;
  min-height: 100vh;
  padding-bottom: 30rpx;
}

/* 顶部用户信息区 */
.user-header {
  position: relative;
  padding: 60rpx 30rpx 40rpx;
  background: linear-gradient(135deg, #2c2416 0%, #5c4a3a 100%);
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 25rpx;
}
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="80" cy="20" r="30" fill="rgba(212,165,116,0.1)"/><circle cx="20" cy="80" r="25" fill="rgba(212,165,116,0.08)"/></svg>');
  opacity: 0.5;
}
.user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  margin-bottom: 35rpx;
}
.avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #d4a574;
  background: #fff;
}
.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background: #d4a574;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  border: 3rpx solid #2c2416;
}
.user-detail {
  flex: 1;
}
.username {
  font-size: 36rpx;
  font-weight: 800;
  color: #d4a574;
  display: block;
  margin-bottom: 8rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.user-id {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}
.settings-icon {
  font-size: 44rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 数据统计 */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  padding: 25rpx 0;
  position: relative;
  z-index: 1;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8rpx;
}
.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
}
.stat-divider {
  width: 1rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.2);
}

/* 卡片通用样式 */
.section-card {
  background: #fff;
  margin: 0 25rpx 25rpx;
  border-radius: 24rpx;
  padding: 30rpx 25rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #2c2416;
  font-family: 'STKaiti', 'KaiTi', serif;
  border-left: 5rpx solid #d4a574;
  padding-left: 12rpx;
}
.more-btn {
  font-size: 24rpx;
  color: #999;
}

/* 订单网格 */
.order-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15rpx;
}
.order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}
.order-icon {
  font-size: 50rpx;
  margin-bottom: 12rpx;
}
.order-text {
  font-size: 22rpx;
  color: #5c4a3a;
}

/* 服务列表 */
.service-list {
  display: flex;
  flex-direction: column;
}
.service-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0ebe3;
}
.service-item:last-child {
  border-bottom: none;
}
.service-icon-wrapper {
  width: 70rpx;
  height: 70rpx;
  background: #faf7f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}
.service-icon {
  font-size: 36rpx;
}
.service-text {
  flex: 1;
  font-size: 28rpx;
  color: #2c2416;
  font-weight: 600;
}
.arrow {
  font-size: 36rpx;
  color: #ccc;
}

/* 退出登录按钮 */
.logout-btn {
  margin: 40rpx 25rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  color: #c0392b;
  font-size: 30rpx;
  font-weight: 700;
  border-radius: 44rpx;
  border: 2rpx solid #f0ebe3;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.06);
}
</style>