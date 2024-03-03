import axios from "@/request/axios";

// 登录接口
export const login = (data: Record<string, any>) => {
  return axios.post("/api/backend/auth/login", data);
};

// 注册接口
export const register = (data: Record<string, any>) => {
  return axios.post("/api/backend/auth/register", data);
};

// 获取用户信息(要求登录)
export const fetchUser = async () => {
  return axios.get("/api/backend/auth/profile");
};
