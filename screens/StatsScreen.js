import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import API_ENDPOINTS from '../src/api/apiConfig'; // Import API endpoints

const screenWidth = Dimensions.get('window').width - 40;

const StatsScreen = ({ route }) => {
  const { userPhone } = route.params || {};
  const [stats, setStats] = useState({ 
    salesTrend: [
      { label: 'T2', data: 0 },
      { label: 'T3', data: 0 },
      { label: 'T4', data: 0 },
      { label: 'T5', data: 0 },
      { label: 'T6', data: 0 },
      { label: 'T7', data: 0 },
      { label: 'CN', data: 0 }
    ], 
    maxWasteDay: null, 
    maxWasteWeight: 0 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userPhone) {
      const loadStats = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_ENDPOINTS.STATS}/${userPhone}`); // Use centralized endpoint
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          setStats(data);
        } catch (err) {
          console.log('Stats error:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadStats();
    }
  }, [userPhone]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Xem dự đoán</Text>
        
        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Xu hướng bán hàng</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            <LineChart
              data={{
                labels: stats.salesTrend.map(s => s.label),
                datasets: [
                  {
                    data: stats.salesTrend.map(s => s.data),
                    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726'
                }
              }}
              bezier
              style={styles.chart}
            />
          )}
          
          <View style={styles.statsBox}>
            <Text style={styles.statsLabel}>Ngày bán nhiều nhất</Text>
            <Text style={styles.statsValue}>
              {stats.maxWasteDay 
                ? new Date(stats.maxWasteDay).toLocaleDateString('vi-VN') 
                : 'Chưa có dữ liệu'}
            </Text>
          </View>
          
          <View style={styles.statsBox}>
            <Text style={styles.statsLabel}>Khối lượng hao hụt</Text>
            <Text style={styles.statsValue}>{stats.maxWasteWeight} gram</Text>
          </View>
          
          <TouchableOpacity style={styles.returnButton}>
            <Text style={styles.returnButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8c7',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#d32f2f',
  },
  chartContainer: {
    backgroundColor: '#e6d7b1',
    borderRadius: 10,
    padding: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  statsLabel: {
    fontSize: 16,
    color: '#333',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  returnButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StatsScreen;