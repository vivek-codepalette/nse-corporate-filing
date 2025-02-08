import { Metadata } from "next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import LoginForm from "./login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage(props: {searchParams: Promise<{callbackUrl?: string}>}) {
    const {callbackUrl} = await props.searchParams
    const session = await auth()
    if (session) {
        redirect(callbackUrl || "/dashboard")
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
          Sign in to your account
        </h2>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
