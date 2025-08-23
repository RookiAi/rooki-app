import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const voiceRouter = createTRPCRouter({
  getVoiceByUserId: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    try {
      const voices = await ctx.db.voice.findMany({
        where: {
          userId: userId,
        },
      });

      return voices;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch voices",
        cause: error,
      });
    }
  }),
});
