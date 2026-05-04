<script>
  export default {
    onLaunch: function() {
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /* 全局基础样式 */
  page {
    background: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  }
  
  /* 滚动条美化 */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
  
  /* 通用卡片样式 */
  .modern-card {
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 通用渐变按钮 */
  .gradient-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.4);
  }
  
  /* 通用标题样式 */
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 0.5rpx;
  }
  
  /* 通用副标题 */
  .section-subtitle {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
</style>