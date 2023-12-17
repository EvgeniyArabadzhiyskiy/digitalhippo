import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { authCredentialsValidator } from "../lib/validators/account-credential-validator";
import { publicProcedure, router } from "./trpc";

// import sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
// async function sendVerification(email: string) {
//   const msg = {
//     to: email,
//     from: "djon4292@gmail.com",
//     subject: "APP HIPPO-PO",
//     text: `http://localhost:8080/api/auth/verify`,
//     html: `<a href="http://localhost:8080/api/auth/verify" >VERIFYCATION CODE</a>`,
//   };

//   try {
//     const data = await sgMail.send(msg);
//     console.log("sendVerification  data:", data);
//   } catch (error) {
//     throw new Error("Error in sgMail");
//   }
// }

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(authCredentialsValidator)
    .mutation(async (opts) => {
      const { input } = opts;
      const { email, password } = input;

      const payload = await getPayloadClient();

      //   const {} = await payload.db.findOne('www')

      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });
      console.log("FIND users:", users);

      console.log("LENGTH !== 0:", users.length);
      if (users.length !== 0) {
        throw new TRPCError({ message: "TRPC Error", code: "CONFLICT" });
      }

      await payload.create({
        collection: "users",
        data: {
          email: email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string(), email: z.string() }))
    .query(async ({ input }) => {
      const { token, email } = input;

      const payload = await getPayloadClient();

      const { docs } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
          _verified: {
            equals: true,
          },
        },
      });

      const verifiedUser = docs[0];

      if (!verifiedUser) {
        try {
          const isVerified = await payload.verifyEmail({
            collection: "users",
            token,
          });

          return { verify: true, isVerified };
        } catch (error) {
          console.log("ERRRRRRRRRRRRRORRRRRRRRRR<<<<<<<<>>>>>>>>>");

          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      } else {
        return { success: true, user: verifiedUser };
      }
    }),

  signIn: publicProcedure
    .input(authCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      const payload = await getPayloadClient();

      try {
      const user =  await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });
      

        return { success: true, user };
      } catch (error) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
