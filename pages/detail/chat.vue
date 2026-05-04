<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="nav-title">蓝心讲解员</text>
      <text class="nav-placeholder"></text>
    </view>
    
    <!-- 聊天区域 -->
    <scroll-view scroll-y class="chat-box" :scroll-into-view="scrollId" scroll-with-animation>
      <view v-for="(msg, i) in history" :key="i" :id="'msg-' + i" :class="['msg', msg.role]">
        <view class="msg-avatar" v-if="msg.role === 'ai'">🤖</view>
        <view class="msg-bubble" :class="msg.role">
          <text class="msg-content">{{ msg.content }}</text>
        </view>
      </view>
      
      <!-- 思考中动画 -->
      <view v-if="thinking" class="msg ai">
        <view class="msg-avatar">🤖</view>
        <view class="msg-bubble ai">
          <view class="typing-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 输入区域 -->
    <view class="input-area">
      <input 
        v-model="input" 
        class="chat-input" 
        placeholder="询问文物的历史..." 
        @confirm="send"
        :disabled="thinking"
      />
      <button class="send-btn" @click="send" :disabled="thinking || !input.trim()">
        <text v-if="thinking">⏳</text>
        <text v-else>发送</text>
      </button>
    </view>
  </view>
</template>

<script>
import { callOpenAI, getArtifactChatPrompt } from '../../utils/api.js'

export default {
  data() { 
    return { 
      input: '', 
      history: [], 
      thinking: false,
      scrollId: '',
      artifactName: '这件文物',
      conversationHistory: [] // 保存对话历史用于上下文
    } 
  },
  onLoad(options) {
    this.artifactName = options.name || '这件文物'
    const dynasty = options.dynasty || ''
    
    // 添加欢迎消息
    const welcomeMsg = `您好！我是蓝心讲解员。🎋

关于【${this.artifactName}】${dynasty ? '（' + dynasty + '）' : ''}，您有什么想了解的吗？

我可以为您介绍：
📜 历史背景
🎨 工艺特点
💎 文化价值
🔍 鉴定要点`
    
    this.history.push({ role: 'ai', content: welcomeMsg })
    this.scrollToBottom()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    async send() {
      if (!this.input.trim() || this.thinking) return
      
      const userMessage = this.input.trim()
      this.input = ''
      
      // 添加用户消息
      this.history.push({ role: 'user', content: userMessage })
      this.scrollToBottom()
      
      // 开始思考
      this.thinking = true
      
      try {
        // 构建对话历史（保留最近 10 条消息作为上下文）
        const recentHistory = this.history.slice(-10).map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.content
        }))
        
        // 构建系统提示
        const messages = [
          {
            role: 'system',
            content: `你是"蓝心讲解员"，一位专业的文物历史讲解专家。你正在为游客讲解【${this.artifactName}】。

你的讲解要求：
1. 内容详实丰富，每次回答不少于 300 字
2. 从多个角度展开：历史背景、制作工艺、文化价值、流传故事等
3. 语言生动有趣，富有故事性和感染力
4. 专业准确，同时通俗易懂
5. 适当使用表情符号增加趣味性
6. 分段清晰，使用小标题组织内容
7. 提供具体的数据、年代、人物等细节
8. 结合历史典故和趣闻轶事`
          },
          ...recentHistory
        ]
        
        // 调用 AI API
        const response = await callOpenAI(messages, 0.8)
        
        // 添加 AI 回复
        this.history.push({ role: 'ai', content: response })
        this.scrollToBottom()
        
      } catch (error) {
        console.error('AI 调用失败:', error)
        this.history.push({ 
          role: 'ai', 
          content: '抱歉，我现在有点累了，请稍后再试。😅\n\n错误信息：' + (error.message || '网络错误')
        })
        this.scrollToBottom()
      } finally {
        this.thinking = false
      }
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollId = 'msg-' + (this.history.length - 1)
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

/* 聊天区域 */
.chat-box { 
  flex: 1; 
  padding: 30rpx;
  background: #faf7f2;
}

.msg { 
  display: flex;
  margin-bottom: 30rpx;
  align-items: flex-start;
}

.msg.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.08);
}

.msg-bubble {
  max-width: 75%;
  padding: 25rpx 30rpx;
  border-radius: 24rpx;
  margin: 0 20rpx;
}

.msg-bubble.ai {
  background: #fff;
  color: #2c2416;
  border-bottom-left-radius: 6rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.06);
}

.msg-bubble.user {
  background: linear-gradient(135deg, #8b6914, #d4a574);
  color: #fff;
  border-bottom-right-radius: 6rpx;
  box-shadow: 0 4rpx 15rpx rgba(139, 105, 20, 0.3);
}

.msg-content {
  font-size: 28rpx;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 思考动画 */
.typing-dots {
  display: flex;
  gap: 10rpx;
  padding: 10rpx 0;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #d4a574;
  animation: typing 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { 
    transform: translateY(0);
    opacity: 0.4;
  }
  30% { 
    transform: translateY(-10rpx);
    opacity: 1;
  }
}

/* 输入区域 */
.input-area { 
  padding: 20rpx 30rpx; 
  display: flex; 
  gap: 15rpx; 
  border-top: 1rpx solid #e0d5c5; 
  background: #fff;
  box-shadow: 0 -4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.chat-input { 
  flex: 1; 
  height: 80rpx; 
  background: #faf7f2; 
  border-radius: 40rpx; 
  padding: 0 30rpx; 
  font-size: 28rpx;
  color: #2c2416;
}

.send-btn { 
  width: 140rpx; 
  height: 80rpx; 
  line-height: 80rpx; 
  background: linear-gradient(135deg, #8b6914, #d4a574); 
  color: #fff; 
  border-radius: 40rpx; 
  font-size: 28rpx; 
  font-weight: 700;
  padding: 0;
  box-shadow: 0 4rpx 15rpx rgba(139, 105, 20, 0.3);
}

.send-btn[disabled] { 
  background: #e0d5c5; 
  color: #999;
  box-shadow: none;
}
</style>