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
  SiFlutter,
  SiDart,
  SiFirebase,
  SiMongodb,
  SiNumpy,
  SiPandas,
  SiExpress,
  SiFigma,
  SiArduino,
  SiRaspberrypi,
  SiMysql,
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
  dart: SiDart,
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  keras: SiKeras,
  "scikit-learn": SiScikitlearn,
  sklearn: SiScikitlearn,
  "scikit learn": SiScikitlearn,
  opencv: SiOpencv,
  huggingface: SiHuggingface,
  numpy: SiNumpy,
  pandas: SiPandas,
  react: SiReact,
  "react native": SiReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  flutter: SiFlutter,
  vite: SiVite,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  "express.js": SiExpress,
  express: SiExpress,
  fastapi: SiFastapi,
  django: SiDjango,
  supabase: SiSupabase,
  firebase: SiFirebase,
  mongodb: SiMongodb,
  mysql: SiMysql,
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
  figma: SiFigma,
  arduino: SiArduino,
  "raspberry pi": SiRaspberrypi,
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
