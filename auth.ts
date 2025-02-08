import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/validations/user.validations"
import { compareSync } from "bcrypt-ts"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Test the below code for Zod validation
        const parsedCredentials = loginSchema.parse(credentials)
        
        const user = await prisma.user.findFirst({
          where: { email: parsedCredentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const passwordsMatch = await compareSync(parsedCredentials.password as string, user.password)

        if (!passwordsMatch) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token, trigger }) {
      session.user.id = token.sub as string
      
      if (trigger === "update") {
        session.user.email = token.email as string
        // session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})