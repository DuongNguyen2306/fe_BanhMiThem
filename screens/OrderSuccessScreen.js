import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OrderSuccessScreen = ({ navigation }) => {
  const handleReturn = () => {
    navigation.navigate('Đặt hàng');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.successContainer}>
          <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
          <Text style={styles.title}>ĐẶT HÀNG THÀNH CÔNG!</Text>
          <Text style={styles.message}>
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian sớm nhất.
          </Text>
          
          <TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
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
    justifyContent: 'center',
  },
  successContainer: {
    backgroundColor: '#e6d7b1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#d32f2f',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  returnButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSuccessScreen;