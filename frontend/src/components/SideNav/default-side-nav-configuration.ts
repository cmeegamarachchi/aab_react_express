import { BookOpen, Bot, LifeBuoy, Send, Settings2, SquareTerminal, Database, HomeIcon } from "lucide-react";


const sideNavConfig = {
    breadCrumbs: [],
    user: {
      name: "chintana-m",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: HomeIcon,
        isActive: true,
      },      
      {
        title: "Contacts",
        url: "/contacts",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "All",
            url: "/contacts/all",
          },
          {
            title: "Starred",
            url: "/contacts/started",
          }
        ],
      },
      {
        title: "Data store",
        url: "#",
        icon: Database,
        isActive: false,
        items: [
          {
            title: "System data store",
            url: "/data-store",
          },
          {
            title: "Object data store",
            url: "/data-store/objects",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "/settings",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  export const getDefaultSideNavConfig = () => sideNavConfig;