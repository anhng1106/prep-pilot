import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";
import { IUser } from "./backend/models/user.model";
import { isUserAdmin, isUserSubscribed } from "./helpers/auth";

export default withAuth(function proxy(req) {
  const url = req?.nextUrl?.pathname;
  const user = req?.nextauth?.token?.user as IUser | undefined;

  const isSubscribed = user ? isUserSubscribed(user) : false;

  const isAdminUser = user ? isUserAdmin(user) : false;

  if (url?.startsWith("/app") && !isSubscribed && !isAdminUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url?.startsWith("/admin") && !isAdminUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url?.startsWith("/api/admin") && !isAdminUser) {
    return new NextResponse(
      JSON.stringify({
        message: "You are not authorized to access this resource.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/subscribe",
    "/unsubscribe",
    "/api/interviews/:path*",
    "/api/admin/:path*",
    "/api/dashboard/:path*",
    "/api/invoices/:path*",
  ],
};
