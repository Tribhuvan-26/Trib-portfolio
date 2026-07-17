export interface ProjectEntry {
  name: string;
  year: string;
  /** short discipline tag, e.g. "Full-stack", "Machine Learning" */
  kind: string;
  summary: string;
  /** GitHub repo URL, or "PRIVATE" if not public */
  repo?: string;
}

export const trajectory: ProjectEntry[] = [
  {
    name: "Campus Companion",
    year: "2026",
    kind: "Full-stack",
    summary:
      "End-to-end platform for attendance, grades, and HOD admin workflows. 117+ commits, role-based access for students, faculty, and HODs. Live deployment serving 30+ active users.",
    repo: "PRIVATE",
  },
  {
    name: "DermAI",
    year: "2026",
    kind: "Machine Learning",
    summary:
      "ResNet50 transfer-learning classifier on HAM10000 — ~85% validation accuracy / 0.93 macro AUC across 7 lesion classes, with Grad-CAM explainability.",
    repo: "https://github.com/Tribhuvan-26/DermAI-SkinCancerDetection",
  },
  {
    name: "Into Furbish",
    year: "2025",
    kind: "Augmented Reality",
    summary:
      "Unity AR app for 3D furniture placement, scaling, and layout preview through a mobile camera. Lightweight, hands-on prototyping.",
  },
];
