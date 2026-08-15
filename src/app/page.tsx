import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Stack } from "@/components/Stack";
import { Signals } from "@/components/Signals";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Command } from "@/components/Command";
import { StatHUD } from "@/components/StatHUD";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Command />
      <StatHUD />
      <Nav />
      <main className="relative pt-14">
        <Hero />
        <Ticker />
        <Work />
        <About />
        <Stack />
        <Signals />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
