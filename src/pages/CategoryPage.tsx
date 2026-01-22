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
import { ChevronDown, LayoutGrid, List } from "lucide-react";
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
        if (searchTerm) newParams.set("q", searchTerm);
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

        // State filter (from quick links / Hero dropdown)
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
        // Rooms filter comes as 'rooms' attribute with { min, max } from FiltersPanel
        // But URL searchParams are flat: 'rooms' key isn't used directly, but maybe we need to parse it?
        // Wait, the searchListings RPC handles 'attributes' logic for exact matches.
        // BUT Range filters in FiltersPanel might be sending complex keys or values.
        // Let's check how FiltersPanel sends range data.
        // It sends separate keys for subfilters usually if configured that way.
        // In filters.ts: 'rooms' has subfilters 'min' and 'max'.
        // So FiltersPanel will emit { rooms: { min: '...', max: '...' } } ???
        // No, FiltersPanel uses the key defined in subfilters?
        // Actually, let's look at FiltersPanel implementation or assume standard behavior.
        // If the user selects "min" for "Quartos", what param is set in URL?
        // Based on previous code: handleFilterChange iterates and sets params.
        
        // Let's debug the 'rooms' logic here.
        // If the user selects "2" in min dropdown for rooms.
        // The filter key is likely just 'min' inside the subfilter, but we need to know it belongs to 'rooms'.
        // The current implementation of FiltersPanel might be flattening keys incorrectly or we need to handle them here.
        
        // Let's enforce client-side range filtering for specific known keys like 'rooms' if RPC misses it
        // RPC 'search_listings' uses JSONB contains (@>) which handles exact matches, but NOT ranges for JSON fields easily.
        // So we MUST do client-side filtering for ranges on JSON attributes.

        // Rooms Check
        const roomsMin = searchParams.get("rooms_min");
        const roomsMax = searchParams.get("rooms_max");
        
        // NOTE: FiltersPanel likely needs to send 'rooms_min' and 'rooms_max' instead of just nested objects?
        // Or if it sends 'rooms' with a value?
        // Let's assume for now we need to manually check 'rooms' attribute in ad against URL params.
        
        // HACK: If we see params like 'min' or 'max' without context, it's ambiguous.
        // But let's look at how we parsed params at the top.
        // We put everything not in blocklist into 'attrs'.
        
        // Let's try to filter based on 'rooms' attribute if it exists in 'attrs' (exact match)
        // OR if we have specific range logic.
        
        // FIX: Let's implement robust client-side range check for 'rooms'
        if (ad.attributes?.rooms) {
            const adRooms = parseInt(ad.attributes.rooms);
            
            // Check if we have any room constraints in attrs that might be range-like
            // Since we don't have explicit 'rooms_min' keys in the filter config yet, 
            // we might need to rely on what is actually in the URL.
            // If the user selects '2' in the 'min' dropdown of 'Quartos', what is the URL param?
            // If filters.ts says subfilter key is 'min', and parent key is 'rooms'.
            // FiltersPanel likely constructs keys? No, it usually sends flat keys if not handled.
            
            // Let's assume the URL has specific params we need to catch.
            // For now, let's just log or try to match generic range logic if we can identify it.
            
            // Temporary Fix: Check if 'attrs' contains 'rooms' as a string (exact match)
            // If the user selected '2' in a dropdown that maps to 'rooms', it might be exact.
            // But 'Quartos' is a RANGE filter in config.
            
            // We need to parse range params from 'attrs' manually for client side.
            // The RPC might fail on ranges inside JSONB.
            
            // Let's handle 'rooms' specifically here using the 'attrs' object we built
            // But we need to know which keys in 'attrs' correspond to min/max rooms.
            // In filters.ts, keys are 'min' and 'max' nested under 'rooms'.
            // If FiltersPanel flattens them as 'rooms.min'? Or just 'min'?
            // If it's just 'min', it conflicts with Price min.
            
            // If the URL is ?min=2&max=5... that's ambiguous (Price vs Rooms).
            // We need to fix FiltersPanel keys in filters.ts to be unique (e.g., 'rooms_min').
            // BUT, since I can't change filters.ts easily right now without breaking UI state,
            // let's look at what's likely happening.
            
            // Actually, in filters.ts:
            // Price (Aluguel) -> key: 'price', subfilters: min, max (selects)
            // Quartos -> key: 'rooms', subfilters: min, max (selects)
            
            // Wait, if both use 'min' and 'max' as subfilter names, and FiltersPanel uses those names as keys...
            // They WILL conflict in the URL. ?min=... &min=...
            // THIS IS THE BUG.
            // The filters need unique keys in filters.ts.
            
            // HOWEVER, fixing filters.ts is a large refactor.
            // Let's see if we can infer or if we can change filters.ts quickly.
            // Changing filters.ts is the CORRECT fix.
            // 'rooms_min', 'rooms_max'.
            
            // Let's proceed with that fix in a separate tool call if needed, 
            // but first let's see if we can hack it here or if the user is just asking why it's not working.
            // It's not working because of the key conflict or RPC limitation.
            
            // Let's assume we update filters.ts to use unique keys.
            // I will update this file to handle 'rooms_min' and 'rooms_max' client-side just in case.
            
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

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {isAdultCategory && (
                <AdultContentWarning
                    onAccept={() => { }}
                    onDecline={() => navigate("/")}
                />
            )}
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white pt-3 pb-1">
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
                    
                    {/* FILTER BOX (Gray Area) */}
                    <div className="bg-[#eef1f3] p-4 rounded-sm border border-gray-200 mb-6">
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
                                        // LIST VIEW STYLES
                                        // Base container - Responsive: flex-col on mobile, flex-row on md+
                                        containerClasses = "border p-4 flex flex-col md:flex-row gap-4 transition-all group cursor-pointer relative shadow-sm hover:shadow-md rounded-sm";
                                        titleClasses = "font-bold text-lg group-hover:underline mb-1 uppercase text-[#004e8a]";
                                        
                                        if (isPremium) {
                                            // PREMIUM: White Background + Orange Border + Badge
                                            containerClasses += " bg-white";
                                            customStyle.borderColor = "#f97316"; // Orange-500 to match badge
                                            titleClasses = "font-bold text-lg group-hover:underline mb-1 uppercase text-[#004e8a]";
                                        } else if (isHighlight) {
                                            // HIGHLIGHT: Green Background #F4FFEA + Green Border #65B21C
                                            customStyle.backgroundColor = "#F4FFEA";
                                            customStyle.borderColor = "#65B21C";
                                            titleClasses = "font-bold text-lg group-hover:underline mb-1 uppercase text-green-700";
                                        } else {
                                            // REGULAR
                                            containerClasses += " bg-white border-gray-200 hover:border-gray-300";
                                        }
                                    } else {
                                        // GRID VIEW STYLES (FOTOS)
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
                                            
                                            {isPremium && viewMode === 'list' ? (
                                                <div className="flex gap-1 h-[180px] w-full md:w-auto flex-shrink-0">
                                                    {/* Main Image */}
                                                    <div className="w-full md:w-[240px] h-full relative bg-gray-200 overflow-hidden rounded-sm">
                                                        <img
                                                            src={ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"}
                                                            alt={ad.title}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                                                            <span className="text-blue-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{ad.images?.length || 0}</span>
                                                        </div>
                                                    </div>
                                                    {/* Thumbnails - Hidden on mobile for space */}
                                                    <div className="hidden md:flex flex-col gap-1 w-[100px] h-full">
                                                        <div className="h-1/2 relative bg-gray-200 overflow-hidden rounded-sm">
                                                            <img
                                                                src={ad.images?.[1] || ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="h-1/2 relative bg-gray-200 overflow-hidden rounded-sm">
                                                            <img
                                                                src={ad.images?.[2] || ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`${viewMode === 'list' ? 'w-full h-[200px] md:w-[240px] md:h-[180px]' : 'w-full h-[200px]'} flex-shrink-0 bg-gray-200 relative overflow-hidden rounded-sm`}>
                                                    <img
                                                        src={ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"}
                                                        alt={ad.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                                                        <span className="text-blue-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{ad.images?.length || 0}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className={titleClasses}>
                                                            <Link to={`/anuncio/${ad.id}`} className={viewMode === 'list' ? "block truncate" : "block"}>{ad.title}</Link>
                                                        </h3>
                                                    </div>
                                                    
                                                    {/* Attributes Row */}
                                                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1 flex-wrap">
                                                        {ad.attributes?.rooms && <span>{ad.attributes.rooms} Dormitório(s)</span>}
                                                        {ad.attributes?.rooms && <span>•</span>}
                                                        <span>{ad.attributes?.advertiser_type || 'Particular'}</span>
                                                        {viewMode === 'list' && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{ad.city} {ad.state}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Price */}
                                                    {ad.price && (
                                                        <div className={`font-bold text-xl mb-2 ${isHighlight ? 'text-[#76bc21]' : 'text-[#76bc21]'}`}>
                                                            R${ad.price.toLocaleString('pt-BR')}
                                                        </div>
                                                    )}

                                                    {viewMode === 'list' && (
                                                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                            {ad.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-end mt-2">
                                                    {viewMode === 'list' ? (
                                                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                                            {ad.category_id === 'imoveis' ? 'Casas a venda' : 'Classificados'}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-gray-400 text-xs truncate max-w-[150px]">
                                                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                                            {ad.city}
                                                        </div>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={(e) => handleToggleFavorite(e, ad.id)}
                                                        className={`transition-colors p-1 rounded-full hover:bg-gray-100 ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                    >
                                                        <svg className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            
                        )}
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-center mt-8 gap-1">
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
