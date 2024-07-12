import { User } from "@/entities/user";

export interface Dictionary {
  id: string;
  primary: string;
  key: string;
  label: string;
  description?: string;
  create_date: string;
  create_by: string;
  user: Pick<User, "username" | "nickname">;
}
