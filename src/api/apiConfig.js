const BASE_URL = 'http://10.87.64.155:3000/api'; // Loại bỏ /api khỏi BASE_URL

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  SALES: `${BASE_URL}/sales`,
  ORDERS: `${BASE_URL}/orders`,
  PROFILES: `${BASE_URL}/profiles`,
  CONFIRM_ORDER: `${BASE_URL}/confirm-order`,
  LOGOUT: `${BASE_URL}/logout`,
  STATS: `${BASE_URL}/stats`,
  PREDICTIONS: `${BASE_URL}/predictions`, // Sẽ thành http://192.168.0.197:3000/predictions
};

export default API_ENDPOINTS;