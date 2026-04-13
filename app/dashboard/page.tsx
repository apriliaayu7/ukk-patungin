import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/SideBar"
import { TopBar } from "@/components/TopBar"
import Dashboard from "@/components/Dashboard"

export default async function DashboardPage() {
  const user = await prisma.user.findFirst()

  if (!user) {
    return <div>Tidak ada data</div>
  }

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* TopBar */}
      <div className="ml-64">
        <TopBar />
      </div>

      {/* Main Content */}
      <main className="ml-64 pt-20 p-6">
        <Dashboard
         user={{
    ...user,
    name: user.email, // sementara pakai email
    balance: 0 // default dulu
  }}
          activeBill={null}
          activeSummary={null}
          recentBills={[]}
        />
      </main>
    </div>
  )
}