export interface Result<T> {
  data?: T;
  code: number;
  timestamp: number;
  msg?: string;
  path?: string;
}
