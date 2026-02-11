/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled for HeyGen WebRTC stability
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;