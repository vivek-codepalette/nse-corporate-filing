import { APP_NAME } from "@/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="p-5 flex justify-center">
        <p>Copyright &copy; {currentYear} {APP_NAME}</p>
      </div>
    </footer>
  );
}