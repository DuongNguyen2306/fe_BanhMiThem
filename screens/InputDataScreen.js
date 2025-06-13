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
import { MaterialIcons } from '@expo/vector-icons';

const InputDataScreen = ({ route, navigation }) => {
  const { userPhone } = route.params || {};
  const [breadCount, setBreadCount] = useState('');
  const [wasteWeight, setWasteWeight] = useState('');
  const [extraItems, setExtraItems] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSkip = () => {
    navigation.navigate('Đặt hàng', { userPhone });
  };

  const handleNext = async () => {
    if (!userPhone) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sales to:', `http://192.168.0.198:3000/api/sales for user ${userPhone}`);
      
      const response = await fetch('http://192.168.0.198:3000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          breadCount: Number(breadCount) || 0, 
          wasteWeight: Number(wasteWeight) || 0, 
          extraWeight: 0, 
          userPhone 
        }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log('Sales response:', result);
      
      if (result.success) {
        Alert.alert('Thành công', result.message);
        navigation.navigate('Đặt hàng', { userPhone });
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể lưu dữ liệu');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
      console.log('Input error details:', error);
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
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Chào, Khách Hàng <Text style={styles.waveEmoji}>👋</Text></Text>
                <Text style={styles.subtitle}>Hãy quản lý nguyên liệu của bạn</Text>
              </View>
              <View style={styles.avatarContainer}>
                <MaterialIcons name="account-circle" size={40} color="#888" />
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.progressContainer}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Text style={styles.progressStepTextActive}>1</Text>
                  </View>
                </View>
                <View style={styles.progressLine}>
                  <View style={[styles.progressLineFill, { width: '0%' }]} />
                </View>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepInactive}>
                    <Text style={styles.progressStepTextInactive}>2</Text>
                  </View>
                </View>
                <View style={styles.progressLine}>
                  <View style={[styles.progressLineFill, { width: '0%' }]} />
                </View>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepInactive}>
                    <Text style={styles.progressStepTextInactive}>3</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.formTitle}>Số lượng bánh mì đã bán ngày hôm nay</Text>

              <Text style={styles.inputLabel}>Số bánh mì (ổ)</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                value={breadCount}
                onChangeText={setBreadCount}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Khối lượng chả lòng hỏng bỏ đi (gram)</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                value={wasteWeight}
                onChangeText={setWasteWeight}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Những mục phát sinh (gram)</Text>
              <TextInput
                style={styles.input}
                placeholder="100gr bơ, 200gr pate..."
                value={extraItems}
                onChangeText={setExtraItems}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.skipButton} 
                  onPress={handleSkip}
                  disabled={isLoading}
                >
                  <Text style={styles.skipButtonText}>Bỏ qua</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
                  onPress={handleNext}
                  disabled={isLoading}
                >
                  <Text style={styles.nextButtonText}>
                    {isLoading ? 'Đang xử lý...' : 'Tiếp theo'}
                  </Text>
                </TouchableOpacity>
              </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5e8c7',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  waveEmoji: {
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#e6d7b1',
    borderRadius: 10,
    padding: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressStepActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepInactive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressStepTextInactive: {
    color: '#666',
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: 'black',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#333',
  },
  nextButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#666',
  },
  nextButtonText: {
    color: 'white',
  },
});

export default InputDataScreen;