/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.GITHUB_PAGES === 'true' ? { output: 'export', basePath: '/hobbyBFF', trailingSlash: true } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_PAGES === 'true' ? '/hobbyBFF' : '' },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
