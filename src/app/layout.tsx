import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trib-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tribhuvan — AI/ML Engineer & Full-Stack Developer",
    template: "%s · Tribhuvan",
  },
  description:
    "Personal site of Tribhuvan — AI/ML engineer and full-stack developer building research-flavored products. CNN, RAG, Next.js, Python.",
  keywords: [
    "Tribhuvan",
    "Tribhuvan-26",
    "AI Engineer",
    "ML Engineer",
    "Full-Stack Developer",
    "Next.js",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Tribhuvan", url: "https://github.com/Tribhuvan-26" }],
  creator: "Tribhuvan",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Tribhuvan — AI/ML Engineer & Full-Stack Developer",
    description: "Research-flavored products. Built with care.",
    siteName: "Tribhuvan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribhuvan — AI/ML Engineer & Full-Stack Developer",
    description: "Research-flavored products. Built with care.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tribhuvan",
  url: SITE_URL,
  jobTitle: "AI/ML Engineer & Full-Stack Developer",
  sameAs: ["https://github.com/Tribhuvan-26"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-bg text-fg font-sans"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
