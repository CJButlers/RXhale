import { UserPlus, LogOut, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"; //
import { Separator } from "./ui/separator"; //
import { Avatar, AvatarFallback } from "./ui/avatar"; 

// Menu items configuration
const items = [
  { title: "Patient List", url: "home", icon: Users },
  { title: "Add New Patient", url: "add-patient", icon: UserPlus },
  { title: "Settings", url: "#", icon: Settings },
];

interface AppSidebarProps {
  onNavigate: (page: any) => void;
  onLogout: () => void;
  currentUser: string;
}

export function AppSidebar({ onNavigate, onLogout, currentUser }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold text-xl text-teal-700">
          {/* You can use your Inhaler image here */}
          <span>RXhale</span>
        </div>
      </SidebarHeader>
      
      <Separator /> {/* */}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onNavigate(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-slate-100">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{currentUser.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">
            <p>{currentUser}</p>
            <p className="text-xs text-muted-foreground">Pharmacist</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}