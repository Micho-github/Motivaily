import Image from "next/image";
import SignUpForm from "@/components/Forms/SignUpForm";
import RegisterPoster from "@/components/posters/RegisterPoster";
import logo from "@/public/images/logo-no-background.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiFillHome } from "react-icons/ai";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="w-full h-full ">
    <div className="grid w-full h-screen lg:grid-cols-[3fr_1fr] ">
      <RegisterPoster />
      <div
        className={`flex bg-card  items-center justify-center p-6 transition-all duration-500`}
      >
        <div className="relative  mx-auto w-full max-w-md space-y-6">
          <Link href="/">
                <Button className="absolute flex items-center bg-secondary hover:bg-secondary-hover text-white gap-2 top-0 lg:right-0">
                  <AiFillHome />

                </Button>
              </Link>
          <div className="space-y-2 text-center">
            <Image
              src={logo}
              alt="logo"
              className="mx-auto block w-[15rem] mb-10"
            />
            <h1 className="text-3xl font-bold ">Create an account</h1>
            <p className="text-muted-foreground">
              Already have an account?&nbsp;
              <Link href="/login">
              <button
                type="button"
                className="font-medium underline underline-offset-4 text-primary transition-colors duration-300 hover:text-secondary"
              >
                Login
              </button>
              </Link>
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  </div>
);
}