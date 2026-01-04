import ListInterview from "@/components/interview/ListInterview";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

async function getInterviews(searchParams: string) {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const queryStr = urlParams.toString();

    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/interviews?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching interviews");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch interviews");
  }
}

const InterviewPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsValue = await searchParams;

  const data = await getInterviews(searchParamsValue);
  return <ListInterview data={data} />;
};

export default InterviewPage;
