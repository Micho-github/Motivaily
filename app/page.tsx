"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ArrowRight, PlayIcon } from "lucide-react";
import DemoTasks from "@/components/clientcomponents/DemoTasks";
import logoicon from "@/public/images/motivaily-favicon-color.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/buttons/ThemeToggle";
import LandingHeader from "@/components/clientcomponents/LandingHeader";
import RatingsCarousel from "@/components/clientcomponents/RatingsCarousel";
import { useRouter } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import PricingSection from "@/components/clientcomponents/PricingSection";
import { NavMenu } from "@/components/clientcomponents/NavMenu";
import TaskDemo from "@/components/clientcomponents/TaskDemo";
import { createClient } from "@/utils/supabase/client";

export default function Index() {
  const router = useRouter();
  const supabase = createClient();
  const [isDemoVisible, setIsDemoVisible] = React.useState(true);
  const [User, SetUser] = React.useState<boolean>(false);

  const handleLink = async (path: string) => {
    setIsDemoVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(path, undefined);
  };

  React.useEffect(() => {
    setIsDemoVisible(true);
  }, []);

  React.useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        SetUser(true);
      }
    };
    checkUser();
  }, [supabase, router]);

  return (
    <div className="scroll-smooth w-auto flex flex-col min-h-[100dvh]">
      <LandingHeader>
        <Link className="flex items-center justify-center" href="#">
          <Image src={logoicon} width={50} alt="logo" />
          <span className="ml-2 text-lg font-bold">Motivaily</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6 hidden md:flex ">
          <NavMenu />
          <ThemeToggle />
        </nav>
      </LandingHeader>
      <main className="flex-1 ">
        {/*Overview */}
        <section className="w-full py-12 ">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn Your Goals into Daily Wins
                  </h1>
                  <p className="max-w-[600px] text-primary md:text-xl">
                    Effortlessly organize, prioritize, and accomplish your
                    tasks. Experience the power of intelligent task management.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {User ? (
                    <Button
                      size="lg"
                      className="gap-2 bg-secondary hover:bg-secondary-hover text-white"
                      onClick={() => handleLink("/protected")}
                    >
                      Start App <PlayIcon size={18} />
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="bg-secondary hover:bg-secondary-hover text-white"
                        onClick={() => handleLink("/login")}
                      >
                        Start for Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline">
                        Live Demo
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <DemoTasks isDemoVisible={isDemoVisible} />
            </div>
          </div>
        </section>
        <Separator className=" bg-muted" />
        {/*Features */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <div className="mb-12 inline-block border-2 border-muted rounded-lg  px-3 py-1 text-sm">
                🎯 Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Powerful tools to boost your productivity 🚀
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our todo app offers a range of features to help you stay
                organized and on top of your tasks, including task management,
                calendar integration, collaboration tools, and even AI-powered
                task suggestions! 🤖
              </p>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center justify-center lg:space-y-0">
              <div className="w-full">
                <TaskDemo />
              </div>
              <div className="flex flex-col space-y-8 lg:w-full">
                <ul className="space-y-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">📝 Task Management</h3>
                      <p className="text-muted-foreground">
                        Create, organize, and prioritize your tasks with ease.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        📅 Calendar Integration
                      </h3>
                      <p className="text-muted-foreground">
                        Sync your tasks with your calendar to stay on top of
                        deadlines.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        👥 Collaboration Tools
                      </h3>
                      <p className="text-muted-foreground">
                        Invite team members, assign tasks, and track progress
                        together.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        🤖 AI Task Suggestions
                      </h3>
                      <p className="text-muted-foreground">
                        Get smart recommendations on what to work on next based
                        on your habits and deadlines.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <PricingSection />
        {/* Rating section */}
        <section>
          <Card className="w-full border-none shadow-none bg-inherit py-12">
            <div className="text-center container px-4 md:px-6">
              <div className="mb-12 inline-block border-2 border-muted rounded-lg px-3 py-1 text-sm">
                ⭐ Ratings
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                What Our Users Say
              </h2>
              <RatingsCarousel />
            </div>
          </Card>
        </section>
        {/*Q&A section*/}
        <section>
          <Card className="w-full py-12 md:py-24 lg:py-32 bg-inherit border-none">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="w-full max-w-3xl mx-auto"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is Motivaily free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, Motivaily offers a free tier with essential features.
                    We also have premium plans for advanced functionality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Can I collaborate with my team?
                  </AccordionTrigger>
                  <AccordionContent>
                    Motivaily supports team collaboration, allowing you to share
                    tasks and projects with your colleagues.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    We take data security seriously. All your information is
                    encrypted and stored securely on our servers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>
        </section>
        {/*Footer section*/}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Boost Your Productivity?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of satisfied users and start organizing your
                  life with Motivailytoday.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  14-day free trial, no credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Motivaily. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Cookie Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

{
  /* <div className="flex-1 w-full flex flex-col gap-20 items-center">
<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
  <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
    <DeployButton />
    {isSupabaseConnected && <AuthButton />}
  </div>
</nav>

<div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
  <Header />
  <main className="flex-1 flex flex-col gap-6">
    <h2 className="font-bold text-4xl mb-4">Next steps</h2>
    {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
  </main>
</div>

<footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
  <p>
    Powered by{" "}
    <a
      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
      target="_blank"
      className="font-bold hover:underline"
      rel="noreferrer"
    >
      Supabase
    </a>
  </p>
</footer>
</div> */
}
