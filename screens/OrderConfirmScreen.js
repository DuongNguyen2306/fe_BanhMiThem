import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import API_ENDPOINTS from '../src/api/apiConfig'; // Import API endpoints

const OrderConfirmScreen = ({ route, navigation }) => {
  const { orderId, userPhone } = route.params || {};
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(userPhone || '');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userPhone) {
      // Load user profile
      const loadProfile = async () => {
        try {
          const response = await fetch(`${API_ENDPOINTS.PROFILES}/${userPhone}`); // Use centralized endpoint
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setName(data.name || '');
              setAddress(data.address || '');
            }
          }
        } catch (err) {
          console.log('Profile load error:', err);
        }
      };
      
      loadProfile();
    }
  }, [userPhone]);

  const handleConfirm = async () => {
    if (!userPhone) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }
    
    if (!name || !phone || !address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);
    try {
      // Update profile
      console.log('Attempting profile update to:', `${API_ENDPOINTS.PROFILES} for user ${userPhone}`);
      
      const profileResponse = await fetch(API_ENDPOINTS.PROFILES, { // Use centralized endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, password: '123456' }),
      });
      
      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        console.log('Profile response:', profileResult);
        
        if (profileResult.success) {
          // Confirm order if orderId exists
          if (orderId) {
            const confirmResponse = await fetch(API_ENDPOINTS.CONFIRM_ORDER, { // Use centralized endpoint
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId }),
            });
            
            if (confirmResponse.ok) {
              const confirmResult = await confirmResponse.json();
              console.log('Confirm response:', confirmResult);
              
              if (confirmResult.success) {
                Alert.alert('Thành công', 'Đơn hàng hoàn tất');
                navigation.navigate('Đặt hàng thành công');
              } else {
                Alert.alert('Lỗi', confirmResult.message || 'Không thể xác nhận đơn hàng');
              }
            } else {
              Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng');
            }
          } else {
            Alert.alert('Thành công', 'Thông tin đã được cập nhật');
            navigation.goBack();
          }
        } else {
          Alert.alert('Lỗi', profileResult.message || 'Không thể cập nhật thông tin');
        }
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
      console.log('Confirm error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Thông tin đặt hàng</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Họ và Tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Họ và Tên"
              value={name}
              onChangeText={setName}
            />
            
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            
            <TouchableOpacity 
              style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]} 
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text style={styles.confirmButtonText}>
                {isLoading ? 'Đang xử lý...' : 'Đồng ý'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  confirmButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: '#f0a0a0',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderConfirmScreen;