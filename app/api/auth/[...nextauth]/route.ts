import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
    accessToken?: string;
    twitterToken?: string;
    twitterRefreshToken?: string;
  }

  interface JWT {
    sub?: string;
    twitterToken?: string;
    twitterRefreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            console.error('Login error response:', data);
            throw new Error(data.message || 'Authentication failed');
          }

          return {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.token,
          };
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "twitter") {
        console.log('Twitter OAuth callback received:', {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          tokenType: account.token_type,
        });
        
        return {
          ...token,
          twitterToken: account.access_token,
          twitterRefreshToken: account.refresh_token,
        };
      }

      return token;
    },
    async session({ session, token }) {
      console.log('Creating session from token:', {
        hasTwitterToken: !!token.twitterToken,
        hasTwitterRefreshToken: !!token.twitterRefreshToken,
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
        },
        twitterToken: token.twitterToken,
        twitterRefreshToken: token.twitterRefreshToken,
      };
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };