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
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route, navigation }) => {
  const { userPhone: routeUserPhone, setUserPhone } = route.params || {};
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(routeUserPhone || '');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (routeUserPhone) {
      const loadProfile = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://192.168.0.198:3000/api/profiles/${routeUserPhone}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          console.log('Profile data received:', data);
          if (data) {
            setName(data.name || '');
            setAddress(data.address || '');
            setPhone(data.phone || routeUserPhone);
          }
        } catch (err) {
          console.log('Profile load error:', err);
          Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProfile();
    }
  }, [routeUserPhone]);

  const handleSave = async () => {
    if (!routeUserPhone) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }
    
    if (!name || !phone || !address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting profile save to:', `http://192.168.0.198:3000/api/profiles for user ${routeUserPhone}`);
      
      const response = await fetch('http://192.168.0.198:3000/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, password: '123456' }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile save response:', result);
        
        if (result.success) {
          Alert.alert('Thành công', result.message || 'Đã lưu thông tin cá nhân');
        } else {
          Alert.alert('Lỗi', result.message || 'Không thể lưu thông tin');
        }
      } else {
        Alert.alert('Lỗi', 'Không thể lưu thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối đến server: ${error.message}`);
      console.log('Profile save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            setIsLoading(true);
            try {
              await AsyncStorage.removeItem('userPhone');
              try {
                await fetch('http://192.168.0.198:3000/api/logout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                });
              } catch (apiError) {
                console.log('Logout API error (non-critical):', apiError);
              }
              if (setUserPhone) {
                setUserPhone(null);
              }
              Alert.alert('Thành công', 'Đã đăng xuất');
            } catch (error) {
              Alert.alert('Lỗi', `Không thể đăng xuất: ${error.message}`);
              console.log('Logout error details:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5e8c7" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>Thông tin cá nhân</Text>
              
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
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Số điện thoại"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={false}
                />
                
                <Text style={styles.inputLabel}>Địa chỉ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Địa chỉ"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    disabled={isLoading}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={isLoading}
                  >
                    <Text style={styles.saveButtonText}>
                      {isLoading ? 'Đang lưu...' : 'Lưu'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]} 
                  onPress={handleLogout}
                  disabled={isLoading}
                >
                  <Text style={styles.logoutButtonText}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng xuất'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
    flex: 1,
    backgroundColor: '#f5e8c7',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#d32f2f',
  },
  formContainer: {
    backgroundColor: '#e6d7b1',
    borderRadius: 15,
    padding: 20,
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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    backgroundColor: '#ffcdd2',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;