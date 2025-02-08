import { Metadata } from "next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import RegisterForm from "./register-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Register",
  description: "Register to your account",
}

export default async function RegisterPage() {
    const session = await auth()
    if (session) {
        redirect("/dashboard")
    }
  return (
    <Card className="w-[400px]">
      <CardHeader className="flex items-center">
        {/* <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="mb-4"
        /> */}
        <h2 className="text-2xl font-semibold text-center">
          Register to your account
        </h2>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  )
}
