"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { defaultRegisterInputs  } from "@/constants/defaultInputs"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { register } from "@/lib/actions/user-auth.actions"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { useTransition } from "react"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { registerSchema } from "@/lib/validations/user.validations"
import { zodResolver } from "@hookform/resolvers/zod"

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: defaultRegisterInputs as z.infer<typeof registerSchema>
    })
    const { toast } = useToast()

    const onSubmit = (data: z.infer<typeof registerSchema>) => {
        startTransition(async () => {
            const result = await register(data)
            if (!result.success) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message
                })
            }
            toast({
                title: "Success",
                description: "Account created successfully",
                action: <Link href="/login">Login</Link>
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Name" required autoComplete="name"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="Email" required autoComplete="email"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" placeholder="Password" required autoComplete="new-password"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" placeholder="Confirm Password" required autoComplete="new-password"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Registering..." : "Register"}
                </Button>
                <div className="text-sm text-muted-foreground">
                    <Link href="/login">Already have an account? Login</Link>
                </div>
            </form>
        </Form>
    )
}
