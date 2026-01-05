"use client";

import { getTotalPages, paginate } from "@/helpers/helper";
import {
  Alert,
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { Key, useState } from "react";
import { Stripe } from "stripe";

export const columns = [
  { name: "INVOICE", uid: "invoice" },
  { name: "BILL PAID", uid: "bill_paid" },
  { name: "BILLING DATE", uid: "date" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  invoices: Stripe.Invoice[];
};

const ListInvoices = ({ invoices }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const totalPages = getTotalPages(invoices?.length, invoicesPerPage);

  const currentInvoices = paginate(invoices, currentPage, invoicesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const lastInvoice = invoices[0];

  const renderCell = React.useCallback(
    (invoice: Stripe.Invoice, columnKey: Key) => {
      const cellValue = invoice[columnKey as keyof Stripe.Invoice] as string;

      switch (columnKey) {
        case "invoice":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {invoice?.account_name}
              </p>
              <p className="text-bold text-sm capitalize text-default-400">
                {invoice?.id}
              </p>
            </div>
          );
        case "bill_paid":
          return (
            <Chip
              className="capitalize"
              color="success"
              size="sm"
              variant="flat"
            >
              ${invoice?.amount_paid / 100}
            </Chip>
          );
        case "date":
          return (
            <p className="text-bold text-sm text-default-400">
              {new Date(
                invoice?.lines?.data[0]?.period.end * 1000
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Button
                className="bg-foreground font-medium text-background"
                color="secondary"
                endContent={<Icon icon="solar:download-linear" fontSize={20} />}
                variant="flat"
                as={Link}
                href={invoice?.invoice_pdf || "#"}
                target="_blank"
              >
                Download Invoice
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex justify-center items-center my-40">
        <p>No invoices found.</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="flex items-center justify-center w-full mb-5">
        <Alert
          title="Next Billing Information"
          color="warning"
          variant="flat"
          description={`Your next billing of $${
            lastInvoice?.lines?.data[0]?.amount / 100
          } for ${lastInvoice?.account_name} will be on ${new Date(
            lastInvoice?.lines?.data[0]?.period.end * 1000
          ).toLocaleDateString()}.`}
        />
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
        <TableBody items={currentInvoices}>
          {(item: Stripe.Invoice) => (
            <TableRow key={item.id.toString()}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center mt-10">
        <Pagination
          isCompact
          showControls
          showShadow
          initialPage={1}
          total={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListInvoices;
