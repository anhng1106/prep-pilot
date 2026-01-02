import Interview from "@/components/interview/Interview";
import ResultDetails from "@/components/result/ResultDetails";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

async function getInterview(id: string) {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/interviews/${id}`,
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

const ResultDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const data = await getInterview(id);
  console.log("Interview Data:", data);

  if (!data?.interview) {
    throw new Error("This interview not found.");
  }

  return <ResultDetails interview={data?.interview} />;
};

export default ResultDetailsPage;
