import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/config/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Define custom error classes
class InvalidCredentialsError extends CredentialsSignin {
  code = "InvalidCredentials";
}

class UserNotFoundError extends CredentialsSignin {
  code = "UserNotFound";
}

class MissingCredentialsError extends CredentialsSignin {
  code = "MissingCredentials";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EmailNotVerified";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new MissingCredentialsError();
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new UserNotFoundError();
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string,
        );

        if (!isPasswordValid) {
          throw new InvalidCredentialsError();
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});
