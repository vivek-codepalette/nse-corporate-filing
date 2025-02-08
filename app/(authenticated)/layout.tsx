import DashboardHeader from "@/components/header/dashboard-header";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        {children}
      </div>
    );
  }