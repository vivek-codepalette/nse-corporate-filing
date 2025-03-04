"use server"

import { prisma } from "@/db/prisma"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { signIn, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@/lib/validations/user.validations"
import { hashSync } from "bcrypt-ts"
import { z } from "zod"

// Uses React Hook Form to handle form submission
export async function register(registerData: z.infer<typeof registerSchema>) {
  try {
    const validatedFields = registerSchema.parse({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    })
    await prisma.user.create({
      data: {
        name: validatedFields.name,
        email: validatedFields.email,
        password: hashSync(validatedFields.password, 10),
      },
    })
    return { success: true, message: "Registration successful" }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Registration failed" }
  }
}


// Uses action state to handle form submission
export async function loginWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackUrl: formData.get("callbackUrl") as string || "/dashboard"
    })
    await signIn("credentials", validatedFields)
    return { success: true, message: "Login successful" }
  } catch (error) {
    console.log(error)
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" }
  }
}

export async function logout() {
  await signOut({ redirect: false })
  redirect("/login")
}