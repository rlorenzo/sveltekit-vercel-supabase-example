import { describe, it, expect } from 'vitest';
import { supabase } from './supabaseClient';

describe('Supabase Client', () => {
	it('should be defined', () => {
		expect(supabase).toBeDefined();
	});

	it('should have required methods', () => {
		expect(supabase.from).toBeDefined();
		expect(supabase.auth).toBeDefined();
		expect(supabase.storage).toBeDefined();
	});
});
