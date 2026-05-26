export interface KaijuEntry {
  /** kaiju codename — sci-fi handle for the project */
  codename: string;
  /** date defeated / engaged */
  date: string;
  /** Pacific Rim category I–V (higher = bigger threat) */
  category: 1 | 2 | 3 | 4 | 5;
  /** which "jaeger" (project) was deployed */
  jaeger: string;
  /** battle location / sector */
  location: string;
  /** battle report */
  summary: string;
  /** outcome */
  status: "DEFEATED" | "IN PURSUIT" | "ARCHIVED";
  /** GitHub repo URL, or "PRIVATE" if not public */
  repo?: string;
}

export const trajectory: KaijuEntry[] = [
  {
    codename: "CAMPUSWRAITH",
    date: "2026",
    category: 4,
    jaeger: "Campus Companion",
    location: "Sector / Institutional Grid",
    summary:
      "Full-stack breach across attendance, grades, and HOD admin workflows. 117+ commits, role-based defenses for students, faculty, and HODs. Live deployment serving 30+ active operators.",
    status: "IN PURSUIT",
    repo: "PRIVATE",
  },
  {
    codename: "MELANOSAUR",
    date: "2026",
    category: 4,
    jaeger: "DermAI",
    location: "Sector / Dermoscopic Trench",
    summary:
      "ResNet50 transfer-learning classifier on HAM10000. Pinned the kaiju at ~85% validation accuracy / 0.93 macro AUC across 7 lesion classes. Grad-CAM explainability armed and operational.",
    status: "DEFEATED",
    repo: "https://github.com/Tribhuvan-26/DermAI-SkinCancerDetection",
  },
  {
    codename: "FURBISH",
    date: "2025",
    category: 2,
    jaeger: "Into Furbish",
    location: "Sector / Augmented Reality",
    summary:
      "Unity AR strike — 3D furniture placement, scaling, and layout preview piped through a mobile camera. Lightweight engagement, clean takedown.",
    status: "DEFEATED",
  },
];
