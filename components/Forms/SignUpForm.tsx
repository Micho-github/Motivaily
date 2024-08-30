"use client";
import React from "react";
import { Button } from "../ui/button";
import { FcGoogle as ChromeIcon } from "react-icons/fc";
import { IoLogoGithub as GithubIcon } from "react-icons/io";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import Chance from "chance";
import { useFormik } from "formik";
import SignupSchema from "../Schemas/SignupSchema";
import { ClipLoader } from "react-spinners";

interface Values {
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [SubmitLoading, SetSubmitLoading] = React.useState(false);
  const [FormResponse, SetFormResponse] = React.useState("");
  const router = useRouter();

  const signUp = async (values: Values) => {
    SetSubmitLoading(true);
    const origin = window.location.origin;
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: GenerateUsername(),
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      SetSubmitLoading(false);

      if (error) {
        console.error("Sign-up error:", error);

        // Check if the error is specifically related to an existing email
        if (error.message.includes("already registered")) {
          SetFormResponse(
            "This email is already registered. Please try logging in."
          );
        } else {
          SetFormResponse(error.message); // Display other error messages
        }

        return;
      }

      router.push("/signup?message=Check email to continue sign in process");
    } catch (err) {
      console.error("Unexpected error:", err);
      SetFormResponse("An unexpected error occurred. Please try again.");
      SetSubmitLoading(false);
    }
  };
  const GenerateUsername = () => {
    const chance = new Chance();
    const Name = chance.first() + chance.integer({ min: 1, max: 9999 });
    return Name;
  };

  const HandleEmailChange = (e: any) => {
    formik.setFieldValue("email", e.target.value);
  };

  const HandlePasswordChange = (e: any) => {
    formik.setFieldValue("password", e.target.value);
  };

  const HandleRepeatedPasswordChange = (e: any) => {
    formik.setFieldValue("repeatedPassword", e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatedPassword: "",
      terms: false,
    },
    validationSchema: SignupSchema,
    onSubmit: signUp,
  });

  return (
    <form className="space-y-3 lg:space-y-4" onSubmit={formik.handleSubmit}>
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
          name="email"
          onChange={(e) => HandleEmailChange(e)}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          disabled={SubmitLoading}
          className={`
            transition-all duration-300 focus:ring-2 focus:ring-primary
            ${
              formik.errors.email && formik.touched.email
                ? "border-red-500"
                : formik.touched.email
                ? "border-input"
                : ""
            }`}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          onChange={(e) => HandlePasswordChange(e)}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          disabled={SubmitLoading}
          className={`
            transition-all duration-300 focus:ring-2 focus:ring-primary
            ${
              formik.errors.password && formik.touched.password
                ? "border-red-500"
                : formik.touched.password
                ? "border-input"
                : ""
            }`}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          name="repeatedPassword"
          onChange={(e) => HandleRepeatedPasswordChange(e)}
          onBlur={formik.handleBlur}
          value={formik.values.repeatedPassword}
          disabled={SubmitLoading}
          className={`
            transition-all duration-300 focus:ring-2 focus:ring-primary
            ${
              formik.errors.repeatedPassword && formik.touched.repeatedPassword
                ? "border-red-500"
                : formik.touched.repeatedPassword
                ? "border-input"
                : ""
            }`}
        />
        {formik.touched.repeatedPassword && formik.errors.repeatedPassword && (
          <div className="text-red-500 text-sm">
            {formik.errors.repeatedPassword}
          </div>
        )}
      </div>
      {FormResponse && (
        <div className="text-red-500 text-center">{FormResponse}</div>
      )}
      <Button
        disabled={SubmitLoading}
        type="submit"
        className="w-full  bg-secondary text-white hover:bg-secondary-hover focus:ring-green-600"
      >
        {SubmitLoading ? <ClipLoader color="white" size={20} /> : "Sign up"}
      </Button>
    </form>
  );
}

{
  /* <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
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
      </form> */
}
