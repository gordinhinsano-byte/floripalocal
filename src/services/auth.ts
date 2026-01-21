import { supabase } from "@/lib/supabaseClient";

export async function register(email: string, password: string, options?: any) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        ...(options ? { options } : {})
    });

    console.log("SIGNUP data:", data);
    console.log("SIGNUP error:", error);

    if (error) throw error;

    // Se confirmação de email estiver ON, o user pode vir mas sem session
    return data;
}

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("LOGIN data:", data);
    console.log("LOGIN error:", error);

    if (error) throw error;

    return data;
}

export async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/minha-conta`
        }
    });

    if (error) throw error;
    return data;
}
