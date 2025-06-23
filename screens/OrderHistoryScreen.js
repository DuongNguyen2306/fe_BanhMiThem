"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import axios from "axios"
import API_ENDPOINTS from "../src/api/apiConfig"

const OrderHistoryScreen = ({ route, navigation }) => {
  const { userPhone } = route.params || {}
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrderHistory = async (isRefresh = false) => {
    if (!userPhone) {
      setLoading(false)
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.")
      return
    }

    if (isRefresh) setRefreshing(true)

    try {
      console.log(`Fetching order history for ${userPhone} from ${API_ENDPOINTS.ORDERS}/${userPhone}`)
      const response = await axios.get(`${API_ENDPOINTS.ORDERS}/${userPhone}`, {
        timeout: 5000,
      })
      // Chuyển đổi totalWeight thành số để tránh lỗi ghép chuỗi
      const formattedOrders = response.data.map(order => ({
        ...order,
        totalWeight: Number(order.totalWeight) || 0, // Đảm bảo là số, mặc định 0 nếu NaN
      }))
      setOrders(formattedOrders)
      console.log("Order history fetched successfully:", formattedOrders)
    } catch (error) {
      console.error("Failed to fetch order history:", error.message, error.response?.status, error.response?.data)
      Alert.alert("Lỗi", "Không thể tải lịch sử đơn hàng. Vui lòng kiểm tra kết nối.")
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrderHistory()
  }, [userPhone])

  const onRefresh = () => {
    fetchOrderHistory(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50"
      case "pending":
        return "#FF9800"
      case "cancelled":
        return "#f44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "pending":
        return "Đang xử lý"
      case "cancelled":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const renderOrderItem = ({ item, index }) => (
    <View style={[styles.orderItem, index === 0 && styles.firstItem]}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <MaterialIcons name="receipt" size={24} color="#d32f2f" />
          <View style={styles.orderDetails}>
            <Text style={styles.orderDate}>{item.orderDate}</Text>
            <Text style={styles.orderId}>#{item._id.slice(-6)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{orderItem.name}</Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
              <Text style={styles.itemWeight}>{orderItem.weight}kg</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalWeight}>
            Tổng KL: {item.totalWeight}kg {/* Hiển thị trực tiếp */}
          </Text>
        </View>
        <Text style={styles.totalAmount}>0đ</Text>
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
            <Text style={styles.loadingText}>Đang tải lịch sử đơn hàng...</Text>
          </View>
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#8B4513" />
          </TouchableOpacity>
          <Text style={styles.title}>Lịch sử đơn hàng</Text>
          <View style={styles.placeholder} />
        </View>

        {orders.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.emptyContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#d32f2f"]} tintColor="#d32f2f" />
            }
          >
            <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
            <Text style={styles.emptySubtitle}>Hãy đặt đơn hàng đầu tiên của bạn!</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            style={styles.container}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#d32f2f"]} tintColor="#d32f2f" />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5e8c7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5e8c7",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B4513",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5e8c7",
  },
  listContainer: {
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  orderItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  firstItem: {
    marginTop: 0,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderDetails: {
    marginLeft: 12,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderId: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  itemsList: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  itemDetails: {
    alignItems: "flex-end",
  },
  itemWeight: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  footerLeft: {
    flex: 1,
  },
  totalWeight: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
})

export default OrderHistoryScreen