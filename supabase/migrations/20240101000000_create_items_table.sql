-- Create items table
CREATE TABLE IF NOT EXISTS public.items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Read access for all users (including anonymous)
CREATE POLICY "Allow anonymous read on items" ON public.items
    FOR SELECT
    USING (true);

-- Full access for authenticated users only
CREATE POLICY "Allow authenticated full access on items" ON public.items
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create index on created_at for better query performance
CREATE INDEX items_created_at_idx ON public.items(created_at DESC);
