import DashboardHeader from "@/components/header/dashboard-header"
import Sidebar from "@/components/sidebar"
import { ADMIN_SIDEBAR_ITEMS } from "@/constants"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DashboardHeader />
            <div className="flex flex-row">
                <Sidebar items={ADMIN_SIDEBAR_ITEMS} />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </>
    )
}