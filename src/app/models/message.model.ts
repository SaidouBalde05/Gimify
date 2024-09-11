export interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    date: Date;
    isRead: boolean;  // Indique si le message est lu ou non
  }
  