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
import { title } from "process";
import Constants from "@/config/Constants";

const authItems = [
  { title: "Login", url: "/login", icon: LogIn },
  { title: "Sign Up", url: "/signup", icon: UserPlus },
];

const mainItems = [
  { title: "Survey Form", url: "/survey-form", icon: FileTextIcon },
];

const analyticsItems = [
  { title: "Survey Reports", url: "/survey-reports", icon: BarChart3 },
  // { title: "Analytics", url: "/analytics", icon: Activity },
];

const coItems = [
  { title: "CO Dashboard", url: "/co-dashboard", icon: Home },
  { title: "Survey Reports", url: "/co-survey-reports", icon: FileText },
  { title: "Mutation", url: "/co-mutation", icon: FileText}
];

const lmItems = [
  { title: "LM Dashboard", url: "/lm-dashboard", icon: Home },
  // { title: "Survey Reports", url: "/co-survey-reports", icon: FileText },
  { title: "Mutation", url: "/lm-mutation", icon: FileText},
  { title: "Mutation Cases", url: "/lm-mutation-cases", icon: FileText},
];

export function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    auth: true,
    main: true,
    analytics: false,
  });
  const navigate = useNavigate();

  const goTo = (url: string) => {
    navigate(url);
  };

  const user = StorageService.getJwtCookie();
  const userData: any = StorageService.getJwtCookieData(user);

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const renderMenuItems = (items: typeof authItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              onClick={() => {
                if (isMobile && !isCollapsed) {
                  toggleSidebar();
                }
              }}
              to={item.url}
              className={
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive(item.url)
                    ? "bg-medical-600 text-white shadow-sm"
                    : "text-medical-700 hover:bg-medical-100 hover:text-medical-800"
                )
              }
            >
              <item.icon className={cn(
                "h-4 w-4 transition-colors",
                isActive(item.url) ? "text-white" : "text-medical-600 group-hover:text-medical-700"
              )} />
              {!isCollapsed && (
                <span className={cn("font-medium text-sm", isActive(item.url) ? "text-white " : "text-medical-600")}>{item.title}</span>
              )}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  const renderCollapsibleGroup = (
    title: string,
    items: typeof authItems,
    groupKey: string,
    defaultOpen = true
  ) => (
    <Collapsible
      open={openGroups[groupKey]}
      onOpenChange={() => toggleGroup(groupKey)}
    >
      <CollapsibleTrigger asChild>
        <SidebarGroupLabel className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-xs font-semibold tracking-wider uppercase cursor-pointer transition-colors",
          "text-medical-600 hover:text-medical-800",
          !isCollapsed && "hover:bg-medical-50 rounded-md"
        )}>
          <span>{!isCollapsed ? title : title.charAt(0)}</span>
          {!isCollapsed && (
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openGroups[groupKey] ? "rotate-180" : ""
            )} />
          )}
        </SidebarGroupLabel>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarGroupContent className="mt-2">
          {renderMenuItems(items)}
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  );

  const logout = async () => {
    StorageService.jwtRemove();
    if(userData.usertype == '4' || userData.usertype == '3') {
      window.location.href = Constants.SINGLESIGN_URL;
    }
    else {
      goTo('/login');
    }
  };

  return (
    <Sidebar className={cn(
      "border-r border-medical-200 bg-white shadow-sm transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent className="py-4 bg-white">
        {/* Logo/Brand Section */}
        <div className={cn(
          "px-4 pb-4 mb-4 border-b border-medical-100",
          isCollapsed && "px-2"
        )}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-medical-600 rounded-lg flex items-center justify-center">
                {/* <Activity className="h-4 w-4 text-white" /> */}
              </div>
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

        {/* Navigation Groups */}
        <div className="">
          {(userData.usertype == '1' || userData.usertype == '11') && <SidebarGroup>
            {renderCollapsibleGroup("Survey", mainItems, "main")}
          </SidebarGroup>}

          {(userData.usertype == '1' || userData.usertype == '11') && <SidebarGroup>
            {renderCollapsibleGroup("Reports", analyticsItems, "analytics")}
          </SidebarGroup>}
          {userData.usertype == '4' && <SidebarGroup>
            {renderCollapsibleGroup("CO Panel", coItems, "co")}
          </SidebarGroup>}
          {userData.usertype == '3' && <SidebarGroup>
            {renderCollapsibleGroup("LM Panel", lmItems, "lm")}
          </SidebarGroup>}

          {/* Settings Section */}
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              "px-3 py-2 text-xs font-semibold tracking-wider uppercase",
              "text-medical-600"
            )}>
              {!isCollapsed ? "System" : "S"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
                      "text-medical-700 hover:bg-medical-100 hover:text-medical-800"
                    )}>
                      <Settings className="h-4 w-4 text-medical-600" />
                      {!isCollapsed && (
                        <ConfirmDialog
                          trigger={<span className="font-medium text-sm">Sign Out</span>}
                          title="Logout"
                          description="Are you sure you want to logout of the current session?"
                          confirmText="Yes"
                          cancelText="No"
                          onConfirm={logout}
                        />
                        // <span className="font-medium text-sm" onClick={logout}>Sign Out</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}