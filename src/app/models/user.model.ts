import { Music } from "./music.model";

export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  
}
  