import { prisma } from "@/db/prisma";

export async function getUsers({ limit = 1, page = 1 }: { limit?: number, page?: number }) {
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
            skip: (page - 1) * limit,
        }),
        prisma.user.count(),
    ]);
    return { 
        data: users, 
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total: total,
    };
}