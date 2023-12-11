import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'U-Design',
  },
  routes: routes,
  valtio: {},
  npmClient: 'pnpm',
  tailwindcss: {},
  plugins: [
    require.resolve('@alita/plugins/dist/keepalive'),
    require.resolve('@alita/plugins/dist/tabs-layout'),
  ],
  keepalive: [/./],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  scripts: [
    `https://unpkg.com/react@18.2.0/umd/react.production.min.js`,
    `https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js`,
  ],
});
