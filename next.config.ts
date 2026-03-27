const nextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: __dirname,
  },
} as any;

export default nextConfig;