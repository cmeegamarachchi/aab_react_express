import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavMain from "./NavMain";
import NavSecondary from "./NavSecondary";
import NavUser from "./NavUser";
import { useSideNavContext } from "../SideNavContext";
import CompanyLogo from "@/components/CompanyLogo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { data } = useSideNavContext();
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="https://www.appsolve.com.au" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CompanyLogo size={20} foregroundColor="white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">App Solve</span>
                  <span className="truncate text-xs">Human Technology</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        { data.navSecondary && <NavSecondary className="mt-auto" />}
      </SidebarContent>
      { data.user && <SidebarFooter>
        <NavUser />
      </SidebarFooter>}
    </Sidebar>
  );
}
