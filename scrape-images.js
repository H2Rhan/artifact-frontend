const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 配置
const OUTPUT_DIR = path.join(__dirname, 'static', 'goods-images');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 商品列表和对应的爬取关键词
const products = [
  {
    id: 1,
    name: '清代乾隆通宝（宝泉局）',
    keywords: ['乾隆通宝', '宝泉局'],
    filename: 'qianlong-tongbao.jpg'
  },
  {
    id: 2,
    name: '民国三年袁大头（壹圆）',
    keywords: ['袁大头', '民国三年'],
    filename: 'yuan-datou.jpg'
  },
  {
    id: 3,
    name: '唐代开元通宝（背月纹）',
    keywords: ['开元通宝', '唐代'],
    filename: 'kaiyuan-tongbao.jpg'
  },
  {
    id: 4,
    name: '1999年建国50周年纪念钞',
    keywords: ['建国50周年', '纪念钞'],
    filename: 'jidian-chao.jpg'
  },
  {
    id: 5,
    name: '战国刀币（齐法化）',
    keywords: ['战国刀币', '齐法化'],
    filename: 'warring-dao.jpg'
  },
  {
    id: 6,
    name: '宋代崇宁通宝（当十）',
    keywords: ['崇宁通宝', '宋代'],
    filename: 'chongning-tongbao.jpg'
  },
  {
    id: 7,
    name: '2008年奥运福娃纪念银币',
    keywords: ['奥运福娃', '纪念银币'],
    filename: 'olympic-coin.jpg'
  },
  {
    id: 8,
    name: '清代光绪元宝（广东省造）',
    keywords: ['光绪元宝', '广东省造'],
    filename: 'guangxu-yuanbao.jpg'
  }
];

// 从 7788 收藏网爬取图片
async function scrapeFrom7788(product) {
  console.log(`\n🔍 正在从 7788 收藏网爬取：${product.name}`);
  
  try {
    const keyword = product.keywords[0];
    const encodedKeyword = encodeURIComponent(keyword);
    const searchUrl = `https://www.7788.com/search/?q=${encodedKeyword}`;
    
    console.log(` 搜索 URL: ${searchUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: searchUrl,
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://www.7788.com/'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const images = [];
    
    // 查找商品图片
    $('.item-img img, .product-img img, img[src*=".jpg"], img[src*=".png"]').each((i, elem) => {
      let imgSrc = $(elem).attr('src');
      if (imgSrc && !imgSrc.startsWith('data:') && images.length < 3) {
        // 处理相对路径
        if (imgSrc.startsWith('//')) {
          imgSrc = 'https:' + imgSrc;
        } else if (imgSrc.startsWith('/')) {
          imgSrc = 'https://www.7788.com' + imgSrc;
        }
        images.push(imgSrc);
      }
    });
    
    if (images.length > 0) {
      console.log(`✅ 找到 ${images.length} 张图片`);
      return images[0]; // 返回第一张图片
    }
    
    console.log('⚠️ 未找到图片');
    return null;
    
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    return null;
  }
}

// 从微拍堂爬取图片
async function scrapeFromWeipaitang(product) {
  console.log(`\n🔍 正在从微拍堂爬取：${product.name}`);
  
  try {
    const keyword = product.keywords[0];
    const encodedKeyword = encodeURIComponent(keyword);
    const searchUrl = `https://www.wpm.cn/search?keyword=${encodedKeyword}`;
    
    const response = await axios({
      method: 'GET',
      url: searchUrl,
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://www.wpm.cn/'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const images = [];
    
    // 查找商品图片
    $('img[src*=".jpg"], img[src*=".png"], img[data-src]').each((i, elem) => {
      let imgSrc = $(elem).attr('src') || $(elem).attr('data-src');
      if (imgSrc && !imgSrc.startsWith('data:') && images.length < 3) {
        if (imgSrc.startsWith('//')) {
          imgSrc = 'https:' + imgSrc;
        }
        images.push(imgSrc);
      }
    });
    
    if (images.length > 0) {
      console.log(`✅ 找到 ${images.length} 张图片`);
      return images[0];
    }
    
    console.log('⚠️ 未找到图片');
    return null;
    
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    return null;
  }
}

// 备用方案：使用百度图片搜索
async function scrapeFromBaidu(product) {
  console.log(`\n🔍 正在从百度图片搜索：${product.name}`);
  
  try {
    const keyword = product.keywords.join(' ');
    const encodedKeyword = encodeURIComponent(keyword + ' 实物照片 高清');
    
    // 使用百度图片 API（更稳定）
    const response = await axios({
      method: 'GET',
      url: `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=${encodedKeyword}&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=&hd=&latest=&copyright=&word=${encodedKeyword}&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&pn=0&rn=5`,
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://image.baidu.com/'
      },
      timeout: 15000
    });
    
    const data = response.data;
    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].thumbURL || data.data[0].middleURL || data.data[0].objURL;
      if (imageUrl) {
        console.log('✅ 找到图片');
        return imageUrl;
      }
    }
    
    console.log('⚠️ 未找到图片');
    return null;
    
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
    return null;
  }
}

// 下载图片
async function downloadImage(url, filename, name) {
  console.log(`\n📥 正在下载：${name}`);
  console.log(` URL: ${url}`);
  
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': USER_AGENT
      },
      timeout: 30000
    });

    const filePath = path.join(OUTPUT_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const stats = fs.statSync(filePath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`✅ 已保存: ${filePath} (${sizeMB} MB)`);
        resolve(filePath);
      });
      writer.on('error', (err) => {
        console.error('❌ 保存失败:', err.message);
        reject(err);
      });
    });
  } catch (error) {
    console.error('❌ 下载失败:', error.message);
    return null;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始爬取古玩实物照片...');
  console.log('='.repeat(60));
  console.log(` 输出目录: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const product of products) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`处理第 ${product.id}/8 个商品：${product.name}`);
    console.log('='.repeat(60));
    
    let imageUrl = null;
    
    // 尝试从多个源爬取
    imageUrl = await scrapeFromBaidu(product);
    
    if (!imageUrl) {
      imageUrl = await scrapeFrom7788(product);
    }
    
    if (!imageUrl) {
      imageUrl = await scrapeFromWeipaitang(product);
    }
    
    // 下载图片
    if (imageUrl) {
      const filePath = await downloadImage(imageUrl, product.filename, product.name);
      results.push({
        name: product.name,
        filename: product.filename,
        success: !!filePath
      });
    } else {
      console.log('❌ 所有源都未找到图片，使用默认图标');
      results.push({
        name: product.name,
        filename: product.filename,
        success: false
      });
    }
    
    // 每个商品间隔 2 秒，避免被封
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 输出结果汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 爬取结果汇总：');
  console.log('='.repeat(60));
  
  let successCount = 0;
  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.name} - ${r.filename}`);
    if (r.success) successCount++;
  });
  
  console.log('='.repeat(60));
  console.log(` 总共成功: ${successCount}/${products.length} 张`);
  
  // 生成更新后的代码
  if (successCount > 0) {
    console.log('\n 请复制以下代码替换 market.vue 中的 getDefaultGoods() 方法：');
    console.log('='.repeat(60));
    console.log('getDefaultGoods() {');
    console.log('  return [');
    
    products.forEach((product, index) => {
      const result = results.find(r => r.filename === product.filename);
      const imagePath = result.success ? 
        `'/static/goods-images/${product.filename}'` : 
        `''`;
      
      console.log(`    {`);
      console.log(`      id: ${product.id},`);
      console.log(`      name: '${product.name}',`);
      console.log(`      dynasty: '${getDynasty(product.id)}',`);
      console.log(`      category: '${getCategory(product.id)}',`);
      console.log(`      price: '${getPrice(product.id)}',`);
      console.log(`      image: ${imagePath},`);
      console.log(`      isAuth: true,`);
      console.log(`      likes: ${getLikes(product.id)},`);
      console.log(`      sales: ${getSales(product.id)},`);
      console.log(`      hot: ${getHot(product.id)},`);
      console.log(`      platform: '${getPlatform(product.id)}'`);
      console.log(`    }${index < products.length - 1 ? ',' : ''}`);
    });
    
    console.log('  ];');
    console.log('}');
  }
  
  console.log('\n 爬取完成！');
}

// 辅助函数
function getDynasty(id) {
  const dynasties = ['清代·乾隆', '民国·1914年', '唐代·开元', '1999年', '战国·齐国', '宋代·崇宁', '2008年', '清代·光绪'];
  return dynasties[id - 1];
}

function getCategory(id) {
  const categories = ['古钱币', '银元', '古钱币', '纪念钞', '青铜币', '古钱币', '收藏币', '银元'];
  return categories[id - 1];
}

function getPrice(id) {
  const prices = ['280', '1,680', '450', '180', '3,200', '680', '3,500', '2,100'];
  return prices[id - 1];
}

function getLikes(id) {
  const likes = [342, 528, 276, 196, 156, 234, 412, 389];
  return likes[id - 1];
}

function getSales(id) {
  const sales = [1250, 890, 720, 650, 280, 560, 320, 445];
  return sales[id - 1];
}

function getHot(id) {
  const hots = [true, true, true, false, false, true, false, true];
  return hots[id - 1];
}

function getPlatform(id) {
  const platforms = ['古泉园地', '华夏古泉', '赵涌在线', '微拍堂', '7788收藏', '艺典中国', '孔夫子旧书网', '收藏网'];
  return platforms[id - 1];
}

// 运行
main().catch(console.error);