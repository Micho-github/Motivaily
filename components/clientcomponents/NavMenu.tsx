"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import  Icon  from "@/public/images/logo-no-background.png"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"

const features: { title: string; href: string; description: string }[] = [
  {
    title: "AI Task Management",
    href: "/features/ai-task-management",
    description:
      "Leverage AI to automate and optimize your task management and scheduling.",
  },
  {
    title: "Task Prioritization",
    href: "/features/task-prioritization",
    description:
      "Organize your tasks by priority to focus on what matters most.",
  },
  {
    title: "Due Dates & Reminders",
    href: "/features/due-dates",
    description:
      "Set due dates and reminders to stay on top of your deadlines.",
  },
  {
    title: "Collaborative Tasks",
    href: "/features/collaborative-tasks",
    description: "Manage tasks and collaborate with your team seamlessly.",
  },
  {
    title: "Task Analytics",
    href: "/features/task-analytics",
    description:
      "Analyze your task performance and productivity with detailed reports.",
  },
  {
    title: "Customizable Views",
    href: "/features/customizable-views",
    description:
      "Customize your task views to fit your workflow and preferences.",
  },
]

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Image alt="icon" src={Icon} className="h-full" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      TodoApp
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manage your tasks efficiently with features designed to boost productivity and collaboration.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Learn about the core features and benefits of TodoApp.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                Step-by-step guide to setting up TodoApp in your environment.
              </ListItem>
              <ListItem href="/docs/features" title="Features">
                Explore the various features that TodoApp offers.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {features.map((feature) => (
                <ListItem
                  key={feature.title}
                  title={feature.title}
                  href={feature.href}
                >
                  {feature.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
