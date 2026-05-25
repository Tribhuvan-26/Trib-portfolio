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
      index="007"
      label="ESTABLISH TRANSMISSION"
      title="reach"
      kicker="Direct comms or the form. Either lands in the same inbox."
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        {/* left: direct links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7 }}
          className="relative flex flex-col gap-1 border border-line bg-bg-elev p-2"
        >
          <span className="absolute -top-3 left-4 bg-bg-elev px-2 font-mono text-[10px] tracking-widest text-fg-muted">
            // DIRECT CHANNELS
          </span>
          {[
            { label: "EMAIL", value: social.email, href: `mailto:${social.email}` },
            { label: "GITHUB", value: `@${social.githubHandle}`, href: social.github },
            { label: "LINKEDIN", value: "profile", href: social.linkedin },
            { label: "TWITTER / X", value: "profile", href: social.twitter },
          ].map((l, idx) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`group flex items-baseline justify-between px-4 py-4 transition-colors hover:bg-accent ${
                idx > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-fg-faint group-hover:text-fg">
                {l.label}
              </span>
              <span className="flex items-center gap-2 font-display text-base text-fg md:text-lg">
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
          <Field label="CALL SIGN">
            <input
              required
              name="name"
              autoComplete="name"
              className="w-full border-b-2 border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-fg md:text-lg"
              placeholder="who are you?"
            />
          </Field>
          <Field label="RETURN FREQUENCY">
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="w-full border-b-2 border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-fg md:text-lg"
              placeholder="how do I reach you?"
            />
          </Field>
          <Field label="PAYLOAD">
            <textarea
              required
              name="message"
              rows={4}
              className="w-full resize-none border-b-2 border-line bg-transparent py-3 font-display text-base text-fg outline-none transition-colors focus:border-fg md:text-lg"
              placeholder="what's the transmission?"
            />
          </Field>

          {!ENDPOINT && (
            <div className="font-mono text-[10px] tracking-widest text-fg-faint">
              // DEMO MODE — SET NEXT_PUBLIC_FORMSPREE_ID FOR LIVE
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group mt-4 inline-flex items-center gap-3 self-start border-2 border-fg bg-fg px-6 py-3 font-mono text-xs tracking-widest text-bg transition-all hover:bg-accent hover:text-fg disabled:opacity-50"
          >
            {status === "submitting" ? "TRANSMITTING…" : "SEND TRANSMISSION"}
            <ArrowUpRight size={14} />
          </button>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs tracking-widest text-fg"
              >
                ✓ TRANSMISSION RECEIVED — STAND BY FOR RESPONSE
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs tracking-widest text-alert"
              >
                ✗ TRANSMISSION FAILED — {error}
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
