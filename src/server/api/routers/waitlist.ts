import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const waitlistRouter = createTRPCRouter({
  addToWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existingEmail = await ctx.db.waitlist.findUnique({
        where: { email: input.email },
      });

      if (existingEmail) {
        throw new Error("Email already registered");
      }

      // Create new waitlist entry
      return ctx.db.waitlist.create({
        data: {
          email: input.email,
        },
      });
    }),
});
