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
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview.model";
import { Key } from "@react-types/shared";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteInterview } from "@/actions/interview.action";
import Link from "next/link";
import { calculateAverageScore } from "@/helpers/interview";
import CustomPagination from "../layout/pagination/CustomPagination";
import { isAdminPath } from "@/helpers/auth";

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const interviews = [];

type ListInterviewProps = {
  data: {
    interviews: IInterview[];
    resPerPage: number;
    filteredCount: number;
  };
};

export default function ListInterview({ data }: ListInterviewProps) {
  const { interviews, resPerPage, filteredCount } = data;

  const router = useRouter();
  const pathname = usePathname();

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview] as string;

      const handleDelete = async () => {
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
                    Delete interview{" "}
                    <span className="text-danger">{interview?.topic}</span>?
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

        const res = await deleteInterview(interview._id.toString());

        if (res?.error) {
          return toast.error(
            res?.error?.message || "Failed to delete interview"
          );
        }

        if (res?.deleted) {
          toast.success("An interview has been deleted successfully!");

          if (isAdminPath(pathname)) {
            router.push("/app/admin/interviews");
          } else {
            router.push("/app/interviews");
          }
        }
      };

      switch (columnKey) {
        case "interview":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{interview?.topic}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {interview?.type}
              </p>
            </div>
          );
        case "result":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {calculateAverageScore(interview.questions)}/10
              </p>
              <p className="text-bold text-sm capitalize text-default-400">
                {interview?.numOfQuestions} Questions
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={interview?.status === "completed" ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <>
              {interview?.answers === 0 &&
              interview?.status !== "completed" &&
              !isAdminPath(pathname) ? (
                <Button
                  className="bg-foreground font-medium text-background w-full hover:bg-foreground/90"
                  color="secondary"
                  endContent={
                    <Icon icon="solar:arrow-right-linear" fontSize={20} />
                  }
                  variant="flat"
                  as={Link}
                  href={`/app/interviews/conduct/${interview._id.toString()}`}
                >
                  Start
                </Button>
              ) : (
                <div className="relative flex items-center justify-center gap-2">
                  {interview?.status !== "completed" &&
                    !isAdminPath(pathname) && (
                      <Tooltip
                        color="danger"
                        content="Continue interview"
                        placement="top"
                      >
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <Icon
                            icon="solar:round-double-alt-arrow-right-bold"
                            fontSize={22}
                            onClick={() =>
                              router.push(
                                `/app/interviews/conduct/${interview._id.toString()}`
                              )
                            }
                          />
                        </span>
                      </Tooltip>
                    )}

                  {interview?.status === "completed" && (
                    <Tooltip content="View Interview Results" placement="top">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Icon
                          icon="solar:eye-broken"
                          fontSize={22}
                          onClick={() =>
                            router.push(
                              `/app/results/${interview._id.toString()}`
                            )
                          }
                        />
                      </span>
                    </Tooltip>
                  )}
                  <div className="relative flex items-center gap-2">
                    <Tooltip
                      color="danger"
                      content="Delete interview"
                      placement="top"
                    >
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <Icon
                          icon="solar:trash-bin-trash-outline"
                          fontSize={21}
                          onClick={handleDelete}
                        />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              )}
            </>
          );
        default:
          return cellValue;
      }
    },
    [router, pathname]
  );

  const handleStatusChange = (status: string) => {
    let queryParams: any;

    queryParams = new URLSearchParams(window.location.search);

    if (queryParams.has("status") && status === "all") {
      queryParams.delete("status");
      const path = `${window.location.pathname}?${queryParams.toString()}`;
      router.push(path);
      return;
    } else if (queryParams.has("status")) {
      queryParams.set("status", status);
    } else {
      queryParams.append("status", status);
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
          <SelectItem key={"pending"}>Pending</SelectItem>
          <SelectItem key={"completed"}>Completed</SelectItem>
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
        <TableBody items={interviews}>
          {(item) => (
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
}
