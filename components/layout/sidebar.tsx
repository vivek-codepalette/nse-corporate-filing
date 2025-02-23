"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FolderKanban,
  Users,
  Star,
} from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/admin/projects",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
];

const userRoutes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Stocks",
    icon: FolderKanban,
    href: "/stocks",
  },
  {
    title: "Favorites",
    icon: Star,
    href: "/stocks/favorites",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.includes("admin");
  const routes = isAdmin ? adminRoutes : userRoutes;

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background pt-16">
      <ScrollArea className="h-full px-3 py-4">
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              {isAdmin ? "Admin Portal" : "User Portal"}
            </h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === route.href && "bg-muted"
                  )}
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="h-4 w-4" />
                    {route.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 