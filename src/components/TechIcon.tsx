"use client";

import type { ComponentType } from "react";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiReact,
  SiNextdotjs,
  SiVite,
  SiFastapi,
  SiSupabase,
  SiTailwindcss,
  SiUnity,
  SiAutodesk,
  SiBlender,
  SiFramer,
  SiThreedotjs,
  SiOpenjdk,
  SiC,
  SiSharp,
  SiDocker,
  SiGithubactions,
  SiVercel,
  SiPostgresql,
  SiOpencv,
  SiNodedotjs,
  SiDjango,
  SiGraphql,
  SiKeras,
  SiHuggingface,
} from "react-icons/si";
import { IconType } from "react-icons";

const MAP: Record<string, IconType> = {
  python: SiPython,
  typescript: SiTypescript,
  javascript: SiJavascript,
  java: SiOpenjdk,
  c: SiC,
  "c#": SiSharp,
  "c++": SiC,
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  keras: SiKeras,
  "scikit-learn": SiScikitlearn,
  sklearn: SiScikitlearn,
  "scikit learn": SiScikitlearn,
  opencv: SiOpencv,
  huggingface: SiHuggingface,
  react: SiReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  vite: SiVite,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  fastapi: SiFastapi,
  django: SiDjango,
  supabase: SiSupabase,
  tailwind: SiTailwindcss,
  "tailwind css": SiTailwindcss,
  postgresql: SiPostgresql,
  graphql: SiGraphql,
  "framer motion": SiFramer,
  "three.js": SiThreedotjs,
  threejs: SiThreedotjs,
  r3f: SiThreedotjs,
  unity: SiUnity,
  autocad: SiAutodesk,
  "fusion 360": SiAutodesk,
  blender: SiBlender,
  docker: SiDocker,
  "github actions": SiGithubactions,
  vercel: SiVercel,
};

const norm = (s: string) => s.toLowerCase().trim();

export function TechIcon({
  name,
  size = 14,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[norm(name)] as ComponentType<{ size?: number; className?: string }> | undefined;
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export function hasIcon(name: string) {
  return Boolean(MAP[norm(name)]);
}
