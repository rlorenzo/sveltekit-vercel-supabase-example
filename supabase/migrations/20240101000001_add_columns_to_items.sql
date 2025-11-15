-- Add description column
ALTER TABLE public.items
ADD COLUMN description TEXT;

-- Add status column with default value
ALTER TABLE public.items
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Add check constraint for status values
ALTER TABLE public.items
ADD CONSTRAINT items_status_check
CHECK (status IN ('pending', 'in-progress', 'completed', 'archived'));

-- Create index on status for filtering
CREATE INDEX items_status_idx ON public.items(status);
