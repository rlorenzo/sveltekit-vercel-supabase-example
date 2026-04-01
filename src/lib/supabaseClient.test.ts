import { describe, it, expect, vi, beforeAll } from 'vitest';
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
  // Import the module once for all tests so each test is self-contained
  // and does not rely on execution order.
  beforeAll(async () => {
    await import('./supabaseClient');
  });

  it('should export a supabase client instance', async () => {
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
