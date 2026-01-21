import { MapPin, Clock } from "lucide-react";

const recentAds = [
  {
    title: "Apartamento 2 quartos - Centro",
    price: "R$ 1.800/mês",
    location: "São Paulo, SP",
    time: "2h",
    category: "Imóveis",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=280&h=180&fit=crop",
  },
  {
    title: "Honda Civic 2020 - Único dono",
    price: "R$ 98.000",
    location: "Rio de Janeiro, RJ",
    time: "4h",
    category: "Veículos",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=280&h=180&fit=crop",
  },
  {
    title: "Vaga Desenvolvedor Full Stack",
    price: "A combinar",
    location: "Remoto",
    time: "5h",
    category: "Empregos",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=280&h=180&fit=crop",
  },
  {
    title: "iPhone 14 Pro Max 256GB",
    price: "R$ 5.500",
    location: "Belo Horizonte, MG",
    time: "6h",
    category: "Compra e Venda",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=280&h=180&fit=crop",
  },
  {
    title: "Aulas de Inglês Particular",
    price: "R$ 80/hora",
    location: "Curitiba, PR",
    time: "7h",
    category: "Cursos",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=280&h=180&fit=crop",
  },
  {
    title: "Golden Retriever Filhotes",
    price: "R$ 2.500",
    location: "Porto Alegre, RS",
    time: "8h",
    category: "Animais",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=280&h=180&fit=crop",
  },
  {
    title: "Eletricista Residencial 24h",
    price: "A partir de R$ 150",
    location: "Brasília, DF",
    time: "9h",
    category: "Serviços",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=280&h=180&fit=crop",
  },
  {
    title: "Casa 3 quartos com piscina",
    price: "R$ 650.000",
    location: "Florianópolis, SC",
    time: "10h",
    category: "Imóveis",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=280&h=180&fit=crop",
  },
];

export const RecentAds = () => {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Anúncios recentes
          </h2>
          <a href="#" className="text-sm text-viva-green hover:underline">
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentAds.map((ad, index) => (
            <article
              key={index}
              className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                  {ad.category}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1.5 hover:text-viva-green transition-colors leading-tight">
                  {ad.title}
                </h3>
                <p className="text-base font-bold text-viva-green mb-1.5">{ad.price}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{ad.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ad.time}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
