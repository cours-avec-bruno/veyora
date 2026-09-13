import { Hero } from "@/sections/home/Hero";
import { Principles } from "@/sections/home/Principles";
import { DestinationsGrid } from "@/sections/home/DestinationsGrid";
import { Interlude } from "@/sections/home/Interlude";
import { GuidesCollection } from "@/sections/home/GuidesCollection";
import { FeaturedGuide } from "@/sections/home/FeaturedGuide";
import { InsideGuide } from "@/sections/home/InsideGuide";
import { Figures } from "@/sections/home/Figures";
import { Method } from "@/sections/home/Method";
import { Social } from "@/sections/home/Social";
import { Manifesto } from "@/sections/home/Manifesto";
import { Newsletter } from "@/sections/home/Newsletter";
import { MobileDock } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Hero />
      <Principles />
      <DestinationsGrid />
      <Interlude />
      <GuidesCollection />
      <FeaturedGuide />
      <InsideGuide />
      <Figures />
      <Method />
      <Social />
      <Manifesto />
      <Newsletter />
      <MobileDock />
    </>
  );
}
