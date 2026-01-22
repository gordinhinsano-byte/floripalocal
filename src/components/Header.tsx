import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart, MessageCircle, HelpCircle, User, PlusCircle, FileText } from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

export const Header = ({ transparent = false }: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  // Use the logo based on background, but ensure it exists. Fallback to text if needed.
  // Assuming logos exist as /logoflb.svg (white/transparent bg) and /logofl.svg (colored/white bg)
  const logoSrc = isHome ? "/logoflb.svg" : "/logofl.svg"; 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = transparent 
    ? 'text-white hover:text-gray-200' 
    : 'text-viva-gray hover:text-viva-dark';

  return (
    <header className={`${transparent ? 'absolute top-0 left-0 right-0 z-50 bg-transparent border-none' : 'bg-white border-b border-border'} transition-all`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 relative">
          {/* Logo - Centered on Mobile if Transparent (Home), otherwise Left */}
          <Link 
            to="/" 
            className={`flex items-center ${transparent ? 'absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0' : ''}`}
          >
            {/* Using a standard height for the logo */}
            <img
              src={logoSrc}
              alt="FloripaLocal"
              className="h-16 sm:h-20 md:h-24 w-auto max-h-none object-contain block"
            />
          </Link>

          {/* Spacer for Flex layout when logo is absolute to keep menu button right */}
          <div className={`hidden md:block ${transparent ? 'flex-1' : ''}`}></div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/meus-anuncios" className={`text-sm flex items-center gap-1.5 ${linkClass} transition-colors font-medium`}>
              <FileText className="w-4 h-4" />
              Meus Anúncios
            </Link>
            <Link to="/minha-conta?tab=favorites" className={`text-sm flex items-center gap-1.5 ${linkClass} transition-colors font-medium`}>
              <Heart className="w-4 h-4" />
              Favoritos
            </Link>
            <Link to="/minha-conta?tab=chat" className={`text-sm flex items-center gap-1.5 ${linkClass} transition-colors font-medium`}>
              <MessageCircle className="w-4 h-4" />
              Mensagens
            </Link>
            <Link to="/ajuda" className={`text-sm flex items-center gap-1.5 ${linkClass} transition-colors font-medium`}>
              <HelpCircle className="w-4 h-4" />
              Ajuda
            </Link>
            <Link to="/minha-conta" className={`text-sm flex items-center gap-1.5 ${linkClass} transition-colors font-bold`}>
              <User className="w-4 h-4" />
              Minha Conta
            </Link>
            <Link to="/publicar-anuncio" className="bg-viva-green hover:bg-viva-green/90 text-white text-sm font-bold px-5 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Inserir anúncio
            </Link>
          </nav>

          {/* Mobile menu button - Always Right */}
          <button 
            className={`md:hidden ml-auto ${transparent ? 'text-white' : 'text-viva-gray'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-2 z-50">
             <Link to="/meus-anuncios" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded">
               <FileText className="w-5 h-5 text-viva-green" /> Meus Anúncios
             </Link>
             <Link to="/minha-conta?tab=favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded">
               <Heart className="w-5 h-5 text-viva-green" /> Favoritos
             </Link>
             <Link to="/minha-conta?tab=chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded">
               <MessageCircle className="w-5 h-5 text-viva-green" /> Mensagens
             </Link>
             <Link to="/ajuda" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded">
               <HelpCircle className="w-5 h-5 text-viva-green" /> Ajuda
             </Link>
             <Link to="/minha-conta" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded">
               <User className="w-5 h-5 text-viva-green" /> Minha Conta
             </Link>
             <Link to="/publicar-anuncio" onClick={() => setIsMobileMenuOpen(false)} className="bg-viva-green text-white text-center font-bold py-3.5 rounded mt-2 shadow-sm">
               Inserir anúncio
             </Link>
          </div>
        )}
      </div>
    </header>
  );
};
