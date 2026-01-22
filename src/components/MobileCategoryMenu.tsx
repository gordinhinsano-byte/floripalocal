import { categories } from "./CategoryBar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { 
    Home, 
    Briefcase, 
    Truck, 
    Wrench, 
    GraduationCap, 
    PawPrint, 
    Tag, 
    Heart,
    MapPin,
    Globe,
    PlusCircle // Usando PlusCircle ou apenas Plus estilizado
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
    "Imóveis": Home,
    "Empregos": Briefcase,
    "Veículos": Truck,
    "Serviços": Wrench,
    "Cursos": GraduationCap,
    "Animais de Estimação": PawPrint,
    "Comprar e Vender": Tag,
    "Relacionamentos": Heart,
};

export const MobileCategoryMenu = () => {
    return (
        <div className="w-full bg-white md:hidden border-t border-gray-200">
            <Accordion type="single" collapsible className="w-full">
                {categories.map((category, index) => {
                    const Icon = iconMap[category.name] || Tag;
                    return (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100">
                            {/* 
                                Customizing Trigger:
                                - Hide default chevron: [&>svg]:hidden (assuming shadcn implementation uses an svg child)
                                - Add our own Plus icon that rotates
                            */}
                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 [&>svg]:hidden">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3 text-gray-700 font-normal text-base">
                                        <Icon className="w-6 h-6 stroke-[1.5]" />
                                        <span>{category.name}</span>
                                    </div>
                                    <div className="rounded-full border border-gray-400 p-0.5 transition-transform duration-200 group-data-[state=open]:rotate-45">
                                        <PlusCircle className="w-5 h-5 text-gray-500 stroke-[1.5]" />
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-gray-50 px-4 pb-4 border-t border-gray-100">
                                <div className="flex flex-col gap-2 pt-2">
                                    {category.columns.map((col, colIdx) => (
                                        <div key={colIdx}>
                                            {col.groups.map((group, gIdx) => (
                                                <div key={gIdx} className="mb-3 last:mb-0">
                                                     {group.title && <h4 className="font-bold text-xs text-gray-400 uppercase mb-2 mt-2 tracking-wider">{group.title}</h4>}
                                                     <ul className="space-y-3">
                                                        {group.items.map(item => (
                                                            <li key={item}>
                                                                <Link 
                                                                    to={`/c/todas?q=${encodeURIComponent(item)}`} 
                                                                    className="text-gray-600 text-sm block hover:text-viva-green"
                                                                >
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                     </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}

                {/* Item Extra: Região e cidades */}
                 <AccordionItem value="item-region" className="border-b border-gray-100">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 [&>svg]:hidden">
                         <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 text-gray-700 font-normal text-base">
                                <MapPin className="w-6 h-6 stroke-[1.5]" />
                                <span>Região e cidades</span>
                            </div>
                            <div className="rounded-full border border-gray-400 p-0.5 transition-transform duration-200 group-data-[state=open]:rotate-45">
                                <PlusCircle className="w-5 h-5 text-gray-500 stroke-[1.5]" />
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50 px-4 py-4">
                        <p className="text-sm text-gray-500">Selecione sua região (Em breve)</p>
                    </AccordionContent>
                </AccordionItem>

                 {/* Item Extra: Vivalocal no mundo */}
                 <AccordionItem value="item-world" className="border-b border-gray-100">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 [&>svg]:hidden">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 text-gray-700 font-normal text-base">
                                <Globe className="w-6 h-6 stroke-[1.5]" />
                                <span>Vivalocal no mundo</span>
                            </div>
                            <div className="rounded-full border border-gray-400 p-0.5 transition-transform duration-200 group-data-[state=open]:rotate-45">
                                <PlusCircle className="w-5 h-5 text-gray-500 stroke-[1.5]" />
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50 px-4 py-4">
                         <p className="text-sm text-gray-500">Links internacionais (Em breve)</p>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
};
