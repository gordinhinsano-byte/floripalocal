import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Listing } from "@/types";

interface VIPCarouselProps {
    ads: Listing[];
    favorites: string[];
    onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export function VIPCarousel({ ads, favorites, onToggleFavorite }: VIPCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [ads]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 320; // Approximately one card width
        const currentScroll = scrollContainerRef.current.scrollLeft;
        
        scrollContainerRef.current.scrollTo({
            left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!ads || ads.length === 0) return null;

    return (
        <div className="bg-white border border-orange-200 p-4 rounded-sm shadow-sm mb-6 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="bg-[#ff7f00] text-white font-bold px-2 py-0.5 text-xs rounded-sm uppercase inline-block">
                    VIP
                </div>
            </div>

            <div className="relative group">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r transition-colors shadow-lg"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l transition-colors shadow-lg"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}

                <div 
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {ads.map((ad) => {
                        const isFavorited = favorites.includes(ad.id);
                        return (
                            <Link 
                                key={ad.id} 
                                to={`/anuncio/${ad.id}`}
                                className="flex-shrink-0 w-[280px] group/card block"
                            >
                                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                                    {/* Image Area */}
                                    <div className="relative h-[200px] bg-gray-200">
                                        <img 
                                            src={ad.images?.[0] || "https://placehold.co/400x300?text=Sem+Foto"} 
                                            alt={ad.title}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                            <div className="bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Camera className="w-3 h-3" />
                                                <span>{ad.images?.length || 0}</span>
                                            </div>
                                            <div className="bg-viva-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                                Foto Verificada
                                            </div>
                                        </div>

                                        <button 
                                            onClick={(e) => onToggleFavorite(e, ad.id)}
                                            className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                                        >
                                            <svg className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} stroke="currentColor" viewBox="0 0 24 24" fill="none">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1 group-hover/card:text-[#004e8a] group-hover/card:underline">
                                            {ad.title}
                                        </h3>
                                        
                                        <div className="text-xs text-gray-500 mb-2">
                                            {ad.attributes?.age ? `${ad.attributes.age} anos` : ''} 
                                            {ad.attributes?.age && ad.city ? ' • ' : ''}
                                            {ad.city && `${ad.city} ${ad.state}`}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 text-center">
                <button className="bg-[#ff7f00] hover:bg-[#e67300] text-white font-bold py-2 px-6 rounded text-sm transition-colors">
                    Veja todos os anúncios VIP
                </button>
            </div>
        </div>
    );
}
