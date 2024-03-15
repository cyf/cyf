import axios from "@/request/axios";
import { Result } from "@/entities/response";
import { Insider } from "@/entities/insider";

// 加入内测计划
export const create = (data: Record<string, any>): Promise<Result<Insider>> => {
  return axios.post("/api/insider", data);
};

// 获取内测计划列表
export const list = (): Promise<Result<Insider[]>> => {
  return axios.get("/api/insider");
};

// 获取内测计划详情
export const findOne = (id: string): Promise<Result<Insider>> => {
  return axios.get(`/api/insider/${id}`);
};

// 更新内测计划详情
export const update = (
  id: string,
  data: Record<string, any>,
): Promise<Result<Insider>> => {
  return axios.patch(`/api/insider/${id}`, data);
};
