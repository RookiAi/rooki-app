import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const salaryRouter = createTRPCRouter({
  getSalaryByUser: protectedProcedure.query(({ ctx }) => {
    // This would query the database for the user's salary
    // For now, it's just a placeholder implementation
    return ctx.db.salary.findFirst({
      where: { userId: ctx.session.user.id },
    });
  }),
  
  updateSalary: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        amount: z.number().min(0),
        currency: z.string(),
        paymentSchedule: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.salary.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id, // Ensure user owns this salary record
        },
        data: { 
          amount: input.amount,
        },
      });
    }),
    
  createSalary: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(0),
        currency: z.string(),
        paymentSchedule: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.salary.create({
        data: {
          userId: ctx.session.user.id,
          amount: input.amount,
        },
      });
    }),
});
