import type { User } from "./user";

export interface Auth {
  access_token: string;
  create_seconds: number;
  expire_seconds: number;
  user: User | null;
}
