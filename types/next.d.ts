declare module "nodemailer";

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      _id?: string;
      id?: string;
      subscription?: {
        subscriptionId?: string;
        customerId?: string;
        createdAt?: string | Date;
        status?: string;
        startDate?: string | Date;
        currentPeriodEnd?: string | Date;
        nextPaymentAttempt?: string | Date;
      };
    };
  }
}
