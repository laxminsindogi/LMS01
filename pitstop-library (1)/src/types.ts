export type Role = 'Student' | 'Employee' | 'Admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar_url?: string;
  demographics?: {
    age?: number;
    department?: string;
    enrollmentYear?: string;
    bio?: string;
  };
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  cover_url: string;
}
