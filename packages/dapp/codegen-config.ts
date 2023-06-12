import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema.graphql',
  documents: 'src/graphql/queries/**',
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
    'src/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
