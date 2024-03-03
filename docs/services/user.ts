import axios from "@/request/axios";

export const verify = () => {
  return axios.post("/api/backend/user/verify");
};
