/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aggregator.walrus-testnet.walrus.space',
        pathname: '/v1/blobs/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig 