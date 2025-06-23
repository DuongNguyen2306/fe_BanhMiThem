"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import axios from "axios"
import API_ENDPOINTS from "../src/api/apiConfig"
import { LineChart, BarChart } from "react-native-chart-kit"

const PredictionScreen = ({ route }) => {
  const { userPhone } = route.params || {}
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Theo ngày")

  // Sample data for charts
  const salesTrendData = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5"],
    datasets: [
      {
        data: [10, 85, 45, 70],
        color: (opacity = 1) => `rgba(76, 217, 100, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const purchaseHistoryData = {
    labels: ["1/3", "5/3", "10/3", "15/3", "20/3", "25/3"],
    datasets: [
      {
        data: [35, 80, 50, 55, 95, 70],
      },
    ],
  }

  const screenWidth = Dimensions.get("window").width

  const fetchPrediction = async (isRefresh = false) => {
    if (!userPhone) {
      setLoading(false)
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.")
      return
    }

    if (isRefresh) setRefreshing(true)

    try {
      console.log(`Fetching prediction for ${userPhone} from ${API_ENDPOINTS.PREDICTIONS}/${userPhone}`)
      const response = await axios.get(`${API_ENDPOINTS.PREDICTIONS}/${userPhone}`, {
        timeout: 5000,
      })
      setPrediction(response.data)
      console.log("Prediction fetched successfully:", response.data)
    } catch (error) {
      console.error("Failed to fetch prediction:", error.message, error.response?.status, error.response?.data)
      Alert.alert("Lỗi", "Không thể tải dự đoán. Vui lòng kiểm tra kết nối.")
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPrediction()
  }, [userPhone])

  const onRefresh = () => {
    fetchPrediction(true)
  }

  const renderPredictionItem = ({ item, index }) => (
    <View style={[styles.predictionItem, index === 0 && styles.firstItem]}>
      <View style={styles.itemContent}>
        <View style={styles.productInfo}>
          <MaterialIcons name="shopping-basket" size={24} color="#d32f2f" />
          <Text style={styles.productName}>{item.product}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng</Text>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d32f2f" />
            <Text style={styles.loadingText}>Đang tải dự đoán...</Text>
          </View>
        </SafeAreaView>
      </>
    )
  }

  if (!prediction) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={64} color="#d32f2f" />
            <Text style={styles.errorTitle}>Không thể tạo dự đoán</Text>
            <Text style={styles.errorSubtitle}>Vui lòng thử lại sau</Text>
          </View>
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#d32f2f"]} tintColor="#d32f2f" />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.starIcon}>
                <MaterialIcons name="star" size={20} color="white" />
              </View>
              <Text style={styles.title}>Xem dự đoán</Text>
            </View>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={24} color="#666" />
            </View>
          </View>

          {/* Sales Trend Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Xu hướng bán hàng</Text>
              <TouchableOpacity
                onPress={() => setSelectedPeriod(selectedPeriod === "Theo ngày" ? "Theo tuần" : "Theo ngày")}
              >
                <Text style={styles.periodSelector}>{selectedPeriod} ▼</Text>
              </TouchableOpacity>
            </View>

            <LineChart
              data={salesTrendData}
              width={screenWidth - 60}
              height={120}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(76, 217, 100, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#4CD964",
                },
              }}
              bezier
              style={styles.chart}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              withDots={true}
              withShadow={false}
            />

            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>0</Text>
              <Text style={styles.chartLabel}>10k</Text>
              <Text style={styles.chartLabel}>20k</Text>
              <Text style={styles.chartLabel}>50k</Text>
              <Text style={styles.chartLabel}>100k</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Ngày bán nhiều nhất</Text>
              <Text style={styles.statValue}>Thứ ba</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Số ổ bánh mì trung bình</Text>
              <Text style={styles.statValueNumber}>100 ổ</Text>
            </View>
          </View>

          {/* Purchase History Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Lịch sử mua hàng của người dùng</Text>

            <BarChart
              data={purchaseHistoryData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(94, 234, 212, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                yAxisLabel: "Khối lượng mua hàng (kg)",
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              fromZero={true}
              yAxisLabel=""
              yAxisSuffix="kg"
            />

            {/* Weight labels on bars */}
            <View style={styles.barLabelsContainer}>
              <Text style={styles.barLabel}>35kg</Text>
              <Text style={styles.barLabel}>80kg</Text>
              <Text style={styles.barLabel}>50kg</Text>
              <Text style={styles.barLabel}>55kg</Text>
              <Text style={styles.barLabel}>95kg</Text>
              <Text style={styles.barLabel}>70kg</Text>
            </View>

            {/* Next Purchase Prediction */}
            <View style={styles.predictionSection}>
              <Text style={styles.predictionLabel}>Ngày mua hàng ước tính tiếp theo</Text>
              <Text style={styles.predictionDate}>28-29/03</Text>
            </View>
          </View>

          {/* Bottom Navigation Placeholder */}
          <View style={styles.bottomNavPlaceholder} />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5e8c7",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#8B4513",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B4513",
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#ddd",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  periodSelector: {
    fontSize: 14,
    color: "#666",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
  },
  statValueNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  predictionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  predictionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  predictionDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  bottomNavPlaceholder: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  barLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    marginTop: -10,
    marginBottom: 10,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
})

export default PredictionScreen