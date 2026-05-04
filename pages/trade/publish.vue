<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">发布藏品</text>
      <text class="subtitle">填写信息，让您的藏品触达更多收藏家</text>
    </view>

    <!-- 第一步：上传照片 -->
    <view class="step-card">
      <view class="step-header">
        <view class="step-num">1</view>
        <text class="step-title">上传藏品照片</text>
      </view>
      
      <view class="upload-area" @click="chooseImage">
        <image v-if="uploadedImage" :src="uploadedImage" class="preview-img" mode="aspectFill"></image>
        <view v-else class="upload-placeholder">
          <text class="upload-icon">📷</text>
          <text class="upload-text">点击上传藏品照片</text>
          <text class="upload-tip">支持 JPG、PNG 格式</text>
        </view>
      </view>
    </view>

    <!-- 第二步：填写交易信息 -->
    <view class="step-card">
      <view class="step-header">
        <view class="step-num">2</view>
        <text class="step-title">设置交易信息</text>
      </view>

      <!-- 藏品名称 -->
      <view class="form-group">
        <text class="label">藏品名称</text>
        <view class="input-wrapper">
          <input class="normal-input" type="text" v-model="form.name" placeholder="例如：清代青花瓷瓶" />
        </view>
      </view>

      <!-- 藏品分类 -->
      <view class="form-group">
        <text class="label">藏品分类</text>
        <picker mode="selector" :range="categories" :value="categoryIndex" @change="onCategoryChange">
          <view class="picker-box">
            <text :class="categoryIndex >= 0 ? 'picker-value' : 'picker-placeholder'">
              {{ categoryIndex >= 0 ? categories[categoryIndex] : '请选择分类' }}
            </text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </view>

      <!-- 出售价格 -->
      <view class="form-group">
        <text class="label">出售价格</text>
        <view class="price-input-wrapper">
          <text class="price-symbol">¥</text>
          <!-- #ifdef H5 -->
          <input class="price-input" type="number" v-model="form.price" placeholder="请输入价格" @input="onPriceInput" />
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <input class="price-input" type="digit" v-model="form.price" placeholder="请输入价格" confirm-type="done" />
          <!-- #endif -->
        </view>
      </view>

      <!-- 藏品描述 -->
      <view class="form-group">
        <text class="label">藏品描述</text>
        <!-- #ifdef H5 -->
        <textarea class="textarea" v-model="form.desc" placeholder="描述品相、来源、保存状况..." maxlength="500" @input="onDescInput" />
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <textarea class="textarea" v-model="form.desc" placeholder="描述品相、来源、保存状况..." maxlength="500" />
        <!-- #endif -->
        <text class="char-count">{{ form.desc.length }}/500</text>
      </view>

      <!-- 卖家联系方式 -->
      <view class="form-group">
        <text class="label">📞 联系方式</text>
        <view class="input-wrapper">
          <input class="normal-input" type="text" v-model="form.contact" placeholder="微信号 / 手机号 / QQ" />
        </view>
        <text class="form-tip">方便买家与您取得联系</text>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="submit" :disabled="submitting">
        <text v-if="!submitting">发布藏品</text>
        <text v-else>发布中...</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      uploadedImage: '',
      submitting: false,
      categoryIndex: -1,
      categories: ['收藏币', '纪念钞', '青铜币', '年份久远钱币', '杂项'],
      form: {
        name: '',
        price: '',
        desc: '',
        category: '',
        contact: ''
      }
    }
  },
  methods: {
    // H5环境下的输入处理
    onNameInput(e) {
      // 支持H5和小程序两种事件格式
      const value = e.detail ? e.detail.value : (e.target ? e.target.value : '')
      this.form.name = value
      console.log('name输入:', value)
    },
    onPriceInput(e) {
      const value = e.detail ? e.detail.value : (e.target ? e.target.value : '')
      this.form.price = value
      console.log('price输入:', value)
    },
    onDescInput(e) {
      const value = e.detail ? e.detail.value : (e.target ? e.target.value : '')
      this.form.desc = value
      console.log('desc输入:', value)
    },
    onContactInput(e) {
      const value = e.detail ? e.detail.value : (e.target ? e.target.value : '')
      this.form.contact = value
      console.log('contact输入:', value)
    },
    
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.form.category = this.categories[this.categoryIndex]
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.uploadedImage = res.tempFilePaths[0]
          uni.showToast({ title: '照片已上传', icon: 'success' })
        }
      })
    },

    submit() {
      console.log('=== 提交表单 ===')
      console.log('form.name:', this.form.name)
      console.log('form.price:', this.form.price)
      console.log('form.contact:', this.form.contact)
      console.log('categoryIndex:', this.categoryIndex)
      console.log('uploadedImage:', this.uploadedImage)
      
      if (!this.uploadedImage) {
        return uni.showToast({ title: '请先上传藏品照片', icon: 'none' })
      }
      if (!this.form.name) {
        return uni.showToast({ title: '请输入藏品名称', icon: 'none' })
      }
      if (this.categoryIndex < 0) {
        return uni.showToast({ title: '请选择藏品分类', icon: 'none' })
      }
      if (!this.form.price || this.form.price.trim() === '') {
        console.log('价格验证失败, form.price:', this.form.price)
        return uni.showToast({ title: '请输入出售价格', icon: 'none' })
      }
      if (!this.form.contact) {
        return uni.showToast({ title: '请填写联系方式', icon: 'none' })
      }

      this.submitting = true

      setTimeout(() => {
        const goodsList = uni.getStorageSync('trade_goods') || []
        goodsList.unshift({
          id: Date.now(),
          name: this.form.name,
          category: this.form.category,
          dynasty: '未知',
          price: this.form.price,
          image: this.uploadedImage,
          isAuth: false,
          description: this.form.desc,
          contact: this.form.contact
        })
        uni.setStorageSync('trade_goods', goodsList)

        this.submitting = false
        uni.showToast({ title: '发布成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style>
/* 容器 */
.container { 
  background: #f8f9fa; 
  min-height: 100vh; 
  padding: 30rpx;
  padding-bottom: 50rpx;
}

/* 顶部标题 */
.header { 
  text-align: center; 
  margin-bottom: 50rpx; 
  padding-top: 20rpx;
}
.title { 
  font-size: 44rpx; 
  font-weight: 800; 
  color: #1a1a1a; 
  display: block;
  letter-spacing: 1rpx;
}
.subtitle { 
  font-size: 24rpx; 
  color: #999; 
  display: block; 
  margin-top: 12rpx;
  letter-spacing: 0.5rpx;
}

/* 步骤卡片 */
.step-card { 
  background: #fff; 
  border-radius: 28rpx; 
  padding: 35rpx 30rpx; 
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
}
.step-header { 
  display: flex; 
  align-items: center; 
  margin-bottom: 30rpx;
}
.step-num {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 800;
  margin-right: 18rpx;
  box-shadow: 0 6rpx 15rpx rgba(102, 126, 234, 0.3);
}
.step-title { 
  font-size: 32rpx; 
  font-weight: 700; 
  color: #1a1a1a;
}

/* 上传区域 */
.upload-area {
  width: 100%;
  height: 420rpx;
  background: linear-gradient(135deg, #f5f6f8 0%, #e8eaf6 100%);
  border-radius: 24rpx;
  overflow: hidden;
  border: 3rpx dashed #d0d0d0;
  transition: all 0.3s;
}
.upload-area:active {
  border-color: #667eea;
  background: linear-gradient(135deg, #e8eaf6 0%, #d5d8f0 100%);
}
.preview-img {
  width: 100%;
  height: 100%;
}
.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.upload-icon {
  font-size: 90rpx;
  margin-bottom: 20rpx;
  opacity: 0.6;
}
.upload-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 600;
  margin-bottom: 10rpx;
}
.upload-tip {
  font-size: 22rpx;
  color: #999;
}

/* 表单组 */
.form-group {
  margin-bottom: 30rpx;
}
.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 700;
  display: block;
  margin-bottom: 15rpx;
}

/* 普通输入框wrapper */
.input-wrapper {
  width: 100%;
  background: #f5f6f8;
  border-radius: 16rpx;
  padding: 0 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 3rpx rgba(102, 126, 234, 0.1);
}

.normal-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #333;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.input, .textarea {
  width: 100%;
  background: #f5f6f8;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  border: 2rpx solid transparent;
  transition: all 0.3s;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}
.input:focus, .textarea:focus {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 3rpx rgba(102, 126, 234, 0.1);
}
.textarea {
  height: 200rpx;
}
.char-count {
  font-size: 22rpx;
  color: #999;
  display: block;
  text-align: right;
  margin-top: 8rpx;
}

/* 价格输入框 */
.price-input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f6f8;
  border-radius: 16rpx;
  padding: 0 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}
.price-input-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 3rpx rgba(102, 126, 234, 0.1);
}
.price-symbol {
  font-size: 32rpx;
  color: #667eea;
  font-weight: 800;
  margin-right: 8rpx;
}
.price-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #333;
}

/* 选择器 */
.picker-box {
  width: 100%;
  height: 88rpx;
  background: #f5f6f8;
  border-radius: 16rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}
.picker-box:active {
  background: #fff;
  border-color: #667eea;
}
.picker-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}
.picker-placeholder {
  font-size: 28rpx;
  color: #999;
}
.arrow {
  font-size: 24rpx;
  color: #999;
}

/* 提示文字 */
.form-tip {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-top: 10rpx;
}

/* 提交按钮 */
.submit-btn {
  margin-top: 40rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 34rpx;
  font-weight: 700;
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}
.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.3);
}
.submit-btn[disabled] {
  background: #ccc;
  box-shadow: none;
}
</style>
