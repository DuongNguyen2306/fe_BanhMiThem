import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';

const OrderScreen = ({ route, navigation }) => {
  const { userPhone } = route.params || {};
  const [chaLua, setChaLua] = useState('');
  const [chaDo, setChaDo] = useState('');
  const [gioThu, setGioThu] = useState('');
  const [jambon, setJambon] = useState('');
  const [xucXichToi, setXucXichToi] = useState('');
  const [pate, setPate] = useState('');
  const [bacKien, setBacKien] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOrder = async () => {
    if (!userPhone) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    const orderData = { 
      chaLua: chaLua || '0', 
      chaDo: chaDo || '0', 
      gioThu: gioThu || '0', 
      jambon: jambon || '0', 
      xucXichToi: xucXichToi || '0', 
      pate: pate || '0', 
      bacKien: bacKien || '0', 
      userPhone 
    };

    setIsLoading(true);
    try {
      console.log('Attempting order to:', `http://192.168.0.198:3000/api/orders for user ${userPhone}`);
      
      const response = await fetch('http://192.168.0.198:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log('Order response:', result);
      
      if (result.success) {
        navigation.navigate('Xem thông tin', { orderId: result.orderId, userPhone });
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể đặt hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
      console.log('Order error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Đặt hàng</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Chả lụa (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={chaLua}
                onChangeText={setChaLua}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Chả đỏ (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={chaDo}
                onChangeText={setChaDo}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Giò thủ (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={gioThu}
                onChangeText={setGioThu}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Jambon (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={jambon}
                onChangeText={setJambon}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Xúc xích tỏi (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={xucXichToi}
                onChangeText={setXucXichToi}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Pate (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={pate}
                onChangeText={setPate}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Bơ kiến (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={bacKien}
                onChangeText={setBacKien}
                keyboardType="numeric"
              />
              
              <TouchableOpacity 
                style={[styles.orderButton, isLoading && styles.orderButtonDisabled]} 
                onPress={handleOrder}
                disabled={isLoading}
              >
                <Text style={styles.orderButtonText}>
                  {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5e8c7',
  },
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
    paddingTop: 10,
  },
  formContainer: {
    backgroundColor: '#e6d7b1',
    borderRadius: 10,
    padding: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  orderButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  orderButtonDisabled: {
    backgroundColor: '#f0a0a0',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderScreen;