import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedListings />
    </main>
  );
}
