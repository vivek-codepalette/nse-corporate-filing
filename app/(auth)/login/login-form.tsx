"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { defaultLoginInputs } from "@/constants/defaultInputs"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginWithCredentials } from "@/lib/actions/user-auth.actions"
import { useSearchParams } from "next/navigation"

export default function LoginForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    const [state, formAction] = useActionState(loginWithCredentials, {
        success: false,
        message: "",
    })

    const LoginButton = () => {
        const {pending} = useFormStatus()
        return (
            <Button type="submit" className="w-full" variant="default" disabled={pending}>
                {pending ? "Logging in..." : "Login"}
            </Button>
        )
    }
  return (
    <form action={formAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Email" required autoComplete="email" defaultValue={defaultLoginInputs.email}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" placeholder="Password" required autoComplete="password" defaultValue={defaultLoginInputs.password}/>
            </div>
            <div>
                <LoginButton />
            </div>

            {state && !state.success && (
                <div className="text-sm text-red-500">
                    {state.message}
                </div>
            )}
            <div className="text-sm text-muted-foreground">
                <Link href="/register">Don&apos;t have an account? Register</Link>
            </div>
        </div>
    </form>
  )
}
