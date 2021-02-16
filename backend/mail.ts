import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function createEmailTemplate(text: string) {
  return `
        <div style="
            border: 1px solid black;
            padding: 10px;
            font-family: sans-serif;
            line-height: 2
        ">
            <h2>Hello there!</h2>
            <p>${text}</p>
            <p>Regards, <br /> Adithya </p>
        </div>
    `;
}

export interface Envelope {
  from: string;
  to?: string[] | null;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendResetPasswordLink(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Password Reset Link - SickFits',
    html: createEmailTemplate(`Your password reset link has arrived!
            <a style="color: blue;" href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
            Click here to reset your password
            </a>
        `),
  })) as MailResponse;
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Preview the email message at ${getTestMessageUrl(info)}`);
  }
  console.log(info);
}
