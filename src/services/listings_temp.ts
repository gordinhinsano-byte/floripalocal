export async function getFavoriteListings(): Promise<Listing[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select(`
            listing:listing_id (
                *,
                profiles:owner_id (
                    name,
                    phone,
                    avatar_url
                )
            )
        `)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching favorite listings:", error);
        return [];
    }

    // Map the nested result back to a flat Listing array
    // @ts-ignore
    return data?.map(item => item.listing).filter(Boolean) || [];
}
