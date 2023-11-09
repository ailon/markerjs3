import typescript from '@rollup/plugin-typescript';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import dev from 'rollup-plugin-dev';
import livereload from 'rollup-plugin-livereload';
// import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import svgo from 'rollup-plugin-svgo';
import resolve from '@rollup/plugin-node-resolve';

export default {
  preserveSymlinks: false,
  input: ['test/manual/index.ts'],
  output: {
    dir: 'build-dev',
    format: 'umd',
    sourcemap: true,
    name: 'markerjs3',
    // globals: {
    //   'mjs-toolbar': 'mjstoolbar'
    // }
  },
  plugins: [
    //del({ targets: 'build-dev/*' }),
    resolve(),
    typescript(),
    svgo(),
    htmlTemplate({
      template: 'test/manual/template.html',
      target: 'index.html',
    }),
    copy({
      targets: [
        {
          src: 'test/manual/images/**/*',
          dest: 'build-dev/images',
        },
      ],
    }),
    dev({ host: '127.0.0.1', dirs: ['build-dev'], port: 8088 }),
    livereload('build-dev'),
  ],
};
