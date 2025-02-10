export interface User {

  id: string;

  email: string;

  name: string;

  password?: string;

  isActive: boolean;

  isConnected: boolean;

  role?: 'admin' | 'user';
}
