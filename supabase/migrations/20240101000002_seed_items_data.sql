-- Seed sample data into items table
INSERT INTO public.items (name, description, status, created_at) VALUES
    ('Complete project setup', 'Initialize SvelteKit project with all necessary configurations', 'completed', NOW() - INTERVAL '5 days'),
    ('Configure Tailwind CSS', 'Set up Tailwind CSS with PostCSS and create base styles', 'completed', NOW() - INTERVAL '4 days'),
    ('Set up Supabase', 'Initialize Supabase locally and create database migrations', 'completed', NOW() - INTERVAL '3 days'),
    ('Create sample UI', 'Build a responsive table component to display items', 'in-progress', NOW() - INTERVAL '2 days'),
    ('Configure GitHub Actions', 'Set up CI/CD pipelines for linting, testing, and deployment', 'in-progress', NOW() - INTERVAL '1 day'),
    ('Deploy to Vercel', 'Configure Vercel deployment for staging and production', 'pending', NOW() - INTERVAL '12 hours'),
    ('Add authentication', 'Implement user authentication with Supabase Auth', 'pending', NOW() - INTERVAL '6 hours'),
    ('Write documentation', 'Create comprehensive README with setup instructions', 'pending', NOW() - INTERVAL '3 hours'),
    ('Add unit tests', 'Write tests for components and utilities', 'pending', NOW() - INTERVAL '2 hours'),
    ('Performance optimization', 'Optimize bundle size and loading performance', 'pending', NOW() - INTERVAL '1 hour');
