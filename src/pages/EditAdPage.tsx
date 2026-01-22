import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CATEGORY_FILTERS } from "@/constants/filters";
import { getCategories } from "@/services/categories";
import { getListingById, updateListing } from "@/services/listings";
import { Category, Listing } from "@/types";
import { supabase } from "@/lib/supabaseClient";

type FilterDefinition = {
    name: string;
    type: "range" | "select" | "checkbox" | "price";
    key: string;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    subfilters?: Array<{ name: string; type: string; options: string[] }>;
};

export default function EditAdPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [listing, setListing] = useState<Listing | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySlug, setCategorySlug] = useState("");
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        state: "",
        city: "",
        userType: "",
        price: "",
        address: "",
        services: [],
        locations: []
    });

    const preventNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
    };

    useEffect(() => {
        (async () => {
            try {
                const [cats, ad] = await Promise.all([
                    getCategories(),
                    id ? getListingById(id) : Promise.resolve(null)
                ]);

                setCategories(cats);
                if (!ad) {
                    toast.error("Anúncio não encontrado.");
                    navigate("/");
                    return;
                }

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate(`/login`);
                    return;
                }
                if (ad.owner_id !== user.id) {
                    toast.error("Você não tem permissão para editar este anúncio.");
                    navigate(`/anuncio/${ad.id}`);
                    return;
                }

                setListing(ad);
                const slug = cats.find((c) => c.id === ad.category_id)?.slug || "";
                setCategorySlug(slug);

                const attrs = ad.attributes || {};
                setFormData({
                    ...attrs,
                    title: ad.title || "",
                    description: ad.description || "",
                    state: ad.state || "",
                    city: ad.city || "",
                    userType: attrs.userType || "",
                    price: ad.price !== null && ad.price !== undefined ? String(ad.price) : "",
                    address: attrs.address || "",
                    services: Array.isArray(attrs.services) ? attrs.services : [],
                    locations: Array.isArray(attrs.locations) ? attrs.locations : []
                });
            } catch (e: any) {
                console.error(e);
                toast.error("Erro ao carregar anúncio.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, navigate]);

    const filters: FilterDefinition[] = useMemo(() => {
        if (!categorySlug) return [];
        return (CATEGORY_FILTERS as any)[categorySlug]?.filters || [];
    }, [categorySlug]);

    const updateFormData = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const isEscortCategory = categorySlug.startsWith("acompanhantes");

    const generatedRangeOptions = (filter: FilterDefinition) => {
        if (Array.isArray(filter.options) && filter.options.length > 0) return filter.options;
        if (typeof filter.min === "number" && typeof filter.max === "number") {
            return Array.from(
                { length: Math.floor((filter.max - filter.min) / (filter.step || 1)) + 1 },
                (_, i) => String(filter.min! + i * (filter.step || 1))
            );
        }
        return undefined;
    };

    const renderFilter = (filter: FilterDefinition, index: number) => {
        if (filter.key === "price") return null;

        if (isEscortCategory && filter.key === "services" && Array.isArray(filter.options)) {
            const options: string[] = filter.options.filter((opt) => opt && opt !== "Todos");
            const selected: string[] = Array.isArray(formData.services) ? formData.services : [];
            const toggle = (service: string, checked: boolean) => {
                const next = checked
                    ? Array.from(new Set([...selected, service]))
                    : selected.filter((s) => s !== service);
                updateFormData("services", next);
            };

            const col1 = options.slice(0, 7);
            const col2 = options.slice(7);

            return (
                <div key={index} className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Serviços</label>
                    <div className="border border-gray-300 rounded bg-white p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                            <div className="space-y-2">
                                {col1.map((service) => {
                                    const checked = selected.includes(service);
                                    return (
                                        <label key={service} className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                                checked={checked}
                                                onChange={(e) => toggle(service, e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">{service}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="space-y-2">
                                {col2.map((service) => {
                                    const checked = selected.includes(service);
                                    return (
                                        <label key={service} className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                                checked={checked}
                                                onChange={(e) => toggle(service, e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">{service}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (filter.type === "checkbox" && Array.isArray(filter.options)) {
            const selected: string[] = Array.isArray(formData[filter.key]) ? formData[filter.key] : [];
            const toggle = (opt: string, checked: boolean) => {
                const next = checked
                    ? Array.from(new Set([...selected, opt]))
                    : selected.filter((v) => v !== opt);
                updateFormData(filter.key, next);
            };

            return (
                <div key={index} className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{filter.name}</label>
                    <div className="border border-gray-300 rounded bg-white p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                            {filter.options.map((opt) => {
                                const checked = selected.includes(opt);
                                return (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                            checked={checked}
                                            onChange={(e) => toggle(opt, e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-700">{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        const rangeOptions = generatedRangeOptions(filter);

        const value = formData[filter.key] ?? "";

        return (
            <div key={index} className="col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">{filter.name}</label>
                {filter.type === "select" || filter.type === "range" ? (
                    <select
                        value={value}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-600"
                        onChange={(e) => updateFormData(filter.key, e.target.value)}
                    >
                        <option value="">Escolha uma opção</option>
                        {(filter.options || rangeOptions || filter.subfilters?.[0]?.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : filter.type === "price" ? (
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">R$</span>
                        <input
                            type="number"
                            min={0}
                            onKeyDown={preventNegativeKey}
                            value={value}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            onChange={(e) => updateFormData(filter.key, e.target.value)}
                        />
                    </div>
                ) : (
                    <input
                        type="text"
                        value={value}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        onChange={(e) => updateFormData(filter.key, e.target.value)}
                    />
                )}
            </div>
        );
    };

    const handleSave = async () => {
        if (!listing) return;
        setSaving(true);
        try {
            const { title, description, state, city, userType, price, address, ...otherAttributes } = formData;

            const computedPrice = isEscortCategory ? Number(otherAttributes.rate_1h) : Number(price);
            if (!Number.isFinite(computedPrice) || computedPrice < 0) {
                toast.error(isEscortCategory ? "Cachê (1 hora) inválido" : "Preço inválido");
                return;
            }

            const nextCity = city || address || null;
            const nextAddress = address || "";

            await updateListing(listing.id, {
                title: String(title || ""),
                description: String(description || ""),
                state: String(state || ""),
                city: nextCity,
                price: computedPrice,
                attributes: { ...otherAttributes, userType, address: nextAddress }
            });

            toast.success("Anúncio atualizado!");
            navigate(`/anuncio/${listing.id}`);
        } catch (e: any) {
            console.error(e);
            toast.error("Erro ao salvar: " + (e?.message || "desconhecido"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="max-w-[960px] mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden p-8">
                        Carregando...
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!listing) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-[960px] mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-[#e6e6e6] px-6 py-3 border-b border-gray-300 flex justify-between items-center">
                        <h1 className="font-bold text-gray-700 text-lg">Editar anúncio</h1>
                        <div className="font-bold text-gray-700 text-sm">{categorySlug || "categoria"}</div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-base font-bold text-gray-700 mb-2">Título *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateFormData("title", e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-base font-bold text-gray-700 mb-2">Descrição *</label>
                                <textarea
                                    rows={8}
                                    value={formData.description}
                                    onChange={(e) => updateFormData("description", e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-orange-500 transition-colors resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Estado *</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-600"
                                    onChange={(e) => updateFormData("state", e.target.value)}
                                />
                            </div>

                            {!isEscortCategory && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Preço (Sem Pontuação) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                        <input
                                            type="number"
                                            min={0}
                                            onKeyDown={preventNegativeKey}
                                            value={formData.price}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            onChange={(e) => updateFormData("price", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Endereço {!isEscortCategory && <span>*</span>}
                                </label>
                                <input
                                    type="text"
                                    value={formData.address || ""}
                                    placeholder="Coloque rua, número e cidade (se quiser)."
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    onChange={(e) => updateFormData("address", e.target.value)}
                                />
                            </div>

                            {filters.map(renderFilter)}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate(`/anuncio/${listing.id}`)}
                                className="px-6 py-2 border border-gray-300 rounded text-gray-600 font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-[#76bc21] hover:bg-[#689F38] text-white font-bold rounded shadow-sm transition-colors disabled:opacity-50"
                                disabled={saving}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

