import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        console.log("~~~profile", profile);
        return {
          profile: profile,
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("~~~user", user);
      return true;
    },
    async jwt({ token, account }) {
      // add accessToken to the token
      console.log("~~~jwt", { token, account });
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // pass accessToken to the session
      console.log("~~~session before modification", session, token);
      // if (token?.accessToken) {
      //   session.accessToken = token.accessToken; // Add accessToken to session
      // }
      console.log("~~~session after modification", session);
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};