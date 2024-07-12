import { authService } from "@/services";
import type { User } from "@/entities/user";

// A mock function to mimic making an async request for data
export const fetchUser = async (): Promise<User | null> => {
  const res = await authService.fetchUser();
  return res?.data || null;
};
