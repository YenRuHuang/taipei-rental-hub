/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'hp2.591.com.tw',
      'img2.591.com.tw',
      'img1.591.com.tw',
      'localhost'
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig;