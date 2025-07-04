import { emailTemplates } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";
import dayjs from "dayjs";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Invalid email type");

  const mailInfo = {
    userName: subscription.user.mail,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYY"),
    planName: subscription.name,
    price: `${subscription.currency}  ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateBody(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log("Error sending email");

    console.log("Email sent: " + info.response);
  });
};
