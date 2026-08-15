import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/lib/theme";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
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
  weight: ["400", "500", "700"],
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
    "Tribhuvan — AI/ML engineer, full-stack developer, and mentor building fast, useful, real-world software. CNN, RAG, Next.js, Python.",
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
    description: "Fast, useful, real-world software. Built with care.",
    siteName: "Tribhuvan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribhuvan — AI/ML Engineer & Full-Stack Developer",
    description: "Fast, useful, real-world software. Built with care.",
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
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        {/* apply theme before paint — no light-flash on load */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-paper text-ink font-sans">
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
