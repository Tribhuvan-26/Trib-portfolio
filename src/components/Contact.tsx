"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { social } from "@/config/social";
import { Section } from "./Section";

const SOCIALS = [
  { label: "GitHub", href: social.github, Icon: SiGithub },
  { label: "LinkedIn", href: social.linkedin, Icon: FaLinkedinIn },
  { label: "Twitter / X", href: social.twitter, Icon: SiX },
  { label: "Email", href: `mailto:${social.email}`, Icon: Mail },
];

const ROWS = [
  { k: "Location", v: social.location },
  { k: "Email", v: social.email },
  { k: "GitHub", v: `@${social.githubHandle}` },
  { k: "LinkedIn", v: "katepally-tribhuvan" },
];

export function Contact() {
  return (
    <Section
      id="contact"
      index="007"
      label="CONTACT"
      title="get in touch"
      kicker="Reach out through any of the channels below."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 border border-line bg-bg-elev p-8 md:p-12"
      >
        {/* corner accents */}
        <span aria-hidden className="absolute -top-px -left-px h-4 w-4 border-l-2 border-t-2 border-accent" />
        <span aria-hidden className="absolute -top-px -right-px h-4 w-4 border-r-2 border-t-2 border-accent" />
        <span aria-hidden className="absolute -bottom-px -left-px h-4 w-4 border-l-2 border-b-2 border-accent" />
        <span aria-hidden className="absolute -bottom-px -right-px h-4 w-4 border-r-2 border-b-2 border-accent" />

        {/* icon row */}
        <div className="flex flex-wrap items-center gap-5">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent text-accent transition-all hover:bg-accent hover:text-bg"
            >
              <Icon size={22} strokeWidth={1.8} className="transition-transform group-hover:scale-110" />
            </a>
          ))}
        </div>

        {/* plain text rows */}
        <ul className="flex flex-col gap-3 font-mono text-sm leading-relaxed text-fg-muted md:text-base">
          {ROWS.map((r) => (
            <li key={r.k} className="flex flex-wrap items-baseline gap-3">
              <span className="min-w-24 text-fg-faint">{r.k}</span>
              <span className="text-fg-faint">—</span>
              <span className="text-fg">{r.v}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
