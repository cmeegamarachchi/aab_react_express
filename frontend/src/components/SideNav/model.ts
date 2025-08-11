import { LucideIcon } from "lucide-react";

export type NavUser = {
    name: string;
    email: string;
    avatar: string;
};

export type NavItem = {
    title: string;
    url: string;
};

export type NavMainItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items: NavItem[];
};

export type NavSecondaryItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

export type BreadCrumbItem = {
    title: string;
    url: string;
}

export type SidebarData = {
    breadCrumbs?: BreadCrumbItem[];
    user?: NavUser;
    navMain: NavMainItem[];
    navSecondary?: NavSecondaryItem[];
};