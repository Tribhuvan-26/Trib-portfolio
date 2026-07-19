export interface Project {
  id: string;
  year: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  links: { label: string; href: string }[];
  metric?: string;
}

export const projects: Project[] = [
  {
    id: "campus-companion",
    year: "2026",
    title: "Campus Companion",
    summary:
      "Full-stack platform digitizing attendance, grades, and HOD admin workflows for an institutional client. Role-based access for students, faculty, and HODs — 117+ commits on the active codebase, deployed to production.",
    role: "Solo",
    stack: ["TypeScript", "Next.js", "Supabase", "Tailwind"],
    metric: "30+ active users",
    links: [{ label: "Live", href: "https://campus-companion-mu.vercel.app" }],
  },
  {
    id: "workshop-carnival",
    year: "2026",
    title: "Workshop Carnival Chatbot",
    summary:
      "AI assistant for MLRIT's Workshop Carnival, answering attendee queries on schedules, registration, and event details. Retrieval-augmented generation with Gemini 2.5 Flash over indexed event content for context-grounded answers.",
    role: "Solo",
    stack: ["React", "Vite", "FastAPI", "Gemini 2.5 Flash", "RAG"],
    metric: "Live event deployment",
    links: [
      { label: "Live", href: "https://wc.mlritcie.in" },
      { label: "GitHub", href: "https://github.com/Tribhuvan-26/wc-chatbot" },
    ],
  },
  {
    id: "derm-ai",
    year: "2026",
    title: "DermAI",
    summary:
      "Dermoscopic image classifier on HAM10000 using ResNet50 transfer learning. Integrated Grad-CAM explainability with a React + FastAPI app — drag-and-drop uploads, real-time confidence visualizations across 7 lesion classes.",
    role: "Team Lead",
    stack: ["Python", "PyTorch", "FastAPI", "React", "Grad-CAM"],
    metric: "~85% acc · 0.93 AUC",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Tribhuvan-26/Skin-cancer-classification",
      },
    ],
  },
  {
    id: "auraloop",
    year: "2026",
    title: "AuraLoop",
    summary:
      "Cross-platform Gen-Z fintech app that rounds up everyday transactions to the nearest ₹10/20/50 into savings goal jars. On-device Android SMS parsing auto-imports bank transactions with zero server uploads, plus a weekly “aura score” spend-health summary.",
    role: "Solo",
    stack: ["React", "Vite", "Tailwind", "Capacitor"],
    metric: "On-device · zero uploads",
    links: [
      { label: "GitHub", href: "https://github.com/345678o/finance-controller" },
    ],
  },
  {
    id: "into-furbish",
    year: "2025",
    title: "Into Furbish",
    summary:
      "AR furniture visualization app built in Unity — place and customize 3D furniture in real spaces via mobile camera. Implemented 3D model interaction, scaling, and placement for real-time layout previews.",
    role: "Architect",
    stack: ["Unity", "C#", "Augmented Reality"],
    links: [],
  },
];
