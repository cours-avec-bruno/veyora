"use client";

import { OPT_WIDTHS } from "./image-widths";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Maps /images/<key>.jpg to the closest pre-generated WebP width. */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const match = src.match(/^\/images\/([\w-]+)\.jpg$/);
  if (!match) return `${base}${src}`;
  const w = OPT_WIDTHS.find((x) => x >= width) ?? OPT_WIDTHS[OPT_WIDTHS.length - 1];
  return `${base}/images/_opt/${w}/${match[1]}.webp`;
}
