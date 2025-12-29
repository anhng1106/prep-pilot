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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview.model";
import { Key } from "@react-types/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deleteInterview } from "@/actions/interview.action";

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
  };
};

export default function ListInterview({ data }: ListInterviewProps) {
  const { interviews } = data;

  const router = useRouter();

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview] as string;

      const handleDelete = async () => {
        const confirmed = await new Promise<boolean>((resolve) => {
          toast.custom(
            (t) => (
              <div
                className="bg-white dark:bg-neutral-900 rounded-md shadow p-3 w-[400px] flex flex-col items-center justify-center text-center"
                style={{
                  transform: "translateY(35vh)",
                }}
              >
                <p className="text-xl font-semibold">
                  Delete interview {interview?.topic}?
                </p>
                <p className="text-base text-default-500 mt-1">
                  This action cannot be undone.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-3 py-1 rounded border border-default-200 text-base"
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-danger text-white text-base"
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(true);
                    }}
                  >
                    Delete
                  </button>
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
          router.refresh();
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
              <p className="text-bold text-sm capitalize">0/10</p>
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
          );
        default:
          return cellValue;
      }
    },
    [router]
  );

  return (
    <div className="my-4">
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
    </div>
  );
}
