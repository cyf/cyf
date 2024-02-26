import { authService } from "@/services";
import type { User } from "./user";

export const fetchUser = async (): Promise<User | null> => {
  const response = await authService.fetchUser();
  return response?.data;
};
