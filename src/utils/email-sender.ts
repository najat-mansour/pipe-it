import nodemailer, { Transporter } from "nodemailer";
import { apiConfig } from "../config.js";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: apiConfig.emailConfig.address,
    pass: apiConfig.emailConfig.token,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await transporter.sendMail({
    to,
    subject,
    html,
    from: apiConfig.emailConfig.address,
  });
}
