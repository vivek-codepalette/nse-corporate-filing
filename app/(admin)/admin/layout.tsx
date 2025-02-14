import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ContentWrapper } from "@/components/layout/content-wrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <ContentWrapper>{children}</ContentWrapper>
        </main>
      </div>
    </div>
  );
}