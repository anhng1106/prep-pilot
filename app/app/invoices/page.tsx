import ListInvoices from "@/components/invoices/ListInvoices";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

async function getInvoices() {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/invoices`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching invoices");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch invoices");
  }
}

const InvoicesPage = async () => {
  const data = await getInvoices();
  return <ListInvoices invoices={data?.invoices} />;
};

export default InvoicesPage;
