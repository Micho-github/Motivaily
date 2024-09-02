"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Users,
  Mail,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

export default function AppLeftMenuSideBar() {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="fixed z-10 w-64 h-screen bg-card text-card-foreground border-r p-4">
      <div className="mt-10 mb-10 flex justify-center items-center w-full">
        <Image
          src="/images/logo-no-background.png"
          width={150}
          height={150}
          alt="Motivaily logo"
        />
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => toggleExpand(item.label)}
              >
                <span className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </span>
                {item.subItems &&
                  (expandedItems[item.label] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </Button>
              <AnimatePresence>
                {expandedItems[item.label] && item.subItems && (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                        >
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
      </nav>
    </div>
  );
}
