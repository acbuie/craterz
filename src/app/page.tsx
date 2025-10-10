import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppDashboard } from "@/components/dashboard";
import { AppSidebar } from "@/components/sidebar";
import { AppHeader } from "@/components/header";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <AppDashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
