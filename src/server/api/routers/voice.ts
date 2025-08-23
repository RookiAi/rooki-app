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

  updateStorageUrl: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        url: z.string().url(),
        x_handle: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.voice.update({
        where: { id: input.id },
        data: { storage_url: input.url, x_handle: input.x_handle },
      });
    }),
});
