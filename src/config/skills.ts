export interface SkillGroup {
  title: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C", "C#"],
  },
  {
    title: "AI / ML",
    items: [
      "PyTorch",
      "Transfer Learning",
      "ResNet",
      "Grad-CAM",
      "scikit-learn",
      "Computer Vision",
    ],
  },
  {
    title: "Web & Frameworks",
    items: [
      "React",
      "Next.js",
      "Vite",
      "FastAPI",
      "Supabase",
      "Tailwind",
    ],
  },
  {
    title: "Design & Tools",
    items: [
      "Unity",
      "AutoCAD",
      "Fusion 360",
      "3D Modelling",
      "IoT Systems",
      "Augmented Reality",
    ],
  },
];
