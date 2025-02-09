import DashboardHeader from "@/components/header/dashboard-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DashboardHeader />
            <div>
                {children}
            </div>
        </>
    )
}