import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Box,
  Layers,
  Settings,
  FileEdit,
  GitBranch,
  Shield,
  Database,
  History,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Assets", icon: Box, path: "/assets" },
  { label: "Asset Types", icon: Layers, path: "/asset-types" },
  {
    label: "Studio",
    icon: Settings,
    children: [
      { label: "Entity Designer", path: "/studio/entities", icon: Database },
      { label: "Form Builder", path: "/studio/forms", icon: FileEdit },
      { label: "Rules", path: "/studio/rules", icon: GitBranch },
      { label: "Permissions", path: "/studio/permissions", icon: Shield },
    ],
  },
  { label: "Data Sources", icon: Database, path: "/data-sources" },
  { label: "Audit & Versions", icon: History, path: "/audit" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Studio"]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isGroupActive = (children?: NavItem["children"]) =>
    children?.some((child) => location.pathname === child.path);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Box className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground">AssetFlow</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            const isExpanded = expandedGroups.includes(item.label);
            const groupActive = isGroupActive(item.children);

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    "w-full sidebar-item",
                    groupActive && "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            cn(
                              "sidebar-item pl-6",
                              isActive && "active"
                            )
                          }
                        >
                          <child.icon className="w-4 h-4 shrink-0" />
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                cn("sidebar-item", isActive && "active")
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </motion.aside>
  );
};
