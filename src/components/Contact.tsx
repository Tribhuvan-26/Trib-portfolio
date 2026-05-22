"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { social } from "@/config/social";
import { Section } from "./Section";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";
const ENDPOINT = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : null;

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ENDPOINT) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3500);
      return;
    }
    const form = e.currentTarget;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <Section
      id="contact"
      index="007 — contact"
      title="reach"
      kicker="Best places to find me. Or use the form."
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        {/* left: direct links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-3"
        >
          {[
            { label: "Email", value: social.email, href: `mailto:${social.email}` },
            { label: "GitHub", value: `@${social.githubHandle}`, href: social.github },
            { label: "LinkedIn", value: "profile", href: social.linkedin },
            { label: "Twitter / X", value: "profile", href: social.twitter },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between border-b border-line py-3 transition-colors hover:border-accent"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-fg-faint">
                {l.label}
              </span>
              <span className="flex items-center gap-2 font-display text-base text-fg group-hover:text-accent md:text-lg">
                {l.value}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </motion.div>

        {/* right: form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ delay: 0.15, duration: 0.7 }}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
        >
          <Field label="Name">
            <input
              required
              name="name"
              autoComplete="name"
              className="w-full border-b border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-accent md:text-lg"
              placeholder="who are you?"
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="w-full border-b border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-accent md:text-lg"
              placeholder="how do I reach you?"
            />
          </Field>
          <Field label="Message">
            <textarea
              required
              name="message"
              rows={4}
              className="w-full resize-none border-b border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-accent md:text-lg"
              placeholder="what's on your mind?"
            />
          </Field>

          {!ENDPOINT && (
            <div className="font-mono text-[10px] tracking-widest text-fg-faint">
              demo mode · set NEXT_PUBLIC_FORMSPREE_ID for live submission
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group mt-4 inline-flex items-center gap-3 self-start border border-accent bg-transparent px-6 py-3 font-mono text-xs tracking-widest text-accent transition-all hover:bg-accent hover:text-bg disabled:opacity-50"
          >
            {status === "submitting" ? "sending…" : "send message"}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs tracking-widest text-accent"
              >
                ✓ message received — I&apos;ll get back to you
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs tracking-widest text-red-400"
              >
                ✗ failed — {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">
        {label}
      </div>
      {children}
    </label>
  );
}
