-- Add neighborhood column to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS neighborhood text;

-- Update the search_listings function if it uses explicit column selection or if we want to filter by neighborhood later
-- For now, just adding the column ensures it can be selected and inserted.
