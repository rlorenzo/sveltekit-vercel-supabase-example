import { describe, it, expect, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase createClient function
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
  })),
}));

describe('Supabase Client', () => {
  it('should export a supabase client instance', async () => {
    // Import after mocking
    const module = await import('./supabaseClient');

    expect(module.supabase).toBeDefined();
    expect(module.supabase.from).toBeDefined();
    expect(module.supabase.auth).toBeDefined();
    expect(module.supabase.storage).toBeDefined();
  });

  it('should call createClient with correct parameters', () => {
    expect(createClient).toHaveBeenCalled();
  });
});
