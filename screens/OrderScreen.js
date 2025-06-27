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
import API_ENDPOINTS from '../src/api/apiConfig';

const OrderScreen = ({ route, navigation }) => {
  const { userPhone } = route.params || {};
  const [chaLua, setChaLua] = useState('');
  const [chaDo, setChaDo] = useState('');
  const [pate, setPate] = useState('');
  const [xucXichToi, setXucXichToi] = useState('');
  const [jambon, setJambon] = useState('');
  const [butter, setButter] = useState('');
  const [chaBong, setChaBong] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestionEnabled, setAiSuggestionEnabled] = useState(false);

  // Function to handle AI suggestions
  const handleAISuggestion = () => {
    setChaLua('0.5');
    setChaDo('0.5');
    setPate('0.5');
    setXucXichToi('0.5');
    setJambon('0.5');
    setButter('0.5');
    setChaBong('0.5');
    Alert.alert('Gợi ý', 'AI đã gợi ý 0.5kg cho mỗi sản phẩm. Bạn có thể điều chỉnh!');
  };

  // Function to handle checkbox toggle
  const handleCheckboxToggle = () => {
    const newValue = !aiSuggestionEnabled;
    setAiSuggestionEnabled(newValue);
    
    if (newValue) {
      handleAISuggestion();
    } else {
      setChaLua('');
      setChaDo('');
      setPate('');
      setXucXichToi('');
      setJambon('');
      setButter('');
      setChaBong('');
    }
  };

  const handleOrder = async () => {
    if (!userPhone) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    const orderData = { 
      chaLua: chaLua || '0', 
      chaDo: chaDo || '0', 
      pate: pate || '0', 
      xucXichToi: xucXichToi || '0', 
      jambon: jambon || '0', 
      butter: butter || '0', 
      chaBong: chaBong || '0', 
      userPhone 
    };

    setIsLoading(true);
    try {
      console.log('Attempting order to:', `${API_ENDPOINTS.ORDERS} for user ${userPhone}`);
      
      const response = await fetch(API_ENDPOINTS.ORDERS, { 
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

  // Price calculation (VND/kg)
  const prices = {
    chaLua: 107000,
    chaDo: 143000,
    pate: 93500,
    xucXichToi: 113300,
    jambon: 173800,
    butter: 99000,
    chaBong: 120000,
  };
  const totalAmount = (
    (Number(chaLua) || 0) * prices.chaLua +
    (Number(chaDo) || 0) * prices.chaDo +
    (Number(pate) || 0) * prices.pate +
    (Number(xucXichToi) || 0) * prices.xucXichToi +
    (Number(jambon) || 0) * prices.jambon +
    (Number(butter) || 0) * prices.butter +
    (Number(chaBong) || 0) * prices.chaBong
  );

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
              {/* AI Suggestion Checkbox - Centered in form */}
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={handleCheckboxToggle}
              >
                <View style={[styles.checkbox, aiSuggestionEnabled && styles.checkboxChecked]}>
                  {aiSuggestionEnabled && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Gợi ý của AI</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>Nhập số lượng muốn đặt</Text>
              
              <Text style={styles.inputLabel}>Chả lụa (kg) - 107k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={chaLua}
                onChangeText={setChaLua}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Chả đỏ (kg) - 143k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={chaDo}
                onChangeText={setChaDo}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Pate (kg) - 93.5k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={pate}
                onChangeText={setPate}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Xúc xích tỏi (kg) - 113.3k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={xucXichToi}
                onChangeText={setXucXichToi}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Jambon (kg) - 173.8k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={jambon}
                onChangeText={setJambon}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Bơ (kg) - 99k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={butter}
                onChangeText={setButter}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.inputLabel}>Chà bông (kg) - 120k/kg</Text>
              <TextInput
                style={[styles.input, aiSuggestionEnabled && styles.inputDisabled]}
                placeholder="0"
                value={chaBong}
                onChangeText={setChaBong}
                keyboardType="numeric"
                editable={!aiSuggestionEnabled}
              />
              
              <Text style={styles.totalText}>Tổng tiền: {totalAmount.toLocaleString()} VND</Text>
              
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    paddingLeft: 5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#8B7355',
    borderRadius: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#8B7355',
    borderColor: '#8B7355',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#5D4E37',
    fontWeight: '400',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#5D4E37',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
    color: '#d32f2f',
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