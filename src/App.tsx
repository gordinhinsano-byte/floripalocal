import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { CanonicalTag } from "./components/CanonicalTag";
import Index from "./pages/Index";
import AluguelCasas from "./pages/AluguelCasas";
import AdDetail from "./pages/AdDetail";
import NotFound from "./pages/NotFound";

import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserDashboard from "./pages/UserDashboard";
import PostAdPage from "./pages/PostAdPage";
import PromoteAdPage from "./pages/PromoteAdPage";
import MinhaConta from "./pages/MinhaConta";
import HelpPage from "./pages/HelpPage";
import EditAdPage from "./pages/EditAdPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Sitemap from "./pages/Sitemap";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const AuthHashRedirector = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash || "";
    if (!hash) return;
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const type = params.get("type");
    const accessToken = params.get("access_token");
    const error = params.get("error");
    if ((type === "recovery" || !!accessToken || !!error) && location.pathname !== "/recuperar-senha") {
      navigate(`/recuperar-senha${hash}`, { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  return null;
};

const App = () => {
  useEffect(() => {
    async function debugAuth() {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("SESSION:", sessionData.session);

      const { data: userData } = await supabase.auth.getUser();
      console.log("USER:", userData.user);
    }
    debugAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <BrowserRouter>
          <CanonicalTag />
          <AuthHashRedirector />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/alugar-casa-apartamento" element={<AluguelCasas />} />
            <Route path="/c/:categorySlug" element={
              <ErrorBoundary>
                <CategoryPage />
              </ErrorBoundary>
            } />
            <Route path="/anuncio/:id" element={<AdDetail />} />
            <Route path="/minha-conta" element={<MinhaConta />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
            <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
            <Route path="/painel" element={<UserDashboard />} />
            <Route path="/meus-anuncios" element={<UserDashboard />} />
            <Route path="/publicar-anuncio" element={<PostAdPage />} />
            {/* <Route path="/anuncio/:id/promover" element={<PromoteAdPage />} /> */}
            <Route path="/anuncio/:id/editar" element={<EditAdPage />} />
            <Route path="/ajuda" element={<HelpPage />} />
            <Route path="/termos-de-uso" element={<TermsPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/sitemap" element={<Sitemap />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
