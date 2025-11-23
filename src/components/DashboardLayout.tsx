import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar"; // Defined in the previous step
import { Separator } from "./ui/separator";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  currentUser: string;
}

export function DashboardLayout({ 
  children, 
  onNavigate, 
  onLogout, 
  currentUser 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar onNavigate={onNavigate} onLogout={onLogout} currentUser={currentUser} />
      <SidebarInset className="bg-slate-50">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">Pharmacy Dashboard</span>
            <span className="text-xs text-slate-500">COPD Monitoring System</span>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}