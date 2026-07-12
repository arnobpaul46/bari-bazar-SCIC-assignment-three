import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedListings />
      <TestimonialsSection/>
    </main>
  );
}
