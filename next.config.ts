import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const isDev = process.env.NODE_ENV === 'development';


const withPWA = withPWAInit({
  dest: 'public',
  // // swSrc: 'sw.js', // Your source file in project root
  // swDest: 'public/sw.js', // Explicit output path
  // mode: 'production',
  register: true,
  // skipWaiting: true,
  disable: false,
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
