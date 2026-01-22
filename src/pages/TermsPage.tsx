import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Termos de Uso Gerais</h1>
                    
                    <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                        <p>
                            Aceitação dos nossos Termos. O Floripa Local ("Floripa Local ou Site"), site de classificados gratuitos virtual, disponível sob a URL www.floripalocal.com.br, oferece uma variedade de recursos incluindo classificados grátis e diversos serviços (estes estão definidos aqui como "Serviços").
                        </p>
                        <p>
                            Os Serviços estão sujeitos aos Termos de Uso ("Termos"), que poderão ser atualizados pelo Floripa Local sempre que necessário. O Floripa Local poderá informar os seus usuários de mudanças significativas nos seus Termos de Uso, colocando-as disponíveis no Site, porém cabe ao Usuário checar os Termos periodicamente.
                        </p>
                        <p>
                            Usando o Floripa Local, você concorda em ficar vinculado por estes Termos e Condições (“Termos"). Você também concorda com nossa Política de Privacidade, que é parte integrante destes Termos, e aceita os cookies deste site. Se você tiver alguma objeção a qualquer termo ou condição, diretriz, ou subsequentes alterações introduzidas no site, recomendamos o desuso imediato do site.
                        </p>
                        
                        <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">Conteúdo</h2>
                        <p>
                            O Usuário concorda e declara que todos os anúncios, mensagens, comentários, arquivos, imagens, fotos, vídeos, arquivos de som ou outros materiais (aqui definidos como "Conteúdo") publicados, transmitidos ou com links no Site, são de responsabilidade total do Usuário que inseriu o Conteúdo. Mais especificamente, o Usuário é inteiramente responsável por todo e qualquer Conteúdo que ele inserir no, ou através do, Site e/ou dos Serviços.
                        </p>
                        <p>
                            O Usuário entende que o Floripa Local não controla e/ou monitora previamente qualquer Anúncio disponibilizado através do Site pelo Usuário anunciante e, portanto, não é responsável por seu conteúdo. Ao acessar e/ou usar o Site, o Usuário pode ser exposto a Conteúdo eventualmente ofensivo, indecente, incorreto, falso, infrator e/ou repreensível.
                        </p>
                        <p>
                            O Floripa Local não representa ou garante a autenticidade e exatidão das informações contidas em seu Site, uma vez que o conteúdo é incluído pelo Usuário sem qualquer tipo de ingerência do Floripa Local. O acesso feito através de links a qualquer outro site também é de responsabilidade e risco do próprio Usuário.
                        </p>
                        <p>
                            Sob nenhuma circunstância o Floripa Local será responsabilizado de forma alguma por Conteúdo ou por qualquer perda ou dano de qualquer tipo incorridos como resultado do uso de qualquer conteúdo listado, por e-mail ou outra forma disponibilizado através do Serviço.
                        </p>

                        <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">Notificação sobre Infrações</h2>
                        <p>
                            Caso qualquer pessoa, seja ou não Usuário do Site, se sentir lesado em relação a qualquer Anúncio e/ou Conteúdo, poderá encaminhar ao Floripa Local notificação por escrito solicitando sua exclusão e retirada do Site. No entanto, para não prejudicar Usuários de boa-fé, a retirada do Anúncio e/ou Conteúdo do Site dependerá de efetiva comprovação ou forte evidência da ilegalidade ou infração à lei, direitos de terceiros e/ou a estes Termos.
                        </p>
                        <p>
                            As notificações deverão ser encaminhadas ao e-mail contato@floripalocal.com.br. O notificante reconhece que caso não cumpra com todos os requisitos legais, sua notificação poderá não ser considerada.
                        </p>

                        <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">Privacidade e Divulgação de Informação</h2>
                        <p>
                            Ao usar o Site ou qualquer dos Serviços, o Usuário reconhece e concorda que o Floripa Local poderá, a seu critério, divulgar o Conteúdo publicado pelos Usuários, assim como reter, armazenar e/ou divulgar as suas informações pessoais para fins legais ou de segurança.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
