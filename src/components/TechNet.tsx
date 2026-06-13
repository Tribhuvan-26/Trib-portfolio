"use client";

import { forwardRef, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { TechIcon, hasIcon } from "./TechIcon";
import { Section } from "./Section";

interface NodeDef {
  id: string;
  label: string;
}

const LAYERS: { label: string; nodes: NodeDef[] }[] = [
  {
    label: "LANGUAGES",
    nodes: [
      { id: "python", label: "Python" },
      { id: "typescript", label: "TypeScript" },
      { id: "javascript", label: "JavaScript" },
      { id: "c++", label: "C++" },
      { id: "java", label: "Java" },
    ],
  },
  {
    label: "AI / ML",
    nodes: [
      { id: "pytorch", label: "PyTorch" },
      { id: "tensorflow", label: "TensorFlow" },
      { id: "keras", label: "Keras" },
      { id: "scikit-learn", label: "scikit-learn" },
      { id: "opencv", label: "OpenCV" },
      { id: "huggingface", label: "HuggingFace" },
    ],
  },
  {
    label: "FRONTEND",
    nodes: [
      { id: "react", label: "React" },
      { id: "next.js", label: "Next.js" },
      { id: "three.js", label: "Three.js" },
      { id: "tailwind", label: "Tailwind" },
      { id: "framer motion", label: "Framer" },
    ],
  },
  {
    label: "BACKEND",
    nodes: [
      { id: "fastapi", label: "FastAPI" },
      { id: "node.js", label: "Node.js" },
      { id: "django", label: "Django" },
      { id: "supabase", label: "Supabase" },
      { id: "postgresql", label: "PostgreSQL" },
    ],
  },
  {
    label: "DEVOPS / 3D",
    nodes: [
      { id: "docker", label: "Docker" },
      { id: "github actions", label: "GH Actions" },
      { id: "vercel", label: "Vercel" },
      { id: "unity", label: "Unity" },
      { id: "blender", label: "Blender" },
    ],
  },
];

const EDGES: [string, string][] = [
  // Languages → AI/ML
  ["python", "pytorch"], ["python", "tensorflow"], ["python", "keras"],
  ["python", "scikit-learn"], ["python", "opencv"], ["python", "huggingface"],
  ["c++", "opencv"],
  // Languages → Frontend
  ["typescript", "react"], ["typescript", "next.js"], ["typescript", "three.js"],
  ["typescript", "framer motion"],
  ["javascript", "react"], ["javascript", "next.js"], ["javascript", "three.js"],
  // Languages → Backend
  ["python", "fastapi"], ["python", "django"],
  ["javascript", "node.js"], ["typescript", "node.js"],
  // AI/ML → Backend
  ["pytorch", "fastapi"], ["tensorflow", "fastapi"],
  // Frontend → Backend
  ["react", "node.js"], ["react", "supabase"], ["react", "fastapi"],
  ["next.js", "supabase"], ["next.js", "fastapi"], ["next.js", "node.js"],
  // Frontend → DevOps
  ["next.js", "vercel"],
  // Backend → DevOps
  ["fastapi", "docker"], ["fastapi", "vercel"],
  ["node.js", "docker"], ["node.js", "github actions"], ["node.js", "vercel"],
  ["django", "docker"],
  ["supabase", "vercel"],
  // Creative
  ["typescript", "unity"], ["three.js", "blender"],
];

type Pt = { x: number; y: number };

const NodeCard = forwardRef<
  HTMLDivElement,
  {
    node: NodeDef;
    isHovered: boolean;
    isConnected: boolean;
    isDimmed: boolean;
    onHover: (id: string | null) => void;
  }
>(function NodeCard({ node, isHovered, isConnected, isDimmed, onHover }, ref) {
  const showIcon = hasIcon(node.id);
  const initials = node.label.slice(0, 2).toUpperCase();

  return (
    <div
      ref={ref}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className="flex flex-col items-center gap-1.5 cursor-default select-none transition-opacity duration-200"
      style={{ opacity: isDimmed ? 0.15 : 1 }}
    >
      <div
        className={`relative flex h-12 w-12 items-center justify-center border transition-all duration-200 ${
          isHovered
            ? "border-accent bg-accent/10 shadow-[0_0_18px_var(--accent-glow)]"
            : isConnected
            ? "border-accent/45 bg-accent/5"
            : "border-line bg-bg-elev"
        }`}
      >
        {isHovered && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 scale-[1.3] border border-accent/25 transition-transform duration-300"
          />
        )}
        {showIcon ? (
          <TechIcon
            name={node.id}
            size={22}
            className={`transition-colors duration-200 ${
              isHovered ? "text-accent" : isConnected ? "text-accent/60" : "text-fg-muted"
            }`}
          />
        ) : (
          <span
            className={`font-mono text-[10px] font-bold transition-colors duration-200 ${
              isHovered ? "text-accent" : isConnected ? "text-accent/60" : "text-fg-muted"
            }`}
          >
            {initials}
          </span>
        )}
      </div>
      <span
        className={`font-mono text-[8px] tracking-widest transition-colors duration-200 ${
          isHovered ? "text-accent" : isConnected ? "text-fg-muted" : "text-fg-faint"
        }`}
      >
        {node.label.toUpperCase()}
      </span>
    </div>
  );
});

function safeId(a: string, b: string) {
  return `technet-${a}-${b}`.replace(/[.\s/]/g, "-");
}

export function TechNet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const [positions, setPositions] = useState<Map<string, Pt>>(new Map());
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  const measure = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const next = new Map<string, Pt>();
    nodeEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      next.set(id, {
        x: r.left - cr.left + r.width / 2,
        y: r.top - cr.top + r.height / 2,
      });
    });
    setPositions(new Map(next));
    setSvgDims({ w: cr.width, h: cr.height });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    const c = containerRef.current;
    if (c) ro.observe(c);
    return () => ro.disconnect();
  }, [measure]);

  const connectedSet = useMemo(() => {
    if (!hovered) return new Set<string>();
    const s = new Set<string>();
    EDGES.forEach(([a, b]) => {
      if (a === hovered) s.add(b);
      if (b === hovered) s.add(a);
    });
    return s;
  }, [hovered]);

  const allNodes = LAYERS.flatMap((l) => l.nodes);

  return (
    <Section
      id="stack"
      index="004"
      label="NEURAL MATRIX"
      title="tech stack"
      kicker="Weapons armed and patched — hover any node to trace its signal path."
    >
      {/* ── Desktop: neural net ── */}
      <div className="relative hidden md:block" ref={containerRef}>
        {/* SVG connection layer */}
        {svgDims.w > 0 && (
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0"
            width={svgDims.w}
            height={svgDims.h}
            style={{ overflow: "visible" }}
          >
            {EDGES.map(([a, b]) => {
              const pa = positions.get(a);
              const pb = positions.get(b);
              if (!pa || !pb) return null;
              const isActive = hovered === a || hovered === b;
              const isDimmed = !!hovered && !isActive;
              const pid = safeId(a, b);
              const mx = (pa.x + pb.x) / 2;
              const d = `M ${pa.x} ${pa.y} C ${mx} ${pa.y}, ${mx} ${pb.y}, ${pb.x} ${pb.y}`;

              return (
                <g key={pid}>
                  <path
                    id={pid}
                    d={d}
                    fill="none"
                    stroke={isActive ? "var(--accent)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={isActive ? 1.5 : 0.75}
                    strokeDasharray={isActive ? "5 7" : "3 9"}
                    opacity={isDimmed ? 0.04 : isActive ? 0.9 : 0.45}
                    style={
                      isActive
                        ? { animation: "technet-flow 1.2s linear infinite" }
                        : undefined
                    }
                  />
                  {isActive && (
                    <circle r="2.5" fill="var(--accent)" opacity="0.9">
                      <animateMotion dur="1.6s" repeatCount="indefinite">
                        <mpath href={`#${pid}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Layer columns */}
        <div className="grid grid-cols-5 gap-2 py-10">
          {LAYERS.map((layer) => (
            <div key={layer.label} className="flex flex-col items-center gap-8">
              <span className="font-mono text-[9px] tracking-[0.28em] text-fg-faint">
                {layer.label}
              </span>
              {layer.nodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isHovered={hovered === node.id}
                  isConnected={connectedSet.has(node.id)}
                  isDimmed={!!hovered && hovered !== node.id && !connectedSet.has(node.id)}
                  onHover={setHovered}
                  ref={(el) => {
                    if (el) nodeEls.current.set(node.id, el);
                    else nodeEls.current.delete(node.id);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: compact grid ── */}
      <div className="grid grid-cols-3 gap-2 md:hidden sm:grid-cols-4">
        {allNodes.map((node) => (
          <div
            key={node.id}
            className="flex flex-col items-center gap-1.5 border border-line bg-bg-elev p-3"
          >
            {hasIcon(node.id) ? (
              <TechIcon name={node.id} size={18} className="text-fg-muted" />
            ) : (
              <span className="font-mono text-[10px] font-bold text-fg-muted">
                {node.label.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="text-center font-mono text-[8px] tracking-widest text-fg-faint">
              {node.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
