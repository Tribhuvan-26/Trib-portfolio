const DEFAULT = [
  "Python",
  "Next.js",
  "PyTorch",
  "Supabase",
  "FastAPI",
  "React",
  "Unity",
  "IoT",
  "Grad-CAM",
  "Mentoring",
];

export function Ticker({ items = DEFAULT }: { items?: string[] }) {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y-[3px] border-ink bg-ink py-3 text-paper"
    >
      <div className="flex animate-marquee whitespace-nowrap font-mono text-sm font-medium uppercase tracking-[0.2em]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-8">
                <span>{t}</span>
                <span className="text-pop">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
