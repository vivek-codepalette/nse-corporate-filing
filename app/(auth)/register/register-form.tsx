"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { defaultRegisterInputs  } from "@/constants/defaultInputs"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { register } from "@/lib/actions/user.actions"

export default function RegisterForm() {
    const [state, formAction] = useActionState(register, {
        success: false,
        message: "",
    })

    const RegisterButton = () => {
        const {pending} = useFormStatus()
        return (
            <Button type="submit" className="w-full" variant="default" disabled={pending}>
                {pending ? "Registering..." : "Register"}
            </Button>
        )
    }
  return (
    <form action={formAction}>
        <div className="space-y-4">
        <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Name" required autoComplete="name" defaultValue={defaultRegisterInputs.name}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Email" required autoComplete="email" defaultValue={defaultRegisterInputs.email}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" placeholder="Password" required autoComplete="password" defaultValue={defaultRegisterInputs.password}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required autoComplete="confirmPassword" defaultValue={defaultRegisterInputs.confirmPassword}/>
            </div>
            <div>
                <RegisterButton />
            </div>

            {state && !state.success && (
                <div className="text-sm text-red-500">
                    {state.message}
                </div>
            )}
            <div className="text-sm text-muted-foreground">
                <Link href="/login">Already have an account? Login</Link>
            </div>
        </div>
    </form>
  )
}
