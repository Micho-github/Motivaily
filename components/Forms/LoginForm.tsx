"use client";
import React from "react";
import { Button } from "../ui/button";
import { FcGoogle as ChromeIcon } from "react-icons/fc";
import { IoLogoGithub as GithubIcon } from "react-icons/io";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useFormik } from "formik";
import LoginSchema from "../Schemas/LoginSchema";
import { ClipLoader } from "react-spinners";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
interface Values {
  email: string;
  password: string;
}
export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [SubmitLoading, SetSubmitLoading] = React.useState(false);
  const [FormResponse, SetFormResponse] = React.useState("");
  const router = useRouter();
  const supabase = createClient();

  const signInWithOAuth = async (provider: any) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
  };

  const signIn = async (values: Values) => {
    SetFormResponse("");
    SetSubmitLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.log(error.message);
      SetFormResponse(error.message);
      SetSubmitLoading(false);
      return router.push("/login?message=Could not authenticate user");
    }

    return router.push("/mainPage");
    // return router.push("/protected");
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const HandleEmailChange = (e: any) => {
    formik.setFieldValue("email", e.target.value);
  };

  const HandlePasswordChange = (e: any) => {
    formik.setFieldValue("password", e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: signIn,
  });

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          variant="outline"
          className="w-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          onClick={() => signInWithOAuth("google")}
        >
          <ChromeIcon className="h-5 w-5 mr-2" />
          Login with Google
        </Button>
        <Button
          variant="outline"
          className="w-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          onClick={() => signInWithOAuth("github")}
        >
          <GithubIcon className="h-5 w-5 mr-2" />
          Login with GitHub
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
      <form className="space-y-3 lg:space-y-4" onSubmit={formik.handleSubmit}>
        <div className="space-y-2">
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
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="inline-block text-sm text-primary transition-colors duration-300 hover:text-secondary"
              prefetch={false}
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={HandlePasswordChange}
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
          <div
            role="button"
            className="absolute right-2 top-7"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <BiSolidHide size={25} />
            ) : (
              <BiSolidShow size={25} />
            )}
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
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
          {SubmitLoading ? <ClipLoader color="white" size={20} /> : "Login"}
        </Button>
      </form>
    </div>
  );
}

{
  /* <Link
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
      </Link> */
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
