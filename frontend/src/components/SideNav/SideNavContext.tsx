import { createContext, useContext } from "react";
import { SidebarData } from "./model";

const SideNavContext = createContext<{data: SidebarData} | null>(null);

export const useSideNavContext = () => {
    const context = useContext(SideNavContext);
    if (!context) {
        throw new Error("useSideNavContext must be used within a SideNavProvider");
    }
    return context;
} 

export const SideNavProvider = SideNavContext.Provider;