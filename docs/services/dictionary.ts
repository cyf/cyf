import axios from "@/request/axios";
import { Result } from "@/entities/response";
import { Dictionary } from "@/entities/dictionary";

// 新增数据字典
export const create = (
  data: Record<string, any>,
): Promise<Result<Dictionary>> => {
  return axios.post("/api/dictionary", data);
};

// 获取数据字典列表
export const list = (): Promise<Result<Dictionary[]>> => {
  return axios.get("/api/dictionary");
};

// 获取组列表
export const listAllPrimary = (): Promise<Result<Dictionary[]>> => {
  return axios.get("/api/dictionary/primary");
};

// 根据组获取数据字典列表
export const listByPrimary = (
  primary: string,
): Promise<Result<Dictionary[]>> => {
  return axios.get(`/api/dictionary/primary/${primary}`);
};

// 获取数据字典详情
export const findOne = (id: string): Promise<Result<Dictionary>> => {
  return axios.get(`/api/dictionary/${id}`);
};

// 更新数据字典详情
export const update = (
  id: string,
  data: Record<string, any>,
): Promise<Result<Dictionary>> => {
  return axios.patch(`/api/dictionary/${id}`, data);
};
