// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { BreadCrumbItem } from "@/components/SideNav/model";
import SideNav from "@/components/SideNav";
import { getDefaultSideNavConfig } from "@/components/SideNav/default-side-nav-configuration";

interface LayoutProps {
  children: React.ReactNode;
  titleToActivate: string;
  breadcrumbs: BreadCrumbItem[];
}

function Title({children }:{children: React.ReactNode}) {
  return <h1 className="text-2xl font-semibold m-4">{children}</h1>;
} 

function Layout({ children, titleToActivate, breadcrumbs }:LayoutProps) {
  const sideNavConfig = getDefaultSideNavConfig();

  sideNavConfig.navMain.map((item) => {
    item.isActive = false;
    if (item.title === titleToActivate) {
      item.isActive = true;
    }
    return item;
  });

  const _sideNavConfig = {
    ...sideNavConfig,
    breadCrumbs: breadcrumbs,
  };

  return <SideNav contentTitle data={_sideNavConfig}>{children}</SideNav>;
};

Layout.Title = Title;

export default Layout;
