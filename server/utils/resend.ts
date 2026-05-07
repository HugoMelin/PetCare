import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_MAX_REQUESTS_PER_SECOND = 5;
const RESEND_MIN_DELAY_MS = Math.ceil(1000 / RESEND_MAX_REQUESTS_PER_SECOND);

let resendQueue: Promise<void> = Promise.resolve();
let nextSendAt = 0;

const wait = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const waitForRateLimitSlot = async () => {
  const now = Date.now();
  const delayMs = Math.max(0, nextSendAt - now);

  nextSendAt = Math.max(now, nextSendAt) + RESEND_MIN_DELAY_MS;

  if (delayMs > 0) {
    await wait(delayMs);
  }
};

const enqueueResendEmail = async <T>(send: () => Promise<T>) => {
  const sendAfterPrevious = resendQueue.then(async () => {
    await waitForRateLimitSlot();
    return send();
  });

  resendQueue = sendAfterPrevious.then(
    () => undefined,
    () => undefined,
  );

  return sendAfterPrevious;
};

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
) => {
  return await enqueueResendEmail(() =>
    resend.emails.send({
      from,
      to,
      subject,
      html,
    }),
  );
};
