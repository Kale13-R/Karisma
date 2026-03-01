import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow images from local public folder and future CDN
    remotePatterns: [],
  },
  // Ensure API calls work in production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
