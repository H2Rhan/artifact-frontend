#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <fstream>
#include <sstream>
#include <chrono>
#include <thread>
#include <mutex>
#include <queue>
#include <functional>
#include <memory>
#include <exception>
#include <cstring>

// ==================== 数据结构定义 ====================

struct ArtifactData {
    int id;
    std::string name;
    std::string category;
    std::string dynasty;
    double current_price;
    std::string description;
    std::string image_url;
    double condition_score;
    int rarity_level;
    std::string authentication_status;
    std::vector<double> price_history;
    std::map<std::string, std::string> metadata;
};

struct MarketAnalysis {
    std::string item_name;
    double predicted_price;
    double confidence_score;
    std::string trend_direction;
    double volatility_index;
    double liquidity_score;
    std::vector<std::string> risk_factors;
    std::map<std::string, double> technical_indicators;
};

struct TradingRecord {
    int transaction_id;
    std::string buyer_id;
    std::string seller_id;
    std::string item_name;
    double transaction_price;
    std::string timestamp;
    std::string payment_method;
    std::string status;
};

// ==================== 价格预测引擎 ====================

class PricePredictionEngine {
private:
    std::vector<double> historical_prices;
    std::vector<std::string> dates;
    std::mutex data_lock;
    
    // 移动平均线计算
    double calculateSMA(const std::vector<double>& data, int period) {
        if (data.size() < static_cast<size_t>(period)) return 0.0;
        double sum = 0.0;
        for (size_t i = data.size() - period; i < data.size(); ++i) {
            sum += data[i];
        }
        return sum / period;
    }
    
    // 指数移动平均线
    double calculateEMA(const std::vector<double>& data, int period) {
        if (data.size() < static_cast<size_t>(period)) return 0.0;
        double multiplier = 2.0 / (period + 1.0);
        double ema = data[0];
        for (size_t i = 1; i < data.size(); ++i) {
            ema = (data[i] - ema) * multiplier + ema;
        }
        return ema;
    }
    
    // 相对强弱指数
    double calculateRSI(const std::vector<double>& prices, int period = 14) {
        if (prices.size() < static_cast<size_t>(period + 1)) return 50.0;
        
        double avg_gain = 0.0, avg_loss = 0.0;
        for (size_t i = 1; i <= static_cast<size_t>(period); ++i) {
            double change = prices[i] - prices[i-1];
            if (change > 0) avg_gain += change;
            else avg_loss += std::abs(change);
        }
        avg_gain /= period;
        avg_loss /= period;
        
        if (avg_loss == 0) return 100.0;
        double rs = avg_gain / avg_loss;
        return 100.0 - (100.0 / (1.0 + rs));
    }
    
    // MACD指标
    void calculateMACD(const std::vector<double>& prices, double& macd_line, double& signal_line, double& histogram) {
        double ema12 = calculateEMA(prices, 12);
        double ema26 = calculateEMA(prices, 26);
        macd_line = ema12 - ema26;
        signal_line = macd_line * 0.9;
        histogram = macd_line - signal_line;
    }
    
    // 布林带
    void calculateBollingerBands(const std::vector<double>& prices, int period, 
                                double& upper_band, double& middle_band, double& lower_band) {
        middle_band = calculateSMA(prices, period);
        double std_dev = 0.0;
        for (size_t i = prices.size() - period; i < prices.size(); ++i) {
            std_dev += std::pow(prices[i] - middle_band, 2);
        }
        std_dev = std::sqrt(std_dev / period);
        upper_band = middle_band + 2 * std_dev;
        lower_band = middle_band - 2 * std_dev;
    }
    
    // 线性回归预测
    double linearRegression(const std::vector<double>& y, int steps_ahead) {
        int n = y.size();
        if (n < 2) return y.empty() ? 0.0 : y[0];
        
        double sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
        for (int i = 0; i < n; ++i) {
            sum_x += i;
            sum_y += y[i];
            sum_xy += i * y[i];
            sum_xx += i * i;
        }
        
        double slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        double intercept = (sum_y - slope * sum_x) / n;
        
        return slope * (n + steps_ahead) + intercept;
    }
    
    // 多项式回归
    double polynomialRegression(const std::vector<double>& y, int degree, int steps_ahead) {
        // 简化的二阶多项式实现
        if (degree == 2 && y.size() >= 3) {
            int n = y.size();
            double sum_x = 0, sum_x2 = 0, sum_x3 = 0, sum_x4 = 0;
            double sum_y = 0, sum_xy = 0, sum_x2y = 0;
            
            for (int i = 0; i < n; ++i) {
                double x = i;
                sum_x += x;
                sum_x2 += x * x;
                sum_x3 += x * x * x;
                sum_x4 += x * x * x * x;
                sum_y += y[i];
                sum_xy += x * y[i];
                sum_x2y += x * x * y[i];
            }
            
            // 使用矩阵求解（简化版）
            double a = (n * sum_x2y - sum_x2 * sum_y) / (n * sum_x4 - sum_x2 * sum_x2);
            double b = (sum_xy - a * sum_x3) / sum_x2;
            double c = (sum_y - a * sum_x2 - b * sum_x) / n;
            
            double x_pred = n + steps_ahead;
            return a * x_pred * x_pred + b * x_pred + c;
        }
        return linearRegression(y, steps_ahead);
    }

public:
    void addPriceData(double price, const std::string& date = "") {
        std::lock_guard<std::mutex> lock(data_lock);
        historical_prices.push_back(price);
        if (!date.empty()) {
            dates.push_back(date);
        } else {
            auto now = std::chrono::system_clock::now();
            auto time_t = std::chrono::system_clock::to_time_t(now);
            dates.push_back(std::ctime(&time_t));
        }
    }
    
    MarketAnalysis performAnalysis(const std::string& item_name, int prediction_days = 7) {
        MarketAnalysis analysis;
        analysis.item_name = item_name;
        
        if (historical_prices.empty()) {
            analysis.confidence_score = 0.0;
            return analysis;
        }
        
        // 计算技术指标
        analysis.technical_indicators["SMA_7"] = calculateSMA(historical_prices, 7);
        analysis.technical_indicators["SMA_20"] = calculateSMA(historical_prices, 20);
        analysis.technical_indicators["EMA_12"] = calculateEMA(historical_prices, 12);
        analysis.technical_indicators["EMA_26"] = calculateEMA(historical_prices, 26);
        analysis.technical_indicators["RSI"] = calculateRSI(historical_prices);
        
        double macd_line, signal_line, histogram;
        calculateMACD(historical_prices, macd_line, signal_line, histogram);
        analysis.technical_indicators["MACD"] = macd_line;
        analysis.technical_indicators["MACD_Signal"] = signal_line;
        analysis.technical_indicators["MACD_Histogram"] = histogram;
        
        double upper, middle, lower;
        calculateBollingerBands(historical_prices, 20, upper, middle, lower);
        analysis.technical_indicators["BB_Upper"] = upper;
        analysis.technical_indicators["BB_Middle"] = middle;
        analysis.technical_indicators["BB_Lower"] = lower;
        
        // 价格预测（综合多种方法）
        double lr_prediction = linearRegression(historical_prices, prediction_days);
        double poly_prediction = polynomialRegression(historical_prices, 2, prediction_days);
        double current_price = historical_prices.back();
        
        analysis.predicted_price = (lr_prediction * 0.6 + poly_prediction * 0.4);
        analysis.confidence_score = std::min(1.0, historical_prices.size() / 30.0);
        
        // 趋势判断
        double short_term_trend = (historical_prices.back() - historical_prices[std::max(0, static_cast<int>(historical_prices.size()) - 7)]) / current_price;
        if (short_term_trend > 0.05) analysis.trend_direction = "Strong Bullish";
        else if (short_term_trend > 0.02) analysis.trend_direction = "Bullish";
        else if (short_term_trend > -0.02) analysis.trend_direction = "Neutral";
        else if (short_term_trend > -0.05) analysis.trend_direction = "Bearish";
        else analysis.trend_direction = "Strong Bearish";
        
        // 波动率计算
        double mean = std::accumulate(historical_prices.begin(), historical_prices.end(), 0.0) / historical_prices.size();
        double variance = 0.0;
        for (double price : historical_prices) {
            variance += std::pow(price - mean, 2);
        }
        analysis.volatility_index = std::sqrt(variance / historical_prices.size()) / mean;
        
        // 流动性评分
        analysis.liquidity_score = std::min(1.0, historical_prices.size() / 50.0);
        
        // 风险因素
        if (analysis.volatility_index > 0.3) {
            analysis.risk_factors.push_back("High Volatility");
        }
        if (historical_prices.size() < 10) {
            analysis.risk_factors.push_back("Limited Historical Data");
        }
        if (analysis.confidence_score < 0.5) {
            analysis.risk_factors.push_back("Low Prediction Confidence");
        }
        
        return analysis;
    }
    
    const std::vector<double>& getPriceHistory() const { return historical_prices; }
    size_t getDataCount() const { return historical_prices.size(); }
};

// ==================== 市场数据分析器 ====================

class MarketDataAnalyzer {
private:
    std::vector<ArtifactData> artifacts;
    std::vector<TradingRecord> transactions;
    std::mutex data_mutex;
    
public:
    bool addArtifact(const ArtifactData& artifact) {
        std::lock_guard<std::mutex> lock(data_mutex);
        artifacts.push_back(artifact);
        return true;
    }
    
    bool addTransaction(const TradingRecord& transaction) {
        std::lock_guard<std::mutex> lock(data_mutex);
        transactions.push_back(transaction);
        return true;
    }
    
    std::vector<ArtifactData> searchArtifacts(const std::string& keyword) {
        std::lock_guard<std::mutex> lock(data_mutex);
        std::vector<ArtifactData> results;
        for (const auto& artifact : artifacts) {
            if (artifact.name.find(keyword) != std::string::npos ||
                artifact.category.find(keyword) != std::string::npos ||
                artifact.dynasty.find(keyword) != std::string::npos) {
                results.push_back(artifact);
            }
        }
        return results;
    }
    
    std::map<std::string, double> getCategoryStatistics() {
        std::lock_guard<std::mutex> lock(data_mutex);
        std::map<std::string, std::vector<double>> category_prices;
        
        for (const auto& artifact : artifacts) {
            category_prices[artifact.category].push_back(artifact.current_price);
        }
        
        std::map<std::string, double> stats;
        for (const auto& pair : category_prices) {
            double sum = std::accumulate(pair.second.begin(), pair.second.end(), 0.0);
            stats[pair.first + "_avg"] = sum / pair.second.size();
            stats[pair.first + "_count"] = static_cast<double>(pair.second.size());
        }
        
        return stats;
    }
    
    double calculateMarketIndex() {
        std::lock_guard<std::mutex> lock(data_mutex);
        if (artifacts.empty()) return 0.0;
        
        double total_value = 0.0;
        for (const auto& artifact : artifacts) {
            total_value += artifact.current_price;
        }
        return total_value / artifacts.size();
    }
    
    std::vector<TradingRecord> getRecentTransactions(int limit = 10) {
        std::lock_guard<std::mutex> lock(data_mutex);
        std::vector<TradingRecord> recent;
        int count = 0;
        for (auto it = transactions.rbegin(); it != transactions.rend() && count < limit; ++it, ++count) {
            recent.push_back(*it);
        }
        return recent;
    }
};

// ==================== 主程序 ====================

int main(int argc, char* argv[]) {
    std::cout << "========================================" << std::endl;
    std::cout << "  文物鉴定与交易平台 - C++核心模块" << std::endl;
    std::cout << "  Artifact Trading Platform - C++ Core" << std::endl;
    std::cout << "========================================" << std::endl;
    std::cout << std::endl;
    
    // 初始化价格预测引擎
    PricePredictionEngine predictor;
    
    // 添加测试数据
    std::vector<double> test_prices = {350, 365, 358, 372, 380, 375, 390, 385, 395, 400, 
                                       392, 405, 410, 398, 415, 420, 408, 425, 430, 418};
    
    for (double price : test_prices) {
        predictor.addPriceData(price);
    }
    
    std::cout << "[INFO] 已加载 " << predictor.getDataCount() << " 条价格数据" << std::endl;
    
    // 执行市场分析
    MarketAnalysis analysis = predictor.performAnalysis("清代乾隆通宝", 7);
    
    std::cout << std::endl;
    std::cout << "=== 市场分析报告 ===" << std::endl;
    std::cout << "物品名称: " << analysis.item_name << std::endl;
    std::cout << "预测价格: ¥" << analysis.predicted_price << std::endl;
    std::cout << "置信度: " << (analysis.confidence_score * 100) << "%" << std::endl;
    std::cout << "趋势方向: " << analysis.trend_direction << std::endl;
    std::cout << "波动率指数: " << (analysis.volatility_index * 100) << "%" << std::endl;
    std::cout << std::endl;
    
    std::cout << "=== 技术指标 ===" << std::endl;
    for (const auto& indicator : analysis.technical_indicators) {
        std::cout << indicator.first << ": " << indicator.second << std::endl;
    }
    
    if (!analysis.risk_factors.empty()) {
        std::cout << std::endl;
        std::cout << "=== 风险因素 ===" << std::endl;
        for (const auto& risk : analysis.risk_factors) {
            std::cout << "- " << risk << std::endl;
        }
    }
    
    std::cout << std::endl;
    std::cout << "=== C++核心模块运行成功 ===" << std::endl;
    
    return 0;
}
