import type { SVGProps } from "react";
import { TrainFront, Bus, Footprints, Bike, Ship, MoonStar } from "lucide-react";
import type { TransportMode } from "@/data/types";

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const modeIcons = {
  train: TrainFront,
  nuit: MoonStar,
  bus: Bus,
  marche: Footprints,
  velo: Bike,
  bateau: Ship,
} satisfies Record<TransportMode, unknown>;

export const modeLabels: Record<TransportMode, string> = {
  train: "Train",
  nuit: "Train de nuit",
  bus: "Bus",
  marche: "À pied",
  velo: "Vélo",
  bateau: "Bateau",
};

export function ModeIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  const I = modeIcons[mode];
  return <I className={className ?? "size-4"} strokeWidth={1.4} aria-label={modeLabels[mode]} />;
}

export function ModeRow({ modes, className }: { modes: TransportMode[]; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      {modes.map((m, i) => (
        <span key={m} className="inline-flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="h-px w-2 bg-current opacity-40" />}
          <ModeIcon mode={m} className="size-[0.95rem]" />
        </span>
      ))}
    </span>
  );
}
