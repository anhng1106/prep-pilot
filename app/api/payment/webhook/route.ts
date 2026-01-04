import { subscriptionWebhook } from "@/backend/controllers/payment.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await subscriptionWebhook(request);

  if (result instanceof Response) {
    return result;
  }

  return NextResponse.json({ success: result.success });
}
