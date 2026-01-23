import { Search, ChevronDown, PlusCircle } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { CategoryBar } from "@/components/CategoryBar";
import { MobileCategoryMenu } from "@/components/MobileCategoryMenu";
import { useNavigate } from "react-router-dom";
import { CATEGORY_FILTERS, CATEGORY_GROUP_MAP } from "@/constants/filters";

// Define strict group order for display
const GROUP_ORDER = [
  "Veículos",
  "Imóveis",
  "Relacionamento",
  "Animais estimação",
  "Empregos",
  "Serviços",
  "Cursos",
  "Comunidade",
  "Para a sua casa",
  "Moda e beleza",
  "Multimédia & Eletrónicos",
  "Lazer e Hobbies"
];

const states = [
  "TODO BRASIL",
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro - RJ",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo - SP",
  "Sergipe",
  "Tocantins",
];

export const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Escolha a categoria desejada");
  const [selectedState, setSelectedState] = useState("TODO BRASIL");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  const flattenedCategories = useMemo(() => {
    const grouped: Record<string, { label: string, isHeader: boolean, id?: string }[]> = {};

    // Group items
    Object.entries(CATEGORY_FILTERS).forEach(([key, value]) => {
      const groupName = CATEGORY_GROUP_MAP[key] || "Outros";
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push({ label: value.label, isHeader: false, id: key });
    });

    const result = [{ label: "TODAS CATEGORIAS", isHeader: false }];

    // Flatten based on order
    GROUP_ORDER.forEach(groupName => {
      if (grouped[groupName] && grouped[groupName].length > 0) {
        result.push({ label: `-- ${groupName} --`, isHeader: true });
        result.push(...grouped[groupName]);
      }
    });

    // Handle any groups not in ORDER if necessary, or just ignore them to keep it clean (preferred)

    return result;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleSearch = () => {
    // If no specific category is selected, or "Escolha a categoria desejada"
    // we can redirect to a generic search or default category, or alert the user.
    // For now, let's try to map the label back to a slug if possible, or just go to /
    
    // Find the slug from the selected label
    let slug = "";
    Object.entries(CATEGORY_FILTERS).forEach(([key, value]) => {
      if (value.label === selectedCategory) {
        slug = key;
      }
    });

    // Handle "TODAS CATEGORIAS"
    if (selectedCategory === "TODAS CATEGORIAS") {
        slug = "todas"; // Or just empty string to go to a general search page
    }

    // Special mapping for categories in CategoryBar if not found in CATEGORY_FILTERS directly
    // Ideally CATEGORY_FILTERS should have everything.
    // If slug is still empty, try to match via text
    if (!slug && selectedCategory !== "Escolha a categoria desejada") {
        // Fallback map for items that might be in the dropdown but not in main filters map (if any)
         const reverseMap: Record<string, string> = {
            "Apartamentos - Casas venda": "comprar-imovel",
            "Alugar casas - Apartamentos": "alugar-casa-apartamento",
            "Carros usados": "carros-usados",
            "Motos usadas": "motos-scooters",
            // Add more common ones if needed, but CATEGORY_FILTERS should be source of truth
         };
         if (reverseMap[selectedCategory]) {
             slug = reverseMap[selectedCategory];
         }
    }

    if (slug) {
      // Redirect to category page with state query param
      // If slug is 'todas', maybe route to /classificados or just /c/todas
      let url = slug === 'todas' ? '/c/todas' : `/c/${slug}`;
      
      if (selectedState && selectedState !== "TODO BRASIL") {
        url += `?state=${encodeURIComponent(selectedState)}`;
      }
      navigate(url);
    } else {
      // If "Escolha a categoria desejada" and user clicks search
      if (selectedCategory === "Escolha a categoria desejada" && selectedState !== "TODO BRASIL") {
          // Search globally in the state?
          // We don't have a global search page yet, maybe send to 'todas'
          navigate(`/c/todas?state=${encodeURIComponent(selectedState)}`);
      }
    }
  };

  return (
    <>
    <section
      className="relative z-10 flex flex-col justify-center min-h-[380px] md:h-[460px] pb-12 md:pb-0"
      style={{
        backgroundImage: `linear-gradient(rgba(2,6,23,0.68), rgba(2,6,23,0.55)), url('/bannerhero.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // height: '460px' // Removed fixed height inline style to allow responsive classes
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center pt-28 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight drop-shadow">
            Anúncios Classificados Grátis
          </h1>

          {/* Search Form */}
          <div className="relative z-[60] bg-white/95 backdrop-blur rounded-none shadow-2xl ring-1 ring-black/5 flex flex-col md:flex-row">
            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowStateDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-viva-green/30 focus-visible:ring-inset"
              >
                <span className="truncate text-sm">{selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-[80] top-full left-0 right-0 -mt-px bg-white border border-gray-200 shadow-xl max-h-72 overflow-y-auto">
                  {flattenedCategories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!cat.isHeader) {
                          setSelectedCategory(cat.label);
                          setShowCategoryDropdown(false);
                        }
                      }}
                      disabled={cat.isHeader}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${cat.isHeader
                        ? "font-bold text-gray-800 bg-gray-100 cursor-default"
                        : "text-gray-700 hover:bg-viva-green hover:text-white cursor-pointer"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* State Dropdown */}
            <div ref={stateRef} className="relative md:w-52 border-b md:border-b-0 md:border-r border-gray-200">
              <button
                onClick={() => {
                  setShowStateDropdown(!showStateDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-viva-green/30 focus-visible:ring-inset"
              >
                <span className="truncate text-sm">{selectedState}</span>
                <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStateDropdown && (
                <div className="absolute z-[80] top-full left-0 right-0 -mt-px bg-white border border-gray-200 shadow-xl max-h-72 overflow-y-auto">
                  {states.map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        setSelectedState(state);
                        setShowStateDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-viva-green hover:text-white transition-colors"
                    >
                      {state}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
                onClick={handleSearch}
                className="bg-viva-green hover:bg-red-700 text-white px-8 py-3.5 flex items-center justify-center gap-2 transition-colors font-bold rounded-none"
            >
              <Search className="w-5 h-5" />
              <span>Buscar</span>
            </button>

            {/* Mobile: Post Ad Button (Between Search and Categories) */}
            <button 
                onClick={() => navigate('/publicar-anuncio')}
                className="md:hidden bg-[#ff7f00] hover:bg-[#e67300] text-white px-8 py-3.5 flex items-center justify-center gap-2 transition-colors font-bold border-t border-white/20 rounded-none"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Inserir Anúncio</span>
            </button>
          </div>
        </div>
      </div>
      <div className="hidden md:block absolute bottom-4 left-0 right-0 z-20">
        <CategoryBar />
      </div>
    </section>
    
    <MobileCategoryMenu />
    </>
  );
};
