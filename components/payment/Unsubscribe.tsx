"use client";

import React, { useState } from "react";

import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Logo } from "@/config/Logo";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IUser } from "@/backend/models/user.model";
import { cancelUserSubscription } from "@/actions/payment.action";
import toast from "react-hot-toast";

const Unsubscribe = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data } = useSession();
  const user = data?.user as IUser | undefined;

  const handleUnsubscribe = async () => {
    setLoading(true);

    if (!user) {
      toast.error("User not found.");
      setLoading(false);
      return;
    }

    const res = await cancelUserSubscription(user.email!);

    setLoading(false);

    if (res?.error) {
      toast.error(res?.message ?? "Unsubscribe failed.");
      return;
    }

    if (res?.status) {
      toast.success("You have successfully unsubscribed.");
      router.push("/");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Unsubscribe</p>
          <p className="text-small text-default-500">
            Unsubscribe from your current plan
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <RadioGroup isDisabled label="Your Plan" defaultValue={"9.99"}>
            <Radio value="9.99">$9.99 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Email"
            variant="bordered"
            value={user?.email}
            isDisabled
          />

          <Button
            className="w-full"
            color="danger"
            type="submit"
            startContent={<Icon icon="solar:card-recive-bold" fontSize={19} />}
            onPress={handleUnsubscribe}
            isDisabled={loading}
            isLoading={loading}
          >
            {loading ? "Processing..." : "Unsubscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
