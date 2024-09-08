"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { users } from "@/types";
import { ArrowLeft, ArrowRight, Check, Pen, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useFormik } from "formik";
import * as yup from "yup";
import { createClient } from "@/utils/supabase/client";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";

const ProfileSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  avatar_url: yup.string().url("Invalid URL").required("Avatar is required"),
});

export default function FirstLogin({
  userInfo,
}: {
  userInfo: users | undefined;
}) {
  const [step, setStep] = useState(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [user, setUser] = useState({
    username: userInfo?.username || "",
    avatar: userInfo?.avatar_url || "",
  });
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const avatarOptions = [
    userInfo?.avatar_url,
    "/placeholder.svg?height=128&width=128&text=2",
    "/placeholder.svg?height=128&width=128&text=3",
    "/placeholder.svg?height=128&width=128&text=4",
    "/placeholder.svg?height=128&width=128&text=5",
    "/placeholder.svg?height=128&width=128&text=6",
  ];

  const handleGallerySelect = (avatar: string) => {
    setUser((prev) => ({ ...prev, avatar }));
    setIsGalleryOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    setIsGalleryOpen(true);
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const supabase = createClient();
  const handleComplete = async (values: {
    username: string;
    avatar_url: string;
    isfirstlogin: boolean;
  }) => {
    console.log("hello");
    try {
      setIsAcceptLoading(true);
      const { data, error } = await supabase
        .from("users")
        .update({
          username: values.username,
          avatar_url: values.avatar_url,
          isfirstlogin: false,
        })
        .eq("uid", userInfo?.uid); // Ensure userInfo is not undefined

      if (error) {
        throw error;
      }
      setIsSuccessful(true);
      console.log("Profile setup complete!", data);
      window.location.reload(); // Correct reload method
      // Redirect or show a success message here
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsAcceptLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: user.username,
      avatar_url: user.avatar, // Match key with handleComplete expectations
      isfirstlogin: true,
    },
    validationSchema: ProfileSchema,
    onSubmit: handleComplete,
  });
  return (
    <form
      className="w-screen flex items-center justify-center min-h-screen"
      onSubmit={formik.handleSubmit}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome Aboard! 🚀
        </h1>
        <Progress value={(step / 3) * 100} className="mb-6" />
        {step === 1 && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Let's start with your name
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">What should we call you?</Label>
                <Input
                  id="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Your name"
                  className="mt-1"
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.username}
                  </div>
                ) : null}
              </div>
              <Button
                disabled={!!formik.errors.username}
                onClick={handleNext}
                className="w-full bg-secondary hover:bg-secondary-hover text-white"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Add your avatar</h2>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <Avatar className="h-32 w-32 cursor-pointer">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      {user.username
                        ? user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "admin"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    onClick={handleAvatarClick}
                    className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pen className="text-white h-8 w-8" />
                  </div>
                </div>
              </div>
              <Input
                ref={fileInputRef}
                id="avatar"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {formik.errors.avatar_url ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.avatar_url}
                </div>
              ) : null}
              <p className="text-sm text-center">
                Click on the avatar to change your profile picture
              </p>
              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-secondary hover:bg-secondary-hover text-white"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Confirm Your Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username
                      ? user.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "admin"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{user.username}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Username</h3>
                <p className="">{user.username}</p>
              </div>
              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={isAcceptLoading || isSuccessful}
                  className="bg-secondary hover:bg-secondary-hover text-white flex items-center justify-center px-5"
                  aria-live="assertive"
                >
                  {isAcceptLoading ? (
                    <ClipLoader color="white" size={25} />
                  ) : isSuccessful ? (
                    <FaCheckCircle color="white" size={25} />
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose an avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {avatarOptions.map((avatar, index) => (
              <Avatar
                key={index}
                className="h-20 w-20 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => handleGallerySelect(avatar)}
              >
                <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
              </Avatar>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload custom
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary-hover text-white"
              onClick={() => setIsGalleryOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
