import { getInterview } from "@/backend/controllers/interview.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await getInterview(request);

  const { interviews } = res;

  return NextResponse.json({ interviews });
}
