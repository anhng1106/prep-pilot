import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user.model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("No user found with the given email");
        }

        const isPasswordMatch = await user.comparePassword(
          credentials!.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      await dbConnect();

      console.log(profile);

      if (account.provider === "credentials") {
        user.id = user?._id.toString();
      } else {
        //handle social login
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            profilePicture: { url: profile?.image || user?.image },
            authProvider: [
              {
                provider: account?.provider,
                providerId: profile?.id || profile?.sub,
              },
            ],
          });

          await newUser.save();
          user.id = newUser._id.toString();
        } else {
          const existingProvider = existingUser.authProvider?.find(
            (provider: { provider: string }) =>
              provider.provider === account.provider
          );
          if (!existingProvider) {
            if (!existingUser.authProvider) existingUser.authProvider = [];
            existingUser.authProvider.push({
              provider: account.provider,
              providerId: profile?.id || profile?.sub,
            });

            if (!existingUser.profilePicture?.url) {
              existingUser.profilePicture = {
                url: profile?.image || user?.image,
              };
            }
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
        }
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      } else {
        await dbConnect();

        const dbUser = await User.findById(token.user.id);

        if (dbUser) {
          token.user = dbUser;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;

      delete session.user.password;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(options);
export const POST = NextAuth(options);
