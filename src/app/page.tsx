import { LoadingScreen } from "@/components/LoadingScreen";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Stack } from "@/components/Stack";
import { Trajectory } from "@/components/Trajectory";
import { Signals } from "@/components/Signals";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { ParticleCanvas } from "@/components/ParticleCanvas";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <LoadingScreen />
      <ParticleCanvas />
      <Nav />
      <main className="relative">
        <Hero />
        <Work />
        <About />
        <Stack />
        <Trajectory />
        <Signals />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
