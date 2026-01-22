import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Política de Privacidade</h1>
                    
                    <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                        <p>
                            Nossa política de privacidade determina como iremos tratar a informação pessoal que você (usuário) nos fornece enquanto usa o website www.floripalocal.com.br (denominado como "Site") e/ou os serviços fornecidos por ele (denominado como "Serviços"). Poderemos alterar a nossa Política de privacidade de tempo em tempo e as mudanças terão efeito a partir da data e hora em que a Política de Privacidade revisada for publicada no Site.
                        </p>
                        <p>
                            Para prover o Site e os Serviços, é necessário para nós manter e processar certas informações pessoais. Tomamos medidas para manter essas informações seguras para prevenir acesso não permitido a elas ou uso fora das leis. Todas as informações pessoas são processadas por nós de acordo com a legislação de proteção de dados aplicável.
                        </p>
                        <p>
                            De tempo em tempo, poderemos requisitar a você para providenciar parte o a totalidade das seguintes informações: detalhes do seu nome, sua empresa ou nome fantasia, números de telefone e fax, endereço de e-mail e detalhes de cartão de crédito. Essa informação pessoal será guardada junta com qualquer outra informação que seja fornecida por você de tempo em tempo, e será usada por nós (e nossos provedores de serviços necessários) para proporcionar a você com os Serviços e outras atividades associados a eles. Também poderemos usar a sua informação pessoal para:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Facilitar o fornecimentos dos serviços para você</li>
                            <li>Para analisar o uso do Site</li>
                            <li>Para mantermos você atualizado com novas características, produtos e outros serviços que possamos considerar de seu interesse</li>
                        </ul>
                        <p>
                            Apenas manteremos a sua informação pessoal durante o período necessário para o propósito pelo qual ela nos foi dada. Por favor note que, caso o nosso negócio seja vendido a terceiros, iremos transferir os seus dados à eles com o propósito de continuar fornecendo os Serviços a você.
                        </p>
                        <p>
                            Nós poderemos usar 'cookies' enquanto você acessa o Site para evitar que você tenha que preencher os seus detalhes novamente. Se você não quiser receber 'cookies', você pode trocar suas preferências no seu computador e/ou browser.
                        </p>
                        <p>
                            Por favor note que de tempo em tempo poderemos transferir seus dados pessoais por motivos internos de negócios para localidades fora da região econômica europeia. A respeito de informações transmitidas ao EUA, somente iremos transmitir essas informações a entidades que seguem as políticas apropriadas.
                        </p>
                        <p>
                            Poderemos divulgar a suas informações pessoais se isso for exigido pela lei, ou se acreditarmos de boa fé que que a divulgação é necessária para agir de acordo com alguma determinada lei aplicável, ou para defender os nossos direitos ou propriedade, ou para proteger o direito de segurança pessoal de terceiros.
                        </p>
                        <p>
                            Se você tiver alguma dúvida sobre esta Política de Privacidade, ou deseja receber alguma informação que você escolheu não receber previamente (opted out), por favor nos contate enviando um email para contato@floripalocal.com.br.
                        </p>

                        <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4">Cookies</h2>
                        
                        <h3 className="text-md font-bold text-gray-700 mt-4 mb-2">O que são cookies?</h3>
                        <p>
                            Um cookie é um pequeno arquivo que contém informações enviadas para seu computador quando você visita um website. Quando você retorna a este website, este cookie permite que o seu browser seja reconhecido. Cookies podem gravar preferências de usuários e outras informações para prover uma melhor experiência de navegação. Por exemplo, gravamos informações fornecidas por cookies para identificar seu nome de usuário quando você quer entrar na sua conta no Floripa Local.
                        </p>

                        <h3 className="text-md font-bold text-gray-700 mt-4 mb-2">Uso de cookies pelo Floripa Local</h3>
                        <p>
                            Usamos cookies para identificá-lo como usuário e manter sua sessão ativa no Floripa Local. A maioria dos cookies é deletada ao encerrar uma sessão. Você pode deletar ou remover cookies, mas em alguns casos isso irá prejudicar sua experiência no Floripa Local.
                        </p>
                        <p>
                            Você pode verificar cookies de terceiros (Se você visualizar outra página de terceiro, pode ser que a mesma contenha cookies).
                        </p>

                        <h3 className="text-md font-bold text-gray-700 mt-4 mb-2">Consentimento</h3>
                        <p>
                            Usando nosso website, você autoriza o recolhimento e identificação de suas informações de IP, Informações Pessoais e de localização de acordo com essa política. Caso essa política seja alterada a qualquer momento, estarão disponíveis no site para verificação nesta página.
                        </p>

                        <h3 className="text-md font-bold text-gray-700 mt-4 mb-2">O que é uma sessão de cookie?</h3>
                        <p>
                            Uma sessão de cookie de website é temporária, sendo deletado quando você fecha seu browser. Na próxima vez que você visitar novamente este website após ter os cookies deletados, você terá que efetuar login mais uma vez, pois esse dado não será lembrado. A partir desse momento uma nova sessão será criada, e o cookie será deletado quando você deixar o site novamente. Os cookies de sessão não coletam informações do seu computador.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
