"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { IUser } from "@/backend/models/user.model";
import CustomPagination from "@/components/layout/pagination/CustomPagination";
import UpdateUser from "./UpdateUser";
import { cancelUserSubscription } from "@/actions/payment.action";
import { isUserSubscribed } from "@/helpers/auth";
import { deleteUser } from "@/actions/auth.action";

export const columns = [
  { name: "USERS", uid: "users" },
  { name: "LOGINS", uid: "logins" },
  { name: "SUBSCRIPTION", uid: "subscription" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  data: {
    users: IUser[];
    filteredCount: number;
    resPerPage: number;
  };
};

const ListUsers = ({ data }: Props) => {
  const { users, resPerPage, filteredCount } = data;

  const router = useRouter();

  const handleUnsubscribe = async (email: string) => {
    if (!email) {
      toast.error("User not found.");
      return;
    }

    const res = await cancelUserSubscription(email!);

    if (res?.error) {
      toast.error(res?.message ?? "Subscription cancellation failed.");
      return;
    }

    if (res?.status) {
      toast.success("Subscription cancelled successfully.");
      router.push("/admin/users");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u._id.toString() === userId);
    const confirmed = await new Promise<boolean>((resolve) => {
      toast.custom(
        (t) => (
          <div
            className="fixed inset-0 z-9999 flex-col-8 flex items-center justify-center px-4"
            style={{ transform: "translateY(35vh)" }}
          >
            {/* subtle overlay */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
              onClick={() => {
                toast.remove(t.id);
                setTimeout(() => resolve(false), 0);
              }}
            />

            {/* card */}
            <div
              className={[
                "relative w-105 max-w-[92vw]",
                "rounded-2xl bg-white dark:bg-neutral-900",
                "border border-default-200/70 dark:border-white/10",
                "shadow-lg shadow-black/10 dark:shadow-black/40",
                "p-5",
                "text-center",
              ].join(" ")}
              style={{ transform: "translateY(0)" }}
            >
              {/* top accent line (minimal) */}
              {/* <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-danger/70" /> */}

              <p className="text-xl font-semibold text-foreground">
                Delete user <span className="text-danger">{user?.name}</span>?
              </p>

              <p className="mt-2 text-sm text-default-500">
                This action cannot be undone.
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  className="min-w-30 rounded-xl px-4 py-2 text-sm font-semibold
                           bg-default-100 hover:bg-default-200/80 text-foreground
                           border border-default-200/60 transition-colors"
                  onClick={() => {
                    toast.remove(t.id);
                    setTimeout(() => resolve(false), 0);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="min-w-30 rounded-xl px-4 py-2 text-sm font-semibold text-white
                           bg-danger hover:bg-danger/90 shadow-md shadow-danger/30 transition"
                  onClick={() => {
                    toast.remove(t.id);
                    setTimeout(() => resolve(true), 0);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    const res = await deleteUser(userId);

    if (res?.error) {
      return toast.error(res?.error?.message || "Failed to delete user");
    }

    if (res?.deleted) {
      toast.success("An user has been deleted successfully!");

      router.push("/admin/users");
    }
  };

  const renderCell = React.useCallback(
    (user: IUser, columnKey: Key) => {
      const cellValue = user[columnKey as keyof IUser] as string;

      switch (columnKey) {
        case "users":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm ">{user?.name}</p>
              <p className="text-bold text-sm text-default-400">
                {user?.email}
              </p>
            </div>
          );
        case "logins":
          return (
            <div className="flex flex-col gap-2">
              {user?.authProvider?.map((provider, index) => (
                <Chip
                  //   classNames={{
                  //     base: "bg-linear-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  //     content: "drop-shadow-xs shadow-black text-white",
                  //   }}
                  variant="flat"
                  key={index}
                  color={"primary"}
                  size="sm"
                >
                  {provider?.provider}
                </Chip>
              ))}
            </div>
          );
        case "subscription":
          return (
            <Chip
              className="capitalize"
              color={
                user?.subscription?.status === "active" ? "success" : "danger"
              }
              size="sm"
              variant="flat"
            >
              {user?.subscription?.status || "none"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <UpdateUser user={user} />
              {isUserSubscribed(user) && (
                <Tooltip
                  color="warning"
                  content="Cancel Subscription"
                  placement="top"
                >
                  <span className="text-lg text-warning cursor-pointer active:opacity-50">
                    <Icon
                      icon="solar:shield-cross-bold"
                      fontSize={22}
                      onClick={() =>
                        user?.email && handleUnsubscribe(user.email)
                      }
                    />
                  </span>
                </Tooltip>
              )}

              <Tooltip
                color="danger"
                content="Delete interview"
                placement="top"
              >
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Icon
                    icon="solar:trash-bin-trash-outline"
                    fontSize={21}
                    onClick={() => handleDeleteUser(user._id.toString())}
                  />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router, handleUnsubscribe, handleDeleteUser]
  );

  const handleStatusChange = (status: string) => {
    const queryParams = new URLSearchParams(window.location.search);

    if (status === "all") {
      queryParams.delete("subscription.status");
    } else {
      queryParams.set("subscription.status", status);
    }

    const path = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(path);
  };

  return (
    <div className="my-4">
      <div className="flex justify-end items-center mb-4">
        <Select
          size="sm"
          className="max-w-xs"
          label="Select a status"
          onChange={(event) => handleStatusChange(event.target.value)}
        >
          <SelectItem key={"all"}>All</SelectItem>
          <SelectItem key={"active"}>Active</SelectItem>
          <SelectItem key={"cancelled"}>Cancelled</SelectItem>
          <SelectItem key={"past_due"}>Past Due</SelectItem>
        </Select>
      </div>
      <Table aria-label="Interview List Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item: IUser) => (
            <TableRow key={item._id.toString()}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center mt-10">
        <CustomPagination
          resPerPage={resPerPage}
          filteredCount={filteredCount}
        />
      </div>
    </div>
  );
};

export default ListUsers;
