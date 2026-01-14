import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/ideasheaf',
  serverExternalPackages: ['@myriaddreamin/rehype-typst'],
}

export default nextConfig
