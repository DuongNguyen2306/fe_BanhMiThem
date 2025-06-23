import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './screens/LoginScreen';
import InputDataScreen from './screens/InputDataScreen';
import OrderScreen from './screens/OrderScreen';
import OrderConfirmScreen from './screens/OrderConfirmScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PredictionScreen from './screens/PredictionScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  const [userPhone, setUserPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedPhone) {
          setUserPhone(storedPhone);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const ProfileWrapper = (props) => {
    return <ProfileScreen {...props} setUserPhone={setUserPhone} />;
  };

  const MainTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Nhập dữ liệu') iconName = 'home';
            else if (route.name === 'Đặt hàng') iconName = 'shopping-cart';
            else if (route.name === 'Xem dự đoán') iconName = 'star';
            else if (route.name === 'Lịch sử đơn hàng') iconName = 'history';
            else if (route.name === 'Thông tin') iconName = 'person';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#d32f2f',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Nhập dữ liệu" 
          component={InputDataScreen} 
          initialParams={{ userPhone }} 
        />
        <Tab.Screen 
          name="Đặt hàng" 
          component={OrderScreen} 
          initialParams={{ userPhone }} 
        />
        <Tab.Screen 
          name="Xem dự đoán" 
          component={PredictionScreen} 
          initialParams={{ userPhone }} 
        />
        <Tab.Screen 
          name="Lịch sử đơn hàng" 
          component={OrderHistoryScreen} 
          initialParams={{ userPhone }} 
        />
        <Tab.Screen 
          name="Thông tin" 
          component={ProfileWrapper} 
          initialParams={{ userPhone }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userPhone ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="Xem thông tin" 
              component={OrderConfirmScreen}
              options={{ headerShown: true, title: 'Thông tin đặt hàng' }}
            />
            <Stack.Screen 
              name="Đặt hàng thành công" 
              component={OrderSuccessScreen}
              options={{ headerShown: true, title: 'Thành công' }}
            />
            <Stack.Screen 
              name="Dự đoán" 
              component={PredictionScreen}
              options={{ headerShown: true, title: 'Dự đoán AI' }}
            />
            <Stack.Screen 
              name="Lịch sử đơn hàng" 
              component={OrderHistoryScreen}
              options={{ headerShown: true, title: 'Lịch sử đơn hàng' }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            initialParams={{ setUserPhone }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;