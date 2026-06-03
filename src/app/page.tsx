import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Trajectory } from "@/components/Trajectory";
import { Signals } from "@/components/Signals";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { HazardTicker } from "@/components/HazardTicker";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero />
        <Trajectory />
        <HazardTicker
          items={[
            "BATTLE LOG ARCHIVED",
            "KAIJU SIGNATURES LOGGED",
            "DEPLOYMENT TRACE CLEAN",
            "TARGETING SYSTEMS NOMINAL",
          ]}
        />
        <About />
        <HazardTicker
          items={[
            "PILOT VITALS STABLE",
            "NEURAL LOAD BALANCED",
            "DRIFT COMPATIBLE",
            "CONN-POD SYNCED",
          ]}
        />
        <Signals />
        <HazardTicker
          items={[
            "FEED INTACT",
            "TELEMETRY UPLINK ACTIVE",
            "SHATTERDOME ONLINE",
            "READY FOR DEPLOYMENT",
          ]}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
