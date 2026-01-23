import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CategorySection = () => {
  return (
    <section className="relative z-0 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 h-[112px] flex items-center border-y border-white/10">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Publique já o seu anúncio
        </h2>
        <Link to="/publicar-anuncio">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2 uppercase tracking-wider text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            Inserir Anúncio
          </Button>
        </Link>
      </div>
    </section>
  );
};
