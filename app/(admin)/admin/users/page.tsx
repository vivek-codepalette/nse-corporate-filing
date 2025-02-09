import { User } from "@/types/user";
import UsersTable from "./users-table";
import { prisma } from "@/db/prisma";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Users</h1>
            <UsersTable users={users as User[]} />
        </div>
    )
}