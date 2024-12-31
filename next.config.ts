/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig;
