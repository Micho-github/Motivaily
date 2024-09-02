"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  User,
  LogOut,
  Menu,
  Home,
  Users,
  Settings,
  Bell,
  ChevronRight,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/components/mainPageComponents/ThemeToggle";
import logoicon from '@/public/images/motivaily-favicon-color.png'
import { useRouter } from "next/navigation";

type MenuItem = {
  icon: React.ElementType;
  label: string;
  subItems?: string[];
};

const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    subItems: ["Overview", "Analytics", "Reports"],
  },
  {
    icon: Users,
    label: "Users",
    subItems: ["All Users", "Admins", "Moderators"],
  },
  { icon: Mail, label: "Messages", subItems: ["Inbox", "Sent", "Drafts"] },
  {
    icon: Bell,
    label: "Notifications",
    subItems: ["All", "Mentions", "Replies"],
  },
  {
    icon: Settings,
    label: "Settings",
    subItems: ["Account", "Privacy", "Security"],
  },
];
export default function CompactGridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    // After logout, redirect to login page
    router.push("/login");
  };

  const handleSettings = () => {
    // Implement settings navigation here
    console.log("Navigating to settings...");
    router.push("/settings");
  };

  // const menuItems = [
  //   { icon: Home, label: "Home" },
  //   { icon: Users, label: "Users" },
  //   { icon: Bell, label: "Notifications" },
  //   { icon: Settings, label: "Settings" },
  // ];

  return (
    <div className="w-full min-h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      {/* Compact Sidebar */}
      <aside
        className={cn(
          "bg-card text-card-foreground row-span-full border-r transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 space-y-4">
          <div className={cn("flex justify-between items-center",!isExpanded && "justify-center")}>
            <h1
              className={cn(
                "text-2xl font-bold truncate",
                isExpanded ? "opacity-100" : "opacity-0"
              )}
            >
              Motivaily
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Image alt="logo" src={logoicon}/>
              {/* <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              /> */}
            </Button>
          </div>
          <ul className={cn(" space-y-2", !isExpanded && "flex flex-col items-center")}>
            {menuItems.map((item) => (
              <li key={item.label}>
                <Button
                  variant="ghost"
                  className={cn("w-full flex justify-between", !isExpanded && "justify-center")}
                  onClick={() => toggleExpand(item.label)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="ml-2 truncate">{item.label}</span>
                      {item.subItems && (
                        expandedItems[item.label] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
                <AnimatePresence>
                  {isExpanded && expandedItems[item.label] && item.subItems && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 mt-2 space-y-2"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.li
                          key={subItem}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            {subItem}
                          </Button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Header */}
      <header className="bg-card text-card-foreground p-4 flex justify-between items-center col-start-2">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">John</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  width={32}
                  height={32}
                  alt="Profile"
                  className="rounded-full border-2 border-primary"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 overflow-auto">{children}</main>

      {/* Footer */}
      <footer className="bg-card text-card-foreground p-4 text-center col-span-full">
        © 2023 My App. All rights reserved.
      </footer>
    </div>
  );
}
