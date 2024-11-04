// import axios from "axios";
// import { toast } from "react-toastify";

import axios from "axios";
import { logout, updateAccessToken } from "../../core/store/slice/userSlice";
import { RootState, store } from "../../core/store/store";

const baseUrl = "http://34.126.80.91:8085/api/";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState();
    const user = state.user;

    if (user && user["accessToken"]) {
      config.headers.Authorization = `Bearer ${user["accessToken"]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshToken = async (refresh: any) => {
  if (!refresh) {
    throw new Error("No refresh token available");
  }
  const response = await axios.post(`${baseUrl}v1/user/refresh`, {
    refreshToken: refresh,
  });
  const { accessToken } = response.data.data;
  return accessToken;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const state: RootState = store.getState();
        const user = state.user;
        const newAccessToken = await refreshToken(user && user["refreshToken"]);
        store.dispatch(updateAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        store.dispatch(logout());
        window.location.href = "";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
