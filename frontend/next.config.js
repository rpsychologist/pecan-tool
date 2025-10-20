/** @type {import('next').NextConfig} */
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE

let imageConfig

if(NEXT_DEMO_MODE) {
  imageConfig = { unoptimized: true }
} else {
  imageConfig = {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      }
    ],
  }
}

const nextConfig = {
  output: NEXT_DEMO_MODE ? "export" : "standalone",
  images: imageConfig,
  async rewrites() {
    return [
      {
        // does not handle locales automatically since locale: false is set
        source: '/sv/natverk',
        destination: '/sv/network',
        locale: false,
      },
    ]
  },
  eslint: {
  ignoreDuringBuilds: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
