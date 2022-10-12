import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    // preserveModules: true,
    // dir: 'dist',
    // preserveModulesRoot: 'src',
    file: 'dist/index.js',
    exports: 'named',
    name: 'shared',
  },
  external: ['react', 'react-proptypes'],
  // The order of plugins matters.
  plugins: [
    json(),
    resolve(),
    peerDepsExternal({
      includeDependencies: true,
    }),
    postcss({
      // extensions: [".css", ".less"],
      autoModules: true,
      namedExports: (name) => name.replace(/-/g, '_'),
      use: {
        stylus: null,
        sass: null,
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
      extract: true,
      // config: { path: './postcss.config.js', ctx: null },
    }),
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    typescript({
      useTsconfigDeclarationDir: false,
    }),
    babel({
      babelrc: false,
      // plugins: [['import', { libraryName: 'antd', style: true }]],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    commonjs({
      include: [
        'node_modules/@lifi/wallet-management/**',
        'node_modules/@web3-react/core/**',
      ],
      namedExports: {
        initializeConnector: [
          '../../node_modules/@web3-react/core/dist/index.js',
        ],
      },
    }),
    image(),
  ],
};
