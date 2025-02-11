import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Pagination from "@/components/pagination"
import { getUsers } from "@/lib/actions/user.actions"

interface SearchParams {
    page?: string;
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const currentPage = Number((await searchParams).page || 1);
    const { data, total, totalPages } = await getUsers({ page: currentPage });

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Users</h1>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{total} Users</p>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {totalPages > 1 && (
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                )}
            </div>
        </div>
    )
}