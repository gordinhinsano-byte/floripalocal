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
        <div className="fixed inset-0 z-[100] bg-white md:bg-gray-100 flex items-start md:items-center justify-center overflow-y-auto">
            <div className="bg-white md:rounded-lg md:shadow-xl max-w-2xl w-full min-h-screen md:min-h-0 md:my-8 flex flex-col">
                
                <div className="p-6 md:p-8 flex-1">
                    <div className="flex justify-center mb-8">
                        <img src="/logofl.svg" alt="FloripaLocal" className="h-12" />
                    </div>

                    {/* Warning Box */}
                    <div className="bg-gray-50 p-6 rounded-sm mb-8 text-center border border-gray-100">
                         <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Conteúdo adulto
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            O FloripaLocal é uma plataforma onde se pode encontrar anúncios de profissionais do sexo independentes oferecendo os seus serviços de companhia. O FloripaLocal não é uma agência de acompanhantes e não participa de nenhuma etapa das negociações entre anunciantes e interessados.
                        </p>
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="font-bold text-gray-800 mb-6 text-lg">Termos de Uso</h3>
                        <p className="text-gray-600 text-sm mb-4 text-left">
                            Para acessar esta categoria você precisa confirmar que:
                        </p>

                        <ul className="text-left text-sm text-gray-600 space-y-4 list-disc pl-5 leading-relaxed">
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
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 w-full flex gap-3">
                    <button
                        className="flex-1 py-3 px-4 border border-green-600 text-green-700 font-semibold rounded hover:bg-green-50 transition-colors uppercase text-sm"
                        onClick={onDecline}
                    >
                        Voltar
                    </button>
                    <button
                        className="flex-1 py-3 px-4 bg-[#76bc21] hover:bg-[#6aa61e] text-white font-bold rounded shadow-sm transition-colors uppercase text-sm"
                        onClick={handleAccept}
                    >
                        Eu concordo
                    </button>
                </div>
            </div>
        </div>
    );
};
