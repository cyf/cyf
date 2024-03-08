import axios from "@/request/axios";
import { Result } from "@/entities/response";

// 发送邮箱验证邮件
export const verify = (): Promise<
  Result<{ id: string; message_id: string }>
> => {
  return axios.post("/api/user/email-verify");
};

// 判断用户名是否存在
export const hasUsername = (username: string): Promise<Result<boolean>> => {
  return axios.post("/api/user/has-username", {
    username,
  });
};

// 判断邮箱是否存在
export const hasEmail = (email: string): Promise<Result<boolean>> => {
  return axios.post("/api/user/has-email", {
    email,
  });
};
