<template>
  <view class="container">
    <!-- 古风背景装饰 -->
    <view class="bg-pattern"></view>
    
    <!-- 顶部标题区 -->
    <view class="header">
      <view class="logo-section">
        <text class="main-title">古玩智能鉴定</text>
        <text class="sub-title">传承千年文化 · 连接古今价值</text>
      </view>
    </view>
    
    <!-- 主操作区 -->
    <view class="action-section">
      <view class="action-card" @click="takePhoto">
        <view class="card-icon-wrapper">
          <text class="card-icon">📷</text>
        </view>
        <text class="card-title">拍照识别</text>
        <text class="card-desc">即时拍摄文物</text>
      </view>
      
      <view class="action-card" @click="chooseFromAlbum">
        <view class="card-icon-wrapper">
          <text class="card-icon">🖼️</text>
        </view>
        <text class="card-title">相册选择</text>
        <text class="card-desc">从相册上传图片</text>
      </view>
    </view>
    
    <!-- 核心功能区 -->
    <view class="feature-section">
      <text class="section-title">核心功能</text>
      <view class="feature-grid">
        <view class="feature-item" @click="goMarket">
          <text class="feature-icon">💰</text>
          <text class="feature-text">市场估值</text>
        </view>
        <view class="feature-item" @click="goMarket">
          <text class="feature-icon">🔍</text>
          <text class="feature-text">真实度预测</text>
        </view>
        <view class="feature-item" @click="goDiagnosis">
          <text class="feature-icon">🤖</text>
          <text class="feature-text">AI 诊断</text>
        </view>
        <view class="feature-item" @click="goChat">
          <text class="feature-icon">📖</text>
          <text class="feature-text">历史讲解</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { callOpenAI } from '../../utils/api.js'

export default {
  methods: {
    takePhoto() {
      uni.chooseImage({ 
        count: 1, 
        sourceType: ['camera'], 
        success: (res) => this.startAIIdentification(res.tempFilePaths[0]) 
      })
    },
    chooseFromAlbum() {
      uni.chooseImage({ 
        count: 1, 
        sourceType: ['album'], 
        success: (res) => this.startAIIdentification(res.tempFilePaths[0]) 
      })
    },
    async startAIIdentification(filePath) {
      uni.showLoading({ 
        title: 'AI 鉴定中...',
        mask: true
      })
      
      try {
        // 使用 AI 生成鉴定结果
        const mockResult = await this.mockAIIdentification(filePath)
        uni.setStorageSync('current_result', [mockResult])
        uni.hideLoading()
        uni.navigateTo({ url: '/pages/result/result' })
      } catch (error) {
        uni.hideLoading()
        console.error('鉴定失败:', error)
        uni.showToast({ 
          title: '鉴定失败，请重试', 
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    async mockAIIdentification(filePath) {
      // 文物类别列表
      const categories = ['瓷器', '玉器', '青铜器', '书画', '钱币', '杂项']
      const dynasties = ['商代', '西周', '春秋', '战国', '秦代', '汉代', '唐代', '宋代', '元代', '明代', '清代']
      const names = {
        '瓷器': ['青花瓷瓶', '粉彩碗', '汝窑洗', '官窑盘', '哥窑瓶'],
        '玉器': ['和田玉龙佩', '翡翠手镯', '岫玉璧', '蓝田玉簪'],
        '青铜器': ['司母戊鼎', '四羊方尊', '青铜剑', '青铜镜'],
        '书画': ['清明上河图', '兰亭序', '千里江山图', '富春山居图'],
        '钱币': ['开元通宝', '乾隆通宝', '光绪元宝', '袁大头'],
        '杂项': ['紫檀木盒', '景泰蓝瓶', '漆器盒', '象牙雕']
      }
      
      // 随机选择类别和朝代
      const category = categories[Math.floor(Math.random() * categories.length)]
      const dynasty = dynasties[Math.floor(Math.random() * dynasties.length)]
      const nameList = names[category] || names['杂项']
      const name = nameList[Math.floor(Math.random() * nameList.length)]
      
      // 使用 AI 生成简介
      let description = ''
      try {
        const prompt = [
          {
            role: 'system',
            content: '你是一位文物专家。请用 50 字以内描述这件文物的特点。'
          },
          {
            role: 'user',
            content: `请描述：${dynasty}${name}（${category}）`
          }
        ]
        
        description = await callOpenAI(prompt, 0.7)
      } catch (error) {
        // AI 调用失败时使用默认描述
        description = `${dynasty}时期的${name}，属于${category}类文物，具有重要的历史和艺术价值。`
      }
      
      return {
        name: name,
        dynasty: dynasty,
        category: category,
        description: description,
        confidence: 0.75 + Math.random() * 0.2, // 75%-95% 的置信度
        imageUrl: filePath || '/static/logo.png',
        modelUrl: ''
      }
    },
    
    goMarket() {
      uni.switchTab({ url: '/pages/trade/market' })
    },
    goDiagnosis() {
      uni.navigateTo({ 
        url: '/pages/detail/diagnosis?name=示例文物&dynasty=明代' 
      })
    },
    goChat() {
      uni.navigateTo({ 
        url: '/pages/detail/chat?name=示例文物&dynasty=明代' 
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #faf7f2;
  padding: 40rpx 30rpx;
  position: relative;
}

/* 背景装饰 */
.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500rpx;
  background: linear-gradient(135deg, #2c2416 0%, #5c4a3a 100%);
  border-radius: 0 0 50rpx 50rpx;
  z-index: 0;
}

/* 顶部标题 */
.header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-top: 80rpx;
  margin-bottom: 60rpx;
}
.logo-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border-radius: 30rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
}
.main-title {
  font-size: 52rpx;
  font-weight: 800;
  color: #d4a574;
  display: block;
  margin-bottom: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 4rpx;
}
.sub-title {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  letter-spacing: 2rpx;
}

/* 主操作区 */
.action-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25rpx;
  margin-bottom: 50rpx;
  position: relative;
  z-index: 1;
}
.action-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 50rpx 25rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}
.action-card:active {
  transform: scale(0.96);
}
.card-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #faf7f2 0%, #f0ebe3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.06);
}
.card-icon {
  font-size: 60rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #2c2416;
  margin-bottom: 8rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.card-desc {
  font-size: 22rpx;
  color: #999;
}

/* 核心功能区 */
.feature-section {
  background: #fff;
  border-radius: 28rpx;
  padding: 35rpx 25rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.06);
}
.section-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #2c2416;
  display: block;
  margin-bottom: 25rpx;
  padding-left: 15rpx;
  font-family: 'STKaiti', 'KaiTi', serif;
  border-left: 6rpx solid #d4a574;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.feature-item {
  background: #faf7f2;
  border-radius: 18rpx;
  padding: 30rpx 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}
.feature-item:active {
  transform: scale(0.96);
}
.feature-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}
.feature-text {
  font-size: 24rpx;
  color: #2c2416;
  font-weight: 600;
}
</style>