import Dashboard from "@/components/dashboard/Dashboard";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getDashboardStats(searchParams: string) {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const queryStr = urlParams.toString();

    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/dashboard/stats?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching data");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch data");
  }
}

const DashboardPage = async ({ searchParams }: { searchParams: string }) => {
  const searchParamsValue = await searchParams;

  const data = await getDashboardStats(searchParamsValue);
  return <Dashboard data={data?.data} />;
};

export default DashboardPage;
