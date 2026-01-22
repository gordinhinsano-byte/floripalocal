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

import { uploadListingImage } from "@/services/listingImages";
import { X, Upload, Plus } from "lucide-react";

// ... (existing imports)

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

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState("");
    
    // Video Upload State
    const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

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
                setExistingImages(Array.isArray(ad.images) ? ad.images : []);
                setVideoUrl(attrs.video_url || "");

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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...files]);
            
            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            const urlToRemove = prev[index];
            URL.revokeObjectURL(urlToRemove); // Clean up memory
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate size/type if needed
            if (file.size > 50 * 1024 * 1024) { // 50MB limit example
                toast.error("O vídeo deve ter no máximo 50MB.");
                return;
            }
            setNewVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setVideoUrl("");
        setNewVideoFile(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
    };

    const handleSave = async () => {
        if (!listing) return;
        setSaving(true);
        try {
            // 1. Upload new images
            const uploadedUrls = await Promise.all(
                newImages.map(file => uploadListingImage(listing.id, file))
            );
            
            // 2. Upload Video if exists
            let finalVideoUrl = videoUrl;
            if (newVideoFile) {
                // Upload video using the same helper (it returns public URL)
                // Note: Ensure bucket allows video mime types
                finalVideoUrl = await uploadListingImage(listing.id, newVideoFile);
            }

            // 3. Combine images
            const finalImages = [...existingImages, ...uploadedUrls];

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
                images: finalImages, // Add images
                attributes: { 
                    ...otherAttributes, 
                    userType, 
                    address: nextAddress,
                    video_url: finalVideoUrl // Add video
                }
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
                        <h1 className="font-bold text-gray-700 text-lg">Editar Anúncio (Com Fotos)</h1>
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

                            {/* MEDIA SECTION */}
                            <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6 mt-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Fotos e Vídeo</h3>
                                
                                {/* Images Grid */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Fotos do Anúncio</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {/* Existing Images */}
                                        {existingImages.map((url, index) => (
                                            <div key={`existing-${index}`} className="relative aspect-square bg-gray-100 rounded border border-gray-200 group overflow-hidden">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors"
                                                    title="Remover foto"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* New Images Previews */}
                                        {previews.map((url, index) => (
                                            <div key={`new-${index}`} className="relative aspect-square bg-gray-100 rounded border border-gray-200 group overflow-hidden">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] text-center py-0.5">Nova</div>
                                                <button
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors"
                                                    title="Remover foto"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        <label className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageSelect}
                                            />
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-xs text-gray-500 font-medium">Adicionar Fotos</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Formatos aceitos: JPG, PNG. Máximo 5MB por foto.</p>
                                </div>

                                {/* Video Upload Section */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Vídeo do Anúncio (Opcional)</label>
                                        
                                        {videoUrl || videoPreview ? (
                                            <div className="relative w-full max-w-[200px] aspect-square bg-black rounded overflow-hidden border border-gray-200 group">
                                                <video 
                                                    src={videoPreview || videoUrl} 
                                                    className="w-full h-full object-cover"
                                                    controls
                                                    preload="metadata"
                                                    playsInline
                                                    crossOrigin="anonymous"
                                                />
                                                <button
                                                    onClick={removeVideo}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors z-10"
                                                    title="Remover vídeo"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                {newVideoFile && (
                                                     <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] text-center py-0.5">Novo Vídeo</div>
                                                )}
                                            </div>
                                        ) : (
                                            <label className="relative w-full max-w-[200px] aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition-colors">
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    onChange={handleVideoSelect}
                                                />
                                                <div className="p-3 bg-orange-100 rounded-full mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">Adicionar Vídeo</span>
                                                <span className="text-[10px] text-gray-400 mt-1">(Max 50MB)</span>
                                            </label>
                                        )}
                                    </div>
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
