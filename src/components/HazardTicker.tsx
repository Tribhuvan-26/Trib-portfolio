const DEFAULT_ITEMS = [
  "SYSTEMS ONLINE",
  "CONN-POD SYNCED",
  "NEURAL HANDSHAKE STABLE",
  "DRIFT COMPATIBLE",
  "READY FOR DEPLOYMENT",
];

export function HazardTicker({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  return (
    <div aria-hidden>
      <div className="h-2 hazard-stripe-thin" />
      <div className="overflow-hidden bg-fg text-bg">
        <div className="flex animate-marquee whitespace-nowrap py-3 font-mono text-[11px] tracking-[0.35em]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
              {items.map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  <span>{t}</span>
                  <span className="text-accent">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-2 hazard-stripe-thin" />
    </div>
  );
}
