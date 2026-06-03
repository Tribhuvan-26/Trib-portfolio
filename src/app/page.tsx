import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Trajectory } from "@/components/Trajectory";
import { Signals } from "@/components/Signals";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero />
        <Trajectory />
        <About />
        <Signals />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
