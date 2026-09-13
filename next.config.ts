import type { NextConfig } from "next";

/**
 * Fully static build (`out/`), hostable on GitHub Pages or any CDN.
 * NEXT_PUBLIC_BASE_PATH is set by the Pages workflow ("/veyora"); empty locally.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // No image server on static hosting: responsive WebP files are generated
    // at build time by scripts/optimize-images.mjs and picked by this loader.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
