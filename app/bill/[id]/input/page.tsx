"use client"

import { Sidebar } from "@/components/SideBar"
import { TopBar } from "@/components/TopBar"
import InputMethodPage from "@/components/InputMethod"

export default function Page() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-6 md:p-10">
          <InputMethodPage /> {/* ❌ HAPUS onCancel */}
        </main>
      </div>
    </div>
  )
}