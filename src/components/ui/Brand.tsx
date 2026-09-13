import { cn } from "@/lib/format";

/**
 * Wordmark. A masthead, not a logo: tracked serif capitals and one
 * small route marker — departure dot, line, arrival dot.
 */
export function Wordmark({ className, withMark = false }: { className?: string; withMark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {withMark && <RouteMark className="h-[0.55em] w-auto" />}
      <span className="font-serif text-[1.45em] leading-none tracking-[0.2em] uppercase">
        Veyora
      </span>
    </span>
  );
}

export function RouteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 8" className={className} aria-hidden fill="none">
      <circle cx="4" cy="4" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4h12" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2.4" />
      <circle cx="24" cy="4" r="3.2" fill="currentColor" />
    </svg>
  );
}

/** Horizontal itinerary: stops on a line. Used on covers, cards and heroes. */
export function RouteLine({
  stops,
  className,
  light,
  compact,
}: {
  stops: string[];
  className?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <ol
      className={cn("relative flex items-start justify-between", className)}
      aria-label={`Itinéraire : ${stops.join(" → ")}`}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[5px] right-[5px] left-[5px] h-px",
          light ? "bg-paper/35" : "bg-ink/25",
        )}
      />
      {stops.map((s, i) => {
        const end = i === 0 || i === stops.length - 1;
        return (
          <li
            key={`${s}-${i}`}
            className={cn(
              "relative flex min-w-0 flex-col gap-2",
              i === 0 ? "items-start" : i === stops.length - 1 ? "items-end" : "items-center",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "block size-[11px] rounded-full border",
                light ? "border-paper" : "border-ink",
                end ? (light ? "bg-paper" : "bg-ink") : light ? "bg-forest" : "bg-paper",
              )}
            />
            {!compact && (
              <span
                className={cn(
                  "t-meta truncate text-[0.68rem]",
                  light ? "text-paper/80" : "text-graphite",
                  i !== 0 && i !== stops.length - 1 && "hidden sm:block",
                )}
              >
                {s}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
