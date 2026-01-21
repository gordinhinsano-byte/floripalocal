import { supabase } from '../lib/supabaseClient'

export async function uploadListingImage(listingId: string, file: File) {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${listingId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file, { upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
    return data.publicUrl
}
