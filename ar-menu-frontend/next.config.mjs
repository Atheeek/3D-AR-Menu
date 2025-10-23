/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '4fc010232440608ecc380f65c7872068.r2.cloudflarestorage.com', // Your S3-compatible endpoint
      },
      {
        protocol: 'https',
        hostname: 'pub-c8176a713e4342b0bea535c15a237685.r2.dev', // Your Public R2 Bucket URL hostname
      },
    ],
  },
};

export default nextConfig;