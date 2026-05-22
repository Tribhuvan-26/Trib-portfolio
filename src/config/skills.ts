export interface SkillGroup {
  title: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    title: "AI / ML",
    items: ["Python", "TensorFlow", "PyTorch", "CNN", "RAG", "LLMs", "Transformers", "FAISS", "Langchain"],
  },
  {
    title: "Backend",
    items: ["FastAPI", "Node.js", "Django", "PostgreSQL", "REST", "GraphQL"],
  },
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    title: "Infra",
    items: ["Docker", "GitHub Actions", "Vercel", "Render", "Supabase"],
  },
];
