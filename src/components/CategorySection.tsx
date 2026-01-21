import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CategorySection = () => {
  return (
    <section className="w-full bg-[#5B6378] h-[121px] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          Publique já o seu anúncio
        </h2>
        <Link to="/publicar-anuncio">
          <Button
            className="bg-viva-green hover:bg-viva-green/90 text-white font-bold py-2 px-6 rounded shadow-md transition-colors flex items-center gap-2 uppercase tracking-wider text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            Inserir Anúncio
          </Button>
        </Link>
      </div>
    </section>
  );
};
