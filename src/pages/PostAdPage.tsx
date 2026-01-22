import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_FILTERS, CATEGORY_GROUP_MAP } from "@/constants/filters";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createListing, updateListing, uploadListingImage, uploadListingVideo } from "@/services/listings";
import { getCategories, getCategoryBySlug } from "@/services/categories";
import { Category } from "@/types";
import { supabase } from "@/lib/supabaseClient";

// Official FloripaLocal Icons from Source
const Icons = {
    Camera: () => (
        <svg viewBox="0 0 20 16" className="w-8 h-8 text-gray-400">
            <g stroke="none" strokeWidth="1" fillRule="evenodd" fill="currentColor">
                <path d="M3.20225318,2 C1.43369758,2 0,3.23013655 0,4.73257569 L0,13.2674243 C0,14.7765842 1.43835068,16 3.20225318,16 L16.7977468,16 C18.5663024,16 20,14.7698634 20,13.2674243 L20,4.73257569 C20,3.22341581 18.5616494,2 16.7977468,2 L3.20225318,2 L3.20225318,2 Z M10,14 C12.7614238,14 15,11.7614238 15,9.00000002 C15,6.23857625 12.7614238,4 10,4 C7.23857625,4 5,6.23857625 5,9.00000002 C5,11.7614238 7.23857625,14 10,14 L10,14 L10,14 Z M13,9.00000002 C13,7.34314572 11.6568542,6 10,6 C8.34314576,6 7,7.34314572 7,9.00000002 C7,10.6568542 8.34314576,12 10,12 C11.6568542,12 13,10.6568542 13,9.00000002 L13,9.00000002 Z M7,0 L5,2 L15,2 L13,0 L7,0 L7,0 Z"></path>
            </g>
        </svg>
    ),
    Video: () => (
        <svg viewBox="-1 -1 68 68" className="w-10 h-10 text-gray-400">
            <g>
                <ellipse cx="33.156" cy="32.859" rx="32.844" ry="32.859" fill="#000" stroke="#fff" strokeLinejoin="round" strokeWidth="2px" fillOpacity="0.31"></ellipse>
                <path fill="#fff" d="M46.992,42.002 C46.702,42.002 46.418,41.938 46.150,41.811 L41.534,39.371 L41.534,26.629 L46.150,24.190 C46.418,24.063 46.702,23.999 46.992,23.999 C48.099,23.999 49.000,24.924 49.000,26.062 L49.000,39.939 C49.000,41.077 48.099,42.002 46.992,42.002 ZM38.704,41.758 L18.765,41.758 C17.793,41.758 17.001,40.946 17.001,39.948 L17.001,26.053 C17.001,25.055 17.793,24.243 18.765,24.243 L35.134,24.243 L36.201,24.243 L38.704,24.243 C39.676,24.243 40.467,25.055 40.467,26.053 L40.467,39.948 C40.467,40.946 39.676,41.758 38.704,41.758 Z"></path>
            </g>
        </svg>
    ),
    Tick: () => (
        <svg viewBox="0 0 50 50" className="w-10 h-10 text-viva-green">
            <path d="M 5,13 8.5,16.5 18,7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
        </svg>
    )
}

export default function PostAdPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [categorySlug, setCategorySlug] = useState("");
    const [dbCategories, setDbCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdListingId, setCreatedListingId] = useState<string | null>(null);
    const preventNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
    };

    // Form Data
    const [formData, setFormData] = useState<any>({
        state: '',
        title: '',
        description: '',
        userType: '',
        offerType: 'sell',
        price: '',
        address: '',
        city: '',
        services: []
    });
    
    // Images: Local Preview and File Object
    const [imageFiles, setImageFiles] = useState<{file: File, preview: string}[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const stateOptions = [
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
        "Tocantins"
    ];

    useEffect(() => {
        // Check Auth
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                toast.error("Faça login para publicar um anúncio");
                navigate("/login?redirectTo=/publicar-anuncio");
            }
        });

        // Load categories from DB
        getCategories().then(setDbCategories).catch(console.error);
    }, []);

    const updateFormData = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Group categories logic (merging Static Constants with DB Data)
    // We use DB data for IDs but Static for UI grouping if name matches, or fallback
    const getGroupedCategories = () => {
        const groups: Record<string, any[]> = {};
        
        // Initialize groups
        Object.values(CATEGORY_GROUP_MAP).forEach(g => {
            groups[g] = [];
        });

        dbCategories.forEach(cat => {
            // Try to find group map by slug
            const groupName = CATEGORY_GROUP_MAP[cat.slug] || "Outros";
            if (!groups[groupName]) groups[groupName] = [];
            
            // Use static label if available for better formatting, else DB name
            const label = CATEGORY_FILTERS[cat.slug as keyof typeof CATEGORY_FILTERS]?.label || cat.name;
            
            groups[groupName].push({
                id: cat.id,
                slug: cat.slug,
                label: label
            });
        });

        return groups;
    };

    const groupedCategories = getGroupedCategories();

    const handleNext = async () => {
        if (step === 1) {
            if (!categorySlug || !formData.title || !formData.description || !formData.state) {
                toast.error("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
        }
        if (step === 2) {
            if (categorySlug.startsWith("acompanhantes")) return;
            if (!formData.price || !formData.userType) {
                toast.error("Preencha os campos obrigatórios (*)");
                return;
            }
        }

        if (step === 3) {
            await handlePublish();
            return;
        }

        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handlePublish = async () => {
        if (!createdListingId) return;
        setIsSubmitting(true);
        try {
            await updateListing(createdListingId, { status: 'active' });
            toast.success("Anúncio publicado com sucesso!");
            navigate('/minha-conta');
        } catch (error: any) {
            toast.error("Erro ao publicar: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCreateDraft = async () => {
        setIsSubmitting(true);
        try {
            // 1. Find category ID
            const category = dbCategories.find(c => c.slug === categorySlug);
            if (!category) throw new Error("Categoria inválida");

            // 2. Extract standard fields vs attributes
            const { title, description, price, state, city, userType, offerType, address, ...otherAttributes } = formData;
            const computedPrice = categorySlug.startsWith("acompanhantes") ? Number(otherAttributes.rate_1h) : Number(price);

            // 3. Create Listing (Draft)
            const newListing = await createListing({
                title,
                description,
                price: computedPrice,
                category_id: category.id,
                type: offerType === 'sell' ? 'produto' : 'serviço', // Simplified mapping
                state,
                city: city || address, // Fallback
                attributes: { ...otherAttributes, userType, address },
                images: [] // Will update after upload
            });

            if (!newListing) throw new Error("Falha ao criar rascunho");
            setCreatedListingId(newListing.id);

            // 4. Upload Images
            const uploadedUrls: string[] = [];
            for (const img of imageFiles) {
                try {
                    const url = await uploadListingImage(img.file, newListing.id);
                    uploadedUrls.push(url);
                } catch (err) {
                    console.error("Failed to upload image", err);
                }
            }

            // 5. Update Listing with Images
            await updateListing(newListing.id, { images: uploadedUrls });

            if (videoFile) {
                try {
                    const videoUrl = await uploadListingVideo(videoFile, newListing.id);
                    await updateListing(newListing.id, {
                        attributes: { ...(newListing as any).attributes, video_url: videoUrl }
                    });
                } catch (err) {
                    console.error("Failed to upload video", err);
                }
            }
            
            setStep(3); // Go to success screen

        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao salvar rascunho: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Trigger draft creation at end of Step 2 when user clicks "Next" (which is actually "Publish" flow start)
    // But in this UI, Step 2 Next -> Step 3 (Success). So we do logic on transition 2->3
    const handleStep2Submit = () => {
        if (!formData.userType) {
            toast.error("Preencha os campos obrigatórios (*)");
            return;
        }
        if (!categorySlug.startsWith("acompanhantes") && !formData.price) {
            toast.error("Preencha os campos obrigatórios (*)");
            return;
        }
        if (categorySlug.startsWith("acompanhantes") && !formData.rate_1h) {
            toast.error("Preencha o Cachê (1 hora) (*)");
            return;
        }
        if (!categorySlug.startsWith("acompanhantes") && formData.price && Number(formData.price) < 0) {
            toast.error("Preço não pode ser negativo");
            return;
        }
        if (categorySlug.startsWith("acompanhantes")) {
            if (formData.rate_30m && Number(formData.rate_30m) < 0) {
                toast.error("Cachê (30 minutos) não pode ser negativo");
                return;
            }
            if (formData.rate_1h && Number(formData.rate_1h) < 0) {
                toast.error("Cachê (1 hora) não pode ser negativo");
                return;
            }
            if (formData.rate_2h && Number(formData.rate_2h) < 0) {
                toast.error("Cachê (2 horas) não pode ser negativo");
                return;
            }
        }
        handleCreateDraft();
    }

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const preview = URL.createObjectURL(file);
            setImageFiles([...imageFiles, { file, preview }]);
        }
    }

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    }

    // Dynamic Filter Renderer
    const renderDynamicFilters = () => {
        const filters = CATEGORY_FILTERS[categorySlug as keyof typeof CATEGORY_FILTERS]?.filters || [];

        return filters.map((filter: any, index: number) => {
            if (filter.key === 'price') return null;

            if (categorySlug.startsWith("acompanhantes") && filter.key === "services" && Array.isArray(filter.options)) {
                const options: string[] = filter.options.filter((opt: string) => opt && opt !== "Todos");
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Serviços
                        </label>
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {filter.name}
                        </label>
                        <div className="border border-gray-300 rounded bg-white p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                                {filter.options.map((opt: string) => {
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

            const generatedRangeOptions =
                filter.type === "range" && Array.isArray(filter.options) && filter.options.length > 0
                    ? filter.options
                    : filter.type === "range" && typeof filter.min === "number" && typeof filter.max === "number"
                        ? Array.from(
                            { length: Math.floor((filter.max - filter.min) / (filter.step || 1)) + 1 },
                            (_, i) => String(filter.min + i * (filter.step || 1))
                        )
                        : undefined;

            const required =
                filter.type !== "checkbox" &&
                !(categorySlug.startsWith("acompanhantes") && (filter.key === "rate_30m" || filter.key === "rate_2h"));

            return (
                <div key={index} className="col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        {filter.name} {required && <span className="text-red-500">*</span>}
                    </label>

                    {filter.type === 'select' || filter.type === 'range' ? (
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-600"
                            onChange={(e) => updateFormData(filter.key, e.target.value)}
                        >
                            <option value="">Escolha uma opção</option>
                            {(filter.options || generatedRangeOptions)?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            )) || filter.subfilters?.[0].options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : filter.type === 'checkbox' ? (
                        <div className="flex items-center pt-2">
                            <input
                                type="checkbox"
                                id={filter.key}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                onChange={(e) => updateFormData(filter.key, e.target.checked)}
                            />
                            <label htmlFor={filter.key} className="ml-2 block text-sm text-gray-700">{filter.name}</label>
                        </div>
                    ) : filter.type === 'price' ? (
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">R$</span>
                            <input
                                type="number"
                                min={0}
                                onKeyDown={preventNegativeKey}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (v.startsWith("-")) {
                                        updateFormData(filter.key, "");
                                        return;
                                    }
                                    updateFormData(filter.key, v);
                                }}
                            />
                        </div>
                    ) : (
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            onChange={(e) => updateFormData(filter.key, e.target.value)}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-[960px] mx-auto bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Bar */}
                    <div className="bg-[#e6e6e6] px-6 py-3 border-b border-gray-300 flex justify-between items-center">
                        <h1 className="font-bold text-gray-700 text-lg">Publicar meu anúncio</h1>
                        <div className="font-bold text-gray-700 text-sm">{step} / 3</div>
                    </div>

                    <div className="p-8">
                        {/* STEP 1: CATEGORY, STATE, TITLE, DESCRIPTION */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-2">Categoria</label>
                                    <Select onValueChange={setCategorySlug} value={categorySlug}>
                                        <SelectTrigger className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-600 rounded">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[350px]">
                                            {Object.entries(groupedCategories).map(([group, items]) => (
                                                items.length > 0 && (
                                                    <SelectGroup key={group}>
                                                        <SelectLabel className="bg-[#8cce3b] text-white/50 text-center font-normal py-1 border-b border-[#8cce3b]">-- {group} --</SelectLabel>
                                                        {items.map(item => (
                                                            <SelectItem key={item.id} value={item.slug} className="pl-8 focus:bg-blue-600 focus:text-white cursor-pointer py-1.5">
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                )
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-2">Estado</label>
                                    <Select onValueChange={(v) => updateFormData('state', v)} value={formData.state}>
                                        <SelectTrigger className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-600 rounded">
                                            <SelectValue placeholder="Selecione um estado" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[350px]">
                                            {stateOptions.map((st) => (
                                                <SelectItem key={st} value={st} className="cursor-pointer py-1.5">
                                                    {st}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-2">Título do seu Anúncio *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => updateFormData('title', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Insira pelo menos 15 caracteres</p>
                                </div>

                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-2">Descrição *</label>
                                    <textarea
                                        rows={8}
                                        value={formData.description}
                                        onChange={(e) => updateFormData('description', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-orange-500 transition-colors resize-y"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DETAILS & FILTERS */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Static Fields Step 2 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Você é *</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-600"
                                            onChange={(e) => updateFormData('userType', e.target.value)}
                                        >
                                            <option value="">Escolha uma opção</option>
                                            <option value="particular">Particular</option>
                                            <option value="profissional">Profissional</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo Oferta *</label>
                                        <div className="flex flex-col gap-2 pt-1">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="text-orange-500 focus:ring-orange-500" defaultChecked />
                                                <span className="text-sm text-gray-600">Vendo</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="text-orange-500 focus:ring-orange-500" />
                                                <span className="text-sm text-gray-600">Procuro</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Dynamic Fields */}
                                    {renderDynamicFilters()}

                                    {!categorySlug.startsWith("acompanhantes") && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Preço (Sem Pontuação) *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    onKeyDown={preventNegativeKey}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        if (v.startsWith("-")) {
                                                            updateFormData("price", "");
                                                            return;
                                                        }
                                                        updateFormData("price", v);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Endereço {!categorySlug.startsWith("acompanhantes") && <span>*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Coloque rua, número e cidade (se quiser). (Ex.: Av. Paulista , 1000)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            onChange={(e) => updateFormData('address', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Media Section - Using Official Icons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 mt-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Adicionar fotos</label>
                                        <p className="text-xs text-gray-600 mb-3">A primeira foto que você coloca será a sua foto de perfil.</p>

                                        <div className="flex gap-4 flex-wrap">
                                            {imageFiles.map((img, i) => (
                                                <div key={i} className="w-24 h-24 bg-gray-200 rounded border border-gray-300 overflow-hidden relative">
                                                    <img src={img.preview} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <label className="w-24 h-24 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors rounded cursor-pointer flex items-center justify-center relative">
                                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                <Icons.Camera />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Adicione seu vídeo</label>
                                        <p className="text-xs text-gray-600 mb-3">Importante: Adicione um toque pessoal no seu anúncio. Publique um vídeo de 1 minuto.</p>

                                        <div className="w-24 h-24 bg-gray-300 hover:bg-gray-400 transition-colors rounded-full cursor-pointer flex items-center justify-center relative mx-auto md:mx-0">
                                            <input type="file" onChange={handleVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" />
                                            <Icons.Video />
                                        </div>
                                        {videoFile && (
                                            <div className="text-xs text-gray-500 mt-2 truncate">
                                                Vídeo selecionado: {videoFile.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUCCESS STEP */}
                        {step === 3 && (
                            <div className="space-y-6 text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
                                    <Icons.Tick />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Anúncio Pronto!</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Seu anúncio foi criado como rascunho com sucesso. Clique em publicar para torná-lo visível para todos.
                                </p>
                            </div>
                        )}


                        {/* Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                            {step > 1 ? (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-2 border border-gray-300 rounded text-gray-600 font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm"
                                >
                                    Voltar
                                </button>
                            ) : (
                                <div></div>
                            )}

                            <button
                                onClick={step === 1 ? handleNext : (step === 2 ? handleStep2Submit : handlePublish)}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-[#ff7f00] text-white font-bold rounded shadow-sm hover:bg-[#e67300] transition-colors text-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processando...' : (step === 3 ? 'Publicar Agora' : 'Próximo')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
