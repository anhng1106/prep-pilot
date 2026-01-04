"use client";

import { IInterview } from "@/backend/models/interview.model";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import Link from "next/link";
import { calculateAverageScore } from "@/helpers/interview";
import { useRouter } from "next/navigation";
import CustomPagination from "../layout/pagination/CustomPagination";

type Props = {
  data: {
    interviews: IInterview[];
    resPerPage: number;
    filteredCount: number;
  };
};

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const ListResults = ({ data }: Props) => {
  const { interviews, resPerPage, filteredCount } = data;

  const router = useRouter();

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview] as string;

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
          return interview?.status === "completed" ? (
            <Button
              className="bg-foreground font-medium text-background hover:bg-foreground/90"
              color="secondary"
              endContent={
                <Icon icon="solar:arrow-right-linear" fontSize={20} />
              }
              variant="flat"
              as={Link}
              href={`/app/results/${interview._id.toString()}`}
            >
              View Results
            </Button>
          ) : (
            <p>Complete the interview to view results</p>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  let queryParams: any;

  const handleStatusChange = (status: string) => {
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
};

export default ListResults;
