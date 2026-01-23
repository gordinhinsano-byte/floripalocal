import { MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRecentListings } from "@/services/listings";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const RecentAds = () => {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['recent_ads_v3'],
    queryFn: () => getRecentListings(8)
  });

  return (
    <section className="py-10 bg-[#f6f7fb]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Anúncios recentes
          </h2>
          <Link to="/c/todas" className="text-sm text-viva-green hover:text-red-700 transition-colors">
            Ver todos →
          </Link>
        </div>
        
        {isLoading ? (
             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                 {[...Array(4)].map((_, i) => (
                     <div key={i} className="bg-white rounded-lg h-64 animate-pulse border border-gray-200/70"></div>
                 ))}
             </div>
        ) : ads.length === 0 ? (
             <div className="text-center py-10 text-gray-500">
                 Nenhum anúncio recente encontrado.
             </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ads.map((ad) => (
                <Link
                key={ad.id}
                to={`/anuncio/${ad.id}`}
                className="group bg-white border border-gray-200/80 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                    src={ad.images?.[0] || 'https://placehold.co/400x300?text=Sem+Foto'}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1.5 group-hover:text-viva-green transition-colors leading-tight h-9">
                    {ad.title}
                    </h3>
                    <p className="text-base font-bold text-viva-green mb-1.5">
                        {ad.price ? `R$ ${ad.price.toLocaleString('pt-BR')}` : 'Preço a combinar'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ad.city || ad.state || 'Brasil'}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>
                            {formatDistanceToNow(new Date(ad.created_at), { addSuffix: false, locale: ptBR })
                                .replace('cerca de ', '')
                                .replace('menos de um minuto', 'agora')}
                        </span>
                    </div>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};
