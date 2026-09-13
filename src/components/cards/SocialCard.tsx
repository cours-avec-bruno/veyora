import Image from "next/image";
import { Play } from "lucide-react";
import type { SocialPost } from "@/data/types";
import { photo } from "@/data/photos";
import { socialHandles } from "@/data/social";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { cn } from "@/lib/format";

export function SocialCard({ post, className }: { post: SocialPost; className?: string }) {
  const img = photo(post.image);
  const account = post.platform === "TikTok" ? socialHandles.tiktok : socialHandles.instagram;
  const Icon = post.platform === "TikTok" ? TikTokIcon : InstagramIcon;

  return (
    <a
      href={account.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative isolate flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[10px] bg-ink text-paper",
        className,
      )}
      aria-label={`${post.title} — vidéo ${post.platform}, ${post.duration}. S'ouvre dans un nouvel onglet.`}
    >
      <Image
        src={img.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 18vw, 62vw"
        className="photo -z-10 object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/5 to-black/80" />

      <div className="flex items-center justify-between p-3.5">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-paper/20 bg-black/35 px-2.5 text-[0.72rem] font-medium backdrop-blur-md">
          <Icon className="size-3.5" />
          {post.platform}
        </span>
        <span className="t-meta text-[0.7rem] text-paper/80">{post.duration}</span>
      </div>

      {/* Play affordance */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full border border-paper/40 bg-paper/10 opacity-0 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:scale-100 group-hover:opacity-100"
      >
        <Play className="ml-0.5 size-5 fill-current" strokeWidth={0} />
      </span>

      <div className="p-4">
        <p className="font-serif text-[1.45rem] leading-[1.02] tracking-[-0.015em] text-balance">{post.title}</p>
        <p className="mt-2 text-[0.8rem] leading-snug text-paper/70">{post.hook}</p>
        <div className="mt-4 flex items-center justify-between border-t border-paper/20 pt-3">
          <span className="t-meta text-[0.7rem] text-paper/75">{account.handle}</span>
          <span className="t-meta text-[0.7rem] text-paper/75">{post.views} vues</span>
        </div>
      </div>
    </a>
  );
}
