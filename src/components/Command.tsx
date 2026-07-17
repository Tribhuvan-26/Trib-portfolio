"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { social } from "@/config/social";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Links" | "Actions";
  run: () => void;
};

export function Command() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return null;
}
