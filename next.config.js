/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_API_URI: process.env.NEXT_PUBLIC_API_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_CALLBACK: process.env.NEXT_PUBLIC_CALLBACK,
    NEXT_PUBLIC_TWITTER_API_URI: process.env.NEXT_PUBLIC_TWITTER_API_URI,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DISCORD_SECRET: process.env.DISCORD_SECRET,
    DISCORD_ID: process.env.DISCORD_ID,
    TWITTER_SECRET: process.env.TWITTER_SECRET,
    TWITTER_ID: process.env.TWITTER_ID,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    REGION: process.env.REGION,
    PLAYER_TABLE: process.env.PLAYER_TABLE,
  }
}
module.exports = nextConfig
