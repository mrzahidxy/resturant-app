import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & {
      isAdmin: Boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: Boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.isAdmin = !!token?.isAdmin;
      }
      return session;
    },

    async jwt({ token }) {
      const userInDB = await prisma.user.findUnique({
        where: {
          email: token?.email!,
        },
      });

      token.isAdmin = !!userInDB?.isAdmin;

      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
