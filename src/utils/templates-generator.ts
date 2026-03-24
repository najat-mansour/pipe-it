import fs from "fs";

export function generateForgetPasswordHtmlTemplate(
  newPassword: string,
): string {
  const htmlTemplate = fs.readFileSync(
    "src/assets/forget-password-email.html",
    {
      encoding: "utf-8",
    },
  );
  return htmlTemplate.replace("{{newPassword}}", newPassword);
}
