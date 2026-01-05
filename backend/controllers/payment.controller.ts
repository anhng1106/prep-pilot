import { headers } from "next/headers";
import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import stripe from "../utils/stripe";
import User from "../models/user.model";
import { getCurrentUser } from "../utils/auth";

export const createSubscription = catchAsyncErrors(
  async (email: string, paymentMethodId: string) => {
    await dbConnect();

    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    //create new subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: "price_1SlvUNHMz3menpeIzl6wiuTC" }],
      expand: ["latest_invoice.payment_intent"],
    });

    return { subscription };
  }
);

export const cancelSubscription = catchAsyncErrors(async (email: string) => {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user || !user?.subscription) {
    throw new Error("No active subscription found for this user.");
  }

  const subscription = await stripe.subscriptions.cancel(
    user.subscription.subscriptionId
  );

  return { status: subscription?.status };
});

export const subscriptionWebhook = async (req: Request) => {
  const rawBody = await req.text();

  const headersList = await headers();

  const signature = headersList.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  if (!event) {
    throw new Error("Error, payment event not found!");
  }

  await dbConnect();

  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object as any;
      const email = invoice.customer_email;
      const subscriptionId = invoice.parent?.subscription_details?.subscription;

      if (!subscriptionId) {
        console.error("Subscription ID not found in invoice");
        break;
      }

      const customer = await stripe.customers.retrieve(
        invoice.customer as string
      );

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            "subscription.subscriptionId": subscriptionId,
            "subscription.customerId": customer.id,
            "subscription.status": "active",
            "subscription.createdAt": new Date(invoice.created * 1000),
            "subscription.startDate": new Date(
              invoice.lines.data[0].period.start * 1000
            ),
            "subscription.currentPeriodEnd": new Date(
              invoice.lines.data[0].period.end * 1000
            ),
          },
        }
      );
      break;
    case "invoice.payment_failed":
      const paymentFailed = event.data.object as any;
      const nextPaymentAttempt = paymentFailed.next_payment_attempt;

      await User.findOneAndUpdate(
        { "subscription.id": paymentFailed.subscription },
        {
          $set: {
            "subscription.status": "past_due",
            "subscription.nextPaymentAttempt": nextPaymentAttempt
              ? new Date(nextPaymentAttempt * 1000)
              : null,
          },
        }
      );
      break;
    case "customer.subscription.deleted":
      const subscriptionDeleted = event.data.object as any;

      await User.findOneAndUpdate(
        { "subscription.subscriptionId": subscriptionDeleted.id },
        {
          $set: {
            "subscription.status": "cancelled",
            "subscription.nextPaymentAttempt": null,
          },
        }
      );
      break;
    default:
      break;
  }

  return { success: true };
};

export const getInvoices = catchAsyncErrors(async (req: Request) => {
  await dbConnect();

  const sessionUser = await getCurrentUser(req);

  // Query database to get fresh subscription data
  const user = await User.findOne({ email: sessionUser.email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.subscription?.customerId) {
    return {
      invoices: [],
    };
  }

  const invoices = await stripe.invoices.list({
    customer: user.subscription.customerId,
  });

  return {
    invoices: invoices.data,
  };
});
