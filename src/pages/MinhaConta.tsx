import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function MinhaConta() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            if (!user) {
                nav("/login");
                return;
            }

            nav({ pathname: "/painel", search: window.location.search });
        })();
    }, [nav]);

    if (loading) return <div style={{ padding: 24 }}>Carregando...</div>;

    return (
        <div style={{ padding: 24 }}>
            <h1>Minha conta</h1>
            <p>Logado como: {email ?? "sem email"}</p>

            <button
                onClick={async () => {
                    await supabase.auth.signOut();
                    nav("/");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
                Sair
            </button>
        </div>
    );
}
