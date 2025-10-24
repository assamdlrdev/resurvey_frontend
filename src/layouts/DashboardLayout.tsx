// src/layouts/DashboardLayout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-medical-50">
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-medical-200 flex items-center z-40 shadow-sm">
          <SidebarTrigger className="ml-4 text-medical-600 hover:text-medical-800 hover:bg-medical-100 rounded-md p-2" />
          <h1 className="ml-4 font-bold text-xl text-medical-900">Resurvey</h1>
        </header>

        <AppSidebar />

        <main className="flex-1 pt-14 bg-medical-50">
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  );
}
