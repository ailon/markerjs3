import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import pkg from './package.json' with { type: 'json' };
import generatePackageJson from 'rollup-plugin-generate-package-json';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import svgo from 'rollup-plugin-svgo';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const outputDir = './dist/';

const banner = `/* **********************************
marker.js 3 version ${pkg.version}
https://markerjs.com

copyright Alan Mendelevich
see README.md and LICENSE for details
********************************** */`;

export default [
  // types
  {
    input: ['./src/index.ts'],
    output: {
      dir: './dts/',
    },
    plugins: [
      del({ targets: ['dts/*', 'dist/*'] }),
      nodeResolve(),
      typescript({
        declaration: true,
        outDir: './dts/',
        //rootDir: './src/',
        include: ['./custom.d.ts', './src/**/*.ts'],
        exclude: ['./test/**/*', './dts/**/*', './dist/**/*'],
      }),
      svgo(),
    ],
  },
  {
    input: './dts/index.d.ts',
    output: [{ file: outputDir + pkg.types, format: 'es' }],
    plugins: [dts()],
  },

  // complete UMD package
  {
    input: ['src/index.ts'],
    output: [
      {
        file: outputDir + pkg.main,
        name: 'markerjs3',
        format: 'umd',
        sourcemap: true,
        banner: banner,
      },
    ],
    plugins: [nodeResolve(), typescript(), svgo(), terser()],
  },

  // complete ESM package
  {
    input: ['src/index.ts'],
    output: [
      {
        file: outputDir + pkg.module,
        format: 'es',
        sourcemap: true,
        banner: banner,
      },
    ],
    plugins: [
      //nodeResolve(),
      typescript(),
      svgo(),
      terser(),
      generatePackageJson({
        baseContents: (pkg) => {
          pkg.scripts = {};
          pkg.devDependencies = {};
          return pkg;
        },
      }),
      copy({
        targets: [
          {
            src: 'README.md',
            dest: 'dist',
          },
          {
            src: 'LICENSE',
            dest: 'dist',
          },
        ],
      }),
      // del({ targets: ['dts/*'] }),
    ],
  },
];
