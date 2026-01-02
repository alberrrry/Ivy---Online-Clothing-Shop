import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.102:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (productId) => api.get(`/products/${productId}`),
  create: (data) => api.post("/products", data),
  update: (productId, data) => api.put(`/products/${productId}`, data),
  delete: (productId) => api.delete(`/products/${productId}`),
};

export default api;
