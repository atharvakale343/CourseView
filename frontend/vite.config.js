import path from 'node:path';

import { partytownVite } from '@builder.io/partytown/utils';
import legacy from '@vitejs/plugin-legacy';
import vitePluginRequire from 'vite-plugin-require';

import _config from './_config.js';

const HOST = _config.server.host;
const PORT = _config.server.port;

export default {
  server: {
    host: HOST,
    port: PORT
  },
  plugins: [
    legacy(),
    partytownVite({
      dest: path.join(
        new URL('.', import.meta.url).pathname,
        'dist',
        '~partytown'
      )
    }),
    vitePluginRequire.default()
  ]
};
