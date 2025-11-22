import axios, { AxiosError } from "axios";
import { showToast } from "./toastService";

const api = axios.create({
  baseURL: "https://r0jlt1sk-8080.brs.devtunnels.ms/apolonotes/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    console.log(error);
    if (error.code === "ECONNABORTED") {
      showToast("Solicitud Expirada ", "error");
    }
    if (status === 400) {
      showToast("Solicitud inválida", "error");
    } else if (status === 401) {
      showToast("No autorizado. Por favor inicia sesión.", "error");
      // Optionally clear token or redirect here
    } else if (status === 403) {
      showToast("Acceso denegado", "error");
    } else if (status && status >= 500) {
      showToast("Error del servidor", "error");
    }
    return Promise.reject(error);
  }
);

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
