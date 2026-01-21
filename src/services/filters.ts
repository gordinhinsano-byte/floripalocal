import { supabase } from '../lib/supabaseClient'

export async function getFiltersByCategory(categoryId: string) {
    const { data, error } = await supabase
        .from('attribute_definitions')
        .select('*')
        .eq('category_id', categoryId)
        .eq('filterable', true)

    if (error) throw error
    return data
}
