import type { IEmailTemplate, SendEmailParams } from '../email-sender';

export type ResetPasswordEmailContent = {
  code: string;
  email: string;
};

const resetPasswordEmailTemplate: IEmailTemplate<ResetPasswordEmailContent> = {
  subject: 'Reset Password',
  htmlContent(data) {
    return `
      <h1>Reset Password</h1>
      <p>Code: ${data.code}</p>
      <p>Email: ${data.email}</p>
      <p>Reset Password Url: http://localhost:3000/reset-password/${data.email}</p>
    `;
  },
};

export const getSendResetPasswordEmailParams = (
  data: ResetPasswordEmailContent,
): SendEmailParams<ResetPasswordEmailContent> => ({
  from: 'Hh4r4@example.com',
  to: data.email,
  template: resetPasswordEmailTemplate,
  data,
});
