import { Home, Users, FileText, Database, LogIn, UserPlus, Settings, Activity, BarChart3, ChevronDown, FileTextIcon } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import StorageService from "@/services/StorageService";

export function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const user = StorageService.getJwtCookie();
  const userData: any = StorageService.getJwtCookieData(user);

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const goTo = (url: string) => navigate(url);

  const logout = async () => {
    StorageService.jwtRemove();
    goTo("/login");
  };

  // Single centralized config. Edit this array to add/remove groups/items.
  const menuConfig: {
    key: string;
    title: string;
    collapsible?: boolean;
    visible?: () => boolean;
    items: Array<{
      title: string;
      url?: string;
      icon?: any;
      onClick?: () => void;
    }>;
  }[] = [
    {
      key: "main",
      title: "Survey",
      collapsible: true,
      visible: () => ["1", "11", "14", "2"].includes(userData?.usertype),
      items: [
        { title: "Survey Form", url: "/survey-form", icon: FileTextIcon },
      ],
    },
    {
      key: "analytics",
      title: "Reports",
      collapsible: true,
      visible: () => ["1", "11", "14", "2", "9"].includes(userData?.usertype),
      items: [
        { title: "Survey Reports", url: "/reports", icon: BarChart3 },
        { title: "Area Difference Report", url: "/area-difference-report", icon: Activity },
      ],
    },
    {
      key: "co",
      title: "CO Panel",
      collapsible: true,
      visible: () => userData?.usertype === "4",
      items: [
        { title: "CO Dashboard", url: "/co-dashboard", icon: Home },
        { title: "Survey Reports", url: "/co-survey-reports", icon: FileText },
        { title: "Mutation", url: "/co-mutation", icon: FileText },
      ],
    },
    {
      key: "system",
      title: "System",
      collapsible: false,
      visible: () => true,
      items: [
        {
          title: "Sign Out",
          icon: Settings,
          onClick: logout,
        },
      ],
    },
  ];

  // Initialize open state from config keys (default open = true for collapsible groups)
  const initialOpenGroups = menuConfig.reduce<Record<string, boolean>>((acc, g) => {
    acc[g.key] = g.collapsible !== false;
    return acc;
  }, {});

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleNavClick = (url?: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
    } else if (url) {
      goTo(url);
    }
    if (isMobile && !isCollapsed) {
      toggleSidebar();
    }
  };

  const renderMenuItems = (items: typeof menuConfig[number]["items"]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            {item.url ? (
              <NavLink
                onClick={() => handleNavClick(item.url, item.onClick)}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive(item.url || "") ? "bg-medical-600 text-white shadow-sm" : "text-medical-700 hover:bg-medical-100 hover:text-medical-800"
                )}
              >
                {item.icon && <item.icon className={cn("h-4 w-4 transition-colors", isActive(item.url || "") ? "text-white" : "text-medical-600 group-hover:text-medical-700")} />}
                {!isCollapsed && <span className={cn("font-medium text-sm", isActive(item.url || "") ? "text-white" : "text-medical-600")}>{item.title}</span>}
              </NavLink>
            ) : (
              <button
                onClick={() => handleNavClick(undefined, item.onClick)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
                  "text-medical-700 hover:bg-medical-100 hover:text-medical-800"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 text-medical-600" />}
                {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
              </button>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className={cn("border-r border-medical-200 bg-white shadow-sm transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <SidebarContent className="py-4 bg-white">
        {/* Logo/Brand Section */}
        <div className={cn("px-4 pb-4 mb-4 border-b border-medical-100", isCollapsed && "px-2")}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-medical-600 rounded-lg flex items-center justify-center"></div>
              <div>
                <h2 className="font-bold text-medical-900 text-lg leading-none">Resurvey</h2>
                <p className="text-xs text-medical-600 mt-0.5"></p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-medical-600 rounded-lg flex items-center justify-center mx-auto">
              <Activity className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Navigation Groups (driven by menuConfig) */}
        <div>
          {menuConfig.filter(g => g.visible ? g.visible() : true).map(group => (
            <SidebarGroup key={group.key}>
              {group.collapsible === false ? (
                <>
                  <SidebarGroupLabel className={cn("px-3 py-2 text-xs font-semibold tracking-wider uppercase", "text-medical-600")}>
                    {!isCollapsed ? group.title : group.title.charAt(0)}
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="mt-2">
                    {renderMenuItems(group.items)}
                  </SidebarGroupContent>
                </>
              ) : (
                <Collapsible open={!!openGroups[group.key]} onOpenChange={() => toggleGroup(group.key)}>
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-xs font-semibold tracking-wider uppercase cursor-pointer transition-colors",
                      "text-medical-600 hover:text-medical-800",
                      !isCollapsed && "hover:bg-medical-50 rounded-md"
                    )}>
                      <span>{!isCollapsed ? group.title : group.title.charAt(0)}</span>
                      {!isCollapsed && (
                        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", openGroups[group.key] ? "rotate-180" : "")} />
                      )}
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-2">
                      {renderMenuItems(group.items)}
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </SidebarGroup>
          ))}

        </div>
      </SidebarContent>
    </Sidebar>
  );
}
