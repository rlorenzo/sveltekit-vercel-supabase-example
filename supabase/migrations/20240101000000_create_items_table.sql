-- Create items table
CREATE TABLE IF NOT EXISTS public.items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on items" ON public.items
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create index on created_at for better query performance
CREATE INDEX items_created_at_idx ON public.items(created_at DESC);
