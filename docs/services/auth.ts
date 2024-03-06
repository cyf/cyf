import axios from "@/request/axios";
import { Result } from "@/entities/response";
import { Auth } from "@/entities/auth";
import { User } from "@/entities/user";

// 登录接口
export const login = (data: Record<string, any>): Promise<Result<Auth>> => {
  return axios.post("/api/backend/auth/login", data);
};

// 注册接口
export const register = (data: Record<string, any>): Promise<Result<Auth>> => {
  return axios.post("/api/backend/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 获取用户信息(要求登录)
export const fetchUser = async (): Promise<Result<User>> => {
  return axios.get("/api/backend/auth/profile");
};
