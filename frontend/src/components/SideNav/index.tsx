import React from "react";
import { SidebarData } from "./model";
import { SideNavProvider } from "./SideNavContext";
import { AppSidebar } from "./internal/AppSideBar";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import Breadcrumbs from "./internal/Breadcrumbs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface SideNavProps {
  children: React.ReactNode;
  data: SidebarData;
}

const SideNav: React.FC<SideNavProps> = ({ children, data }) => {
  return (
    <SideNavProvider value={{ data }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex mt-4 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {data.breadCrumbs && (
              <>
                {" "}
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs />{" "}
              </>
            )}
          </div>
        </header>
        <ScrollArea className="h-[calc(100vh-100px)]">{children}</ScrollArea>
      </SidebarInset>
    </SideNavProvider>
  );
};

export default SideNav;
