import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SubFilter {
    name: string;
    type: string;
    options: string[];
}

interface FilterDefinition {
    name: string;
    type: 'range' | 'select' | 'checkbox' | 'price';
    key: string;
    subfilters?: SubFilter[];
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

type Props = {
    filters: FilterDefinition[];
    onChange: (values: any) => void;
    layout?: 'horizontal' | 'vertical';
    values?: Record<string, any>;
};

export function FiltersPanel({ filters, onChange, layout = 'horizontal', values = {} }: Props) {
    if (!filters || filters.length === 0) {
        return null; // Don't render anything if no filters, avoiding layout shift
    }
    const preventNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
    };

    const containerClasses = layout === 'horizontal' 
        ? "flex flex-wrap items-end gap-4" 
        : "flex flex-col gap-4 w-full";

    const itemClasses = layout === 'horizontal'
        ? "flex-shrink-0 min-w-[150px]"
        : "w-full";

    return (
        <div className={containerClasses}>
            {filters.map((filter, index) => (
                <div key={`${filter.key}-${index}`} className={itemClasses}>
                    
                    {/* LABEL */}
                    {filter.type !== 'checkbox' && (
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            {filter.name}
                        </label>
                    )}

                    {/* SELECT TYPE */}
                    {filter.type === 'select' && filter.options && (
                        <select
                            className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white h-[38px]"
                            onChange={(e) => onChange({ [filter.key]: e.target.value })}
                        >
                            <option value="">Todos</option>
                            {filter.options.filter(opt => opt !== "Todos").map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* RANGE TYPE (Double Select Side-by-Side) */}
                    {filter.type === 'range' && filter.subfilters && (
                        <div className="flex gap-2">
                            {filter.subfilters.map((sub, subIdx) => (
                                <div key={subIdx} className="w-[100px]">
                                    <select
                                        className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green bg-white h-[38px]"
                                        onChange={(e) => onChange({ [`${filter.key}_${sub.name}`]: e.target.value })}
                                    >
                                        <option value="">{sub.name === 'min' ? 'min' : 'max'}</option>
                                        {sub.options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* RANGE TYPE (Numeric Inputs - Fallback) */}
                    {filter.type === 'range' && !filter.subfilters && (
                        <div className="flex gap-2 w-full">
                            <input
                                type="number"
                                min={0}
                                onKeyDown={preventNegativeKey}
                                placeholder="Min"
                                className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green h-[38px]"
                                onChange={(e) => onChange({ [`${filter.key}_min`]: e.target.value })}
                            />
                            <input
                                type="number"
                                min={0}
                                onKeyDown={preventNegativeKey}
                                placeholder="Max"
                                className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green h-[38px]"
                                onChange={(e) => onChange({ [`${filter.key}_max`]: e.target.value })}
                            />
                        </div>
                    )}

                    {/* PRICE TYPE */}
                    {filter.type === 'price' && (
                         <div className="flex gap-2 w-full">
                             <input
                                 type="number"
                                 min={0}
                                 onKeyDown={preventNegativeKey}
                                 placeholder="Min R$"
                                 className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green h-[38px]"
                                 onChange={(e) => onChange({ [`${filter.key}_min`]: e.target.value })}
                             />
                             <input
                                 type="number"
                                 min={0}
                                 onKeyDown={preventNegativeKey}
                                 placeholder="Max R$"
                                 className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viva-green h-[38px]"
                                 onChange={(e) => onChange({ [`${filter.key}_max`]: e.target.value })}
                             />
                         </div>
                    )}

                    {/* CHECKBOX TYPE (Rendered at the bottom usually, but here inline) */}
                    {filter.type === 'checkbox' && (
                        <div className="h-[38px] flex items-center pt-6">
                            {filter.options ? (
                                <div className="flex gap-3">
                                    {filter.options.map((opt) => (
                                        <label key={opt} className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-viva-green border-gray-300 rounded focus:ring-viva-green"
                                                onChange={(e) => onChange({ [`${filter.key}_${opt}`]: e.target.checked })}
                                            />
                                            <span className="text-sm text-gray-600">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-viva-green border-gray-300 rounded focus:ring-viva-green bg-white"
                                        onChange={(e) => onChange({ [filter.key]: e.target.checked })}
                                    />
                                    <span className="text-sm text-gray-600 font-medium">{filter.name}</span>
                                </label>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
