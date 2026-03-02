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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "media-src 'self' blob:",
              "font-src 'self'",
              "connect-src 'self' https://*.railway.app https://api.stripe.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
