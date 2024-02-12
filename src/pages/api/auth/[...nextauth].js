import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import DiscordProvider from "next-auth/providers/discord"

export default NextAuth({
  secret: process.env.NEXT_PUBLIC_CHAIN_ID,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.token = token
      return session
    },
    async jwt({ token, user, account = {}, profile, isNewUser }) {
      if (account.provider && !token[account.provider]) {
        token[account.provider] = {}
      }
      if (account.access_token) {
        token.provider = account.provider;
        token[account.provider].accessToken = account.access_token
        token[account.provider].refreshToken = account.refresh_token
        token[account.provider].profile = profile.data
      }
      return token;
    },
    secret: process.env.NEXT_PUBLIC_API_KEY,
  },
  pages: {
    signIn: '/auth/signin',
  },
})