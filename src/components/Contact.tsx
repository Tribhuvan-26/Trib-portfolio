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

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title="Let's build"
      kicker="Got something worth shipping? I'm one message away."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.a
          href={`mailto:${social.email}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="brut brut-hover brut-accent group flex flex-col justify-between gap-8 bg-accent p-7 text-paper md:p-10"
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-paper/80">
            Email me
          </span>
          <span className="font-display text-3xl font-extrabold tracking-tight break-words md:text-5xl">
            {social.email}
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest">
            Say hello
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-4"
        >
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="brut brut-hover flex flex-col items-start justify-between gap-6 p-5 hover:bg-pop"
            >
              <Icon size={26} className="text-ink" />
              <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink">
                {label}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
