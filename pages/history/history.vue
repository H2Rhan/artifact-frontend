<template>
  <view class="container">
    <view class="header">
      <text class="title">鉴定记录</text>
      <text class="subtitle">共 {{ historyList.length }} 条记录</text>
    </view>
    <view v-if="historyList.length > 0" class="list">
      <view class="card" v-for="item in historyList" :key="item.id" @click="viewDetail(item)">
        <image :src="item.imageUrl" class="thumb" mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ item.artifact.name }}</text>
          <text class="meta">{{ item.artifact.dynasty }} · {{ item.artifact.category }}</text>
          <text class="price" v-if="item.artifact.priceRange">💰 {{ item.artifact.priceRange }}</text>
          <text class="time">{{ item.time }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
    <view v-else class="empty">
      <text class="empty-icon">📜</text>
      <text class="empty-text">暂无鉴定记录</text>
      <text class="empty-tip">去交易大厅鉴定钱币试试吧</text>
    </view>
  </view>
</template>

<script>
export default {
  data() { return { historyList: [] } },
  onShow() {
    try { 
      this.historyList = uni.getStorageSync('identify_history') || [] 
    } catch (e) { 
      this.historyList = [] 
    }
  },
  methods: {
    viewDetail(item) {
      // 保存当前查看的记录
      uni.setStorageSync('current_identification', item)
      // 跳转到鉴定详情页面
      uni.navigateTo({ url: '/pages/history/detail' })
    }
  }
}
</script>

<style>
.container { background: #f5f6f8; min-height: 100vh; padding: 20rpx; }
.header { text-align: center; padding: 20rpx 0 30rpx; }
.title { font-size: 36rpx; font-weight: bold; color: #333; display: block; }
.subtitle { font-size: 24rpx; color: #999; display: block; margin-top: 5rpx; }
.card { background: #fff; border-radius: 16rpx; padding: 20rpx; display: flex; align-items: center; margin-bottom: 20rpx; }
.thumb { width: 120rpx; height: 120rpx; border-radius: 12rpx; margin-right: 20rpx; background: #f0f2f5; }
.info { flex: 1; }
.name { font-size: 30rpx; font-weight: bold; color: #333; display: block; margin-bottom: 8rpx; }
.meta { font-size: 24rpx; color: #667eea; display: block; margin-bottom: 8rpx; }
.price { font-size: 26rpx; color: #ff6b6b; font-weight: bold; display: block; margin-bottom: 8rpx; }
.time { font-size: 22rpx; color: #999; }
.arrow { font-size: 40rpx; color: #ccc; margin-left: 10rpx; }
.empty { text-align: center; margin-top: 200rpx; }
.empty-icon { font-size: 100rpx; display: block; margin-bottom: 20rpx; }
.empty-text { color: #666; font-size: 28rpx; display: block; margin-bottom: 15rpx; }
.empty-tip { color: #ccc; font-size: 24rpx; }
</style>