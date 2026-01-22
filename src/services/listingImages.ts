import { supabase } from '../lib/supabaseClient'

export async function uploadListingImage(listingId: string, file: File) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const ext = file.name.split('.').pop() || 'jpg'
    // Path structure: USER_ID/LISTING_ID/filename.ext
    // This satisfies the RLS policy: (storage.foldername(name))[1] = auth.uid()
    const path = `${user.id}/${listingId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file, { upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
    return data.publicUrl
}
