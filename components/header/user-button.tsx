import { auth } from "@/auth"
import { Button } from "../ui/button"
import Link from "next/link"

export default async function UserButton() {
    const session = await auth()
    if (!session) {
        return (
            <Button asChild>
                <Link href="/login">
                    Login
                </Link>
            </Button>
        )
    }
    return (
        <Button asChild>
            <Link href="/dashboard">
                Dashboard
            </Link>
        </Button>
    )
}