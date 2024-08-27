import React from "react";
import { Button } from "../ui/button";
import { FcGoogle as ChromeIcon } from "react-icons/fc";
import { IoLogoGithub as GithubIcon } from "react-icons/io";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Chance from 'chance';

export default function SignUpForm() {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };
  const chance = new Chance();
  let Name = chance.first();
  const randNumber = chance.integer({ min: 1, max: 9999 });
  Name = Name + randNumber;
  console.log(Name);

  return (
    <form className="space-y-3 lg:space-y-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Button
            variant="outline"
            className="w-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          >
            <ChromeIcon className="h-5 w-5 mr-2" />
            Sign up with Google
          </Button>
          <Button
            variant="outline"
            className="w-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          >
            <GithubIcon className="h-5 w-5 mr-2" />
            Sign up with GitHub
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-primary" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button
          type="submit"
          className="w-full  bg-secondary text-white hover:bg-secondary-hover focus:ring-green-600"
        >
          Sign up
        </Button>
    </form>
  );
}

{/* <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link> */}

      {/* <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form> */}