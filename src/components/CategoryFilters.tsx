import React from 'react';
import { CATEGORY_FILTERS } from '@/constants/filters';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface CategoryFiltersProps {
    categorySlug: string;
    onFilterChange?: (filters: any) => void;
}

interface Filter {
    name: string;
    type: 'select' | 'range' | 'checkbox';
    key: string;
    options?: string[];
    subfilters?: {
        name: string;
        type: string;
        options: string[];
    }[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

type DbFilterRow = {
    key: string;
    label: string;
    ui: 'select' | 'range' | 'checkbox';
    value_type: 'text' | 'number' | 'boolean';
    config: any;
};

function mapDbFiltersToUi(rows: DbFilterRow[]): Filter[] {
    return rows.map((r) => {
        const base: Filter = {
            name: r.label,
            type: r.ui,
            key: r.key,
        };

        // For selects: config.options = [..]
        if (r.ui === 'select') {
            return { ...base, options: Array.isArray(r.config?.options) ? r.config.options : [] };
        }

        // For checkboxes: no extra config needed
        if (r.ui === 'checkbox') return base;

        // For ranges: support two modes
        // 1) "subfilters" with min/max arrays (to match your existing UI)
        // 2) numeric range with min/max/step
        if (r.ui === 'range') {
            if (r.config?.subfilters?.min && r.config?.subfilters?.max) {
                return {
                    ...base,
                    subfilters: [
                        { name: 'min', type: 'select', options: r.config.subfilters.min },
                        { name: 'max', type: 'select', options: r.config.subfilters.max },
                    ],
                };
            }

            if (typeof r.config?.min === 'number' && typeof r.config?.max === 'number') {
                return {
                    ...base,
                    min: r.config.min,
                    max: r.config.max,
                    step: r.config.step,
                    unit: r.config.unit,
                };
            }
        }

        return base;
    });
}


export const CategoryFilters = ({ categorySlug, onFilterChange }: CategoryFiltersProps) => {
    const categoryData = CATEGORY_FILTERS[categorySlug as keyof typeof CATEGORY_FILTERS];

    // Prefer DB-driven filters if available
    const { data: dbFilters } = useQuery({
        queryKey: ['category-filters', categorySlug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('attribute_definitions')
                .select('key,label,ui,value_type,config')
                .eq('category_slug', categorySlug)
                .order('created_at', { ascending: true });

            if (error) return [] as DbFilterRow[];
            return (data || []) as DbFilterRow[];
        },
        staleTime: 5 * 60 * 1000,
    });

    const resolvedFilters: Filter[] = (dbFilters && dbFilters.length > 0)
        ? mapDbFiltersToUi(dbFilters)
        : ((categoryData?.filters as Filter[]) || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = React.useState<URLSearchParams>(new URLSearchParams(window.location.search));
    const [localFilters, setLocalFilters] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        // Initialize filters from URL params
        const params = new URLSearchParams(window.location.search);
        const initialFilters: Record<string, string> = {};
        params.forEach((value, key) => {
            initialFilters[key] = value;
        });
        setLocalFilters(initialFilters);
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev };
            if (value === "") {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }
            return newFilters;
        });
    };

    const handleCheckboxChange = (key: string, checked: boolean, value?: string) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev };

            if (value) {
                // For multi-checkbox logic (e.g. Media types)
                // We might perform this differently depending on backend expectations, 
                // but for now let's assume keys like "has_media_photos=true"
                const compoundKey = `${key}_${value}`;
                if (checked) {
                    newFilters[compoundKey] = "true";
                } else {
                    delete newFilters[compoundKey];
                }
            } else {
                // Single checkbox
                if (checked) {
                    newFilters[key] = "true";
                } else {
                    delete newFilters[key];
                }
            }

            return newFilters;
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(localFilters).forEach(([key, value]) => {
            params.append(key, value);
        });

        // Update URL
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);

        // Notify parent if needed (though we updated URL directly which simulates navigation)
        if (onFilterChange) {
            onFilterChange(localFilters);
        }

        // Force reload/re-render if needed or rely on parent listening to URL
        window.location.search = params.toString();
    };

    if ((!dbFilters || dbFilters.length === 0) && !categoryData) {
        return <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500">Filtros não disponíveis para esta categoria.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-bold text-[#003366] uppercase mb-4 tracking-wide">FILTROS</h2>

            {/* Search & Location - Top Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-gray-100 pb-6">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">O QUE VOCÊ PROCURA?</label>
                    <input
                        type="text"
                        value={localFilters['q'] || ''}
                        onChange={(e) => handleFilterChange('q', e.target.value)}
                        placeholder="Buscar por palavra-chave..."
                        className="w-full h-9 px-3 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-700"
                    />
                </div>
                <div className="w-full md:w-64">
                    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">ONDE?</label>
                    <select
                        value={localFilters['region'] || ''}
                        onChange={(e) => handleFilterChange('region', e.target.value)}
                        className="w-full h-9 px-3 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-700"
                    >
                        <option value="">Todo Brasil</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
                {resolvedFilters.map((filter) => {
                    // Handle range filters with subfilters (existing behavior)
                    if (filter.type === 'range' && filter.subfilters) {
                        return (
                            <div key={filter.name} className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase">{filter.name}</label>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={localFilters[`${filter.key}_min`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white min-w-[100px]"
                                    >
                                        <option value="">Min</option>
                                        {filter.subfilters[0].options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-400">-</span>
                                    <select
                                        value={localFilters[`${filter.key}_max`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white min-w-[100px]"
                                    >
                                        <option value="">Max</option>
                                        {filter.subfilters[1].options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        );
                    }

                    // Handle generic range filters with min/max/step (auto-generated)
                    if (filter.type === 'range' && filter.min !== undefined && filter.max !== undefined) {
                        const step = filter.step || 1;
                        const options = [];
                        for (let i = filter.min; i <= filter.max; i += step) {
                            options.push(i);
                        }

                        return (
                            <div key={filter.name} className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase">{filter.name}</label>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={localFilters[`${filter.key}_min`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white min-w-[100px]"
                                    >
                                        <option value="">De {filter.unit || ''}</option>
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt} {filter.unit}</option>
                                        ))}
                                    </select>
                                    <span className="text-gray-400">-</span>
                                    <select
                                        value={localFilters[`${filter.key}_max`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white min-w-[100px]"
                                    >
                                        <option value="">Até {filter.unit || ''}</option>
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt} {filter.unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        );
                    }

                    if (filter.type === 'select') {
                        return (
                            <div key={filter.name} className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase">{filter.name}</label>
                                <select
                                    value={localFilters[filter.key] || ""}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white min-w-[140px]"
                                >
                                    {filter.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    if (filter.type === 'checkbox') {
                        if (filter.options) {
                            return (
                                <div key={filter.name} className="flex flex-col gap-2 pb-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase">{filter.name}</label>
                                    <div className="flex flex-col gap-2">
                                        {filter.options.map(opt => (
                                            <div key={opt} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`${filter.key}-${opt}`}
                                                    checked={!!localFilters[`${filter.key}_${opt}`]}
                                                    onChange={(e) => handleCheckboxChange(filter.key, e.target.checked, opt)}
                                                    className="w-4 h-4 text-viva-green border-gray-300 rounded focus:ring-viva-green"
                                                />
                                                <label htmlFor={`${filter.key}-${opt}`} className="text-sm text-gray-600 font-medium cursor-pointer">{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={filter.name} className="flex items-center gap-2 pb-2">
                                <input
                                    type="checkbox"
                                    id={filter.key}
                                    checked={!!localFilters[filter.key]}
                                    onChange={(e) => handleCheckboxChange(filter.key, e.target.checked)}
                                    className="w-4 h-4 text-viva-green border-gray-300 rounded focus:ring-viva-green"
                                />
                                <label htmlFor={filter.key} className="text-sm text-gray-600 font-medium cursor-pointer">{filter.name}</label>
                            </div>
                        );
                    }

                    return null;
                })}

                <button
                    onClick={applyFilters}
                    className="ml-auto px-6 py-2 bg-[#76bc21] text-white rounded-lg text-sm font-bold hover:bg-[#689F38] transition-colors shadow-sm h-[38px] flex items-center"
                >
                    Aplicar Filtros
                </button>
            </div>
        </div>
    );
};
