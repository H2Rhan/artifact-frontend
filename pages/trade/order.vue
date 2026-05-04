<template>
  <view class="container">
    <view class="tabs">
      <text v-for="tab in tabs" :key="tab" :class="['tab', activeTab === tab ? 'active' : '']" @click="activeTab = tab">{{ tab }}</text>
    </view>
    
    <view class="order-list">
      <view class="order-card" v-for="order in orders" :key="order.id">
        <view class="order-header">
          <text class="order-id">订单号：{{ order.id }}</text>
          <text class="status" :class="order.status">{{ order.statusText }}</text>
        </view>
        <view class="order-body">
          <image class="order-img" :src="order.image" mode="aspectFill"></image>
          <view class="order-info">
            <text class="name">{{ order.name }}</text>
            <text class="price">¥ {{ order.price }}</text>
          </view>
        </view>
        <view class="order-footer">
          <button class="btn small">联系卖家</button>
          <button class="btn primary small" v-if="order.status === 'pending'">立即付款</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '全部',
      tabs: ['全部', '待付款', '已发货', '已完成'],
      orders: [
        { id: 'TR20240419001', name: '清代青花瓷瓶', price: '12,800', image: 'https://via.placeholder.com/100', status: 'pending', statusText: '待付款' },
        { id: 'TR20240418005', name: '和田玉观音挂件', price: '5,600', image: 'https://via.placeholder.com/100', status: 'shipped', statusText: '已发货' },
      ]
    }
  }
}
</script>

<style>
.container { background: #f8f9fa; min-height: 100vh; }
.tabs { display: flex; background: #fff; padding: 20rpx 0; }
.tab { flex: 1; text-align: center; font-size: 28rpx; color: #666; padding-bottom: 15rpx; }
.tab.active { color: #667eea; font-weight: bold; border-bottom: 4rpx solid #667eea; }
.order-list { padding: 20rpx; }
.order-card { background: #fff; border-radius: 16rpx; padding: 20rpx; margin-bottom: 20rpx; }
.order-header { display: flex; justify-content: space-between; margin-bottom: 15rpx; border-bottom: 1rpx solid #eee; padding-bottom: 10rpx; }
.order-id { font-size: 24rpx; color: #999; }
.status { font-size: 26rpx; font-weight: bold; }
.status.pending { color: #ff9800; }
.status.shipped { color: #2196f3; }
.order-body { display: flex; gap: 20rpx; margin-bottom: 15rpx; }
.order-img { width: 150rpx; height: 150rpx; border-radius: 12rpx; }
.order-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.name { font-size: 28rpx; font-weight: bold; color: #333; }
.price { color: #ff5722; font-size: 30rpx; font-weight: bold; }
.order-footer { display: flex; justify-content: flex-end; gap: 15rpx; }
.btn { padding: 10rpx 30rpx; border-radius: 30rpx; font-size: 24rpx; height: auto; line-height: 1.5; }
.small { padding: 10rpx 20rpx; font-size: 22rpx; }
.primary { background: #667eea; color: #fff; }
</style>