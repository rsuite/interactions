import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import packageJson from './package.json';

/**
 * @type import('rollup').RollupOptions
 */
const config = {
  input: 'src/index.js',
  external: Object.keys(packageJson.peerDependencies),
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
    },
    {
      file: packageJson.module,
      format: 'es',
    },
  ],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx'],
    }),
    babel({
      babelHelpers: 'runtime',
      // https://github.com/rollup/plugins/issues/381#issuecomment-627215009
      skipPreflightCheck: true,
    }),
    commonjs(),
  ],
};

export default config;
