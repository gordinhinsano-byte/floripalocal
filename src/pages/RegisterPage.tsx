import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { register, loginWithGoogle } from "@/services/auth";


export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userType: '', // 'advertiser' | 'seeker'
        email: '',
        agreedToTerms: false,
        agreedToNews: false,
        verificationCode: ['', '', '', ''],
        firstName: '',
        lastName: '',
        username: '',
        phone: '', // Added Phone
        password: ''
    });
    const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleCaptchaVerify = () => {
        if (captchaStatus === 'idle') {
            setCaptchaStatus('loading');
            setTimeout(() => {
                setCaptchaStatus('success');
            }, 1000);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error: any) {
            console.error(error);
            toast.error("Erro ao iniciar cadastro com Google: " + error.message);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.userType) {
                toast.error("Por favor, selecione uma opção.");
                return;
            }
            // Require Captcha on Step 1
            if (captchaStatus !== 'success') {
                toast.error("Por favor, confirme que você é humano.");
                return;
            }
        }
        if (step === 2) {
            if (!formData.email) {
                toast.error("Por favor, digite seu email.");
                return;
            }
            if (!formData.agreedToTerms) {
                toast.error("Você precisa aceitar os termos.");
                return;
            }
        }
        if (step === 3 && formData.verificationCode.join("").length !== 4) {
            // For now, allow any code since we are not sending real OTPs yet in this flow
            // toast.error("Digite o código de verificação.");
            // return;
        }
        if (step === 4) {
            if (!formData.firstName || !formData.lastName || !formData.username || !formData.phone || !formData.password) {
                toast.error("Preencha todos os campos.");
                return;
            }

            // Real Registration Logic
            try {
                const data = await register(
                    formData.email,
                    formData.password,
                    {
                        data: {
                            name: `${formData.firstName} ${formData.lastName}`, // Combine Name
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            username: formData.username,
                            phone: formData.phone, // Send Phone
                            user_type: formData.userType,
                        }
                    }
                );

                // if (error) throw error; // register service already throws on error

                // If successful, proceed to success screen
                setStep(5);
                return;

            } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Erro ao criar conta.");
                return;
            }
        }

        setStep(prev => Math.min(prev + 1, 5));
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Calculate progress bar width
    const getProgress = () => {
        switch (step) {
            case 1: return 'w-[20%]';
            case 2: return 'w-[50%]';
            case 3: return 'w-[75%]';
            case 4: return 'w-[100%]';
            default: return 'w-[20%]';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans" >
            <Header />

            <main className="flex-1 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[480px] w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">

                    {/* Progress Bar */}
                    {step < 5 && (
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
                            <div className={`h-full bg-viva-green transition-all duration-500 ease-out ${getProgress()}`}></div>
                        </div>
                    )}

                    {/* STEP 1: User Type */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Vamos te ajudar a se cadastrar. Como você gostaria de usar o FloripaLocal?
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Por favor, selecione uma ou ambas as opções abaixo que melhor o(a) descrevem.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => updateFormData('userType', 'advertiser')}
                                    className={`w-full p-4 border rounded-lg flex items-center gap-4 text-left hover:border-viva-green transition-colors ${formData.userType === 'advertiser' ? 'border-viva-green bg-green-50' : 'border-gray-200'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-viva-green font-bold text-lg">
                                        +
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Anunciante</div>
                                        <div className="text-sm text-gray-600">Gostaria de oferecer meus serviços ou produtos.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => updateFormData('userType', 'seeker')}
                                    className={`w-full p-4 border rounded-lg flex items-center gap-4 text-left hover:border-viva-green transition-colors ${formData.userType === 'seeker' ? 'border-viva-green bg-green-50' : 'border-gray-200'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Procurando</div>
                                        <div className="text-sm text-gray-600">Estou procurando comprar um serviço ou produto.</div>
                                    </div>
                                </button>
                            </div>

                            <div className="relative my-6 hidden">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Ou</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Email */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* ... (rest of Step 2 same as before) ... */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Vamos começar com o seu e-mail
                                </h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    Precisamos disso para enviar um código de verificação
                                </p>
                                <p className="text-sm text-gray-600">
                                    Verifique seu email: confira agora mesmo sua caixa de entrada para obter o código de verificação.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                    placeholder=""
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 text-viva-green focus:ring-viva-green border-gray-300 rounded"
                                        checked={formData.agreedToTerms}
                                        onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Eu concordo com os <a href="#" className="text-blue-500 hover:underline">Termos e Condições</a> do FloripaLocal e aceito a <a href="#" className="text-blue-500 hover:underline">Política de Privacidade</a>
                                    </span>
                                </label>
                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 text-viva-green focus:ring-viva-green border-gray-300 rounded"
                                        checked={formData.agreedToNews}
                                        onChange={(e) => updateFormData('agreedToNews', e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Aceito receber informações e novidades por email do FloripaLocal
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Verification Code */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Por gentileza, digite o código que acabamos de enviar
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Enviado para <span className="font-medium text-gray-900">{formData.email || 'teste@yopmail.com'}</span>
                                </p>
                                <button onClick={() => setStep(2)} className="text-sm text-blue-500 hover:underline">
                                    Mudar meu endereço de email
                                </button>
                            </div>

                            <div className="flex gap-2 justify-between max-w-[280px]">
                                {[0, 1, 2, 3].map((idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        maxLength={1}
                                        className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                        value={formData.verificationCode[idx]}
                                        onChange={(e) => {
                                            const newCode = [...formData.verificationCode];
                                            newCode[idx] = e.target.value;
                                            updateFormData('verificationCode', newCode);
                                            // Auto-focus next logic could go here
                                        }}
                                    />
                                ))}
                            </div>

                            <button className="text-sm text-gray-500 underline hover:text-gray-700">
                                Reenviar o código
                            </button>
                        </div>
                    )}

                    {/* STEP 4: Details */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Última etapa
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Nos conte um pouco sobre você
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => updateFormData('firstName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => updateFormData('lastName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input
                                    type="text"
                                    placeholder="(11) 99999-9999"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Para que compradores possam entrar em contato.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome de usuário</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => updateFormData('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Este é o nome que usaremos no seu anúncio ou perfil
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => updateFormData('password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-viva-green pr-10"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Deve ter pelo menos 12 caracteres
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Success */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div>
                                <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
                                    <div className="h-full bg-viva-green w-full"></div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    É isso, a sua conta foi criada!
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Agora você pode publicar e alterar os seus anúncios na sua conta. Comece já!
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-viva-green" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Endereço de email verificado
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-viva-green" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Informações pessoais
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 bg-viva-green text-white font-semibold py-3 px-4 rounded-md hover:bg-green-700 transition-colors text-sm text-center">
                                    Publique seu primeiro anúncio
                                </button>
                                <Link to="/minha-conta" className="flex-1 border border-viva-green text-viva-green font-semibold py-3 px-4 rounded-md hover:bg-green-50 transition-colors text-sm text-center block">
                                    Minha conta
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Cloudflare Mock (Visible on Steps 1, 2, 3) */}
                    {step < 4 && (
                        <div className="mt-6 border border-gray-200 rounded p-3 flex items-center justify-between bg-[#f9f9f9] select-none">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={handleCaptchaVerify}
                            >
                                <div className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center">
                                    {captchaStatus === 'loading' && (
                                        <div className="w-5 h-5 border-2 border-gray-200 border-t-viva-green rounded-full animate-spin"></div>
                                    )}
                                    {captchaStatus === 'success' && (
                                        <svg className="w-5 h-5 text-viva-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-gray-700">
                                    {captchaStatus === 'success' ? 'Sou humano' : 'Confirme que é humano'}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <img src="/cloudflare-logo.png" alt="" className="h-5 w-auto opacity-50" />
                                <div className="text-[10px] text-gray-400">
                                    Privacy - Terms
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Button */}
                    {step < 5 && (
                        <div className="mt-8">
                            <button
                                onClick={handleNext}
                                className="w-full bg-[#E5E7EB] text-gray-400 font-semibold py-3 rounded-md hover:bg-viva-green hover:text-white transition-colors"
                            >
                                {step === 4 ? 'Criar Conta' : 'Continua'}
                            </button>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-6 space-y-2 text-sm">
                        <div>
                            <span className="text-gray-600">Já tem conta? </span>
                            <Link to="/minha-conta" className="text-blue-500 hover:underline">Acesse aqui</Link>
                        </div>
                        <div>
                            <span className="text-gray-600">Precisa de ajuda? </span>
                            <a href="#" className="text-blue-500 hover:underline">Entre em contato conosco aqui</a>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div >
    );
}
