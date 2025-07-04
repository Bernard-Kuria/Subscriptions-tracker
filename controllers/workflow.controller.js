import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!Subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);
  // Check if that renewal date is in the past or if the subscription doesn't exist or if the status is not active => to stop the reminders from going.
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    // If the renewal date is in the future and the staus is active (map over all the reminders, then check when to put it to sleep & trigger)
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    //renewal date = 22 feb, reminder date = 15 feb, 17, 20, 21
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );

      if (dayjs().isSame(reminderDate, "day")) {
        await triggerReminder(
          context,
          `${daysBefore} days before reminder`,
          subscription
        );
      }

      await triggerReminder(
        context,
        `Reminder ${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

// Fetching subscriptions
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
