"use client";

import React from "react";
import { Button, Input, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Logo } from "@/config/Logo";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { toast } from "react-hot-toast";
import { forgotPassword } from "@/actions/auth.action";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const res = await forgotPassword(data.email);

    if (res?.error) {
      return toast.error(res?.error?.message || "Password reset failed");
    }

    if (res?.emailSent) {
      toast.success("Password reset email sent! Please check your inbox.");
      router.push("/login");
    }
  });

  return (
    <div
      suppressHydrationWarning
      className="flex h-full w-full items-center justify-center"
    >
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Forgot Password</p>
          <p className="text-small text-default-500">
            Enter your email to reset your password
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            classNames={{
              base: "-mb-[2px]",
              inputWrapper:
                "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
            }}
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            endContent={<Icon icon="akar-icons:arrow-right" />}
            isDisabled={loading}
            isLoading={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
