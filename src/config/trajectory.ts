export interface TrajectoryEntry {
  date: string;
  title: string;
  org?: string;
  summary: string;
}

export const trajectory: TrajectoryEntry[] = [
  {
    date: "2025",
    title: "Event Management System",
    summary: "Architecting full-stack registration platform. Design phase.",
  },
  {
    date: "2024 Q3",
    title: "BEFA Study Guide",
    summary: "Authored open study guide using matplotlib + ReportLab. 500+ downloads.",
  },
  {
    date: "2024 Q2",
    title: "RAG Workshop Chatbot",
    summary: "Solo-built retrieval chatbot for live workshop. 1K+ queries fielded.",
  },
  {
    date: "2024 Q1",
    title: "Skin Cancer Classifier",
    summary: "Led 4-person team. Trained CNN on 50K images. 94% test accuracy.",
  },
];
