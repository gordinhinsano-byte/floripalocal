import { supabase } from '../lib/supabaseClient'

export async function upsertListingAttribute(args: {
    listing_id: string
    attribute_id: string
    value_text?: string | null
    value_number?: number | null
    value_bool?: boolean | null
}) {
    const { error } = await supabase
        .from('listing_attributes')
        .upsert(args, { onConflict: 'listing_id,attribute_id' })

    if (error) throw error
}
