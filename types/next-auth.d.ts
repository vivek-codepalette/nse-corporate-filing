import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
    }
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email?: string;
    name?: string;
    role?: string;
  }
} 