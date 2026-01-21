import { supabase } from '../lib/supabaseClient'

export async function createListing(payload: {
    title: string
    description?: string
    price?: number
    category_id: string
    type: 'produto' | 'servico' | 'emprego'
    city?: string
    state?: string
}) {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
        .from('listings')
        .insert({
            ...payload,
            status: 'active',
            owner_id: user.id,
        })
        .select('id')
        .single()

    if (error) throw error
    return data.id as string
}
