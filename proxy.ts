import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";
import { IUser } from "./backend/models/user.model";

export default withAuth(function proxy(req) {
  const url = req?.nextUrl?.pathname;
  const user = req?.nextauth?.token?.user as IUser | undefined;

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/api/interviews/:path*"],
};
