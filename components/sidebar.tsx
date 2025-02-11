"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Sidebar({ items }: { items: { label: string, href: string }[] }) {
    const pathname = usePathname();

    return (
        <div>
            {items.map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                    pathname === item.href && "bg-muted",
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted data-[state=open]:bg-muted"
                )}>
                    {item.label}
                </Link>
            ))}
        </div>
    )
}