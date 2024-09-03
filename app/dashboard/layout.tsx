"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  LogOut,
  Menu,
  Home,
  Users,
  Settings,
  Bell,
  ChevronRight,
  Mail,
  ChevronDown,
  User,
  CreditCard,
  Languages,
  Palette,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/components/mainPageComponents/ThemeToggle";
import logoicon from "@/public/images/motivaily-favicon-color.png";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { users } from "@/types";
import motivailylogo from "@/public/images/logo-no-background.png";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
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
  const [userInfo, setUserInfo] = useState<users>();
  const [error, setError] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("english");
  const { theme, setTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Implement language change logic here
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    // Implement theme change logic here
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const supabase = createClient();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch the authenticated user's data
        const { data: { user } = {}, error: authError } =
          await supabase.auth.getUser();
        // Handle error or if the user is not authenticated
        if (authError || !user) {
          setError(
            "Error fetching authenticated user or user is not authenticated."
          );
          console.error(authError);
          return;
        }

        // Extract the authenticated user's ID
        const authId = user.id;

        // Fetch user information from the users table where uid matches the authenticated user's ID
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("uid", authId);

        if (error) {
          setError("Error fetching user info.");
          console.error(error);
        } else if (data && data.length > 0) {
          setUserInfo(data[0]); // Assuming data is an array and you need the first item
          setAvatarUrl(data[0]?.avatar_url || "/path/to/fallback-image.png"); // Update avatarUrl here
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      }
    };

    // Call the async function to fetch user info
    fetchUserInfo();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      // Redirect to login page after sign-out
      router.push("/auth/login");
    } catch (error) {
      console.error("Unexpected error during sign-out:", error);
    }
  };

  const handleSettings = () => {
    // Implement settings navigation here
    console.log("Navigating to settings...");
    router.push("/settings");
  };
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div
          className={cn("relative p-4 space-y-3", isExpanded && "space-y-6")}
        >
          <div
            className={cn(
              " flex justify-between items-center",
              isExpanded ? "absolute right-5  " : " relative justify-center"
            )}
          >
            <div />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div>
                <Image
                  alt="logo"
                  src={logoicon}
                  className={cn(isExpanded && "hidden")}
                />
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform hidden",
                    isExpanded && "rotate-180 block"
                  )}
                />
              </div>
            </Button>
          </div>
          <div
            className={cn(
              " w-full items-center flex justify-center",
              isExpanded ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={motivailylogo}
              alt="mainlogo"
              width={200}
              height={200}
              className={cn("hidden", isExpanded && "block")}
            />
          </div>
          <Separator className="bg-muted" />
          <ul
            className={cn(
              " space-y-2",
              !isExpanded && "flex flex-col items-center"
            )}
          >
            {menuItems.map((item) => (
              <li key={item.label}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex justify-between",
                    !isExpanded && "justify-center"
                  )}
                  onClick={() => toggleExpand(item.label)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="ml-2 truncate">{item.label}</span>
                      {item.subItems &&
                        (expandedItems[item.label] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
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
        </div>
      </aside>

      {/* Header */}
      <header className="bg-card text-card-foreground p-4 flex justify-between items-center col-start-2">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        {/* <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button> */}
        <div className="flex items-center space-x-2 relative" ref={menuRef}>
          <Button
            variant="ghost"
            className="relative h-12 w-12 rounded-full p-0 flex items-center justify-center overflow-hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Image
              src={avatarUrl}
              alt="User avatar"
              layout="fill" // Ensures the image fills the parent
              className="rounded-full object-cover" // Ensures the image covers the button fully without distortion
            />
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-56 bg-popover text-popover-foreground rounded-md shadow-md z-50"
              >
                <div className="p-2">
                  <div className="flex flex-col justify-center items-center space-y-1">
                    <div className="w-full flex justify-center items-center">
                      <Image
                        src={avatarUrl}
                        width={100}
                        height={100}
                        alt="User avatar"
                        className="rounded-full"
                      />
                    </div>
                    <p className="text-sm font-medium leading-none">
                      {userInfo?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo?.email}
                    </p>
                  </div>

                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSettings}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription or Billing</span>
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => toggleSection("language")}
                  >
                    <div className="flex items-center">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Language</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  <AnimatePresence>
                    {expandedSection === "language" && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-2"
                      >
                        {["english", "french", "arabic"].map((lang) => (
                          <motion.li
                            key={lang}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start ${
                                language === lang ? "bg-accent" : ""
                              }`}
                              onClick={() => handleLanguageChange(lang)}
                            >
                              {lang === "english"
                                ? "English"
                                : lang === "french"
                                ? "Français"
                                : "العربية"}
                            </Button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => toggleSection("theme")}
                  >
                    <div className="flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Theme</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "theme" ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  <AnimatePresence>
                    {expandedSection === "theme" && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-2"
                      >
                        {["light", "dark", "system"].map((themeOption) => (
                          <motion.li
                            key={themeOption}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start ${
                                theme === themeOption ? "bg-accent" : ""
                              }`}
                              onClick={() => handleThemeChange(themeOption)}
                            >
                              {themeOption.charAt(0).toUpperCase() +
                                themeOption.slice(1)}
                            </Button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  <Separator className="my-2" />
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
