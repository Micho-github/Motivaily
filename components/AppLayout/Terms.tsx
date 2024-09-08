"use client"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import motivailylogo from "@/public/images/logo-no-background.png";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { createClient } from "@/utils/supabase/client";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { users } from "@/types";
import { useLayoutEffect } from 'react';

export default function TermsAndConditions({
  userInfo
}: {
  userInfo: users | undefined;
}) {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const supabase = createClient();

  const handleAccept = async () => {
    try {
      setIsAcceptLoading(true);
      const { error } = await supabase
        .from("users")
        .update({ istermsaccepted: true })
        .eq("uid", userInfo?.uid);

      if (error) {
        console.error("Error updating terms acceptance:", error);
      } else {
        console.log("Terms successfully accepted");
        setIsSuccessful(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error handling accept:", error);
    } finally {
      setIsAcceptLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <div className="bg-card flex flex-col space-y-6 items-center justify-center shadow-lg rounded-lg p-8 max-w-lg text-center">
          <Image
            src={motivailylogo}
            alt="Motivaily logo"
            width={200}
            height={200}
            priority
            className="w-auto h-auto"
          />
          <p className="mb-6">
            First, review and accept our terms to continue using Motivaily.
          </p>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-secondary text-white hover:bg-secondary-hover transition duration-300"
            >
              View Terms
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent forceMount className="sm:max-w-[800px] w-full h-[90vh] p-0 flex flex-col">
        <div className="p-6 border-b">
          <DialogTitle>
            <p className="text-2xl font-bold text-center">Terms of Service</p>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Please read these terms carefully before using Motivaily.
          </DialogDescription>
        </div>
        <div
          className="overflow-y-auto p-6 max-w-none space-y-2 text-sm leading-relaxed"
          aria-live="polite"
        >
          <h3 className="mb-4 text-lg font-semibold">1. Introduction</h3>
          <p className="mb-4">
            Welcome to Motivaily! By accessing or using our to-do app, you agree
            to be bound by these terms of service and our privacy policy. If you
            do not agree with these terms, please do not use our app.
          </p>
          <h3 className="mb-4 text-lg font-semibold">2. Eligibility</h3>
          <p className="mb-4">
            Motivaily is intended for users who are at least 13 years old. If
            you are under 13, you may only use our services under the
            supervision of a parent or legal guardian.
          </p>
          <h3 className="mb-4 text-lg font-semibold">3. User Conduct</h3>
          <p className="mb-4">
            You agree to use Motivaily in a lawful and ethical manner. This
            includes, but is not limited to, refraining from activities that are
            illegal, harmful, or infringe on the rights of others. You are
            responsible for the content you add to your to-do lists and goals.
          </p>
          <h3 className="mb-4 text-lg font-semibold">
            4. Intellectual Property
          </h3>
          <p className="mb-4">
            All content and materials provided within Motivaily, including but
            not limited to software, design, and documentation, are the property
            of our company or our licensors. You may not reproduce, distribute,
            or create derivative works from this content without our express
            permission.
          </p>
          <h3 className="mb-4 text-lg font-semibold">
            5. Limitation of Liability
          </h3>
          <p className="mb-4">
            We will not be liable for any indirect, special, or consequential
            damages arising from your use of Motivaily. Our total liability will
            not exceed $100.
          </p>
          <h3 className="mb-4 text-lg font-semibold">6. Termination</h3>
          <p className="mb-4">
            We reserve the right to terminate or suspend your access to
            Motivaily at any time, for any reason, without notice.
          </p>
          <h3 className="mb-4 text-lg font-semibold">7. Governing Law</h3>
          <p className="mb-4">
            These terms of service are governed by the laws of the state of
            Washington, USA.
          </p>
        </div>
        <div className="p-4 border-t flex justify-center gap-5">
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button
            onClick={handleAccept}
            disabled={isAcceptLoading || isSuccessful}
            className="bg-secondary hover:bg-secondary-hover text-white flex items-center justify-center px-5"
            aria-live="assertive"
          >
            {isAcceptLoading ? (
              <ClipLoader color="white" size={25} />
            ) : isSuccessful ? (
              <FaCheckCircle color="white" size={25} />
            ) : (
              "Accept Terms"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
