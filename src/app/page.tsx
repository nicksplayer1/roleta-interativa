import type { Metadata } from "next";
import HeroLiveWheel from "@/components/wheel/hero-live-wheel";

export const metadata: Metadata = {
  title: "Roleta Interativa",
  description:
    "Crie roletas bonitas, rápidas e prontas para girar, compartilhar e testar sem login.",
};

export default function HomePage() {
  return <HeroLiveWheel />;
}
