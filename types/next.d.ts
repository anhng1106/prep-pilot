declare module "nodemailer";

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      _id?: string;
      id?: string;
    };
  }
}
