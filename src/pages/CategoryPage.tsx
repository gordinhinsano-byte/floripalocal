import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiltersPanel } from "@/components/FiltersPanel";
import { AdultContentWarning } from "@/components/AdultContentWarning";
import { VIPCarousel } from "@/components/VIPCarousel";
import { useQuery } from "@tanstack/react-query";
import { searchListings, getFavorites, toggleFavorite } from "@/services/listings";
import { getCategoryBySlug } from "@/services/categories";
import { CATEGORY_FILTERS, CATEGORY_GROUP_MAP } from "@/constants/filters";
import { ChevronDown, LayoutGrid, List, Search, Filter, Bell, X } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

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

export default function CategoryPage() {
    const { categorySlug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const cleanSlug = categorySlug || "";
    
    // View Mode State
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
    // Favorites State
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        getFavorites().then(setFavorites).catch(() => {}); // Silent fail if not logged in
    }, []);

    const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();
        try {
            const isFav = await toggleFavorite(id);
            if (isFav) {
                setFavorites(prev => [...prev, id]);
                toast.success("Adicionado aos favoritos");
            } else {
                setFavorites(prev => prev.filter(fid => fid !== id));
                toast.success("Removido dos favoritos");
            }
        } catch (error: any) {
            console.error("Erro ao favoritar:", error);
            if (error.message === "Usuário não autenticado") {
                toast.error("Faça login para salvar favoritos");
            } else {
                toast.error("Erro: " + (error.message || "Não foi possível salvar"));
            }
        }
    };

    // Identify Adult Categories
    const isAdultCategory = [
        "acompanhantes",
        "acompanhantes-trans",
        "acompanhantes-masculinos",
        "encontros",
        "namoro",
        "mulher-procura-homem",
        "homem-procura-mulher",
        "mulher-procura-mulher",
        "homem-procura-homem",
        "relacionamentos"
    ].some(key => cleanSlug.includes(key));

    // Fetch Category from DB
    const { data: category } = useQuery({
        queryKey: ['category', cleanSlug],
        queryFn: () => getCategoryBySlug(cleanSlug),
        enabled: !!cleanSlug
    });

    // Prepare Filters UI
    const staticFilters = CATEGORY_FILTERS[cleanSlug as keyof typeof CATEGORY_FILTERS]?.filters || [];

    // Parse URL Params to SearchParams
    const attrs: Record<string, any> = {};
    const city = searchParams.get("city") || undefined;
    const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
    const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;
    const advertiserType = searchParams.get("advertiserType") || undefined;
    const searchTermQuery = searchParams.get("q") || "";
    const stateQuery = searchParams.get("state") || "";
    const hasPhotosParam = searchParams.get("has_photos");

    const normalizeText = (value: string) =>
        value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const advertiserTypeFilter = staticFilters.find(
        (f: any) => f?.key === "advertiser_type" && f?.type === "select"
    ) as any;
    const advertiserTypeOptions: string[] = advertiserTypeFilter?.options || [];
    const advertiserTypeValues = advertiserTypeOptions.filter((opt) => opt && opt !== "Todos");
    const privateAdvertiserLabel =
        advertiserTypeValues.find((opt) => normalizeText(opt) === "particular") || "Particular";
    const professionalAdvertiserLabel = advertiserTypeValues.find(
        (opt) => normalizeText(opt) !== normalizeText(privateAdvertiserLabel)
    );

    // Local state for search inputs
    const [searchTerm, setSearchTerm] = useState(searchTermQuery);
    const [selectedState, setSelectedState] = useState(stateQuery || "TODO BRASIL");

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const [showAllLocations, setShowAllLocations] = useState(false);
    
    // NEW MOBILE STATES
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const states = useMemo(() => ([
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
        "Rio de Janeiro",
        "Rio Grande do Norte",
        "Rio Grande do Sul",
        "Rondônia",
        "Roraima",
        "Santa Catarina",
        "São Paulo",
        "Sergipe",
        "Tocantins",
    ]), []);

    const flattenedCategories = useMemo(() => {
        const grouped: Record<string, { label: string; isHeader: boolean; slug?: string }[]> = {};

        Object.entries(CATEGORY_FILTERS).forEach(([slug, value]) => {
            const groupName = CATEGORY_GROUP_MAP[slug] || "Outros";
            if (!grouped[groupName]) grouped[groupName] = [];
            grouped[groupName].push({ label: value.label, isHeader: false, slug });
        });

        const result: { label: string; isHeader: boolean; slug?: string }[] = [];
        GROUP_ORDER.forEach((groupName) => {
            if (grouped[groupName]?.length) {
                result.push({ label: `-- ${groupName} --`, isHeader: true });
                result.push(...grouped[groupName]);
            }
        });

        return result;
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategorySelect = (newSlug: string) => {
        const newParams = new URLSearchParams();
        if (selectedState && selectedState !== "TODO BRASIL") newParams.set("state", selectedState);
        const query = newParams.toString();
        navigate(query ? `/c/${newSlug}?${query}` : `/c/${newSlug}`);
        setShowCategoryDropdown(false);
    };

    // Extract dynamic attributes
    for (const [k, v] of searchParams.entries()) {
        if (!['city', 'priceMin', 'priceMax', 'advertiserType', 'q', 'loc', 'state', 'has_photos'].includes(k)) {
            attrs[k] = v;
        }
    }

    // Add advertiserType to attributes query if present
    if (advertiserType) {
        if (advertiserType === "private") {
            attrs["advertiser_type"] = privateAdvertiserLabel;
        }
        if (advertiserType === "professional" && professionalAdvertiserLabel) {
            attrs["advertiser_type"] = professionalAdvertiserLabel;
        }
    }

    // Fetch Ads
    const { data: ads = [], isLoading } = useQuery({
        queryKey: ['ads', category?.id, searchParams.toString()],
        queryFn: () => category?.id ? searchListings({
            categoryId: category.id,
            city,
            minPrice: priceMin,
            maxPrice: priceMax,
            attributes: attrs
        }) : Promise.resolve([]),
        enabled: !!category?.id
    });

    const handleSearchSubmit = () => {
        const newParams = new URLSearchParams(searchParams);
        if (searchTerm) newParams.set("q", searchTerm);
        else newParams.delete("q");

        if (selectedState && selectedState !== "TODO BRASIL") newParams.set("state", selectedState);
        else newParams.delete("state");

        setSearchParams(newParams);
        setIsMobileFiltersOpen(false); // Close mobile modal if open
    };

    const applyRelatedSearch = (tag: string) => {
        const typeMap: Record<string, string> = {
            "Apartamento a Venda": "Apartamento",
            "Casa a Venda": "Casa",
            "Quitinete a Venda": "Kitnet",
            "Kitnet a Venda": "Kitnet",
            "Loft a Venda": "Loft",
            "Condominio a Venda": "Condomínio",
            "Sobrado a Venda": "Sobrado",
            "Duplex a Venda": "Duplex",
            "Triplex a Venda": "Triplex"
        };

        const mappedType = typeMap[tag];
        if (mappedType) {
            const newSlug = "comprar-imovel";
            const newParams = new URLSearchParams();
            if (selectedState && selectedState !== "TODO BRASIL") newParams.set("state", selectedState);
            newParams.set("property_type", mappedType);
            const query = newParams.toString();
            navigate(query ? `/c/${newSlug}?${query}` : `/c/${newSlug}`);
            return;
        }

        const newParams = new URLSearchParams(searchParams);
        newParams.set("q", tag);
        setSearchParams(newParams);
        setSearchTerm(tag);
    };

    const normalizeLocationLabel = (label: string) => {
        return label
            .replace(/\s+Estado$/i, "")
            .replace(/\s+RJ$/i, "")
            .replace(/\s+SP$/i, "")
            .trim();
    };

    const applyLocation = (locationLabel: string) => {
        const normalized = normalizeLocationLabel(locationLabel);
        setSelectedState(normalized);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("state", normalized);
        setSearchParams(newParams);
    };

    // Client-side filtering
    const allFilteredAds = ads.filter((ad: any) => {
        // Advertiser Type
        if (advertiserType === 'private') {
            const current = ad.attributes?.advertiser_type;
            if (current && normalizeText(String(current)) !== normalizeText(privateAdvertiserLabel)) return false;
        }
        if (advertiserType === 'professional') {
            const current = ad.attributes?.advertiser_type;
            if (!professionalAdvertiserLabel) return false;
            if (!current) return false;
            if (normalizeText(String(current)) !== normalizeText(professionalAdvertiserLabel)) return false;
        }

        // Text Search (Title/Description)
        if (searchTermQuery) {
            const term = searchTermQuery.toLowerCase();
            const matchTitle = ad.title?.toLowerCase().includes(term);
            const matchDesc = ad.description?.toLowerCase().includes(term);
            if (!matchTitle && !matchDesc) return false;
        }

        // State filter
        if (stateQuery) {
            const st = stateQuery.toLowerCase();
            const matchState = ad.state?.toLowerCase().includes(st);
            if (!matchState) return false;
        }

        // Photos Filter
        if (hasPhotosParam === 'true') {
            if (!ad.images || ad.images.length === 0) return false;
        }

        // Room Filter Logic
        if (ad.attributes?.rooms) {
            const adRooms = parseInt(ad.attributes.rooms);
            const rMin = searchParams.get("rooms_min");
            const rMax = searchParams.get("rooms_max");
            
            if (rMin && !isNaN(parseInt(rMin))) {
                if (adRooms < parseInt(rMin)) return false;
            }
            if (rMax && !isNaN(parseInt(rMax))) {
                if (rMax !== 'Ilimitado' && adRooms > parseInt(rMax)) return false;
            }
        }

        return true;
    });

    // Split into VIP and Regular ads
    const { vipAds, regularAds } = useMemo(() => {
        const vip: any[] = [];
        const regular: any[] = [];

        allFilteredAds.forEach((ad: any) => {
            const promotions = ad.attributes?.promotions || [];
            const planTier = (ad.attributes?.plan_tier ? String(ad.attributes.plan_tier).toLowerCase() : "");
            const planExpiresAt = ad.attributes?.plan_expires_at ? Date.parse(String(ad.attributes.plan_expires_at)) : NaN;
            const isPlanActive = Number.isFinite(planExpiresAt) ? planExpiresAt > Date.now() : false;
            const isVip = (planTier === "vip" && isPlanActive) || promotions.includes('vip');

            if (isVip) {
                vip.push(ad);
            }
            regular.push(ad);
        });

        return { vipAds: vip, regularAds: regular };
    }, [allFilteredAds]);

    const handleFilterChange = (newValues: any) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(newValues).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, String(value));
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        const newParams = new URLSearchParams();
        // Keep category-like params maybe? Or wipe all? Usually wipe filters but keep category context.
        // But since category is in URL path, we just clear search params.
        setSearchParams(newParams);
        setSearchTerm("");
        setSelectedState("TODO BRASIL");
        setIsMobileFiltersOpen(false);
    };

    const toggleAdvertiserType = (type: 'private' | 'professional') => {
        const newParams = new URLSearchParams(searchParams);
        const current = newParams.get("advertiserType");
        
        if (current === type) {
            newParams.delete("advertiserType");
        } else {
            newParams.set("advertiserType", type);
        }
        setSearchParams(newParams);
    };

    const categoryTitle = category?.name || cleanSlug.replace(/-/g, ' ').toUpperCase();

    // Toggle Photos Filter
    const togglePhotosFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        if (hasPhotosParam === 'true') {
            newParams.delete("has_photos");
            setViewMode('list');
        } else {
            newParams.set("has_photos", "true");
            setViewMode('grid'); // Usually photos filter implies grid view preference
        }
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {isAdultCategory && (
                <AdultContentWarning
                    onAccept={() => { }}
                    onDecline={() => navigate("/")}
                />
            )}
            
            {/* MOBILE FILTERS MODAL (OVERLAY) */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom-10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="font-bold text-gray-800 text-lg">Filtrar resultados</h2>
                        <button 
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {/* Body (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <FiltersPanel 
                            filters={staticFilters} 
                            onChange={handleFilterChange} 
                            layout="vertical"
                        />
                    </div>
                    
                    {/* Footer (Sticky) */}
                    <div className="p-4 border-t border-gray-200 bg-white flex gap-3 sticky bottom-0">
                        <button
                            onClick={clearFilters}
                            className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded shadow-sm transition-colors uppercase text-sm"
                        >
                            Limpar
                        </button>
                        <button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="flex-1 py-3 px-4 bg-[#ff8000] hover:bg-[#e67300] text-white font-bold rounded shadow-sm transition-colors uppercase text-sm"
                        >
                            Mostrar resultados
                        </button>
                    </div>
                </div>
            )}

            <Header />

            {/* Breadcrumb (Hidden on mobile to save space or simplified?) */}
            <div className="bg-white pt-3 pb-1 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 underline">
                        <Link to="/" className="hover:text-viva-green">Classificados</Link>
                        <span>&gt;</span>
                        <span className="text-gray-800 font-normal">Brasil {categoryTitle}</span>
                    </div>
                </div>
            </div>

            <main className="flex-1">
                <div className="container mx-auto px-4 py-4">
                    
                    {/* FILTER BOX (Responsive) */}
                    <div className="bg-[#eef1f3] p-4 rounded-sm border border-gray-200 mb-6">
                        
                        {/* DESKTOP LAYOUT (Hidden on mobile) */}
                        <div className="hidden md:block">
                             {/* Top Search Row */}
                            <div className="flex flex-col md:flex-row gap-2 mb-4">
                                <div ref={categoryRef} className="relative flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown((prev) => !prev)}
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-viva-green"
                                    >
                                        <span className="truncate">{categoryTitle}</span>
                                        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showCategoryDropdown && (
                                        <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 shadow-xl max-h-72 overflow-y-auto mt-1">
                                            {flattenedCategories.map((cat, index) => (
                                                <button
                                                    key={`${cat.label}-${index}`}
                                                    type="button"
                                                    disabled={cat.isHeader || !cat.slug}
                                                    onClick={() => {
                                                        if (!cat.isHeader && cat.slug) {
                                                            handleCategorySelect(cat.slug);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${cat.isHeader
                                                        ? "font-bold text-gray-800 bg-gray-100 cursor-default"
                                                        : "text-gray-600 hover:bg-viva-green hover:text-white cursor-pointer"
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        const next = e.target.value;
                                        setSelectedState(next);
                                        const newParams = new URLSearchParams(searchParams);
                                        if (next && next !== "TODO BRASIL") newParams.set("state", next);
                                        else newParams.delete("state");
                                        setSearchParams(newParams);
                                    }}
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white"
                                >
                                    {states.map((st) => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handleSearchSubmit}
                                    className="bg-[#76bc21] hover:bg-[#6aa61e] text-white font-bold px-8 py-2 rounded text-sm transition-colors uppercase"
                                >
                                    Procurar
                                </button>
                            </div>
                            {/* Horizontal Filters */}
                            <div className="pt-1">
                                <FiltersPanel filters={staticFilters} onChange={handleFilterChange} />
                            </div>
                        </div>

                        {/* MOBILE LAYOUT (Hidden on desktop) */}
                        <div className="md:hidden space-y-3">
                            {/* Row 1: Search Input */}
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g. 'casal', 'ativo'"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green"
                                />
                                <button 
                                    onClick={handleSearchSubmit}
                                    className="bg-[#76bc21] text-white p-2 rounded w-10 flex items-center justify-center"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Row 2: Category & Location */}
                            <div className="flex gap-2">
                                {/* Category Dropdown (Simplified) */}
                                <div className="flex-1 relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown((prev) => !prev)}
                                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 flex items-center justify-between"
                                    >
                                        <span className="truncate">{categoryTitle}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                     {showCategoryDropdown && (
                                        <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto mt-1">
                                            {flattenedCategories.map((cat, index) => (
                                                <button
                                                    key={`${cat.label}-${index}`}
                                                    disabled={cat.isHeader}
                                                    onClick={() => {
                                                        if (!cat.isHeader && cat.slug) handleCategorySelect(cat.slug);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${cat.isHeader ? "font-bold bg-gray-100" : "hover:bg-gray-50"}`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Location Input (Mocked as text for now to match UI, or use select) */}
                                <div className="flex-1">
                                     <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                                    >
                                        <option value="TODO BRASIL">Brasil</option>
                                        {states.slice(1).map((st) => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="flex-1 bg-white border border-gray-300 rounded py-2 flex items-center justify-center gap-2 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50"
                                >
                                    <Filter className="w-4 h-4 text-[#ff8000]" />
                                    Filtros
                                </button>
                                <button 
                                    onClick={togglePhotosFilter}
                                    className={`flex-1 bg-white border border-gray-300 rounded py-2 flex items-center justify-center gap-2 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 ${hasPhotosParam === 'true' ? 'ring-2 ring-[#ff8000]' : ''}`}
                                >
                                    <LayoutGrid className="w-4 h-4 text-[#ff8000]" />
                                    Fotos
                                </button>
                                <button 
                                    className="flex-1 bg-white border border-gray-300 rounded py-2 flex items-center justify-center gap-2 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50"
                                >
                                    <Bell className="w-4 h-4 text-[#ff8000]" />
                                    Alerta
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-4 border-b border-gray-200 pb-2">
                        <div className="flex items-baseline gap-6">
                            <h1 className="text-xl text-gray-800 font-normal">
                                <span className="font-bold">{allFilteredAds.length} resultados</span> {categoryTitle} em {stateQuery || "Brasil"}
                                <div className="h-[3px] bg-viva-green w-full mt-1"></div>
                            </h1>
                            
                            <div className="flex gap-4 text-sm text-gray-500 font-medium">
                                <button 
                                    onClick={() => toggleAdvertiserType('private')}
                                    className={`transition-colors hover:text-gray-900 ${advertiserType === 'private' ? 'text-[#76bc21] font-bold underline' : ''}`}
                                >
                                    {privateAdvertiserLabel}
                                </button>
                                {professionalAdvertiserLabel && (
                                    <button 
                                        onClick={() => toggleAdvertiserType('professional')}
                                        className={`transition-colors hover:text-gray-900 ${advertiserType === 'professional' ? 'text-[#76bc21] font-bold underline' : ''}`}
                                    >
                                        {professionalAdvertiserLabel}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                             <div className="flex border border-gray-300 rounded overflow-hidden">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-r border-gray-300 ${viewMode === 'list' ? 'bg-white text-gray-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-viva-green' : ''}`} />
                                    Classificados
                                </button>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold ${viewMode === 'grid' ? 'bg-white text-gray-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-viva-green' : ''}`} />
                                    Fotos
                                </button>
                             </div>
                             
                             <div className="flex items-center gap-2">
                                <select className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-600 bg-white">
                                    <option>Ordenar: Mais recentes</option>
                                    <option>Preço: Menor para Maior</option>
                                    <option>Preço: Maior para Menor</option>
                                </select>
                             </div>
                        </div>
                    </div>

                    {/* VIP Carousel */}
                    {vipAds.length > 0 && (
                        <div className="mb-6">
                            <VIPCarousel 
                                ads={vipAds} 
                                favorites={favorites} 
                                onToggleFavorite={handleToggleFavorite} 
                            />
                        </div>
                    )}

                    {/* Listings */}
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "space-y-4"}>
                        {isLoading ? (
                            <div className="col-span-full text-center py-10 text-gray-500">Carregando anúncios...</div>
                        ) : regularAds.length === 0 && vipAds.length === 0 ? (
                            <div className="col-span-full text-center py-10 bg-white rounded shadow-sm border border-gray-200">
                                <p className="text-gray-500 text-lg">Nenhum anúncio encontrado nesta categoria.</p>
                            </div>
                        ) : (
                            regularAds.map((ad: any) => {
                                    // Determine styling based on promotion plan (mocked or from attributes)
                                    // In a real app, this would check active subscriptions/promotions
                                    const promotions = ad.attributes?.promotions || [];
                                    const planTier = (ad.attributes?.plan_tier ? String(ad.attributes.plan_tier).toLowerCase() : "");
                                    const planExpiresAt = ad.attributes?.plan_expires_at ? Date.parse(String(ad.attributes.plan_expires_at)) : NaN;
                                    const isPlanActive = Number.isFinite(planExpiresAt) ? planExpiresAt > Date.now() : false;
                                    
                                    // VIPs are handled in Carousel, so here we only check Premium and Highlight
                                    const isVip = (planTier === "vip" && isPlanActive) || promotions.includes('vip');
                                    const isPremium = (planTier === "premium" && isPlanActive) || promotions.includes('premium');
                                    const isHighlight = promotions.includes('highlight'); // Green
                                    const isNew = promotions.includes('new_label');
                                    const isFavorited = favorites.includes(ad.id);

                                    // Base styles
                                    let containerClasses = "";
                                    let titleClasses = "";
                                    const customStyle: React.CSSProperties = {};
                                    
                                    if (viewMode === 'list') {
                                        // LIST VIEW STYLES - Mobile: Image left, content right
                                        containerClasses = "border p-3 flex flex-col gap-3 transition-all group cursor-pointer relative shadow-sm hover:shadow-md rounded-sm bg-white border-gray-200 hover:border-gray-300";
                                        titleClasses = "font-bold text-base group-hover:underline mb-1 uppercase text-[#004e8a] leading-tight";
                                        
                                        if (isPremium) {
                                            // PREMIUM
                                            customStyle.borderColor = "#f97316";
                                        } else if (isHighlight) {
                                            // HIGHLIGHT
                                            customStyle.backgroundColor = "#F4FFEA";
                                            customStyle.borderColor = "#65B21C";
                                            titleClasses = "font-bold text-base group-hover:underline mb-1 uppercase text-green-700 leading-tight";
                                        }
                                    } else {
                                        // GRID VIEW STYLES
                                        containerClasses = "bg-white border border-gray-200 p-3 flex flex-col gap-3 transition-all group cursor-pointer relative shadow-sm hover:shadow-md rounded-sm h-full";
                                        titleClasses = "font-bold text-sm group-hover:underline mb-1 uppercase text-[#004e8a] line-clamp-2";
                                    }

                                    return (
                                        <article
                                            key={ad.id}
                                            className={containerClasses}
                                            style={customStyle}
                                        >
                                            {isNew && (
                                                <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 z-10">
                                                    NOVO
                                                </div>
                                            )}

                                            {isPremium && viewMode === 'list' && (
                                                <div className="absolute -top-3 -right-1 bg-white text-orange-500 text-[10px] font-bold px-2 py-0.5 border border-orange-500 rounded-sm z-20 shadow-sm uppercase">
                                                    PREMIUM
                                                </div>
                                            )}
                                            
                                            {viewMode === 'list' ? (
                                                // LIST VIEW LAYOUT
                                                <>
                                                    {/* Top Section: Image + Info */}
                                                    <div className="flex gap-3">
                                                        {/* Image */}
                                                        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[120px] flex-shrink-0 relative bg-gray-200 overflow-hidden rounded-sm border border-gray-200">
                                                            <img
                                                                src={ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"}
                                                                alt={ad.title}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1 py-0.5 rounded flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                                                                <span className="text-blue-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{ad.images?.length || 0}</span>
                                                            </div>
                                                        </div>

                                                        {/* Right Info */}
                                                        <div className="flex-1 min-w-0 flex flex-col">
                                                            <h3 className={titleClasses}>
                                                                <Link to={`/anuncio/${ad.id}`} className="block truncate">{ad.title}</Link>
                                                            </h3>
                                                            
                                                            <div className="text-xs text-gray-500 mb-1">
                                                                {ad.attributes?.age ? `${ad.attributes.age} anos • ` : ''} {ad.city} {ad.state}
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                                                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                                                <span className="truncate">{ad.city}</span>
                                                            </div>

                                                            {ad.price && (
                                                                <div className="mt-auto">
                                                                     <span className="inline-block border border-gray-300 rounded px-2 py-0.5 text-xs font-bold text-gray-700 bg-white shadow-sm">
                                                                        Cachê: R${ad.price.toLocaleString('pt-BR')}
                                                                     </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Description (Full Width Below) */}
                                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed border-t border-gray-100 pt-2 mt-1">
                                                        {ad.description}
                                                    </p>
                                                    
                                                    {/* Bottom Actions (Heart) */}
                                                    <div className="absolute bottom-3 right-3">
                                                        <button 
                                                            onClick={(e) => handleToggleFavorite(e, ad.id)}
                                                            className={`transition-colors p-1.5 rounded-full border bg-white hover:bg-gray-50 shadow-sm ${isFavorited ? 'border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500'}`}
                                                        >
                                                            <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    {/* Grid View Content */}
                                                    <div>
                                                        <h3 className={titleClasses}>
                                                            <Link to={`/anuncio/${ad.id}`} className="block truncate">{ad.title}</Link>
                                                        </h3>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {ad.city}
                                                        </div>
                                                        {ad.price && (
                                                            <div className="font-bold text-lg text-[#76bc21] mt-1">
                                                                R${ad.price.toLocaleString('pt-BR')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })
                            
                        )}
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex gap-1 justify-center mt-8">
                        <button className="bg-[#76bc21] text-white font-bold w-8 h-8 flex items-center justify-center rounded-sm text-sm">1</button>
                        <button className="bg-white border border-gray-300 text-gray-600 font-bold w-8 h-8 flex items-center justify-center rounded-sm hover:bg-gray-50 text-sm">»</button>
                    </div>

                    {/* Related Searches & Locations */}
                    <div className="mt-8 space-y-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-sm">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm">Buscas Relacionadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Apartamento a Venda", "Duplex a Venda", "Quitinete a Venda", "Casa a Venda", "Kitnet a Venda", "Sobrado a Venda", "Condominio a Venda", "Loft a Venda", "Triplex a Venda"].map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => applyRelatedSearch(tag)}
                                        className="bg-[#eef1f3] hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-sm font-medium transition-colors"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 p-4 rounded-sm">
                            <div className="flex flex-wrap gap-2 items-center">
                                {(showAllLocations
                                    ? [
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
                                        "Rio de Janeiro RJ Estado",
                                        "Rio Grande do Norte",
                                        "Rio Grande do Sul",
                                        "Rondônia",
                                        "Roraima",
                                        "Santa Catarina",
                                        "São Paulo SP Estado",
                                        "Sergipe",
                                        "Tocantins"
                                    ]
                                    : ["Amazonas", "Bahia", "Ceará", "Goiás", "Minas Gerais", "Pernambuco", "Rio Grande do Sul", "Rio de Janeiro RJ Estado", "Santa Catarina", "São Paulo SP Estado"]
                                ).map(loc => (
                                    <button
                                        key={loc}
                                        type="button"
                                        onClick={() => applyLocation(loc)}
                                        className="bg-[#eef1f3] hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-sm font-medium transition-colors"
                                    >
                                        {loc}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowAllLocations((prev) => !prev)}
                                    className="text-gray-500 text-xs hover:underline ml-auto"
                                >
                                    {showAllLocations ? "menos localidades" : "mais localidades"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
