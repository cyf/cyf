import { User } from "@/entities/user";

export interface Insider {
  id: string;
  app: string;
  platform: string;
  email: string;
  create_date: string;
  create_by: string;
  user: Pick<User, "username" | "nickname">;
}
