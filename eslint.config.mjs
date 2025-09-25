import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // <-- add jest globals so tests don't trigger no-undef etc.
      },
    },
  },
  pluginJs.configs.recommended,
];
