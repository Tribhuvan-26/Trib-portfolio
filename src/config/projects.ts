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
    links: [
      { label: "Live", href: "https://campus-companion-mu.vercel.app" },
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
        href: "https://github.com/Tribhuvan-26/DermAI-SkinCancerDetection",
      },
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
