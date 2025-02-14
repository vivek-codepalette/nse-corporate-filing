import { ThemeToggle } from "@/components/theme-toggle";
import { Building2 } from "lucide-react";
import LoggedUserButton from "@/components/header/logged-user-button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background h-16">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-4">
          <Building2 className="h-6 w-6" />
          <h1 className="text-xl font-semibold">JD Constructions</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LoggedUserButton />
        </div>
      </div>
    </header>
  );
} 