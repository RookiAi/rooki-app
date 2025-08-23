import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      twitterId?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        // Set the user ID to the database ID (cuid)
        session.user.id = user.id;
        
        // Try to get the Twitter account for this user
        try {
          const account = await db.account.findFirst({
            where: {
              userId: user.id,
              provider: "twitter",
            },
            select: {
              providerAccountId: true,
            },
          });

          if (account) {
            session.user.twitterId = account.providerAccountId;
          }
        } catch (error) {
          console.error("Error fetching Twitter account:", error);
        }
      }
      return session;
    },
  },
  providers: [
    TwitterProvider({
      clientId: env.AUTH_TWITTER_CLIENT,
      clientSecret: env.AUTH_TWITTER_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;
