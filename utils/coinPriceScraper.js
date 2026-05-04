const axios = require('axios');
const cheerio = require('cheerio');

class CoinPriceScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    };
  }

  async searchGcoin(coinName) {
    try {
      console.log('🔍 搜索古泉园地...');
      const searchUrl = `https://www.gcoin.net/search/?q=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.item-list .item').each((index, element) => {
        const title = $(element).find('.title').text().trim();
        const price = $(element).find('.price').text().trim();
        const date = $(element).find('.date').text().trim();
        
        if (title && price) {
          prices.push({
            source: '古泉园地',
            title: title,
            price: price,
            date: date,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('古泉园地搜索失败:', error.message);
      return [];
    }
  }

  async searchHuaxia(coinName) {
    try {
      console.log('🔍 搜索华夏古泉...');
      const searchUrl = `https://www.huaxia-g.com/search?keyword=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.search-result-item').each((index, element) => {
        const title = $(element).find('.item-title').text().trim();
        const price = $(element).find('.item-price').text().trim();
        const condition = $(element).find('.item-condition').text().trim();
        
        if (title && price) {
          prices.push({
            source: '华夏古泉',
            title: title,
            price: price,
            condition: condition,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('华夏古泉搜索失败:', error.message);
      return [];
    }
  }

  async searchZhaoyong(coinName) {
    try {
      console.log('🔍 搜索赵涌在线...');
      const searchUrl = `https://www.zhaoonline.com/search?keyword=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.lot-item').each((index, element) => {
        const title = $(element).find('.lot-title').text().trim();
        const hammerPrice = $(element).find('.hammer-price').text().trim();
        const estimatePrice = $(element).find('.estimate-price').text().trim();
        
        if (title) {
          prices.push({
            source: '赵涌在线',
            title: title,
            hammerPrice: hammerPrice,
            estimatePrice: estimatePrice,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('赵涌在线搜索失败:', error.message);
      return [];
    }
  }

  async searchWeipaitang(coinName) {
    try {
      console.log('🔍 搜索微拍堂...');
      const searchUrl = `https://www.weipaitang.com/search?q=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.auction-item').each((index, element) => {
        const title = $(element).find('.auction-title').text().trim();
        const currentPrice = $(element).find('.current-price').text().trim();
        const status = $(element).find('.auction-status').text().trim();
        
        if (title && currentPrice) {
          prices.push({
            source: '微拍堂',
            title: title,
            currentPrice: currentPrice,
            status: status,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('微拍堂搜索失败:', error.message);
      return [];
    }
  }

  // 新增：7788 收藏
  async search7788(coinName) {
    try {
      console.log('🔍 搜索 7788 收藏...');
      const searchUrl = `https://so.7788.com/search?q=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.shop-item, .auction-item').each((index, element) => {
        const title = $(element).find('.item-title, .title').text().trim();
        const price = $(element).find('.price, .current-price').text().trim();
        
        if (title && price) {
          prices.push({
            source: '7788 收藏',
            title: title,
            price: price,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('7788 收藏搜索失败:', error.message);
      return [];
    }
  }

  // 新增：艺典中国
  async searchYidian(coinName) {
    try {
      console.log('🔍 搜索艺典中国...');
      const searchUrl = `https://www.artdian.com/search?keyword=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.lot-item, .product-item').each((index, element) => {
        const title = $(element).find('.title, .name').text().trim();
        const price = $(element).find('.price, .hammer-price').text().trim();
        
        if (title && price) {
          prices.push({
            source: '艺典中国',
            title: title,
            price: price,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('艺典中国搜索失败:', error.message);
      return [];
    }
  }

  // 新增：孔夫子旧书网（古钱币板块）
  async searchKongfz(coinName) {
    try {
      console.log('🔍 搜索孔夫子旧书网...');
      const searchUrl = `https://search.kongfz.com/product_result/?select=0&key=${encodeURIComponent(coinName)}&status=0&category=0`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.item-list .item').each((index, element) => {
        const title = $(element).find('.title').text().trim();
        const price = $(element).find('.price').text().trim();
        
        if (title && price) {
          prices.push({
            source: '孔夫子旧书网',
            title: title,
            price: price,
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('孔夫子旧书网搜索失败:', error.message);
      return [];
    }
  }

  // 新增：收藏网
  async searchShoucang(coinName) {
    try {
      console.log('🔍 搜索收藏网...');
      const searchUrl = `https://www.shoucang.com/search/?q=${encodeURIComponent(coinName)}`;
      const response = await axios.get(searchUrl, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(response.data);
      const prices = [];
      
      $('.search-result li').each((index, element) => {
        const title = $(element).find('a').text().trim();
        const price = $(element).find('.price').text().trim();
        
        if (title) {
          prices.push({
            source: '收藏网',
            title: title,
            price: price || '价格面议',
            url: $(element).find('a').attr('href')
          });
        }
      });
      
      return prices.slice(0, 10);
    } catch (error) {
      console.error('收藏网搜索失败:', error.message);
      return [];
    }
  }

  async searchAll(coinName) {
    console.log(`\n========================================`);
    console.log(`开始搜索古钱币: ${coinName}`);
    console.log(`数据来源：8 大主流古玩交易平台`);
    console.log(`========================================\n`);
    
    const [gcoin, huaxia, zhaoyong, weipaitang, q7788, yidian, kongfz, shoucang] = await Promise.all([
      this.searchGcoin(coinName),
      this.searchHuaxia(coinName),
      this.searchZhaoyong(coinName),
      this.searchWeipaitang(coinName),
      this.search7788(coinName),
      this.searchYidian(coinName),
      this.searchKongfz(coinName),
      this.searchShoucang(coinName)
    ]);
    
    const allPrices = {
      '古泉园地': gcoin,
      '华夏古泉': huaxia,
      '赵涌在线': zhaoyong,
      '微拍堂': weipaitang,
      '7788 收藏': q7788,
      '艺典中国': yidian,
      '孔夫子旧书网': kongfz,
      '收藏网': shoucang
    };
    
    const totalResults = gcoin.length + huaxia.length + zhaoyong.length + weipaitang.length + 
                         q7788.length + yidian.length + kongfz.length + shoucang.length;
    console.log(`\n✅ 搜索完成！共找到 ${totalResults} 条价格记录`);
    console.log(`数据来源分布：`);
    console.log(`  古泉园地：${gcoin.length} 条`);
    console.log(`  华夏古泉：${huaxia.length} 条`);
    console.log(`  赵涌在线：${zhaoyong.length} 条`);
    console.log(`  微拍堂：${weipaitang.length} 条`);
    console.log(`  7788 收藏：${q7788.length} 条`);
    console.log(`  艺典中国：${yidian.length} 条`);
    console.log(`  孔夫子旧书网：${kongfz.length} 条`);
    console.log(`  收藏网：${shoucang.length} 条`);
    console.log('========================================\n');
    
    return allPrices;
  }
}

module.exports = CoinPriceScraper;