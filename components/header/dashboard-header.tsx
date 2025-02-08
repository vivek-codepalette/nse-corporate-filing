import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/constants";
import LoggedUserButton from "./logged-user-button";
export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <h1>{APP_NAME}</h1>
      </Link>
      <LoggedUserButton />
    </header>
  );
}