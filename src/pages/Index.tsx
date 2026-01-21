
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryBar } from "@/components/CategoryBar";
import { CategorySection } from "@/components/CategorySection";
import { RecentAds } from "@/components/RecentAds";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      <Header transparent />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <RecentAds />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
