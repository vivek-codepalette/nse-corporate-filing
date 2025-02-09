import { auth } from "@/auth"
import { Button } from "../ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { logout } from "@/lib/actions/user-auth.actions"

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-8 h-8 rounded-full">
                    {session.user?.email?.[0].toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href="/dashboard">
                        {session.user?.email}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <form action={logout} className="w-full">
                        <Button type="submit" variant="ghost" className="w-full">
                            Logout
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}