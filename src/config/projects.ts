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
    id: "skin-cnn",
    year: "2024",
    title: "Skin Cancer Classifier",
    summary:
      "Deep CNN classifying dermoscopic images across 7 lesion classes. Transfer learning from EfficientNet-B3, focal loss for class imbalance, Grad-CAM for clinical interpretability.",
    role: "Team Lead",
    stack: ["Python", "TensorFlow", "Keras", "OpenCV"],
    metric: "94% accuracy",
    links: [{ label: "GitHub", href: "https://github.com/Tribhuvan-26" }],
  },
  {
    id: "rag-chatbot",
    year: "2024",
    title: "RAG Workshop Chatbot",
    summary:
      "FAISS-backed retrieval-augmented chatbot using sentence-transformer embeddings and Gemini as the generator. Deployed for a live workshop, fielded 1K+ queries.",
    role: "Solo",
    stack: ["FastAPI", "FAISS", "Gemini", "React"],
    metric: "1K+ queries served",
    links: [{ label: "GitHub", href: "https://github.com/Tribhuvan-26" }],
  },
  {
    id: "event-mgmt",
    year: "2025",
    title: "Event Management System",
    summary:
      "Full-stack registration and check-in platform. Currently in design phase — Prisma data model and Next.js App Router architecture sketched.",
    role: "Architect",
    stack: ["Next.js", "PostgreSQL", "Prisma"],
    links: [],
  },
];
