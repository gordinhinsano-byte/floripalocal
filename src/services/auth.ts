import { supabase } from "@/lib/supabaseClient";

export async function register(email: string, password: string, options?: any) {
    // Validate inputs before sending to Supabase
    if (!email || !email.includes('@')) {
        throw new Error('Por favor, digite um email válido.');
    }

    if (!password || password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            ...(options ? { options } : {})
        });

        console.log("SIGNUP data:", data);
        console.log("SIGNUP error:", error);

        if (error) {
            // Translate common Supabase errors to Portuguese
            if (error.message.includes('already registered')) {
                throw new Error('Este email já está cadastrado. Tente fazer login.');
            } else if (error.message.includes('Invalid email')) {
                throw new Error('Email inválido.');
            } else if (error.message.includes('Password should be')) {
                throw new Error('Senha muito fraca. Use pelo menos 6 caracteres.');
            } else if (error.message.includes('User already registered')) {
                throw new Error('Este email já está cadastrado.');
            }
            throw error;
        }

        // Se confirmação de email estiver ON, o user pode vir mas sem session
        return data;
    } catch (error: any) {
        console.error('Registration error in auth service:', error);
        throw error;
    }
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

export async function requestPasswordReset(email: string) {
    const redirectTo = `${window.location.origin}/recuperar-senha`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    return data;
}
