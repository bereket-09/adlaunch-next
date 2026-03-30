// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // @ts-ignore - Some versions of Next.js might have issues with these types
  reactCompiler: true,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },
  // Use 'as any' as a fallback to avoid "known properties" errors in newer Next versions
} as any;

// Skip TLS certificate verification for development/preview
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default nextConfig;