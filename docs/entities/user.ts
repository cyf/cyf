export interface User {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  email_verified: string | null;
  avatar: string | null;
  role: string;
  create_date: string;
  update_date: string;
}
