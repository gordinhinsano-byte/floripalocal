import { X, Calendar } from "lucide-react";
import { useState } from "react";

export const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span className="text-amber-800">
            O FloripaLocal encerra suas atividades em 29 de janeiro de 2026.{" "}
            <a href="#" className="text-viva-green hover:underline font-medium">
              Saiba mais aqui.
            </a>
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-600 hover:text-amber-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
