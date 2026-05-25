export interface KaijuEntry {
  /** kaiju codename — sci-fi handle for the project */
  codename: string;
  /** date defeated */
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
}

export const trajectory: KaijuEntry[] = [
  {
    codename: "GRIDLOCK",
    date: "2025",
    category: 3,
    jaeger: "Event Management System",
    location: "Sector / Next.js Bay",
    summary:
      "Full-stack registration and check-in platform. Currently in conn-pod handshake — Prisma data model + Next.js App Router architecture in final calibration.",
    status: "IN PURSUIT",
  },
  {
    codename: "TOMEBREAKER",
    date: "2024 Q3",
    category: 2,
    jaeger: "BEFA Study Guide",
    location: "Sector / Open Repos",
    summary:
      "Authored an open BEFA study guide using matplotlib + ReportLab. Deployed to public bay — 500+ downloads.",
    status: "DEFEATED",
  },
  {
    codename: "VECTRA",
    date: "2024 Q2",
    category: 3,
    jaeger: "RAG Workshop Chatbot",
    location: "Sector / Live Workshop",
    summary:
      "Solo-piloted a FAISS-backed retrieval chatbot for a live workshop. 1K+ neural queries answered before the kaiju was downed.",
    status: "DEFEATED",
  },
  {
    codename: "MELANOSAUR",
    date: "2024 Q1",
    category: 4,
    jaeger: "Skin Cancer Classifier",
    location: "Sector / Dermoscopic Trench",
    summary:
      "Led a 4-pilot drift. CNN trained on 50K dermoscopic images, transfer learning from EfficientNet-B3. Hit 94% accuracy under cat-IV breach conditions.",
    status: "DEFEATED",
  },
];
