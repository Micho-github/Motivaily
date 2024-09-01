"use client"
import Image from "next/image";
import logo from "@/public/images/logo-no-background.png";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterPoster from "@/components/posters/RegisterPoster";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const router =useRouter();
  const supabase = createClient();
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/");
      }
    };
    checkUser();
  }, [supabase, router]);


  return (
    <div className="text-foreground w-full min-h-screen ">
      <div className="grid  w-full h-screen lg:grid-cols-[1fr_3fr] ">
        <div
          className={`flex bg-card items-center justify-center p-6 transition-all duration-500`}
        >
          <div className="relative  mx-auto w-full max-w-md space-y-6">
          <Link href="/">
                <Button className="absolute flex items-center bg-secondary hover:bg-secondary-hover text-white gap-2 top-0 left-0">
                  <AiFillHome />
                </Button>
              </Link>
            <div className=" space-y-2 text-center">

              <Image
                src={logo}
                alt="logo"
                className="mx-auto block w-[15rem] mb-10"
              />
              <h1 className="text-3xl font-bold ">Login</h1>
              <p className="text-muted-foreground">
                Don't have an account?&nbsp;
                <Link href="/signup">
                  <button
                    type="button"
                    className="font-medium underline underline-offset-4 text-primary transition-colors duration-300 hover:text-secondary"
                  >
                    SignUp
                  </button>
                </Link>
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
        <RegisterPoster />
      </div>
    </div>
  );
}
