import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],

  // Vitest — powered by @voidzero-dev/vite-plus-test
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
  },

  // Oxlint — replaces ESLint
  lint: {
    ignorePatterns: ['build/**', '.svelte-kit/**', 'dist/**', '.vercel/**', 'src/**/*.test.ts'],
    options: {
      typeAware: true,
    },
    rules: {
      'no-console': ['warn', { allow: ['error'] }],
    },
  },

  // Oxfmt — replaces Prettier (Svelte support via community plugin)
  fmt: {
    singleQuote: true,
    plugins: ['oxfmt-prettier-svelte'],
  },

  // Replaces lint-staged — runs on git-staged files before commit
  staged: {
    '*.{js,ts,svelte}': 'vp check --fix',
    '*.md': 'markdownlint-cli2',
    '*.{json,css,html}': 'vp fmt',
  },
});
