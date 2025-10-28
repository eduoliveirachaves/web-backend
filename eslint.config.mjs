// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // 1. Permite 'console.log()' mas dá um aviso (para não esquecer em produção)
      'no-console': 'warn',

      // 2. variáveis não usadas. Mudar de "error" para "warn".
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // 3. Permite o uso de 'any' (você já tinha isso, é ótimo)
      '@typescript-eslint/no-explicit-any': 'off',

      // 4. Forçar tipos de retorno em funções exportadas é bom, mas chato. Mudar para "warn".
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // 5. Mudar todos para "warn"
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',

      // 6. Promessas "flutuantes" ainda são perigosas, mantenha como "warn"
      '@typescript-eslint/no-floating-promises': 'warn',

      'prettier/prettier': 'warn', // <-- Muda de 'error' (padrão) para 'warn'
    },
  },
);