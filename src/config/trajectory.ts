export interface KaijuEntry {
  name: string;
  date: string;
  /** Pacific Rim category I–V (higher = bigger threat) */
  category: 1 | 2 | 3 | 4 | 5;
  location: string;
  summary: string;
  status: "DEFEATED" | "IN PURSUIT" | "ARCHIVED";
  /** GitHub repo URL, or "PRIVATE" if not public */
  repo?: string;
}

export const trajectory: KaijuEntry[] = [
  {
    name: "Campus Companion",
    date: "2026",
    category: 4,
    location: "Sector / Institutional Grid",
    summary:
      "Full-stack breach across attendance, grades, and HOD admin workflows. 117+ commits, role-based defenses for students, faculty, and HODs. Live deployment serving 30+ active operators.",
    status: "IN PURSUIT",
    repo: "PRIVATE",
  },
  {
    name: "DermAI",
    date: "2026",
    category: 4,
    location: "Sector / Dermoscopic Trench",
    summary:
      "ResNet50 transfer-learning classifier on HAM10000. Pinned the kaiju at ~85% validation accuracy / 0.93 macro AUC across 7 lesion classes. Grad-CAM explainability armed and operational.",
    status: "DEFEATED",
    repo: "https://github.com/Tribhuvan-26/DermAI-SkinCancerDetection",
  },
  {
    name: "Into Furbish",
    date: "2025",
    category: 2,
    location: "Sector / Augmented Reality",
    summary:
      "Unity AR strike — 3D furniture placement, scaling, and layout preview piped through a mobile camera. Lightweight engagement, clean takedown.",
    status: "DEFEATED",
  },
];
