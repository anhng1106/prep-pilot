import ListUsers from "@/components/admin/user/ListUsers";
import ListInterview from "@/components/interview/ListInterview";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

async function getUsers(searchParams: string) {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const queryStr = urlParams.toString();

    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/admin/users?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching users");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch users");
  }
}

const UsersPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsValue = await searchParams;

  const data = await getUsers(searchParamsValue);
  return <ListUsers data={data} />;
};

export default UsersPage;
