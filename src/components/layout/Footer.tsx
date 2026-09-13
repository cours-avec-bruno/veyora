import Link from "next/link";
import { footerNav, legalNav } from "@/data/site";
import { socialHandles } from "@/data/social";
import { RouteMark } from "@/components/ui/Brand";
import { InstagramIcon, TikTokIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="container-v pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label text-paper/55">46.05° N · 14.51° E — quelque part entre deux gares</p>
            <p className="t-h1 mt-6 max-w-[14ch] text-balance">
              Voyager <em className="text-sage">autrement.</em>
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7" aria-label="Pied de page">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="t-label text-paper/50">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-u text-[0.95rem] text-paper/90">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="t-label text-paper/50">Social</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={socialHandles.tiktok.url} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2 text-[0.95rem] text-paper/90">
                    <TikTokIcon className="size-3.5" /> TikTok
                  </a>
                </li>
                <li>
                  <a href={socialHandles.instagram.url} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2 text-[0.95rem] text-paper/90">
                    <InstagramIcon className="size-3.5" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Masthead */}
        <div className="relative mt-20 md:mt-28" aria-hidden>
          <svg viewBox="0 0 1000 178" className="block w-full">
            <text x="0" y="170" textLength="1000" lengthAdjust="spacing" className="fill-paper font-serif" fontSize="232">
              VEYORA
            </text>
          </svg>
          <RouteMark className="absolute right-0 -bottom-6 h-3 w-auto text-clay md:h-4" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/15 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="t-meta text-paper/55">© 2026 Veyora · Voyager plus loin. Dépenser moins. Polluer moins.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-u t-meta text-paper/60 hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
