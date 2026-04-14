"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/SideBar"
import { TopBar } from "@/components/TopBar"
import Dashboard from "@/components/Dashboard"

type User = {
  id: string
  email: string
  name?: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  if (!user) {
    return <div>Silakan login dulu</div>
  }

  return (
    <div>
      <Sidebar />

      <div className="ml-64">
        <TopBar />
      </div>

      <main className="ml-64 pt-20 p-6">
        <Dashboard
          user={{
            ...user,
            name: user.name || user.email,
            balance: 0,
          }}
          activeBill={null}
          activeSummary={null}
          recentBills={[]}
        />
      </main>
    </div>
  )
}