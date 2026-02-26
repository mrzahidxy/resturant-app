import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { logger, serializeError } from "./logger";

const authLogger = logger.child({ scope: "auth" });

declare module "next-auth" {
  interface Session {
    user: User & {
      isAdmin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  logger: {
    error(code, metadata) {
      authLogger.error("nextauth.error", { code, metadata });
    },
    warn(code) {
      authLogger.warn("nextauth.warn", { code });
    },
    debug(code, metadata) {
      authLogger.debug("nextauth.debug", { code, metadata });
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    async signIn(message) {
      authLogger.info("auth.event.sign_in", {
        userId: message.user.id,
        email: message.user.email,
        provider: message.account?.provider ?? null,
        isNewUser: message.isNewUser ?? false,
      });
    },
    async signOut(message) {
      authLogger.info("auth.event.sign_out", {
        session: message.session
          ? {
              userId: (message.session.user as any)?.id ?? null,
              email: message.session.user?.email ?? null,
            }
          : null,
        tokenEmail: message.token?.email ?? null,
      });
    },
  },

  callbacks: {
    async session({ token, session }) {
      if (token.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin;
      }
      authLogger.debug("auth.callback.session", {
        userId: session.user?.id ?? null,
        email: session.user?.email ?? null,
        isAdmin: session.user?.isAdmin ?? null,
      });
      return session;
    },

    async jwt({ token }) {
      if (!token.email) return token;

      authLogger.debug("auth.callback.jwt.lookup.start", {
        email: token.email,
      });

      try {
        const userInDB = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
          select: {
            isAdmin: true,
          },
        });

        token.isAdmin = !!userInDB?.isAdmin;

        authLogger.debug("auth.callback.jwt.lookup.success", {
          email: token.email,
          isAdmin: token.isAdmin,
        });
      } catch (error) {
        authLogger.error("auth.callback.jwt.lookup.failed", {
          email: token.email,
          error: serializeError(error),
        });
        throw error;
      }

      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
