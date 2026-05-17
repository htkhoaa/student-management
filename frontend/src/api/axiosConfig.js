import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    if (response?.status === 401 || response?.status === 403) {
      const isLoginRequest = config.url.includes('/auth/login');
      const isPasswordRequest = config.url.includes('/auth/password');

      if (!isLoginRequest && !isPasswordRequest) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;