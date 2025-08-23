import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const voiceRouter = createTRPCRouter({
  getVoiceByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.voice.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
