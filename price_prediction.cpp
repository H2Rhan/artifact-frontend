#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <sstream>
#include <string>

class PricePredictor {
private:
    std::vector<double> prices;

public:
    void addDataPoint(double price) {
        prices.push_back(price);
    }

    double calculateSMA(int period) {
        if (prices.size() < static_cast<size_t>(period)) return 0.0;
        double sum = 0.0;
        for (int i = static_cast<int>(prices.size()) - period; i < static_cast<int>(prices.size()); ++i) {
            sum += prices[i];
        }
        return sum / period;
    }

    double calculateEMA(int period) {
        if (prices.size() < static_cast<size_t>(period)) return 0.0;
        double multiplier = 2.0 / (period + 1.0);
        double ema = prices[0];
        for (size_t i = 1; i < prices.size(); ++i) {
            ema = (prices[i] - ema) * multiplier + ema;
        }
        return ema;
    }

    double linearRegressionPredict(int stepsAhead) {
        if (prices.size() < 2) return prices.empty() ? 0.0 : prices[0];
        int n = static_cast<int>(prices.size());
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (int i = 0; i < n; ++i) {
            sumX += i;
            sumY += prices[i];
            sumXY += i * prices[i];
            sumXX += i * i;
        }
        double slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;
        return slope * (n + stepsAhead) + intercept;
    }

    double calculateVolatility() {
        if (prices.size() < 2) return 0.0;
        double mean = std::accumulate(prices.begin(), prices.end(), 0.0) / prices.size();
        double variance = 0.0;
        for (double price : prices) {
            variance += std::pow(price - mean, 2);
        }
        return std::sqrt(variance / prices.size());
    }

    void getStatistics(double& minPrice, double& maxPrice, double& avgPrice) {
        if (prices.empty()) {
            minPrice = maxPrice = avgPrice = 0.0;
            return;
        }
        minPrice = *std::min_element(prices.begin(), prices.end());
        maxPrice = *std::max_element(prices.begin(), prices.end());
        avgPrice = std::accumulate(prices.begin(), prices.end(), 0.0) / prices.size();
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "{\"error\": \"Usage: price_prediction <command> [args...]\"}" << std::endl;
        return 1;
    }

    std::string command = argv[1];

    if (command == "predict" && argc >= 4) {
        std::string pricesStr = argv[2];
        int steps = std::stoi(argv[3]);

        PricePredictor predictor;
        std::stringstream ss(pricesStr);
        std::string token;

        while (std::getline(ss, token, ',')) {
            try {
                double price = std::stod(token);
                predictor.addDataPoint(price);
            } catch (...) {}
        }

        double prediction = predictor.linearRegressionPredict(steps);
        std::cout << "{\"prediction\": " << prediction <<
                     ", \"sma_7\": " << predictor.calculateSMA(7) <<
                     ", \"ema_7\": " << predictor.calculateEMA(7) <<
                     ", \"volatility\": " << predictor.calculateVolatility() << "}" << std::endl;

    } else if (command == "stats" && argc >= 3) {
        std::string pricesStr = argv[2];

        PricePredictor predictor;
        std::stringstream ss(pricesStr);
        std::string token;

        while (std::getline(ss, token, ',')) {
            try {
                double price = std::stod(token);
                predictor.addDataPoint(price);
            } catch (...) {}
        }

        double minPrice, maxPrice, avgPrice;
        predictor.getStatistics(minPrice, maxPrice, avgPrice);

        std::cout << "{\"min\": " << minPrice <<
                     ", \"max\": " << maxPrice <<
                     ", \"avg\": " << avgPrice <<
                     ", \"volatility\": " << predictor.calculateVolatility() << "}" << std::endl;
    } else {
        std::cout << "{\"error\": \"Invalid command or arguments\"}" << std::endl;
        return 1;
    }

    return 0;
}
