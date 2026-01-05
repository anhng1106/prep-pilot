// Script to manually fix customerId for existing subscriptions
// Run: npx ts-node scripts/fix-customer-id.ts

import mongoose from "mongoose";
import User from "../backend/models/user.model";
import stripe from "../backend/utils/stripe";

async function fixCustomerId() {
  // Connect to database
  await mongoose.connect(process.env.MONGODB_URI!);

  // Find users with active subscription but no customerId
  const users = await User.find({
    "subscription.status": "active",
    "subscription.customerId": { $exists: false },
  });

  console.log(`Found ${users.length} users without customerId`);

  for (const user of users) {
    try {
      if (!user.subscription?.subscriptionId) continue;

      // Get subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        user.subscription.subscriptionId
      );

      // Update user with customerId
      await User.findByIdAndUpdate(user._id, {
        $set: {
          "subscription.customerId": subscription.customer as string,
        },
      });

      console.log(`✅ Updated user ${user.email} with customerId: ${subscription.customer}`);
    } catch (error: any) {
      console.error(`❌ Failed to update user ${user.email}:`, error.message);
    }
  }

  console.log("Done!");
  await mongoose.disconnect();
}

fixCustomerId();
