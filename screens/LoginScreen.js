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
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from '../src/api/apiConfig'; // Import API endpoints

const LoginScreen = ({ route, navigation }) => {
  const { setUserPhone } = route.params || {};
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      console.log('Login data:', { phone, password });
      
      const response = await fetch(API_ENDPOINTS.LOGIN, { // Use centralized endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      console.log('Login response:', result);
      
      if (result.success) {
        Alert.alert('Thành công', result.message);
        await AsyncStorage.setItem('userPhone', phone);
        setUserPhone(phone);
      } else {
        Alert.alert('Lỗi', result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
      console.log('Login error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoTextSmall}>bánh mì</Text>
                <Text style={styles.logoTextLarge}>Thèm</Text>
                <Text style={styles.logoTagline}>Tại minh thêm đồ để bạn năng thêm sức nghiệp!</Text>
              </View>
            </View>

            <Text style={styles.title}>Đăng nhập</Text>
            
            <Text style={styles.inputLabel}>Email / Tên đăng nhập</Text>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>
              Use 8 or more characters with a mix of letters, numbers & symbols
            </Text>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5e8c7',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    paddingTop: 40, // Add extra padding at top
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    height: 150,
    justifyContent: 'center',
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoTextSmall: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Zapfino' : 'serif',
  },
  logoTextLarge: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#d32f2f',
    fontStyle: 'italic',
    marginTop: -10,
    fontFamily: Platform.OS === 'ios' ? 'Zapfino' : 'serif',
  },
  logoTagline: {
    fontSize: 12,
    color: '#d32f2f',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#f0a0a0',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;