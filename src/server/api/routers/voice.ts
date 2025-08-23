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
    
  createVoice: protectedProcedure
    .input(
      z.object({
        storage_url: z.string().url(),
        x_handle: z.string(),
        positioning: z.string(),
        tone: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.voice.create({
        data: {
          userId: ctx.session.user.id,
          storage_url: input.storage_url,
          x_handle: input.x_handle,
          positioning: input.positioning,
          tone: input.tone,
        },
      });
    }),
    
  updateVoice: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        positioning: z.string(),
        tone: z.any(),
      }),
    )
    .mutation(({ ctx, input }) => {
      // Serialize tone to JSON if it's not already a string
      const toneData = typeof input.tone === 'string' 
        ? input.tone 
        : JSON.stringify(input.tone);
        
      return ctx.db.voice.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id, // Ensure user owns this voice
        },
        data: { 
          positioning: input.positioning,
          tone: toneData,
        },
      });
    }),
});
