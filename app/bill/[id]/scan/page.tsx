"use client";

import { Sidebar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import ScanStruk from "@/components/ScanStruk";

export default function Page() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <ScanStruk />
        </main>
      </div>
    </div>
  );
}