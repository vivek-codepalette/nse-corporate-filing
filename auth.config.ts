import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // leave it empty as we'll add them in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const protectedRoutes = ["/dashboard"]

      const { pathname } = nextUrl;

      if (!auth && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig