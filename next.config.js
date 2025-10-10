/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',

  basePath: process.env.PAGES_BASE_PATH,
}
 
module.exports = nextConfig