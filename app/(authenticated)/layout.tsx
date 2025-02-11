import DashboardHeader from "@/components/header/dashboard-header";
import Sidebar from "@/components/sidebar";
import { SIDEBAR_ITEMS } from "@/constants";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex flex-row">
          <Sidebar items={SIDEBAR_ITEMS} />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    );
  }