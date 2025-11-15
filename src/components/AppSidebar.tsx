import { Home, Users, FileText, Database, LogIn, UserPlus, Settings, Activity, BarChart3, ChevronDown, FileTextIcon, MapPinCheck } from "lucide-react";
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
import Constants from "@/config/Constants";

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
    if(userData.usertype == '4' || userData.usertype == '3') {
      window.location.href = Constants.SINGLESIGN_URL;
    }
    else {
      goTo('/login');
    }
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
      collapsible: false,
      visible: () => ["1", "11", "14", "2"].includes(userData?.usertype),
      items: [
        { title: "Survey Form", url: "/survey-form", icon: FileTextIcon },
      ],
    },
    // {
    //   key: "co",
    //   title: "CO Panel",
    //   collapsible: true,
    //   visible: () => userData?.usertype === "4",
    //   items: [
    //     { title: "CO Dashboard", url: "/co-dashboard", icon: Home },
    //     // { title: "Survey Reports", url: "/co-survey-reports", icon: FileText },
    //     // { title: "Mutation", url: "/co-mutation", icon: FileText },
    //   ],
    // },
    {
      key: "analytics",
      title: "Reports",
      collapsible: false,
      visible: () => ["1", "11", "14", "2", "9", "4", "3", "6", "7", "8"].includes(userData?.usertype),
      items: [
        { title: "Survey Reports", url: "/reports", icon: BarChart3 },
        { title: "Area Difference Report", url: "/area-difference-report", icon: Activity },
      ],
    },
    
    {
      key: "Maps",
      title: "Maps",
      collapsible: false,
      visible: () => true,
      items: [
        { title: "Village Map View", url: "/village-map", icon: MapPinCheck },
      ],
    },
    {
      key: "mutation",
      title: "Mutation",
      collapsible: false,
      visible: () => ["3"].includes(userData?.usertype),
      items: [
        {
          title: "Mutation",
          url: "/lm-mutation",
          icon: Settings,
          // onClick: logout,
        },
        {
          title: "Mutation Cases",
          url: "/lm-mutation-cases",
          icon: Settings,
          // onClick: logout,
        },
      ],
    },
    {
      key: "comutation",
      title: "Mutation",
      collapsible: false,
      visible: () => ["4"].includes(userData?.usertype),
      items: [
        {
          title: "Mutation Cases",
          url: "/co-mutation",
          icon: Settings,
          // onClick: logout,
        },
      ],
    },
    {
      key: "system",
      title: "System",
      collapsible: false,
      visible: () => true,
      items: [
        {
          title: "Sign Out"+ (userData?.usercode ? ` (${userData.usercode})` : ""),
          icon: Settings,
          onClick: logout,
        },
      ],
    },
    
    // {
    //   key: "mutation",
    //   title: "Mutation",
    //   collapsible: false,
    //   visible: () => ["3"].includes(userData?.usertype),
    //   items: [
    //     {
    //       title: "Mutation Cases",
    //       url: "/lm-mutation-cases",
    //       icon: Settings,
    //       // onClick: logout,
    //     },
    //   ],
    // },
   

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
                  isActive(item.url || "") ? "bg-red-600 text-white shadow-sm" : "text-red-700 hover:bg-red-100 hover:text-red-800"
                )}
              >
                {item.icon && <item.icon className={cn("h-4 w-4 transition-colors", isActive(item.url || "") ? "text-white" : "text-red-600 group-hover:text-red-700")} />}
                {!isCollapsed && <span className={cn("font-medium text-sm", isActive(item.url || "") ? "text-white" : "text-red-600")}>{item.title}</span>}
              </NavLink>
            ) : (
              <button
                onClick={() => handleNavClick(undefined, item.onClick)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
                  "text-red-700 hover:bg-red-100 hover:text-red-800"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 text-red-600" />}
                {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
              </button>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className={cn("border-r border-red-200 bg-white shadow-sm transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <SidebarContent className="py-4 bg-white">
        {/* Logo/Brand Section */}
        <div className={cn("px-4 pb-4 mb-4 border-b border-red-100", isCollapsed && "px-2")}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center"></div>
              <div>
                <h2 className="font-bold text-red-900 text-lg leading-none">Resurvey</h2>
                <p className="text-xs text-red-600 mt-0.5"></p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto">
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
                  <SidebarGroupLabel className={cn("px-3 py-2 text-xs font-semibold tracking-wider uppercase", "text-red-600")}>
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
                      "text-red-600 hover:text-red-800",
                      !isCollapsed && "hover:bg-red-50 rounded-md"
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