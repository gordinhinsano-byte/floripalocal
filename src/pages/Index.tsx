import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryBar } from "@/components/CategoryBar";
import { CategorySection } from "@/components/CategorySection";
import { RecentAds } from "@/components/RecentAds";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>Floripa Local | Classificados Acompanhantes, Imóveis e Empregos</title>
        <meta name="description" content="O melhor site de classificados em Florianópolis, São José e Palhoça. Encontre Acompanhantes, Garotas de Programa, Imóveis, Carros e Empregos no Floripa Local." />
        <meta name="keywords" content="acompanhantes florianopolis, garotas de programa sao jose, acompanhantes palhoca, viva local, vivalocal, classificados floripa" />
        <link rel="canonical" href="https://www.floripalocal.com/" />
      </Helmet>

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
