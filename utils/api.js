// API 配置 - vivo 蓝心大模型代理
export const API_CONFIG = {
  // 使用后端代理（避免跨域）
  USE_PROXY: true,
  PROXY_URL: 'http://localhost:8000/api/chat',
  // vivo API Key（真实的 Key）
  VIVO_APP_KEY: 'sk-xuanji-2026446869-Q0ZoTXNtTnNtZkZ0ZnppSg==',
  // 使用模拟数据（false = 使用真实 AI，true = 使用模拟数据）
  USE_MOCK: false
}

// AI API 调用工具
export function callOpenAI(messages, temperature = 0.7) {
  return new Promise((resolve, reject) => {
    console.log('调用 AI API...', messages)
    
    // 如果使用模拟数据
    if (API_CONFIG.USE_MOCK) {
      console.log('使用模拟数据模式')
      const lastUserMessage = messages[messages.length - 1]?.content || ''
      const mockResponse = generateMockResponse(lastUserMessage)
      setTimeout(() => resolve(mockResponse), 1000)
      return
    }
    
    // 如果使用代理
    if (API_CONFIG.USE_PROXY) {
      uni.request({
        url: API_CONFIG.PROXY_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          messages: messages,
          temperature: temperature,
          max_tokens: 1500,
          appKey: API_CONFIG.VIVO_APP_KEY
        },
        success: (res) => {
          console.log('代理 API 响应状态码:', res.statusCode)
          
          if (res.statusCode === 200 && res.data) {
            try {
              // 从代理响应中提取 AI 回复内容
              let content = ''
              
              if (res.data.success && res.data.data) {
                // vivo 蓝心大模型代理格式
                content = res.data.data.choices?.[0]?.message?.content || ''
              } else if (res.data.choices && res.data.choices.length > 0) {
                // 直接 OpenAI 格式
                content = res.data.choices[0]?.message?.content || ''
              } else if (res.data.content) {
                // 直接内容格式
                content = res.data.content
              }
              
              if (content && content.trim()) {
                resolve(content)
                return
              }
              
              // 如果没有提取到内容，返回友好错误
              console.error('AI 返回内容为空，响应数据:', res.data)
              reject(new Error('AI 返回空内容，请稍后重试'))
            } catch (error) {
              console.error('解析响应失败:', error)
              reject(new Error('AI 响应解析失败'))
            }
          } else {
            const errorMsg = res.data?.error?.error_msg || res.data?.message || '未知错误'
            reject(new Error(`AI 服务错误: ${errorMsg}`))
          }
        },
        fail: (err) => {
          console.error('API 请求失败:', err)
          reject(new Error('网络连接失败，请检查网络'))
        }
      })
    } else {
      directCall(messages, temperature, resolve, reject)
    }
  })
}

// 直接调用（备用方案）
function directCall(messages, temperature, resolve, reject) {
  uni.request({
    url: `${API_CONFIG.OPENAI_BASE_URL}/chat/completions`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
    },
    data: {
      model: API_CONFIG.MODEL,
      messages: messages,
      temperature: temperature,
      max_tokens: 1000
    },
    success: (res) => {
      console.log('AI API 响应状态码:', res.statusCode)
      
      if (res.statusCode === 200 && res.data) {
        try {
          const content = res.data.choices?.[0]?.message?.content
          if (content && content.trim()) {
            resolve(content)
            return
          }
          reject(new Error('AI 返回空内容'))
        } catch (error) {
          reject(new Error('AI 响应解析失败'))
        }
      } else {
        reject(new Error(`AI 服务错误 (${res.statusCode})`))
      }
    },
    fail: (err) => {
      reject(new Error('网络连接失败'))
    }
  })
}

// 模拟数据生成器
function generateMockResponse(userMessage) {
  if (userMessage.includes('历史') || userMessage.includes('背景')) {
    return `这件文物有着悠久的历史，诞生于古代工艺鼎盛时期。它见证了那个时代的辉煌，凝聚了工匠们的智慧和心血。每一处纹饰都蕴含着深厚的文化寓意，是研究古代社会生活的重要实物资料。`
  }
  
  if (userMessage.includes('工艺') || userMessage.includes('制作')) {
    return `这件文物的制作工艺非常精湛，采用了当时最先进的技术。从选材到成型，从雕刻到烧制，每一步都体现了古代工匠的高超技艺。特别是表面的纹饰处理，展现了独特的艺术风格。`
  }
  
  if (userMessage.includes('价值') || userMessage.includes('价格')) {
    return `这类文物在市场上的价值因品相、保存状态和稀有程度而异。一般来说，品相完好、流传有序的精品价值更高。建议找专业鉴定机构评估，以获取准确的市场参考价。`
  }
  
  return `关于这件文物，它确实有很多值得探索的地方。从历史背景到工艺特点，从文化价值到收藏意义，每一个方面都值得深入研究。如果您对某个具体方面感兴趣，我很乐意为您详细讲解！`
}

// 文物鉴定专用 Prompt
export function getArtifactAnalysisPrompt(artifactName, dynasty, category) {
  return [
    {
      role: 'system',
      content: '你是一位专业的文物鉴定专家，精通中国古代文物的鉴定、估值和历史研究。请用专业但易懂的语言回答用户的问题。'
    },
    {
      role: 'user',
      content: `请分析这件文物：
名称：${artifactName}
朝代：${dynasty || '未知'}
类别：${category || '未知'}

请提供：
1. 文物的历史背景和价值
2. 市场估值范围（人民币）
3. 鉴定要点和注意事项
4. 相关的历史文化知识`
    }
  ]
}

// 文物讲解专用 Prompt
export function getArtifactChatPrompt(artifactName, userQuestion) {
  return [
    {
      role: 'system',
      content: `你是"蓝心讲解员"，一位专业的文物历史讲解专家。你正在为游客讲解【${artifactName}】。请用生动有趣的语言回答用户的问题，让文物历史变得通俗易懂。回答要专业准确，同时富有故事性。`
    },
    {
      role: 'user',
      content: userQuestion
    }
  ]
}

// 智能修复专用 Prompt
export function getRestorationPrompt(artifactName, damageDescription) {
  return [
    {
      role: 'system',
      content: '你是一位文物修复专家，精通古代文物的病害诊断和修复技术。请提供专业的修复建议。'
    },
    {
      role: 'user',
      content: `文物名称：${artifactName}
病害描述：${damageDescription}

请提供：
1. 病害类型分析
2. 修复方案建议
3. 修复后的预期效果
4. 注意事项和保护建议`
    }
  ]
}