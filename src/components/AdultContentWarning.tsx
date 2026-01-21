import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdultContentWarningProps {
    onAccept: () => void;
    onDecline: () => void;
}

export const AdultContentWarning = ({ onAccept, onDecline }: AdultContentWarningProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check session storage on mount
        const hasAccepted = sessionStorage.getItem("adult_content_accepted");
        if (!hasAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem("adult_content_accepted", "true");
        setIsVisible(false);
        onAccept();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-center mb-6">
                    <img src="/logofl.svg" alt="FloripaLocal" className="h-20" />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Conteúdo adulto
                    </h2>

                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mb-6 text-left">
                        O FloripaLocal é uma plataforma onde se pode encontrar anúncios de profissionais do sexo independentes oferecendo os seus serviços de companhia. O FloripaLocal não é uma agência de acompanhantes e não participa de nenhuma etapa das negociações entre anunciantes e interessados.
                    </div>

                    <h3 className="font-bold text-gray-800 mb-4">Termos de Uso</h3>
                    <p className="text-gray-600 text-sm mb-4 text-left font-medium">
                        Para acessar esta categoria você precisa confirmar que:
                    </p>

                    <ul className="text-left text-sm text-gray-600 space-y-3 list-disc pl-5">
                        <li>
                            Você é maior de 18 anos ou se encaixa no mínimo estabelecido de maioridade de acordo com a legislação atual do local de onde está acessando o site.
                        </li>
                        <li>
                            Você entende que esta parte do site apresenta conteúdo explícito, por isso requer maioridade para acessar, incluindo nudez e imagens natureza sexual.
                        </li>
                        <li>
                            Você não vai copiar ou divulgar qualquer conteúdo do site sem consentimento expresso do dono do conteúdo.
                        </li>
                        <li>
                            Você está acessando o site de uma localidade em que é permitido por lei acessar sites de conteúdo adulto e material explícito de natureza sexual.
                        </li>
                        <li>
                            Você não vai permitir que menores de idade tenham acesso a esta parte do site.
                        </li>
                        <li>
                            Você leu e concorda com os <a href="#" className="text-blue-500 hover:underline">Termos de Uso</a> e <a href="#" className="text-blue-500 hover:underline">Política de Privacidade</a> do site.
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        className="flex-1 py-6 border-viva-green text-green-700 hover:bg-green-50"
                        onClick={onDecline}
                    >
                        Voltar
                    </Button>
                    <Button
                        className="flex-1 py-6 bg-viva-green hover:bg-green-600 text-white font-bold"
                        onClick={handleAccept}
                    >
                        Eu concordo
                    </Button>
                </div>
            </div>
        </div>
    );
};
