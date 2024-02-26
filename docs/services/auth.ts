import axios from "@/request/axios";

export const login = (data: Record<string, any>) => {
  return axios.post("/api/backend/auth/login", data);
};

export const fetchUser = async () => {
  return axios.get("/api/backend/auth/profile");
};
