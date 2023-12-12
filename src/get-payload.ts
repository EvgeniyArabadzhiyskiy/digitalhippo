import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer";
import nodemailerSendgrid from 'nodemailer-sendgrid'

const sendGridAPIKey = process.env.SENDGRID_API_KEY

// https://github.com/payloadcms/payload/blob/main/examples/custom-server/src/getPayload.ts

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// https://resend.com/docs/send-with-nodemailer-smtp
// const transporter = nodemailer.createTransport({
//   host: "smtp.resend.com",
//   secure: true,
//   port: 465,
//   auth: {
//     user: "resend",
//     pass: process.env.RESEND_API_KEY,
//   },
// });

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY || ''
  })
);

let cashed = (global as any).payload;

if (!cashed) {
  (global as any).payload = {
    client: null,
    promise: null,
  };

  cashed = (global as any).payload;
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing");
  }

  if (cashed.client) {
    return cashed.client;
  }

  if (!cashed.promise) {
    cashed.promise = payload.init({
      // ...(sendGridAPIKey
      //   ? {
      //       email: {
      //         transportOptions: nodemailerSendgrid({
      //           apiKey: sendGridAPIKey,
      //         }),
      //         fromName: 'DigitalHippo',
      //         fromAddress: 'djon4292@gmail.com',
      //       },
      //     }
      //   : {}),

      // https://payloadcms.com/docs/email/overview#use-a-custom-nodemailer-transport
      email: {
        fromName: "Admin Digital Hippo",
        fromAddress: "djon4292@gmail.com",
        transport: transporter,
      },

      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...initOptions,
    });
  }

  try {
    cashed.client = await cashed.promise;
  } catch (error: unknown) {
    cashed.promise = null;
    throw error;
  }

  return cashed.client;
};


// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function sendVerification(email, token) {
//   const msg = {
//     to: email,
//     from: "djon4292@gmail.com",
//     subject: "VERIFYCATION",
//     text: `http://localhost:8080/api/auth/verify/${token}`,
//     html: `<a href="http://localhost:8080/api/auth/verify/${token}" >VERIFYCATION CODE</a>`,
//   };

//   try {
//     await sgMail.send(msg);
//   } catch (error) {
//     throw new Error("Error in sgMail");
//   }
// }