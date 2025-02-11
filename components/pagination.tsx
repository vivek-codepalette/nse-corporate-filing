"use client"
import { useSearchParams, useRouter } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationComponent({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `/admin/users?${params.toString()}`
    }

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) {
                                    router.push(createPageURL(currentPage - 1))
                                }
                            }}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink 
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push(createPageURL(page))
                                }}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) {
                                    router.push(createPageURL(currentPage + 1))
                                }
                            }}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}